import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { mockService } from '../services/mockService';
import { LeaveRequest, LeaveStatus, LeaveType } from '../types';
import { Plus, Check, X, Filter } from 'lucide-react';

export const Leaves: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form State
  const [leaveType, setLeaveType] = useState<LeaveType>(LeaveType.SICK);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const data = await mockService.getLeaves(isAdmin ? undefined : user?.id);
      setLeaves(data.sort((a, b) => new Date(b.appliedOn).getTime() - new Date(a.appliedOn).getTime()));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isAdmin]);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      await mockService.applyLeave({
        userId: user.id,
        userName: user.name,
        type: leaveType,
        startDate,
        endDate,
        reason
      });
      setShowModal(false);
      setStartDate('');
      setEndDate('');
      setReason('');
      fetchLeaves();
    } catch (e) {
      alert("Failed to apply");
    }
  };

  const handleStatusChange = async (id: string, status: LeaveStatus) => {
    try {
      await mockService.updateLeaveStatus(id, status);
      fetchLeaves();
    } catch (e) {
      alert("Action failed");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leave Management</h1>
          <p className="text-gray-500">Manage time off requests and history.</p>
        </div>
        {!isAdmin && (
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm transition-colors"
          >
            <Plus size={18} />
            Apply Leave
          </button>
        )}
      </div>

      <div className="grid gap-6">
        {leaves.length === 0 && !loading && (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-500">No leave requests found.</p>
          </div>
        )}

        {leaves.map((leave) => (
          <div key={leave.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium
                  ${leave.type === LeaveType.SICK ? 'bg-red-100 text-red-800' :
                    leave.type === LeaveType.PAID ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'}`}>
                  {leave.type}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border
                  ${leave.status === LeaveStatus.APPROVED ? 'bg-green-50 text-green-700 border-green-200' :
                    leave.status === LeaveStatus.REJECTED ? 'bg-red-50 text-red-700 border-red-200' :
                    'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>
                  {leave.status}
                </span>
                <span className="text-xs text-gray-400">Applied on {leave.appliedOn}</span>
              </div>
              
              <h3 className="font-semibold text-gray-900">
                {isAdmin ? leave.userName : 'My Request'} 
                <span className="font-normal text-gray-500 mx-2">•</span> 
                {leave.startDate} to {leave.endDate}
              </h3>
              <p className="text-sm text-gray-600 max-w-2xl">{leave.reason}</p>
            </div>

            {isAdmin && leave.status === LeaveStatus.PENDING && (
              <div className="flex gap-2">
                <button 
                  onClick={() => handleStatusChange(leave.id, LeaveStatus.APPROVED)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 rounded-md hover:bg-green-100 transition-colors border border-green-200 text-sm font-medium"
                >
                  <Check size={16} /> Approve
                </button>
                <button 
                  onClick={() => handleStatusChange(leave.id, LeaveStatus.REJECTED)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-700 rounded-md hover:bg-red-100 transition-colors border border-red-200 text-sm font-medium"
                >
                  <X size={16} /> Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Apply Leave Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Apply for Leave</h2>
            <form onSubmit={handleApply} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
                <select 
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value as LeaveType)}
                  className="w-full rounded-lg border-gray-300 border p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  {Object.values(LeaveType).map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input 
                    type="date"
                    required
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    className="w-full rounded-lg border-gray-300 border p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input 
                    type="date"
                    required
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    className="w-full rounded-lg border-gray-300 border p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                <textarea 
                  required
                  rows={3}
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  className="w-full rounded-lg border-gray-300 border p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Why are you taking leave?"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 rounded-lg text-sm text-white hover:bg-blue-700 font-medium shadow-sm"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
