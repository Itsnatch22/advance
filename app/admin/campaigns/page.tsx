"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Eye, Pencil, MailCheck, Send, AlertCircle } from "lucide-react";
import Link from "next/link";
import type { EmailCampaign, CampaignStatus } from "@/types/campaigns";

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function StatusBadge({ status }: { status: CampaignStatus }) {
  const map: Record<CampaignStatus, string> = {
    draft:
      "bg-slate-50 text-slate-600 ring-slate-500/10",
    scheduled:
      "bg-blue-50 text-blue-700 ring-blue-500/10",
    sending:
      "bg-amber-50 text-amber-700 ring-amber-500/10",
    completed:
      "bg-emerald-50 text-emerald-700 ring-emerald-500/10",
    failed:
      "bg-red-50 text-red-700 ring-red-500/10",
  };
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ring-1 ${map[status]}`}
    >
      {status}
    </span>
  );
}

// ── Skeleton ─────────────────────────────────────────────────────────────────

function SkeletonRow() {
  return (
    <tr className="border-b border-slate-100">
      {[...Array(6)].map((_, i) => (
        <td key={i} className="px-4 py-4">
          <div className="h-4 w-full animate-pulse rounded-lg bg-slate-100" />
        </td>
      ))}
    </tr>
  );
}

// ── Stat Card ─────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-4xl border border-slate-200/60 bg-white px-6 py-5 ring-1 ring-slate-900/5 shadow-sm flex items-center gap-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold font-serif text-slate-900">{value}</p>
        <p className="text-sm text-slate-500">{label}</p>
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/campaigns");
        if (res.status === 401 || res.status === 403) {
          setAccessDenied(true);
          return;
        }
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          setError(body?.error ?? "Failed to load campaigns.");
          return;
        }
        const data = await res.json();
        setCampaigns(data.campaigns ?? []);
      } catch {
        setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // ── Access denied ──
  if (accessDenied) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h2 className="font-serif text-2xl font-bold text-slate-900">Access Restricted</h2>
          <p className="mt-2 text-slate-600">This area requires administrator privileges.</p>
        </div>
      </div>
    );
  }

  // ── Stats ──
  const total = campaigns.length;
  const active = campaigns.filter((c) => c.status === "sending").length;
  const completed = campaigns.filter((c) => c.status === "completed").length;

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.06 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-10 flex items-center justify-between"
      >
        <div>
          <h1 className="font-serif text-3xl font-bold text-slate-900 sm:text-4xl">
            Email Campaigns
          </h1>
          <p className="mt-1 text-slate-500">Manage and send campaigns to your subscribers.</p>
        </div>
        <Link
          href="/admin/campaigns/new"
          className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-emerald-600 to-green-600 px-6 py-3 font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all hover:scale-105"
        >
          <Plus className="h-4 w-4" />
          New Campaign
        </Link>
      </motion.div>

      {/* Error */}
      {error && (
        <div className="mb-6 flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Stat cards */}
      {!loading && !error && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-8 grid gap-4 sm:grid-cols-3"
        >
          <motion.div variants={itemVariants}>
            <StatCard label="Total Campaigns" value={total} icon={<MailCheck className="h-5 w-5" />} />
          </motion.div>
          <motion.div variants={itemVariants}>
            <StatCard label="Currently Sending" value={active} icon={<Send className="h-5 w-5" />} />
          </motion.div>
          <motion.div variants={itemVariants}>
            <StatCard label="Completed" value={completed} icon={<MailCheck className="h-5 w-5" />} />
          </motion.div>
        </motion.div>
      )}

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="rounded-4xl border border-slate-200/60 bg-white ring-1 ring-slate-900/5 shadow-sm overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60">
                {["Title", "Subject", "Status", "Recipients", "Created", "Actions"].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <>
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                </>
              ) : campaigns.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-16 text-center">
                    <p className="font-serif text-lg font-semibold text-slate-700">
                      No campaigns yet.
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Create your first campaign to get started.
                    </p>
                    <Link
                      href="/admin/campaigns/new"
                      className="mt-4 inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-emerald-600 to-green-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all hover:scale-105"
                    >
                      <Plus className="h-4 w-4" />
                      Create Campaign
                    </Link>
                  </td>
                </tr>
              ) : (
                <motion.tbody
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  // Note: motion.tbody is valid but we need to cast
                  // The rows will stagger in
                  className="contents"
                >
                  {campaigns.map((c) => (
                    <motion.tr
                      key={c.id}
                      variants={itemVariants}
                      className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-4 py-4 font-medium text-slate-900 max-w-45">
                        <span className="block truncate">{c.title}</span>
                      </td>
                      <td className="px-4 py-4 text-slate-600 max-w-50">
                        <span className="block truncate">{c.subject}</span>
                      </td>
                      <td className="px-4 py-4">
                        <StatusBadge status={c.status} />
                      </td>
                      <td className="px-4 py-4 text-slate-600">
                        <span className="tabular-nums">
                          {c.total_recipients ?? "—"} total
                          {c.sent_count > 0 && (
                            <span className="ml-1 text-emerald-600">/ {c.sent_count} sent</span>
                          )}
                          {c.failed_count > 0 && (
                            <span className="ml-1 text-red-500">/ {c.failed_count} failed</span>
                          )}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-slate-500 whitespace-nowrap">
                        {formatDate(c.created_at)}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/admin/campaigns/${c.id}`}
                            className="inline-flex items-center gap-1 rounded-xl border border-slate-200/60 px-3 py-1.5 text-xs font-semibold text-slate-600 ring-1 ring-slate-900/5 transition-all hover:border-emerald-200 hover:text-emerald-700"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            View
                          </Link>
                          {(c.status === "draft" || c.status === "scheduled") && (
                            <Link
                              href={`/admin/campaigns/${c.id}`}
                              className="inline-flex items-center gap-1 rounded-xl border border-slate-200/60 px-3 py-1.5 text-xs font-semibold text-slate-600 ring-1 ring-slate-900/5 transition-all hover:border-emerald-200 hover:text-emerald-700"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                              Edit
                            </Link>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </motion.tbody>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
