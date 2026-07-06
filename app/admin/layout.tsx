"use client";

import { AdminAuthGuard } from "./auth-guard";
import Image from "next/image";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthGuard>
      <div className="min-h-screen bg-slate-50">
        <header className="border-b border-slate-200/60 bg-white">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <Image src="/logo.png" alt="EaziWage" className="h-7" width={28} height={28} />
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-500/10">
                Admin
              </span>
            </div>
            <nav className="flex items-center gap-6 text-sm font-medium text-slate-600">
              <a href="/admin/campaigns" className="transition-colors hover:text-emerald-700">
                Campaigns
              </a>
            </nav>
          </div>
        </header>
        <main>{children}</main>
      </div>
    </AdminAuthGuard>
  );
}
