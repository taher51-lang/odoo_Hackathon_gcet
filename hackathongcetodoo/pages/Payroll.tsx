import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { mockService } from '../services/mockService';
import { PayrollRecord } from '../types';
import { Download, DollarSign } from 'lucide-react';

export const Payroll: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const [records, setRecords] = useState<PayrollRecord[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const data = await mockService.getPayroll(isAdmin ? undefined : user?.id);
      setRecords(data);
    };
    fetch();
  }, [user, isAdmin]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Payroll</h1>
        <p className="text-gray-500">View salary slips and payment history.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Month</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Basic Salary</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Allowances</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Deductions</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Net Salary</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
               {records.map(rec => (
                 <tr key={rec.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{rec.month}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">${rec.basicSalary}</td>
                    <td className="px-6 py-4 text-sm text-green-600">+${rec.allowances}</td>
                    <td className="px-6 py-4 text-sm text-red-600">-${rec.deductions}</td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">${rec.netSalary}</td>
                    <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                            {rec.status}
                        </span>
                    </td>
                    <td className="px-6 py-4">
                        <button className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm font-medium">
                            <Download size={16} /> Slip
                        </button>
                    </td>
                 </tr>
               ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
