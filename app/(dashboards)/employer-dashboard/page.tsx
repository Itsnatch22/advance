"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Icons, MOCK_EMPLOYEES } from '@/constants';

export default function EmployerDashboard() {
  const [searchTerm, setSearchTerm] = useState('');

  const chartData = [
    { name: 'Jan', amount: 45000 },
    { name: 'Feb', amount: 52000 },
    { name: 'Mar', amount: 48000 },
    { name: 'Apr', amount: 61000 },
    { name: 'May', amount: 55000 },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col">
        <div className="p-6">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">E</span>
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">EaziWage</span>
          </Link>
        </div>
        
        <nav className="flex-grow px-4 space-y-2 py-4">
          <NavItem icon={<Icons.LayoutDashboard size={20} />} label="Overview" active />
          <NavItem icon={<Icons.Users size={20} />} label="Employees" />
          <NavItem icon={<Icons.CreditCard size={20} />} label="Payroll" />
          <NavItem icon={<Icons.TrendingUp size={20} />} label="Insights" />
          <NavItem icon={<Icons.Settings size={20} />} label="Settings" />
        </nav>

        <div className="p-6 border-t border-slate-100">
          <Link href="/" className="flex items-center text-slate-500 hover:text-red-600 transition-colors">
            <Icons.LogOut size={20} className="mr-2" />
            <span className="text-sm font-medium">Log Out</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-4 lg:p-8 max-h-screen overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Employer Console</h1>
            <p className="text-slate-500">Welcome back, Admin</p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 text-slate-400 hover:text-slate-600">
              <Icons.ShieldCheck size={24} />
            </button>
            <div className="w-10 h-10 bg-blue-100 text-green-500 rounded-full flex items-center justify-center font-bold">
              AD
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Payroll" value="$425,000" change="+4.2%" trend="up" />
          <StatCard title="Active Employees" value="128" change="0.0%" trend="neutral" />
          <StatCard title="Disbursed Wages" value="$18,450" change="+12.5%" trend="up" />
          <StatCard title="Pending Approvals" value="4" urgent />
        </div>

        {/* Charts & Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Analytics */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-slate-900">Wage Disbursement Activity</h3>
                <select className="bg-slate-50 border-none text-sm text-slate-600 rounded-lg px-2 py-1 outline-none">
                  <option>Last 5 months</option>
                </select>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                    <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} />
                    <Bar dataKey="amount" radius={[4, 4, 0, 0]} fill="#15803D" barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Employee Table */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-slate-900">Employee Management</h3>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Search employees..." 
                    className="pl-8 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm w-64 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Icons.Users className="absolute left-2.5 top-2.5 text-slate-400 w-4 h-4" />
                </div>
              </div>
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Employee</th>
                    <th className="px-6 py-4">Salary</th>
                    <th className="px-6 py-4">Accessed</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {MOCK_EMPLOYEES.filter(e => e.name.toLowerCase().includes(searchTerm.toLowerCase())).map((employee) => (
                    <tr key={employee.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900">{employee.name}</div>
                        <div className="text-xs text-slate-500">{employee.role}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">${employee.salary.toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">${employee.withdrawnThisMonth.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                          employee.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                        }`}>
                          {employee.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            <div className="bg-green-600 text-white p-6 rounded-3xl shadow-xl shadow-blue-100">
              <h4 className="font-bold mb-2">Automated Payouts</h4>
              <p className="text-blue-100 text-sm mb-6">Your upcoming payroll reconciliation is in 4 days. Everything is on track.</p>
              <button className="w-full py-3 bg-white text-green-600 font-bold rounded-xl hover:bg-blue-50 transition-colors">
                View Full Schedule
              </button>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-slate-900 mb-4">Approval Requests</h4>
              <div className="space-y-4">
                <ApprovalItem name="David Kim" amount={200} time="2h ago" />
                <ApprovalItem name="Sarah Jenkins" amount={800} time="5h ago" />
                <button className="w-full py-2 text-blue-600 text-sm font-semibold hover:underline">
                  View all requests
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Helper Components
interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

function NavItem({ icon, label, active = false }: NavItemProps) {
  return (
  <button className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
    active ? 'bg-blue-50 text-green-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
  }`}
    >
      {icon}
      <span className="text-sm font-semibold">{label}</span>
    </button>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  trend?: 'up' | 'neutral';
  urgent?: boolean;
}

function StatCard({ title, value, change, trend, urgent = false }: StatCardProps) {
  return (
  <div className={`p-6 bg-white rounded-3xl border ${urgent ? 'border-blue-200 bg-blue-50/30' : 'border-slate-200'} shadow-sm`}>
    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{title}</h4>
    <div className="flex items-baseline justify-between">
      <span className="text-2xl font-bold text-slate-900 tracking-tight">{value}</span>
      {change && (
        <span className={`text-xs font-bold ${trend === 'up' ? 'text-green-600' : 'text-slate-400'}`}>
          {change}
        </span>
      )}
      </div>
    </div>
  );
}

interface ApprovalItemProps {
  name: string;
  amount: number;
  time: string;
}

function ApprovalItem({ name, amount, time }: ApprovalItemProps) {
  return (
  <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50">
    <div className="flex items-center space-x-3">
      <div className="w-8 h-8 bg-blue-100 text-green-600 rounded-lg flex items-center justify-center font-bold text-xs">
        {name.split(' ').map((n: string) => n[0]).join('')}
      </div>
      <div>
        <div className="text-sm font-bold text-slate-900">{name}</div>
        <div className="text-[10px] text-slate-500">{time} • ${amount}</div>
      </div>
    </div>
    <div className="flex space-x-1">
      <button className="p-1.5 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors">
        <Icons.CheckCircle2 size={16} />
      </button>
      </div>
    </div>
  );
}
