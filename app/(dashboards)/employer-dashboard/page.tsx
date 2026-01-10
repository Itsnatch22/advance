import React, { useState } from "react";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Icons, MOCK_EMPLOYEES } from "@/constants";

// --- Sub-page Components ---

const OverviewTab = ({ stats, chartData }: any) => (
  <div className="animate-in fade-in space-y-8 duration-500">
    {/* Stats Grid */}
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Payroll"
        value="$425,000"
        change="+4.2%"
        trend="up"
      />
      <StatCard
        title="Active Employees"
        value="128"
        change="0.0%"
        trend="neutral"
      />
      <StatCard
        title="Disbursed Wages"
        value="$18,450"
        change="+12.5%"
        trend="up"
      />
      <StatCard title="Pending Approvals" value="4" urgent />
    </div>

    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <div className="space-y-8 lg:col-span-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="font-bold text-slate-900">
              Wage Disbursement Activity
            </h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                />
                <Tooltip
                  cursor={{ fill: "#f8fafc" }}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                />
                <Bar
                  dataKey="amount"
                  radius={[4, 4, 0, 0]}
                  fill="#3b82f6"
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 font-bold text-slate-900">Recent Transactions</h3>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-2xl bg-slate-50 p-3"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-green-600">
                    <Icons.CreditCard size={18} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">
                      Withdrawal - Sarah Jenkins
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Today, 2:45 PM
                    </div>
                  </div>
                </div>
                <div className="text-sm font-bold text-slate-900">$450.00</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-3xl bg-blue-600 p-6 text-white shadow-xl shadow-blue-100">
          <h4 className="mb-2 font-bold">Platform Health</h4>
          <p className="mb-4 text-sm text-blue-100">
            Your payroll account is fully funded and integrations are active.
          </p>
          <div className="flex items-center space-x-2 rounded-lg bg-blue-700/50 p-2 text-xs font-bold">
            <Icons.CheckCircle2 size={14} />
            <span>All systems nominal</span>
          </div>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h4 className="mb-4 font-bold text-slate-900">Pending Tasks</h4>
          <div className="space-y-3">
            <ApprovalItem name="David Kim" amount={200} time="2h ago" />
            <ApprovalItem name="Sarah Jenkins" amount={800} time="5h ago" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

const EmployeesTab = ({ employees, searchTerm, setSearchTerm }: any) => (
  <div className="animate-in fade-in slide-in-from-bottom-4 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm duration-500">
    <div className="flex flex-col items-center justify-between gap-4 border-b border-slate-100 p-6 md:flex-row">
      <h3 className="text-xl font-bold text-slate-900">Employee Directory</h3>
      <div className="flex w-full items-center space-x-3 md:w-auto">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search by name or role..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pr-4 pl-10 text-sm transition-all outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 md:w-80"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Icons.Users className="absolute top-3 left-3 h-4 w-4 text-slate-400" />
        </div>
        <button className="rounded-xl bg-blue-600 p-2.5 text-white transition-colors hover:bg-blue-700">
          <Icons.ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead className="bg-slate-50 text-xs tracking-wider text-slate-500 uppercase">
          <tr>
            <th className="px-6 py-4">Employee</th>
            <th className="px-6 py-4">Department</th>
            <th className="px-6 py-4">Monthly Salary</th>
            <th className="px-6 py-4">Total Accessed</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {employees
            .filter((e: any) =>
              e.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((employee: any) => (
              <tr
                key={employee.id}
                className="group transition-colors hover:bg-slate-50/50"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
                      {employee.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">
                        {employee.name}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        ID: EW-{employee.id}000
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-slate-600">
                  {employee.role}
                </td>
                <td className="px-6 py-4 text-sm font-bold text-slate-600">
                  ${employee.salary.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  ${employee.withdrawnThisMonth.toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wide uppercase ${
                      employee.status === "Active"
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-amber-50 text-amber-600"
                    }`}
                  >
                    {employee.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="text-slate-400 transition-colors hover:text-green-600">
                    <Icons.Settings size={16} />
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  </div>
);

const PayrollTab = () => (
  <div className="animate-in fade-in slide-in-from-bottom-4 space-y-6 duration-500">
    <div className="grid gap-6 md:grid-cols-3">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 md:col-span-2">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h3 className="mb-1 text-xl font-bold text-slate-900">
              Payroll Cycle: May 2024
            </h3>
            <p className="text-sm text-slate-500">
              Next settlement date: May 28th, 2024
            </p>
          </div>
          <button className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white transition-all hover:bg-black">
            Run Mid-Cycle Report
          </button>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-6">
            <div className="flex items-center space-x-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-green-600">
                <Icons.Wallet size={24} />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900">
                  Total Funding Required
                </div>
                <div className="text-2xl font-black text-green-600">
                  $443,450.00
                </div>
              </div>
            </div>
            <div className="hidden text-right sm:block">
              <div className="mb-1 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                Status
              </div>
              <div className="flex items-center font-bold text-emerald-600">
                <Icons.CheckCircle2 size={14} className="mr-1" /> Fully Funded
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-slate-100 bg-white p-4">
              <div className="mb-1 text-xs font-bold text-slate-500">
                Net Salaries
              </div>
              <div className="text-lg font-bold text-slate-900">
                $425,000.00
              </div>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-white p-4">
              <div className="mb-1 text-xs font-bold text-slate-500">
                EaziWage Reconcile
              </div>
              <div className="text-lg font-bold text-slate-900">$18,450.00</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-between rounded-3xl bg-slate-900 p-8 text-white">
        <div>
          <Icons.ShieldCheck className="mb-4 text-blue-400" size={32} />
          <h4 className="mb-2 text-lg font-bold">Automated Compliance</h4>
          <p className="text-sm leading-relaxed text-slate-400">
            All tax withholdings and contribution deductions are automatically
            adjusted based on employee wage access.
          </p>
        </div>
        <button className="mt-8 w-full rounded-2xl border border-white/10 bg-white/10 py-4 text-sm font-bold text-white transition-all hover:bg-white/20">
          Download Tax Forms
        </button>
      </div>
    </div>
  </div>
);

const InsightsTab = () => {
  const engagementData = [
    { name: "Mon", active: 45 },
    { name: "Tue", active: 52 },
    { name: "Wed", active: 68 },
    { name: "Thu", active: 59 },
    { name: "Fri", active: 82 },
    { name: "Sat", active: 30 },
    { name: "Sun", active: 25 },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-8 duration-500">
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-8">
          <h3 className="mb-6 font-bold text-slate-900">
            Employee Financial Engagement
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={engagementData}>
                <defs>
                  <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="active"
                  stroke="#10b981"
                  fillOpacity={1}
                  fill="url(#colorActive)"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-8">
          <h3 className="mb-6 font-bold text-slate-900">Retention Impact</h3>
          <div className="flex h-72 items-center justify-between">
            <div className="w-full space-y-6">
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-6">
                <div className="mb-1 text-3xl font-black text-green-600">
                  24%
                </div>
                <div className="text-sm font-bold text-green-800">
                  Reduction in Turnover
                </div>
                <p className="mt-2 text-xs text-green-600/70">
                  Compared to industry average without EWA.
                </p>
              </div>
              <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6">
                <div className="mb-1 text-3xl font-black text-green-600">
                  89%
                </div>
                <div className="text-sm font-bold text-green-800">
                  Positive Feedback
                </div>
                <p className="mt-2 text-xs text-green-600/70">
                  Based on monthly employee wellness surveys.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SettingsTab = () => (
  <div className="animate-in fade-in slide-in-from-bottom-4 max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 duration-500">
    <h3 className="mb-8 text-xl font-bold text-slate-900">Account Settings</h3>

    <div className="space-y-8">
      <section>
        <h4 className="mb-4 text-sm font-bold tracking-widest text-slate-400 uppercase">
          Company Profile
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="ml-1 text-xs font-bold text-slate-600">
              Company Name
            </label>
            <input
              type="text"
              className="w-full rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm"
              defaultValue="Acme Corporation"
            />
          </div>
          <div className="space-y-1">
            <label className="ml-1 text-xs font-bold text-slate-600">
              Tax ID
            </label>
            <input
              type="text"
              className="w-full rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm"
              defaultValue="XX-XXXX452"
            />
          </div>
        </div>
      </section>

      <section>
        <h4 className="mb-4 text-sm font-bold tracking-widest text-slate-400 uppercase">
          Policy Settings
        </h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
            <div>
              <div className="text-sm font-bold text-green-900">
                Withdrawal Limit
              </div>
              <div className="text-xs text-slate-500">
                Max % of earned wage accessible
              </div>
            </div>
            <select className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-bold outline-none">
              <option>50%</option>
              <option>70%</option>
              <option>100%</option>
            </select>
          </div>
          <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
            <div>
              <div className="text-sm font-bold text-green-900">
                Auto-Approval
              </div>
              <div className="text-xs text-slate-500">
                Automatically approve requests under $500
              </div>
            </div>
            <div className="relative h-6 w-12 rounded-full bg-green-600">
              <div className="absolute top-1 right-1 h-4 w-4 rounded-full bg-white"></div>
            </div>
          </div>
        </div>
      </section>

      <button className="w-full rounded-2xl bg-green-600 py-4 font-bold text-white shadow-lg shadow-green-100 transition-all hover:bg-green-700">
        Save All Changes
      </button>
    </div>
  </div>
);

// --- Main Dashboard Component ---

const EmployerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("Overview");
  const [searchTerm, setSearchTerm] = useState("");

  const chartData = [
    { name: "Jan", amount: 45000 },
    { name: "Feb", amount: 52000 },
    { name: "Mar", amount: 48000 },
    { name: "Apr", amount: 61000 },
    { name: "May", amount: 55000 },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "Employees":
        return (
          <EmployeesTab
            employees={MOCK_EMPLOYEES}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        );
      case "Payroll":
        return <PayrollTab />;
      case "Insights":
        return <InsightsTab />;
      case "Settings":
        return <SettingsTab />;
      case "Overview":
      default:
        return <OverviewTab chartData={chartData} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 flex-col border-r border-slate-200 bg-white lg:flex">
        <div className="p-6">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-600">
              <span className="text-xl font-bold text-white">E</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              EaziWage
            </span>
          </Link>
        </div>

        <nav className="flex-grow space-y-2 px-4 py-4">
          <NavItem
            icon={<Icons.LayoutDashboard size={20} />}
            label="Overview"
            active={activeTab === "Overview"}
            onClick={() => setActiveTab("Overview")}
          />
          <NavItem
            icon={<Icons.Users size={20} />}
            label="Employees"
            active={activeTab === "Employees"}
            onClick={() => setActiveTab("Employees")}
          />
          <NavItem
            icon={<Icons.CreditCard size={20} />}
            label="Payroll"
            active={activeTab === "Payroll"}
            onClick={() => setActiveTab("Payroll")}
          />
          <NavItem
            icon={<Icons.TrendingUp size={20} />}
            label="Insights"
            active={activeTab === "Insights"}
            onClick={() => setActiveTab("Insights")}
          />
          <NavItem
            icon={<Icons.Settings size={20} />}
            label="Settings"
            active={activeTab === "Settings"}
            onClick={() => setActiveTab("Settings")}
          />
        </nav>

        <div className="border-t border-slate-100 p-6">
          <Link
            href="/"
            className="flex items-center text-slate-500 transition-colors hover:text-red-600"
          >
            <Icons.LogOut size={20} className="mr-2" />
            <span className="text-sm font-medium">Log Out</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow overflow-y-auto p-4 lg:p-8">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{activeTab}</h1>
            <p className="text-slate-500">Employer Console &bull; Acme Corp</p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-400 shadow-sm transition-all hover:text-slate-600">
              <Icons.ShieldCheck size={20} />
            </button>
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-green-100 font-bold text-green-700 shadow-sm">
              AD
            </div>
          </div>
        </header>

        {renderContent()}
      </main>
    </div>
  );
};

// Helper Components
const NavItem = ({ icon, label, active = false, onClick }: any) => (
  <button
    onClick={onClick}
    className={`group flex w-full items-center space-x-3 rounded-xl px-4 py-3 transition-all ${
      active
        ? "bg-blue-50 text-blue-700"
        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
    }`}
  >
    <div
      className={`${active ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"} transition-colors`}
    >
      {icon}
    </div>
    <span className="text-sm font-semibold">{label}</span>
  </button>
);

const StatCard = ({ title, value, change, trend, urgent = false }: any) => (
  <div
    className={`rounded-3xl border bg-white p-6 ${urgent ? "border-green-200 bg-green-50/30" : "border-slate-200"} group cursor-default shadow-sm transition-colors hover:border-green-300`}
  >
    <h4 className="mb-2 text-xs font-bold tracking-widest text-slate-500 uppercase">
      {title}
    </h4>
    <div className="flex items-baseline justify-between">
      <span className="text-2xl font-bold tracking-tight text-slate-900 transition-colors group-hover:text-green-600">
        {value}
      </span>
      {change && (
        <span
          className={`text-xs font-bold ${trend === "up" ? "text-emerald-600" : "text-slate-400"}`}
        >
          {change}
        </span>
      )}
    </div>
  </div>
);

const ApprovalItem = ({ name, amount, time }: any) => (
  <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-3 transition-colors hover:bg-slate-100">
    <div className="flex items-center space-x-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-xs font-bold text-blue-600">
        {name
          .split(" ")
          .map((n: string) => n[0])
          .join("")}
      </div>
      <div>
        <div className="text-sm font-bold text-slate-900">{name}</div>
        <div className="text-[10px] text-slate-500">
          {time} • ${amount}
        </div>
      </div>
    </div>
    <div className="flex space-x-1">
      <button className="rounded-lg p-1.5 text-green-600 transition-colors hover:bg-green-100">
        <Icons.CheckCircle2 size={16} />
      </button>
    </div>
  </div>
);

export default EmployerDashboard;
