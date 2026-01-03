import React from 'react';
import { useApp } from '../context/AppContext';
import { Role } from '../types';
import { Download, DollarSign } from 'lucide-react';

const Payroll = () => {
  const { user, users } = useApp();
  const isAdmin = user?.role === Role.ADMIN;

  // Mock Payroll Generation based on User Salary
  const generatePayroll = (u: any) => {
    const basic = (u.salary || 0) / 12;
    const allowances = basic * 0.2;
    const deductions = basic * 0.1;
    const net = basic + allowances - deductions;
    return {
      month: 'October 2023',
      basic,
      allowances,
      deductions,
      net,
      status: 'PAID'
    };
  };

  const displayedPayroll = isAdmin 
    ? users.map(u => ({ user: u, ...generatePayroll(u) }))
    : [{ user, ...generatePayroll(user) }];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Payroll</h2>
        <p className="text-slate-500">{isAdmin ? 'Manage employee salaries' : 'View your salary slips'}</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Employee</th>
                <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Month</th>
                <th className="px-6 py-4 font-semibold text-slate-700 text-sm text-right">Basic</th>
                <th className="px-6 py-4 font-semibold text-slate-700 text-sm text-right">Allowances</th>
                <th className="px-6 py-4 font-semibold text-slate-700 text-sm text-right">Deductions</th>
                <th className="px-6 py-4 font-semibold text-slate-700 text-sm text-right">Net Salary</th>
                <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Status</th>
                <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayedPayroll.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                   <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{item.user?.name}</div>
                      <div className="text-xs text-slate-500">{item.user?.position}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{item.month}</td>
                  <td className="px-6 py-4 text-slate-600 text-right">${item.basic.toFixed(2)}</td>
                  <td className="px-6 py-4 text-slate-600 text-right text-green-600">+${item.allowances.toFixed(2)}</td>
                  <td className="px-6 py-4 text-slate-600 text-right text-red-600">-${item.deductions.toFixed(2)}</td>
                  <td className="px-6 py-4 font-bold text-slate-800 text-right">${item.net.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold">
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-50">
                      <Download size={18} />
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

export default Payroll;
