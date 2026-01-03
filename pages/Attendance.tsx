import React, { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { Role, AttendanceRecord } from '../types';
import { CheckCircle, Clock, Search, Filter } from 'lucide-react';

interface AttendanceRecordWithUser extends AttendanceRecord {
  userName?: string;
  userDept?: string;
}

const Attendance = () => {
  const { user, users, attendance, checkIn, checkOut } = useApp();
  const isAdmin = user?.role === Role.ADMIN;
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);

  const today = new Date().toISOString().split('T')[0];
  const myRecord = attendance.find(a => a.userId === user?.id && a.date === today);

  const displayedRecords: AttendanceRecordWithUser[] = useMemo(() => {
    if (isAdmin) {
      return attendance.filter(a => a.date === filterDate).map(record => {
        const u = users.find(usr => usr.id === record.userId);
        return { ...record, userName: u?.name, userDept: u?.department };
      });
    } else {
      // Employee sees their own history
      return attendance.filter(a => a.userId === user?.id).sort((a,b) => b.date.localeCompare(a.date));
    }
  }, [isAdmin, attendance, filterDate, user, users]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Attendance</h2>
          <p className="text-slate-500">Track daily check-ins and check-outs</p>
        </div>
        
        {!isAdmin && (
          <div className="flex items-center space-x-4">
            {!myRecord?.checkIn ? (
              <button 
                onClick={checkIn}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg flex items-center space-x-2 font-medium transition-colors shadow-sm"
              >
                <CheckCircle size={20} />
                <span>Check In</span>
              </button>
            ) : !myRecord?.checkOut ? (
              <button 
                onClick={checkOut}
                className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2.5 rounded-lg flex items-center space-x-2 font-medium transition-colors shadow-sm"
              >
                <Clock size={20} />
                <span>Check Out</span>
              </button>
            ) : (
              <div className="bg-green-100 text-green-700 px-6 py-2.5 rounded-lg font-medium flex items-center space-x-2">
                <CheckCircle size={20} />
                <span>Completed for Today</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Filters for Admin */}
      {isAdmin && (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4">
            <div className="relative">
                <Filter className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
                <input 
                    type="date" 
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none placeholder:text-slate-400"
                />
            </div>
            <div className="text-sm text-slate-500">
                Viewing records for <b>{filterDate}</b>
            </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {isAdmin && <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Employee</th>}
                <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Date</th>
                <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Check In</th>
                <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Check Out</th>
                <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Total Hours</th>
                <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayedRecords.length > 0 ? (
                displayedRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                    {isAdmin && (
                        <td className="px-6 py-4">
                            <div className="font-medium text-slate-900">{record.userName || 'Unknown'}</div>
                            <div className="text-xs text-slate-500">{record.userDept}</div>
                        </td>
                    )}
                    <td className="px-6 py-4 text-slate-600">{record.date}</td>
                    <td className="px-6 py-4 text-slate-600">
                      {record.checkIn ? new Date(record.checkIn).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '-'}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {record.checkOut ? new Date(record.checkOut).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '-'}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {record.totalHours ? `${record.totalHours.toFixed(2)} hrs` : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${record.status === 'PRESENT' ? 'bg-green-100 text-green-800' : 
                          record.status === 'ABSENT' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    No attendance records found for this period.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Attendance;