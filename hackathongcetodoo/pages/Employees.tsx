import React, { useEffect, useState } from 'react';
import { mockService } from '../services/mockService';
import { User } from '../types';
import { Mail, Phone, MapPin } from 'lucide-react';

export const Employees: React.FC = () => {
  const [employees, setEmployees] = useState<User[]>([]);

  useEffect(() => {
    mockService.getUsers().then(setEmployees);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Employees Directory</h1>
        <p className="text-gray-500">Manage all employee records.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {employees.map(emp => (
          <div key={emp.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow">
            <img src={emp.avatarUrl} alt={emp.name} className="w-20 h-20 rounded-full mb-4 border-2 border-gray-100" />
            <h3 className="font-bold text-gray-900 text-lg">{emp.name}</h3>
            <p className="text-blue-600 text-sm font-medium mb-1">{emp.position}</p>
            <p className="text-gray-400 text-xs uppercase tracking-wider mb-4">{emp.department}</p>
            
            <div className="w-full space-y-2 text-sm text-gray-600 text-left bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-3">
                    <Mail size={16} className="text-gray-400" />
                    <span className="truncate">{emp.email}</span>
                </div>
                {emp.phone && (
                    <div className="flex items-center gap-3">
                        <Phone size={16} className="text-gray-400" />
                        <span>{emp.phone}</span>
                    </div>
                )}
                 <div className="flex items-center gap-3">
                    <span className="font-semibold text-xs text-gray-400 w-4">ID</span>
                    <span>{emp.employeeId}</span>
                </div>
            </div>
            
            <button className="mt-4 w-full py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 text-gray-700">
                View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
