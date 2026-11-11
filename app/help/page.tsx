"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  BriefcaseBusiness,
  Search,
  ShieldAlert,
  UserRound,
} from "lucide-react";
import { getUrgentArticles } from "@/lib/help/content";
import { searchHelpArticles } from "@/lib/help/search";

export default function HelpHubPage() {
  const [query, setQuery] = useState("");

  const suggestions = useMemo(() => {
    if (!query.trim()) return getUrgentArticles();
    return searchHelpArticles(query);
  }, [query]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-24 lg:py-28">
      <header className="mb-10 max-w-3xl">
        <p className="text-xs font-semibold tracking-[0.2em] text-emerald-700 uppercase">
          <ShieldAlert className="mr-2 inline size-4" aria-hidden="true" />
          Help &amp; Support
        </p>
        <h1 className="mt-3 font-serif text-4xl leading-tight font-bold tracking-tight text-slate-900 sm:text-5xl">
          Find the answer before you contact support.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
          Search common issues with payouts, verification, access, and payroll.
          If you still need help, the next step is a prefilled contact form.
        </p>

        <div className="group relative mt-7 max-w-2xl">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-emerald-700"
          />
          <input
            aria-label="Search help articles"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search: money didn't arrive, verification failed…"
            className="h-14 w-full rounded-2xl border border-slate-200 bg-white pr-4 pl-12 text-base text-slate-800 shadow-sm transition outline-none placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
          />
        </div>
      </header>

      <section
        aria-label="Browse help by audience"
        className="grid gap-5 md:grid-cols-2"
      >
        <Link
          href="/help/employees"
          className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-[border-color,box-shadow] hover:border-emerald-300 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700 motion-reduce:transition-none sm:p-7"
        >
          <div className="mb-5 flex size-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
            <UserRound size={21} aria-hidden="true" />
          </div>
          <p className="text-xs font-semibold tracking-[0.16em] text-slate-500 uppercase">
            For employees
          </p>
          <h2 className="mt-2 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Access, payouts &amp; account issues
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
            Check the most common reasons wages are delayed, limits are low, or
            a payout does not arrive.
          </p>
          <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700">
            Browse articles
            <ArrowRight
              size={16}
              aria-hidden="true"
              className="transition-transform group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
            />
          </span>
        </Link>

        <Link
          href="/help/employers"
          className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-[border-color,box-shadow] hover:border-emerald-300 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700 motion-reduce:transition-none sm:p-7"
        >
          <div className="mb-5 flex size-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
            <BriefcaseBusiness size={21} aria-hidden="true" />
          </div>
          <p className="text-xs font-semibold tracking-[0.16em] text-slate-500 uppercase">
            For employers
          </p>
          <h2 className="mt-2 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Payroll setup &amp; team onboarding
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
            Review onboarding tasks, payroll corrections, and how to handle
            employees who leave with an outstanding balance.
          </p>
          <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700">
            Browse articles
            <ArrowRight
              size={16}
              aria-hidden="true"
              className="transition-transform group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
            />
          </span>
        </Link>
      </section>

      <section className="mt-12" aria-labelledby="popular-help-heading">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h2
            id="popular-help-heading"
            className="font-serif text-2xl font-bold tracking-tight text-slate-900"
          >
            {query.trim() ? "Search results" : "Popular now"}
          </h2>
          <Link
            href="/help/contact"
            className="text-sm font-semibold text-emerald-700 underline-offset-4 hover:underline"
          >
            Contact support
          </Link>
        </div>

        <div className="space-y-3">
          {suggestions.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-sm leading-relaxed text-slate-600">
              No articles match that search. Try different words or contact our
              support team.
            </div>
          ) : (
            suggestions.map((article) => (
              <Link
                key={article.slug}
                href={`/help/${article.audience}/${article.slug}`}
                className="group block rounded-2xl border border-slate-200 bg-white p-5 transition-colors hover:border-emerald-300 hover:bg-emerald-50/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 motion-reduce:transition-none sm:p-6"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold tracking-[0.16em] text-slate-500 uppercase">
                      {article.audience}
                    </p>
                    <h3 className="mt-2 text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">
                      {article.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                      {article.description}
                    </p>
                  </div>
                  <ArrowRight
                    size={18}
                    aria-hidden="true"
                    className="shrink-0 text-emerald-700 transition-transform group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                  />
                </div>
              </Link>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
