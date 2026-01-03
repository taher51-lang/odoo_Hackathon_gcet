import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { mockService } from '../services/mockService';
import { AttendanceRecord, LeaveRequest, LeaveStatus, User } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Clock, Calendar, Users, TrendingUp, AlertCircle, AlertTriangle, Smile } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const [attendanceStats, setAttendanceStats] = useState<AttendanceRecord[]>([]);
  const [leaveStats, setLeaveStats] = useState<LeaveRequest[]>([]);
  const [burnoutRisks, setBurnoutRisks] = useState<User[]>([]);
  const [happinessData, setHappinessData] = useState<{name: string, value: number, color: string}[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const att = await mockService.getAttendance(isAdmin ? undefined : user?.id);
        const lvs = await mockService.getLeaves(isAdmin ? undefined : user?.id);
        setAttendanceStats(att);
        setLeaveStats(lvs);

        if (isAdmin) {
            const risks = await mockService.getBurnoutRisks();
            setBurnoutRisks(risks);
            const happiness = await mockService.getHappinessStats();
            setHappinessData(happiness);
        }
      } catch (e) {
        console.error("Failed to fetch dashboard data", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, isAdmin]);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading dashboard data...</div>;

  // Compute Stats
  const pendingLeaves = leaveStats.filter(l => l.status === LeaveStatus.PENDING).length;
  const approvedLeaves = leaveStats.filter(l => l.status === LeaveStatus.APPROVED).length;
  const presentToday = attendanceStats.filter(a => a.date === new Date().toISOString().split('T')[0]).length;

  const leaveData = [
    { name: 'Pending', value: pendingLeaves, color: '#F59E0B' },
    { name: 'Approved', value: approvedLeaves, color: '#10B981' },
    { name: 'Rejected', value: leaveStats.filter(l => l.status === LeaveStatus.REJECTED).length, color: '#EF4444' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name}</h1>
        <p className="text-gray-500 mt-1">Here's what's happening today.</p>
      </div>

      {/* Burnout Alert - Admin Only */}
      {isAdmin && burnoutRisks.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-start shadow-sm">
           <AlertTriangle className="text-red-500 mr-3 mt-0.5" />
           <div className="flex-1">
               <h3 className="text-red-800 font-bold">Burnout Risk Alert</h3>
               <p className="text-red-700 text-sm mt-1">
                   The following employees have worked 10+ hours for 5 consecutive days:
               </p>
               <div className="flex flex-wrap gap-2 mt-2">
                   {burnoutRisks.map(u => (
                       <Link to="/employees" key={u.id} className="bg-white px-2 py-1 rounded text-red-600 text-xs font-semibold border border-red-100 hover:bg-red-50">
                           {u.name}
                       </Link>
                   ))}
               </div>
           </div>
        </div>
      )}

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isAdmin && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
            <div className="p-3 bg-blue-50 rounded-lg text-blue-600 mr-4">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Employees</p>
              <p className="text-2xl font-bold text-gray-900">24</p>
            </div>
          </div>
        )}

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
          <div className="p-3 bg-green-50 rounded-lg text-green-600 mr-4">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">{isAdmin ? 'Present Today' : 'Work Hours (Avg)'}</p>
            <p className="text-2xl font-bold text-gray-900">{isAdmin ? presentToday : '8.2h'}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
          <div className="p-3 bg-yellow-50 rounded-lg text-yellow-600 mr-4">
            <AlertCircle size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Pending Leaves</p>
            <p className="text-2xl font-bold text-gray-900">{pendingLeaves}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
          <div className="p-3 bg-purple-50 rounded-lg text-purple-600 mr-4">
            <Calendar size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Upcoming Holidays</p>
            <p className="text-2xl font-bold text-gray-900">2</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Happiness Index - Admin Only */}
        {isAdmin && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-6">
                     <Smile className="text-yellow-500" />
                    <h3 className="text-lg font-semibold text-gray-900">Company Happiness Index</h3>
                </div>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={happinessData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                         <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" width={80} tick={{fontSize: 12}} />
                        <Tooltip cursor={{fill: 'transparent'}} />
                        <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                            {happinessData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Bar>
                    </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        )}

        {/* Leave Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Leave Requests Overview</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={leaveData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {leaveData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            {leaveData.map(d => (
              <div key={d.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }}></div>
                <span className="text-sm text-gray-600">{d.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions / Notifications */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {leaveStats.slice(0, 3).map((leave) => (
              <div key={leave.id} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className={`mt-1 w-2 h-2 rounded-full ${
                  leave.status === 'APPROVED' ? 'bg-green-500' : leave.status === 'REJECTED' ? 'bg-red-500' : 'bg-yellow-500'
                }`} />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {isAdmin ? `${leave.userName} applied for ` : 'You applied for '} 
                    <span className="lowercase">{leave.type} leave</span>
                  </p>
                  <p className="text-xs text-gray-500">{leave.startDate} - {leave.status}</p>
                </div>
              </div>
            ))}
            {leaveStats.length === 0 && (
              <p className="text-sm text-gray-500 italic">No recent activities.</p>
            )}
            
            <Link to="/leaves" className="block w-full text-center py-2 text-sm text-blue-600 hover:text-blue-700 font-medium border-t border-gray-100 mt-4">
              View All Activity
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
