"use client"
import React from 'react';
import { Users, DollarSign, FileText, TrendingUp, ArrowUpRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const mockData = [
  { name: 'Mon', amount: 4000 },
  { name: 'Tue', amount: 3000 },
  { name: 'Wed', amount: 2000 },
  { name: 'Thu', amount: 2780 },
  { name: 'Fri', amount: 1890 },
  { name: 'Sat', amount: 2390 },
  { name: 'Sun', amount: 3490 },
];

const StatCard: React.FC<{ title: string; value: string; trend: string; icon: React.ReactNode }> = ({ title, value, trend, icon }) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-2">{value}</h3>
          <p className="text-sm text-emerald-600 flex items-center gap-1 mt-2">
            <ArrowUpRight size={16} />
            {trend} from last month
          </p>
        </div>
        <div className="p-4 bg-indigo-50 rounded-xl text-indigo-600">
          {icon}
        </div>
      </div>
    </CardContent>
  </Card>
);

const EmployerDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
        <p className="text-slate-500">Welcome back, here's what's happening with your company today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Disbursed" 
          value="$124,500" 
          trend="+12%" 
          icon={<DollarSign size={24} />} 
        />
        <StatCard 
          title="Active Employees" 
          value="482" 
          trend="+4%" 
          icon={<Users size={24} />} 
        />
        <StatCard 
          title="Pending Requests" 
          value="24" 
          trend="+8%" 
          icon={<FileText size={24} />} 
        />
        <StatCard 
          title="Revenue Impact" 
          value="0.5%" 
          trend="-0.1%" 
          icon={<TrendingUp size={24} />} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Disbursement Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockData}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                  <Tooltip 
                    cursor={{ fill: '#f1f5f9' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="amount" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-2 h-2 mt-2 rounded-full bg-indigo-500"></div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">New Request from John Doe</p>
                    <p className="text-xs text-slate-500">2 hours ago</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 text-sm text-indigo-600 font-medium hover:text-indigo-700">View All Activity</button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmployerDashboard;