import React from 'react';
import { useApp } from '../context/AppContext';
import { Role } from '../types';
import { 
  Users, 
  Clock, 
  Calendar, 
  AlertCircle,
  TrendingUp,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const StatCard = ({ title, value, icon: Icon, color, subtext }: any) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-start justify-between">
    <div>
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <h3 className="text-2xl font-bold text-slate-800 mt-1">{value}</h3>
      {subtext && <p className="text-xs text-slate-400 mt-1">{subtext}</p>}
    </div>
    <div className={`p-3 rounded-lg ${color}`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
  </div>
);

const Dashboard = () => {
  const { user, users, attendance, leaves } = useApp();
  const isAdmin = user?.role === Role.ADMIN;

  // Compute Stats
  const today = new Date().toISOString().split('T')[0];
  const presentCount = attendance.filter(a => a.date === today && a.status === 'PRESENT').length;
  const pendingLeaves = leaves.filter(l => l.status === 'PENDING').length;

  const employeeStats = [
    { name: 'Present', value: presentCount },
    { name: 'On Leave', value: leaves.filter(l => l.startDate <= today && l.endDate >= today && l.status === 'APPROVED').length },
    { name: 'Absent', value: users.length - presentCount },
  ];

  if (isAdmin) {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Admin Dashboard</h2>
          <p className="text-slate-500">Overview of company HR metrics</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Total Employees" 
            value={users.length} 
            icon={Users} 
            color="bg-blue-500" 
            subtext="+2 this month"
          />
          <StatCard 
            title="Present Today" 
            value={presentCount} 
            icon={CheckCircle} 
            color="bg-green-500" 
            subtext={`${Math.round((presentCount/users.length)*100)}% attendance`}
          />
          <StatCard 
            title="Pending Leaves" 
            value={pendingLeaves} 
            icon={Clock} 
            color="bg-orange-500" 
            subtext="Requires approval"
          />
          <StatCard 
            title="On Leave" 
            value={employeeStats[1].value} 
            icon={Calendar} 
            color="bg-purple-500" 
            subtext="Approved leaves today"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 lg:col-span-2">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Recent Leave Requests</h3>
            <div className="space-y-4">
              {leaves.slice(0, 5).map(leave => {
                const reqUser = users.find(u => u.id === leave.userId);
                return (
                  <div key={leave.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold">
                        {reqUser?.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">{reqUser?.name}</p>
                        <p className="text-sm text-slate-500">{leave.type} • {leave.startDate}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium 
                      ${leave.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 
                        leave.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                      {leave.status}
                    </span>
                  </div>
                );
              })}
              {leaves.length === 0 && <p className="text-slate-400 text-center py-4">No recent requests</p>}
            </div>
          </div>

          {/* Simple Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Attendance Overview</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={employeeStats}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Employee View
  const myAttendance = attendance.filter(a => a.userId === user?.id);
  const myLeaves = leaves.filter(l => l.userId === user?.id);
  const todayRecord = myAttendance.find(a => a.date === today);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Welcome back, {user?.name}</h2>
        <p className="text-slate-500">Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Attendance Status" 
          value={todayRecord ? 'Present' : 'Not Checked In'} 
          icon={todayRecord ? CheckCircle : Clock} 
          color={todayRecord ? "bg-green-500" : "bg-slate-400"}
          subtext={todayRecord?.checkIn ? `In at ${new Date(todayRecord.checkIn).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}` : "Check in to mark attendance"}
        />
        <StatCard 
          title="Leave Balance" 
          value="12 Days" 
          icon={Calendar} 
          color="bg-blue-500" 
          subtext="Annual Leave Remaining"
        />
        <StatCard 
          title="Pending Requests" 
          value={myLeaves.filter(l => l.status === 'PENDING').length} 
          icon={AlertCircle} 
          color="bg-orange-500" 
          subtext="Waiting for approval"
        />
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 mb-4">My Recent Activity</h3>
        <div className="space-y-4">
           {myLeaves.slice(0, 3).map(leave => (
             <div key={leave.id} className="flex items-center justify-between p-4 border-b border-slate-50 last:border-0">
               <div className="flex items-center space-x-4">
                 <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                   <TrendingUp size={20} />
                 </div>
                 <div>
                   <p className="font-medium text-slate-800">Applied for {leave.type} Leave</p>
                   <p className="text-sm text-slate-500">{leave.startDate} to {leave.endDate}</p>
                 </div>
               </div>
               <span className={`px-3 py-1 rounded-full text-xs font-medium 
                      ${leave.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 
                        leave.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                  {leave.status}
                </span>
             </div>
           ))}
           {myLeaves.length === 0 && <p className="text-slate-400">No recent activity.</p>}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
