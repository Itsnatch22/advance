"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return <>{children}</>;
  }

  const handleSignOut = async () => {
    await getSupabaseBrowserClient().auth.signOut();
    router.replace("/admin/login");
  };

  return (
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
            <a href="/admin/careers/applications" className="transition-colors hover:text-emerald-700">
              Careers
            </a>
            <button
              type="button"
              onClick={handleSignOut}
              className="flex items-center gap-1.5 transition-colors hover:text-emerald-700"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </nav>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
