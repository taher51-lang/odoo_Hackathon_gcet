import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { mockService } from '../services/mockService';
import { AttendanceRecord, AttendanceStatus, User, Mood } from '../types';
import { Clock, CheckCircle, Smile, Meh, Frown, BatteryLow, AlertTriangle } from 'lucide-react';

export const Attendance: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [todayRecord, setTodayRecord] = useState<AttendanceRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]); // For admin mapping
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const data = await mockService.getAttendance(isAdmin ? undefined : user?.id);
      setRecords(data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      
      if (!isAdmin) {
        const today = new Date().toISOString().split('T')[0];
        const todayRec = data.find(r => r.date === today);
        setTodayRecord(todayRec || null);
      }

      if (isAdmin) {
        const uList = await mockService.getUsers();
        setUsers(uList);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isAdmin]);

  const handleCheckIn = async () => {
    if (!user) return;
    if (!selectedMood) {
      alert("Please tell us how you are feeling today!");
      return;
    }
    try {
      await mockService.checkIn(user.id, selectedMood);
      fetchAttendance();
    } catch (error) {
      alert("Check-in failed");
    }
  };

  const handleCheckOut = async () => {
    if (!user) return;
    try {
      await mockService.checkOut(user.id);
      fetchAttendance();
    } catch (error) {
      alert("Check-out failed");
    }
  };

  // Helper for admin to get user name
  const getUserName = (uid: string) => users.find(u => u.id === uid)?.name || uid;

  const moods: { type: Mood; icon: React.ReactNode; label: string; color: string }[] = [
    { type: 'HAPPY', icon: <Smile />, label: 'Happy', color: 'text-green-500 hover:bg-green-50 border-green-200' },
    { type: 'NEUTRAL', icon: <Meh />, label: 'Okay', color: 'text-gray-500 hover:bg-gray-50 border-gray-200' },
    { type: 'SAD', icon: <Frown />, label: 'Sad', color: 'text-blue-500 hover:bg-blue-50 border-blue-200' },
    { type: 'TIRED', icon: <BatteryLow />, label: 'Tired', color: 'text-orange-500 hover:bg-orange-50 border-orange-200' },
    { type: 'STRESSED', icon: <AlertTriangle />, label: 'Stressed', color: 'text-red-500 hover:bg-red-50 border-red-200' },
  ];

  const getMoodIcon = (mood?: Mood) => {
      switch(mood) {
          case 'HAPPY': return <Smile className="text-green-500" size={16} />;
          case 'NEUTRAL': return <Meh className="text-gray-500" size={16} />;
          case 'SAD': return <Frown className="text-blue-500" size={16} />;
          case 'TIRED': return <BatteryLow className="text-orange-500" size={16} />;
          case 'STRESSED': return <AlertTriangle className="text-red-500" size={16} />;
          default: return null;
      }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
          <p className="text-gray-500">Track daily work hours and status.</p>
        </div>
        
        {/* Check In/Out Widget for Employee */}
        {!isAdmin && (
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 w-full md:w-auto">
             <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="text-center md:text-right w-full md:w-auto">
                    <p className="text-sm text-gray-500 font-medium">Current Status</p>
                    <p className={`font-bold ${todayRecord?.checkOut ? 'text-gray-900' : todayRecord ? 'text-green-600' : 'text-gray-400'}`}>
                        {todayRecord?.checkOut ? 'COMPLETED' : todayRecord ? 'CHECKED IN' : 'NOT STARTED'}
                    </p>
                </div>
                
                {!todayRecord ? (
                <div className="flex flex-col gap-3 items-center">
                    <div className="flex gap-2">
                        {moods.map((m) => (
                            <button
                                key={m.type}
                                onClick={() => setSelectedMood(m.type)}
                                className={`p-2 rounded-full border-2 transition-all ${m.color} ${selectedMood === m.type ? 'scale-110 ring-2 ring-offset-2 ring-blue-300 bg-gray-50' : 'border-transparent opacity-70 hover:opacity-100'}`}
                                title={m.label}
                            >
                                {React.cloneElement(m.icon as React.ReactElement<any>, { size: 24 })}
                            </button>
                        ))}
                    </div>
                    <button onClick={handleCheckIn} className="w-full flex justify-center items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed" disabled={!selectedMood}>
                        <Clock size={18} />
                        Check In
                    </button>
                    {!selectedMood && <span className="text-xs text-red-500 animate-pulse">Select mood to check in</span>}
                </div>
                ) : !todayRecord.checkOut ? (
                <button onClick={handleCheckOut} className="flex items-center gap-2 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors shadow-sm">
                    <Clock size={18} />
                    Check Out
                </button>
                ) : (
                <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg">
                    <CheckCircle size={18} />
                    <span>Done</span>
                </div>
                )}
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {isAdmin && <th className="px-6 py-4 text-sm font-semibold text-gray-600">Employee</th>}
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Date</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Mood</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Check In</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Check Out</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Work Hours</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={isAdmin ? 7 : 6} className="px-6 py-4 text-center text-gray-500">Loading...</td></tr>
              ) : records.length === 0 ? (
                <tr><td colSpan={isAdmin ? 7 : 6} className="px-6 py-4 text-center text-gray-500">No records found.</td></tr>
              ) : (
                records.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                    {isAdmin && (
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{getUserName(record.userId)}</td>
                    )}
                    <td className="px-6 py-4 text-sm text-gray-600">{record.date}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${record.status === AttendanceStatus.PRESENT ? 'bg-green-100 text-green-800' :
                          record.status === AttendanceStatus.ABSENT ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'}`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                        {record.mood ? (
                            <div className="flex items-center gap-2" title={record.mood}>
                                {getMoodIcon(record.mood)}
                                <span className="capitalize text-xs">{record.mood.toLowerCase()}</span>
                            </div>
                        ) : <span className="text-gray-400">-</span>}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-mono">{record.checkIn || '--:--'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-mono">{record.checkOut || '--:--'}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">{record.workHours ? `${record.workHours}h` : '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};