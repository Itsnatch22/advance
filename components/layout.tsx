import React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { LogOut, Menu, Bell, Search } from "lucide-react";
import { NavItem } from "../types";

interface DashboardLayoutProps {
  children: React.ReactNode;
  navItems: NavItem[];
  userRole: string;
  userName: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  navItems,
  userRole,
  userName,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    // Clear user session logic here if implemented
    router.push("/");
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Mobile Sidebar Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-slate-200 bg-white transition-transform duration-200 ease-in-out lg:static lg:transform-none ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} `}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center border-b border-slate-100 px-6">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
                <span className="text-lg font-bold text-white">E</span>
              </div>
              <span className="text-xl font-bold text-slate-900">EaziWage</span>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-6">
            <div className="mb-4 px-2">
              <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                {userRole} Menu
              </p>
            </div>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  } `}
                >
                  {React.cloneElement(item.icon as React.ReactElement<any>, {
                    size: 20,
                  })}
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* User Profile & Logout */}
          <div className="border-t border-slate-100 p-4">
            <div className="mb-4 flex items-center gap-3 px-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-600">
                {userName.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <p className="truncate text-sm font-medium text-slate-900">
                  {userName}
                </p>
                <p className="text-xs text-slate-500 capitalize">{userRole}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 lg:px-8">
          <button
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>

          <div className="ml-4 hidden max-w-md flex-1 md:block">
            <div className="relative">
              <Search
                className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search..."
                className="w-full rounded-lg border-none bg-slate-50 py-2 pr-4 pl-10 text-sm transition-all focus:bg-white focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>

          <div className="ml-auto flex items-center gap-4">
            <button className="relative rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full border-2 border-white bg-red-500"></span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="mx-auto max-w-6xl space-y-8">{children}</div>
        </main>
      </div>
    </div>
  );
};
