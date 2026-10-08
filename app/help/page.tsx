"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Search, ShieldAlert, UserRound, BriefcaseBusiness } from "lucide-react";
import { getUrgentArticles } from "@/lib/help/content";
import { searchHelpArticles } from "@/lib/help/search";

export default function HelpHubPage() {
  const [query, setQuery] = useState("");

  const suggestions = useMemo(() => {
    if (!query.trim()) return getUrgentArticles();
    return searchHelpArticles(query);
  }, [query]);

  return (
    <main className="mx-auto max-w-6xl px-4 pb-20 pt-24 sm:px-6 md:pt-28 lg:pt-32">
      <section className="rounded-[2rem] border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-green-50 p-8 shadow-[0_30px_70px_-50px_rgba(16,185,129,0.5)] md:p-16">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2 text-xs font-semibold tracking-[0.2em] text-emerald-700 uppercase">
            <ShieldAlert size={14} />
            Help & Support
          </div>
          <h1 className="font-serif text-4xl font-bold tracking-tight text-slate-900 md:text-6xl">
            Find the answer before you contact support.
          </h1>
          <p className="mt-5 text-lg text-slate-600">
            Search common issues with payouts, verification, access, and payroll. If you still need help, the next step is a prefilled contact form.
          </p>

          <div className="relative mt-8">
            <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              aria-label="Search help articles"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search: money didn't arrive, verification failed…"
              className="h-16 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 text-base text-slate-800 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
            />
          </div>
        </div>
      </section>

      <section className="mt-12 grid gap-6 md:grid-cols-2">
        <Link href="/help/employees" className="group rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-md">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
            <UserRound size={22} />
          </div>
          <p className="text-xs font-semibold tracking-[0.2em] text-slate-500 uppercase">For employees</p>
          <h2 className="mt-3 text-2xl font-bold text-slate-900">Access, payouts & account issues</h2>
          <p className="mt-3 text-slate-600">Check the most common reasons wages are delayed, limits are low, or a payout does not arrive.</p>
          <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700">Browse articles <ArrowRight size={16} className="transition group-hover:translate-x-1" /></div>
        </Link>

        <Link href="/help/employers" className="group rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-md">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
            <BriefcaseBusiness size={22} />
          </div>
          <p className="text-xs font-semibold tracking-[0.2em] text-slate-500 uppercase">For employers</p>
          <h2 className="mt-3 text-2xl font-bold text-slate-900">Payroll setup & team onboarding</h2>
          <p className="mt-3 text-slate-600">Review onboarding tasks, payroll corrections, and how to handle employees who leave with an outstanding balance.</p>
          <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700">Browse articles <ArrowRight size={16} className="transition group-hover:translate-x-1" /></div>
        </Link>
      </section>

      <section className="mt-14">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-slate-900">Popular now</h2>
          <Link href="/help/contact" className="text-sm font-semibold text-emerald-700">Contact support</Link>
        </div>

        <div className="space-y-3">
          {suggestions.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-slate-500">
              No results found. Try a broader search or contact the support team.
            </div>
          ) : (
            suggestions.map((article) => (
              <Link
                key={article.slug}
                href={`/help/${article.audience}/${article.slug}`}
                className="block rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-emerald-300 hover:bg-emerald-50/40"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold tracking-[0.2em] text-slate-500 uppercase">{article.audience}</p>
                    <h3 className="mt-2 text-xl font-semibold text-slate-900">{article.title}</h3>
                    <p className="mt-2 text-sm text-slate-600">{article.description}</p>
                  </div>
                  <ArrowRight size={18} className="text-emerald-700" />
                </div>
              </Link>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
