import React from 'react';
import { useApp } from '../context/AppContext';
import { User } from '../types';
import { Mail, Phone, MapPin } from 'lucide-react';

const EmployeeManagement = () => {
  const { users } = useApp();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Employee Directory</h2>
        <p className="text-slate-500">Manage all employee records</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((employee) => (
          <div key={employee.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
            <div className="p-6 flex-1">
              <div className="flex items-center space-x-4 mb-4">
                <img 
                  src={employee.avatarUrl || `https://ui-avatars.com/api/?name=${employee.name}`} 
                  alt={employee.name} 
                  className="w-16 h-16 rounded-full border border-slate-200"
                />
                <div>
                  <h3 className="text-lg font-bold text-slate-800">{employee.name}</h3>
                  <p className="text-slate-500 text-sm">{employee.position}</p>
                  <span className="inline-block px-2 py-0.5 mt-1 bg-slate-100 text-slate-600 text-xs rounded-full">
                    {employee.department}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2 text-sm text-slate-600">
                <div className="flex items-center space-x-2">
                  <Mail size={16} className="text-slate-400" />
                  <span>{employee.email}</span>
                </div>
                {employee.phone && (
                  <div className="flex items-center space-x-2">
                    <Phone size={16} className="text-slate-400" />
                    <span>{employee.phone}</span>
                  </div>
                )}
                 {employee.address && (
                  <div className="flex items-center space-x-2">
                    <MapPin size={16} className="text-slate-400" />
                    <span className="truncate">{employee.address}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-between items-center text-sm">
                <span className="text-slate-500">Joined {employee.joinDate}</span>
                <span className={`font-semibold ${employee.role === 'ADMIN' ? 'text-purple-600' : 'text-blue-600'}`}>
                    {employee.role}
                </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeeManagement;
