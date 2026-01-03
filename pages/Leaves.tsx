import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Role, LeaveRequest } from '../types';
import { Plus, Check, X, Calendar } from 'lucide-react';

interface LeaveRequestWithUser extends LeaveRequest {
  userName?: string;
}

const Leaves = () => {
  const { user, users, leaves, applyLeave, updateLeaveStatus } = useApp();
  const isAdmin = user?.role === Role.ADMIN;
  
  // Form State
  const [showModal, setShowModal] = useState(false);
  const [type, setType] = useState<'PAID' | 'SICK' | 'UNPAID'>('PAID');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (user && startDate && endDate && reason) {
      const newLeave: LeaveRequest = {
        id: Date.now().toString(),
        userId: user.id,
        type,
        startDate,
        endDate,
        reason,
        status: 'PENDING'
      };
      applyLeave(newLeave);
      setShowModal(false);
      // Reset form
      setStartDate('');
      setEndDate('');
      setReason('');
    }
  };

  const displayedLeaves: LeaveRequestWithUser[] = isAdmin 
    ? leaves.map(l => ({...l, userName: users.find(u => u.id === l.userId)?.name})).sort((a,b) => b.startDate.localeCompare(a.startDate))
    : leaves.filter(l => l.userId === user?.id).sort((a,b) => b.startDate.localeCompare(a.startDate));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Leave Management</h2>
          <p className="text-slate-500">Manage time off and sick leaves</p>
        </div>
        {!isAdmin && (
          <button 
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 font-medium transition-colors"
          >
            <Plus size={20} />
            <span>Apply Leave</span>
          </button>
        )}
      </div>

      {/* Leave Request Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-lg text-slate-800">Request Time Off</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleApply} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Leave Type</label>
                <select 
                  value={type} 
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="PAID">Paid Leave</option>
                  <option value="SICK">Sick Leave</option>
                  <option value="UNPAID">Unpaid Leave</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
                  <input 
                    type="date" 
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none placeholder:text-slate-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
                  <input 
                    type="date" 
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none placeholder:text-slate-400"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Reason</label>
                <textarea 
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-24 resize-none placeholder:text-slate-400"
                  placeholder="Why are you taking leave?"
                  required
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors"
              >
                Submit Request
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Leave List */}
      <div className="grid grid-cols-1 gap-4">
        {displayedLeaves.map((leave) => (
          <div key={leave.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div className="flex items-start space-x-4">
              <div className={`p-3 rounded-lg ${
                leave.type === 'SICK' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
              }`}>
                <Calendar size={24} />
              </div>
              <div>
                {isAdmin && <p className="text-sm font-bold text-slate-900 mb-1">{leave.userName}</p>}
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-slate-800">{leave.type} Leave</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium 
                    ${leave.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 
                      leave.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                    {leave.status}
                  </span>
                </div>
                <p className="text-sm text-slate-500 mt-1">{leave.startDate} to {leave.endDate} • {leave.reason}</p>
              </div>
            </div>

            {isAdmin && leave.status === 'PENDING' && (
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => updateLeaveStatus(leave.id, 'APPROVED')}
                  className="px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors flex items-center space-x-1"
                >
                  <Check size={16} />
                  <span>Approve</span>
                </button>
                <button 
                  onClick={() => updateLeaveStatus(leave.id, 'REJECTED')}
                  className="px-4 py-2 bg-red-50 text-red-700 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors flex items-center space-x-1"
                >
                  <X size={16} />
                  <span>Reject</span>
                </button>
              </div>
            )}
          </div>
        ))}

        {displayedLeaves.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-100">
            <p className="text-slate-400">No leave requests found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaves;