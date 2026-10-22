"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  CheckCircle2,
  Send,
  Trash2,
  Mail,
  Pencil,
  X,
  ChevronLeft,
  FlaskConical,
} from "lucide-react";
import Link from "next/link";
import type {
  CampaignRecipientList,
  CampaignRecipientListMember,
  CampaignTemplate,
  EmailCampaign,
  CampaignStats,
  EmailCampaignLog,
  CampaignStatus,
} from "@/types/campaigns";

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function StatusBadge({ status }: { status: CampaignStatus }) {
  const map: Record<CampaignStatus, string> = {
    draft: "bg-slate-50 text-slate-600 ring-slate-500/10",
    scheduled: "bg-blue-50 text-blue-700 ring-blue-500/10",
    sending: "bg-amber-50 text-amber-700 ring-amber-500/10",
    completed: "bg-emerald-50 text-emerald-700 ring-emerald-500/10",
    failed: "bg-red-50 text-red-700 ring-red-500/10",
  };
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold tracking-wider uppercase ring-1 ${map[status]}`}
    >
      {status}
    </span>
  );
}

function LogStatusChip({ status }: { status: string }) {
  const s = status.toLowerCase();
  const map: Record<string, string> = {
    sent: "bg-emerald-50 text-emerald-700 ring-emerald-500/10",
    delivered: "bg-emerald-50 text-emerald-700 ring-emerald-500/10",
    failed: "bg-red-50 text-red-700 ring-red-500/10",
    bounced: "bg-amber-50 text-amber-700 ring-amber-500/10",
    queued: "bg-slate-50 text-slate-600 ring-slate-500/10",
  };
  const cls = map[s] ?? "bg-slate-50 text-slate-600 ring-slate-500/10";
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${cls}`}
    >
      {status}
    </span>
  );
}

// ── Stat Card ─────────────────────────────────────────────────────────────────

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-[2rem] border border-slate-200/60 bg-white px-6 py-5 shadow-sm ring-1 ring-slate-900/5">
      <p className="font-serif text-2xl font-bold text-slate-900">{value}</p>
      <p className="mt-0.5 text-sm text-slate-500">{label}</p>
    </div>
  );
}

// ── Confirmation Modal ────────────────────────────────────────────────────────

function ConfirmModal({
  title,
  message,
  confirmLabel,
  confirmClass,
  onConfirm,
  onCancel,
  loading,
}: {
  title: string;
  message: string;
  confirmLabel: string;
  confirmClass: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onCancel}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-md rounded-[2rem] border border-slate-200/60 bg-white p-8 shadow-2xl ring-1 ring-slate-900/5"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-serif text-xl font-bold text-slate-900">{title}</h3>
        <p className="mt-3 text-sm text-slate-600">{message}</p>
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="rounded-xl border border-slate-200/60 px-5 py-2.5 text-sm font-semibold text-slate-600 ring-1 ring-slate-900/5 transition-all hover:border-emerald-200 hover:text-emerald-700 disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:scale-105 disabled:opacity-60 disabled:hover:scale-100 ${confirmClass}`}
          >
            {loading ? "Processing…" : confirmLabel}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Test Email Modal ──────────────────────────────────────────────────────────

function TestEmailModal({
  campaignId,
  onClose,
}: {
  campaignId: string;
  onClose: () => void;
}) {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; msg: string } | null>(
    null
  );

  async function send() {
    if (!email.trim()) return;
    setSending(true);
    setResult(null);
    try {
      const res = await fetch(`/api/admin/campaigns/${campaignId}/test`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setResult({ ok: true, msg: data.message ?? "Test email sent!" });
      } else {
        setResult({
          ok: false,
          msg: data.error ?? "Failed to send test email.",
        });
      }
    } catch {
      setResult({ ok: false, msg: "Network error. Please try again." });
    } finally {
      setSending(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-md rounded-[2rem] border border-slate-200/60 bg-white p-8 shadow-2xl ring-1 ring-slate-900/5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h3 className="font-serif text-xl font-bold text-slate-900">
            Send Test Email
          </h3>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200/60 text-slate-400 ring-1 ring-slate-900/5 transition-colors hover:text-slate-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <label className="mb-1.5 block text-sm font-semibold text-slate-700">
          Recipient email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="you@example.com"
          className="w-full rounded-xl border border-slate-200/60 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 ring-1 ring-slate-900/5 transition-colors placeholder:text-slate-400 focus:border-emerald-300 focus:ring-emerald-200 focus:outline-none"
        />
        {result && (
          <div
            className={`mt-3 flex items-center gap-2 rounded-xl border px-4 py-3 text-sm ${
              result.ok
                ? "border-emerald-100 bg-emerald-50 text-emerald-700"
                : "border-red-100 bg-red-50 text-red-700"
            }`}
          >
            {result.ok ? (
              <CheckCircle2 className="h-4 w-4 shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 shrink-0" />
            )}
            {result.msg}
          </div>
        )}
        <div className="mt-5 flex justify-end">
          <button
            onClick={send}
            disabled={sending || !email.trim()}
            className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-emerald-600 to-green-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all hover:scale-105 disabled:opacity-60 disabled:hover:scale-100"
          >
            <Mail className="h-4 w-4" />
            {sending ? "Sending…" : "Send Test"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function CampaignDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [campaign, setCampaign] = useState<EmailCampaign | null>(null);
  const [stats, setStats] = useState<CampaignStats | null>(null);
  const [logs, setLogs] = useState<EmailCampaignLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Edit state
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editSubject, setEditSubject] = useState("");
  const [editHtml, setEditHtml] = useState("");
  const [editPlain, setEditPlain] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Template & recipient lists for editing
  const [templates, setTemplates] = useState<CampaignTemplate[]>([]);
  const [lists, setLists] = useState<CampaignRecipientList[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [selectedList, setSelectedList] = useState<string | null>(null);
  const [importedEmails, setImportedEmails] = useState<string[]>([]);

  // Modals
  const [showTestModal, setShowTestModal] = useState(false);
  const [showSendConfirm, setShowSendConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [estimatedRecipients, setEstimatedRecipients] = useState<number | null>(
    null
  );
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [campaignRes, statsRes] = await Promise.all([
          fetch(`/api/admin/campaigns/${id}`),
          fetch(`/api/admin/campaigns/${id}/stats`),
        ]);

        if (campaignRes.status === 401 || campaignRes.status === 403) {
          setAccessDenied(true);
          return;
        }
        if (!campaignRes.ok) {
          const data = await campaignRes.json().catch(() => ({}));
          setFetchError(data?.error ?? "Failed to load campaign.");
          return;
        }

        const campaignResponse = await campaignRes.json();
        const loadedCampaign = campaignResponse.data?.campaign;
        if (!campaignResponse.success || !loadedCampaign) {
          setFetchError(campaignResponse.error ?? "Failed to load campaign.");
          return;
        }
        setCampaign(loadedCampaign);
        setEditTitle(loadedCampaign.title);
        setEditSubject(loadedCampaign.subject);
        setEditHtml(loadedCampaign.html_content);
        setEditPlain(loadedCampaign.plain_text_content ?? "");

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData.data?.stats ?? null);
          setLogs((statsData.data?.recent_logs ?? []).slice(0, 50));
        }
      } catch {
        setFetchError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  // load templates and recipient lists for editing UI
  useEffect(() => {
    (async () => {
      try {
        const [tRes, lRes] = await Promise.all([
          fetch("/api/admin/templates"),
          fetch("/api/admin/recipient-lists"),
        ]);
        if (tRes.ok) {
          const td = await tRes.json();
          setTemplates(td.data?.templates ?? []);
        }
        if (lRes.ok) {
          const ld = await lRes.json();
          setLists(ld.data?.lists ?? []);
        }
      } catch {}
    })();
  }, []);

  // apply template when selected
  useEffect(() => {
    if (!selectedTemplate) return;
    const t = templates.find((x) => x.id === selectedTemplate);
    if (t) {
      setEditHtml(t.html_content ?? "");
      setEditPlain(t.plain_text_content ?? "");
      setEditSubject((s) => s || t.name || s);
    }
  }, [selectedTemplate, templates]);

  // fetch members when a list is selected
  useEffect(() => {
    if (!selectedList) return;
    (async () => {
      try {
        const res = await fetch(`/api/admin/recipient-lists/${selectedList}`);
        if (!res.ok) return;
        const data = await res.json();
        const members = (data.data?.members ??
          []) as CampaignRecipientListMember[];
        setImportedEmails(members.map((member) => member.email));
      } catch {}
    })();
  }, [selectedList]);

  async function handleSave() {
    if (!campaign) return;
    setSaveError(null);
    if (!editTitle.trim()) {
      setSaveError("Title is required.");
      return;
    }
    if (!editSubject.trim()) {
      setSaveError("Subject is required.");
      return;
    }
    if (!editHtml.trim()) {
      setSaveError("HTML content is required.");
      return;
    }

    setSaving(true);
    try {
      const body: Record<string, unknown> = {
        title: editTitle.trim(),
        subject: editSubject.trim(),
        html_content: editHtml,
        plain_text_content: editPlain.trim() || null,
      };
      if (selectedTemplate) body.template_key = selectedTemplate;
      if (importedEmails.length > 0)
        body.audience_filter = { segment: "manual", emails: importedEmails };

      const res = await fetch(`/api/admin/campaigns/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setSaveError(data?.error ?? "Failed to save changes.");
        return;
      }
      const data = await res.json();
      const updatedCampaign = data.data?.campaign;
      if (!updatedCampaign) {
        setSaveError(
          "Changes were saved, but the server did not return the updated campaign."
        );
        return;
      }
      setCampaign(updatedCampaign);
      setSaveSuccess(true);
      setEditing(false);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch {
      setSaveError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleSend() {
    setActionLoading(true);
    setActionError(null);
    try {
      const res = await fetch(`/api/admin/campaigns/${id}/send`, {
        method: "POST",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setActionError(data?.error ?? "Failed to send campaign.");
        setShowSendConfirm(false);
        return;
      }
      setEstimatedRecipients(data.data?.estimated_recipients ?? null);
      setCampaign((current) =>
        current ? { ...current, status: "sending" } : current
      );
      setShowSendConfirm(false);
      // Refresh campaign data
      const refreshed = await fetch(`/api/admin/campaigns/${id}`);
      if (refreshed.ok) {
        const rd = await refreshed.json();
        setCampaign(rd.data?.campaign ?? null);
      }
    } catch {
      setActionError("Network error. Please try again.");
      setShowSendConfirm(false);
    } finally {
      setActionLoading(false);
    }
  }

  async function handleDelete() {
    setActionLoading(true);
    setActionError(null);
    try {
      const res = await fetch(`/api/admin/campaigns/${id}`, {
        method: "DELETE",
      });
      if (res.status === 204 || res.ok) {
        router.push("/admin/campaigns");
        return;
      }
      const data = await res.json().catch(() => ({}));
      setActionError(data?.error ?? "Failed to delete campaign.");
      setShowDeleteConfirm(false);
    } catch {
      setActionError("Network error. Please try again.");
      setShowDeleteConfirm(false);
    } finally {
      setActionLoading(false);
    }
  }

  // ── Access denied ──
  if (accessDenied) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h2 className="font-serif text-2xl font-bold text-slate-900">
            Access Restricted
          </h2>
          <p className="mt-2 text-slate-600">
            This area requires administrator privileges.
          </p>
        </div>
      </div>
    );
  }

  // ── Loading ──
  if (loading) {
    return (
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-32 w-full animate-pulse rounded-[2rem] bg-slate-100"
          />
        ))}
      </div>
    );
  }

  // ── Fetch error ──
  if (fetchError || !campaign) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {fetchError ?? "Campaign not found."}
        </div>
      </div>
    );
  }

  const canEdit =
    campaign.status === "draft" || campaign.status === "scheduled";
  const canSend =
    campaign.status === "draft" || campaign.status === "scheduled";
  const canDelete = campaign.status === "draft";

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-8"
      >
        {/* Back link */}
        <Link
          href="/admin/campaigns"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-emerald-700"
        >
          <ChevronLeft className="h-4 w-4" />
          All Campaigns
        </Link>

        {/* Action-level error */}
        <AnimatePresence>
          {actionError && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              <AlertCircle className="h-4 w-4 shrink-0" />
              {actionError}
            </motion.div>
          )}
          {saveSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
            >
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              Changes saved.
            </motion.div>
          )}
          {estimatedRecipients !== null && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
            >
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              Campaign queued for {estimatedRecipients} recipient
              {estimatedRecipients !== 1 ? "s" : ""}.
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Overview card ── */}
        <div className="rounded-[2rem] border border-slate-200/60 bg-white p-6 shadow-sm ring-1 ring-slate-900/5 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              {editing ? (
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-200/60 bg-slate-50 px-4 py-2.5 font-serif text-2xl font-bold text-slate-900 ring-1 ring-slate-900/5 transition-colors focus:border-emerald-300 focus:ring-emerald-200 focus:outline-none"
                />
              ) : (
                <h1 className="truncate font-serif text-2xl font-bold text-slate-900 sm:text-3xl">
                  {campaign.title}
                </h1>
              )}
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <StatusBadge status={campaign.status} />
                {editing ? (
                  <input
                    value={editSubject}
                    onChange={(e) => setEditSubject(e.target.value)}
                    placeholder="Subject line"
                    className="min-w-[200px] flex-1 rounded-xl border border-slate-200/60 bg-slate-50 px-3 py-1.5 text-sm text-slate-700 ring-1 ring-slate-900/5 transition-colors focus:border-emerald-300 focus:ring-emerald-200 focus:outline-none"
                  />
                ) : (
                  <span className="text-sm text-slate-600">
                    {campaign.subject}
                  </span>
                )}
              </div>
            </div>
            {canEdit && !editing && (
              <button
                onClick={() => setEditing(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200/60 px-4 py-2 text-sm font-semibold text-slate-600 ring-1 ring-slate-900/5 transition-all hover:border-emerald-200 hover:text-emerald-700"
              >
                <Pencil className="h-4 w-4" />
                Edit Campaign
              </button>
            )}
          </div>

          {/* Edit fields */}
          <AnimatePresence>
            {editing && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="mt-5 space-y-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                      Template
                    </label>
                    <select
                      value={selectedTemplate ?? ""}
                      onChange={(e) =>
                        setSelectedTemplate(e.target.value || null)
                      }
                      className="mt-2 w-full rounded-xl border border-slate-200/60 bg-slate-50 px-3 py-2 text-sm text-slate-700"
                    >
                      <option value="">— none —</option>
                      {/* templates are loaded above in the file's useEffect */}
                      {templates.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                    </select>

                    <div className="mt-4">
                      <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                        HTML Content
                      </label>
                      <textarea
                        value={editHtml}
                        onChange={(e) => setEditHtml(e.target.value)}
                        rows={10}
                        className="w-full resize-y rounded-xl border border-slate-200/60 bg-slate-50 px-4 py-3 font-mono text-xs text-slate-900 ring-1 ring-slate-900/5 transition-colors placeholder:text-slate-400 focus:border-emerald-300 focus:ring-emerald-200 focus:outline-none"
                      />
                    </div>

                    <div className="mt-4">
                      <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                        Plain Text
                        <span className="ml-1 font-normal text-slate-400">
                          (optional)
                        </span>
                      </label>
                      <textarea
                        value={editPlain}
                        onChange={(e) => setEditPlain(e.target.value)}
                        rows={4}
                        className="w-full resize-y rounded-xl border border-slate-200/60 bg-slate-50 px-4 py-3 font-mono text-xs text-slate-900 ring-1 ring-slate-900/5 transition-colors placeholder:text-slate-400 focus:border-emerald-300 focus:ring-emerald-200 focus:outline-none"
                      />
                    </div>

                    <div className="mt-4 rounded border p-3">
                      <h4 className="text-sm font-semibold">Recipients</h4>
                      <p className="mt-1 text-xs text-slate-500">
                        Select a recipient list or upload a CSV to update
                        campaign audience.
                      </p>
                      <div className="mt-3">
                        <label className="block text-xs font-medium text-slate-600">
                          Choose list
                        </label>
                        <select
                          value={selectedList ?? ""}
                          onChange={(e) =>
                            setSelectedList(e.target.value || null)
                          }
                          className="mt-2 w-full rounded border px-3 py-2 text-sm"
                        >
                          <option value="">— none —</option>
                          {lists.map((l) => (
                            <option key={l.id} value={l.id}>
                              {l.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="mt-3">
                        <label className="block text-xs font-medium text-slate-600">
                          Or upload CSV
                        </label>
                        <input
                          type="file"
                          accept=".csv"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (!f) return;
                            const reader = new FileReader();
                            reader.onload = () => {
                              const text = String(reader.result ?? "");
                              const emails = text
                                .split(/\r?\n/)
                                .map((l) => l.trim())
                                .filter(
                                  (l) =>
                                    l && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(l)
                                );
                              // set importedEmails via window to bridge placeholder state
                              setImportedEmails(
                                Array.from(
                                  new Set([...importedEmails, ...emails])
                                )
                              );
                            };
                            reader.readAsText(f);
                          }}
                          className="mt-2"
                        />
                        <p className="mt-2 text-xs text-slate-400">
                          Imported will overwrite current audience when saved.
                        </p>
                      </div>
                    </div>
                  </div>
                  {saveError && (
                    <div className="flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      {saveError}
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-emerald-600 to-green-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all hover:scale-105 disabled:opacity-60 disabled:hover:scale-100"
                    >
                      {saving ? "Saving…" : "Save Changes"}
                    </button>
                    <button
                      onClick={() => {
                        setEditing(false);
                        setSaveError(null);
                        setEditTitle(campaign.title);
                        setEditSubject(campaign.subject);
                        setEditHtml(campaign.html_content);
                        setEditPlain(campaign.plain_text_content ?? "");
                      }}
                      disabled={saving}
                      className="rounded-xl border border-slate-200/60 px-5 py-2.5 text-sm font-semibold text-slate-600 ring-1 ring-slate-900/5 transition-all hover:border-emerald-200 hover:text-emerald-700 disabled:opacity-60"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Metadata */}
          <div className="mt-6 grid grid-cols-2 gap-4 border-t border-slate-100 pt-5 text-sm sm:grid-cols-4">
            <div>
              <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                Created by
              </p>
              <p className="mt-1 truncate font-mono text-slate-700">
                {campaign.created_by.slice(0, 12)}…
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                Created
              </p>
              <p className="mt-1 text-slate-700">
                {formatDate(campaign.created_at)}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                Scheduled
              </p>
              <p className="mt-1 text-slate-700">
                {formatDate(campaign.scheduled_at)}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                Sent at
              </p>
              <p className="mt-1 text-slate-700">
                {formatDate(campaign.sent_at)}
              </p>
            </div>
          </div>
        </div>

        {/* ── Actions bar ── */}
        <div className="rounded-[2rem] border border-slate-200/60 bg-white px-6 py-5 shadow-sm ring-1 ring-slate-900/5">
          <h2 className="mb-4 font-serif text-lg font-semibold text-slate-900">
            Actions
          </h2>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowTestModal(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200/60 px-5 py-2.5 text-sm font-semibold text-slate-600 ring-1 ring-slate-900/5 transition-all hover:border-emerald-200 hover:text-emerald-700"
            >
              <FlaskConical className="h-4 w-4" />
              Send Test Email
            </button>

            {canSend && (
              <button
                onClick={() => setShowSendConfirm(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-emerald-600 to-green-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all hover:scale-105"
              >
                <Send className="h-4 w-4" />
                Send Campaign
              </button>
            )}

            {canDelete && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-5 py-2.5 text-sm font-semibold text-red-600 ring-1 ring-red-500/10 transition-all hover:bg-red-100"
              >
                <Trash2 className="h-4 w-4" />
                Delete Campaign
              </button>
            )}
          </div>
        </div>

        {/* ── Stats ── */}
        {stats && (
          <div>
            <h2 className="mb-4 font-serif text-xl font-semibold text-slate-900">
              Delivery Stats
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                label="Total Recipients"
                value={stats.total_recipients}
              />
              <StatCard label="Delivered" value={stats.sent_count} />
              <StatCard label="Failed" value={stats.failed_count} />
              <StatCard
                label="Delivery Rate"
                value={`${stats.delivery_rate.toFixed(1)}%`}
              />
            </div>
            <div className="mt-5 rounded-[2rem] border border-slate-200/60 bg-white px-6 py-5 shadow-sm ring-1 ring-slate-900/5">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-semibold text-slate-700">
                  Delivery Progress
                </span>
                <span className="text-slate-500 tabular-nums">
                  {stats.delivery_rate.toFixed(1)}%
                </span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(stats.delivery_rate, 100)}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full rounded-full bg-linear-to-r from-emerald-500 to-green-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* ── Logs ── */}
        {logs.length > 0 && (
          <div>
            <h2 className="mb-4 font-serif text-xl font-semibold text-slate-900">
              Recent Logs
              <span className="ml-2 text-base font-normal text-slate-400">
                ({logs.length} entries)
              </span>
            </h2>
            <div className="overflow-hidden rounded-[2rem] border border-slate-200/60 bg-white shadow-sm ring-1 ring-slate-900/5">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/60">
                      {["Email", "Status", "Sent At", "Error"].map((h) => (
                        <th
                          key={h}
                          className="px-4 py-3.5 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log) => (
                      <tr
                        key={log.id}
                        className="border-b border-slate-100 transition-colors last:border-0 hover:bg-slate-50/50"
                      >
                        <td className="max-w-[220px] px-4 py-3 font-medium text-slate-800">
                          <span className="block truncate">
                            {log.recipient_email}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <LogStatusChip status={log.delivery_status} />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-slate-500">
                          {formatDate(log.sent_at)}
                        </td>
                        <td className="max-w-[280px] px-4 py-3 text-red-500">
                          <span className="block truncate text-xs">
                            {log.error_message ?? "—"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* ── Modals ── */}
      <AnimatePresence>
        {showTestModal && (
          <TestEmailModal
            campaignId={id}
            onClose={() => setShowTestModal(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSendConfirm && (
          <ConfirmModal
            title="Send Campaign"
            message={`This will send to all active, confirmed subscribers${
              campaign.total_recipients != null
                ? ` (estimated ${campaign.total_recipients} recipients)`
                : ""
            }. This action cannot be undone.`}
            confirmLabel="Send Now"
            confirmClass="bg-linear-to-r from-emerald-600 to-green-600 shadow-emerald-500/25"
            onConfirm={handleSend}
            onCancel={() => setShowSendConfirm(false)}
            loading={actionLoading}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDeleteConfirm && (
          <ConfirmModal
            title="Delete Campaign"
            message="This will permanently delete the campaign. This action cannot be undone."
            confirmLabel="Delete"
            confirmClass="bg-red-600 shadow-red-500/25"
            onConfirm={handleDelete}
            onCancel={() => setShowDeleteConfirm(false)}
            loading={actionLoading}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
