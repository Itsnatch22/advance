"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  X,
  Eye,
  AlertCircle,
  CheckCircle2,
  Info,
} from "lucide-react";
import type {
  CampaignRecipientList,
  CampaignRecipientListMember,
  CampaignTemplate,
} from "@/types/campaigns";

// ... PreviewModal unchanged (copying original implementation) ...

function PreviewModal({
  html,
  onClose,
}: {
  html: string;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
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
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-3xl overflow-hidden rounded-4xl border border-slate-200/60 bg-white shadow-2xl ring-1 ring-slate-900/5"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <h3 className="font-serif text-lg font-semibold text-slate-900">
              Email Preview
            </h3>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200/60 text-slate-400 ring-1 ring-slate-900/5 transition-colors hover:text-slate-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="h-150 w-full">
            <iframe
              srcDoc={
                html ||
                "<p style='font-family:sans-serif;padding:2rem;color:#94a3b8'>No HTML content yet.</p>"
              }
              className="h-full w-full border-0"
              sandbox="allow-same-origin"
              title="Email preview"
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function NewCampaignPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [htmlContent, setHtmlContent] = useState("");
  const [plainText, setPlainText] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [showPlainText, setShowPlainText] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Templates & recipient lists
  const [templates, setTemplates] = useState<CampaignTemplate[]>([]);
  const [lists, setLists] = useState<CampaignRecipientList[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [selectedList, setSelectedList] = useState<string | null>(null);
  const [importedEmails, setImportedEmails] = useState<string[]>([]);
  const [csvFeedback, setCsvFeedback] = useState<{
    totalLines: number;
    invalidCount: number;
    duplicateCount: number;
    addedCount: number;
  } | null>(null);

  useEffect(() => {
    async function load() {
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
      } catch {
        // ignore
      }
    }
    load();
  }, []);

  useEffect(() => {
    // when template selected, populate content
    if (!selectedTemplate) return;
    const t = templates.find((x) => x.id === selectedTemplate);
    if (t) {
      setHtmlContent(t.html_content ?? "");
      setPlainText(t.plain_text_content ?? "");
      setSubject((s) => s || t.name || s);
    }
  }, [selectedTemplate, templates]);

  useEffect(() => {
    // when list selected, fetch members and set importedEmails
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

  function parseCsv(text: string) {
    const lines = text
      .split(/\r?\n/)
      // CSV of one email per line, but tolerate "email,name" style rows too
      .map((l) => l.trim().split(",")[0].trim())
      .filter((l) => l.length > 0);
    const valid = lines.filter((l) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(l));
    return {
      totalLines: lines.length,
      valid,
      invalidCount: lines.length - valid.length,
    };
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result ?? "");
      const { totalLines, valid, invalidCount } = parseCsv(text);
      const existing = new Set(importedEmails);
      const deduped = Array.from(new Set(valid));
      const duplicateCount =
        deduped.filter((e) => existing.has(e)).length +
        (valid.length - deduped.length);
      const merged = Array.from(new Set([...importedEmails, ...deduped]));

      setImportedEmails(merged);
      setCsvFeedback({
        totalLines,
        invalidCount,
        duplicateCount,
        addedCount: merged.length - importedEmails.length,
      });
    };
    reader.readAsText(f);
    e.target.value = "";
  }

  function removeImportedEmail(email: string) {
    setImportedEmails((prev) => prev.filter((e) => e !== email));
  }

  async function handleSave() {
    setError(null);
    if (!title.trim()) {
      setError("Campaign title is required.");
      return;
    }
    if (!subject.trim()) {
      setError("Email subject is required.");
      return;
    }
    if (!htmlContent.trim()) {
      setError("HTML content is required.");
      return;
    }
    if (scheduledAt && new Date(scheduledAt).getTime() <= Date.now()) {
      setError("Choose a future time to schedule this campaign.");
      return;
    }

    setSaving(true);
    try {
      const body: Record<string, unknown> = {
        title: title.trim(),
        subject: subject.trim(),
        html_content: htmlContent,
        plain_text_content: plainText.trim() || null,
      };
      if (scheduledAt) {
        body.scheduled_at = new Date(scheduledAt).toISOString();
      }

      if (importedEmails.length > 0) {
        body.audience_filter = { segment: "manual", emails: importedEmails };
      }

      const res = await fetch("/api/admin/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data?.error ?? "Failed to create campaign.");
        return;
      }

      const data = await res.json();
      const campaignId = data.data?.campaign?.id;
      if (!campaignId) {
        setError("Campaign was saved, but the server did not return its ID.");
        return;
      }
      setSuccess(true);
      setTimeout(() => router.push(`/admin/campaigns/${campaignId}`), 600);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold text-slate-900 sm:text-4xl">
            New Campaign
          </h1>
          <p className="mt-1 text-slate-500">
            Compose and save a new email campaign.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-5">
          <div className="space-y-6 lg:col-span-3">
            <section className="space-y-5 rounded-4xl border border-slate-200/60 bg-white p-6 shadow-sm ring-1 ring-slate-900/5">
              <div>
                <label
                  htmlFor="campaign-title"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Campaign title
                </label>
                <input
                  id="campaign-title"
                  type="text"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  maxLength={300}
                  required
                  placeholder="e.g. November product update"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 transition outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                />
              </div>

              <div>
                <label
                  htmlFor="campaign-subject"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Email subject
                </label>
                <input
                  id="campaign-subject"
                  type="text"
                  value={subject}
                  onChange={(event) => setSubject(event.target.value)}
                  maxLength={300}
                  required
                  placeholder="What recipients will see in their inbox"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 transition outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                />
              </div>

              <div>
                <label
                  htmlFor="campaign-html"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Email HTML
                </label>
                <textarea
                  id="campaign-html"
                  value={htmlContent}
                  onChange={(event) => setHtmlContent(event.target.value)}
                  required
                  rows={16}
                  maxLength={500_000}
                  spellCheck={false}
                  placeholder="Paste or write the email HTML here. You can also choose a template."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-mono text-xs leading-6 text-slate-900 transition outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                />
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => setShowPlainText((visible) => !visible)}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-800 hover:text-emerald-950"
                  aria-expanded={showPlainText}
                >
                  {showPlainText ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                  Plain-text version (optional)
                </button>
                {showPlainText && (
                  <textarea
                    value={plainText}
                    onChange={(event) => setPlainText(event.target.value)}
                    rows={8}
                    maxLength={500_000}
                    placeholder="Add an accessible plain-text version of the email."
                    className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-mono text-xs leading-6 text-slate-900 transition outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                  />
                )}
              </div>

              <div>
                <label
                  htmlFor="campaign-schedule"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Schedule for later (optional)
                </label>
                <input
                  id="campaign-schedule"
                  type="datetime-local"
                  value={scheduledAt}
                  min={new Date(
                    Date.now() +
                      60_000 -
                      new Date().getTimezoneOffset() * 60_000
                  )
                    .toISOString()
                    .slice(0, 16)}
                  onChange={(event) => setScheduledAt(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 transition outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                />
              </div>
            </section>

            {/* Error / success */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {error}
                </motion.div>
              )}
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
                >
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  Campaign saved! Redirecting…
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center gap-3">
              <button
                onClick={handleSave}
                disabled={saving || success}
                className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-emerald-600 to-green-600 px-6 py-3 font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all hover:scale-105 disabled:opacity-60 disabled:hover:scale-100"
              >
                {saving
                  ? "Saving…"
                  : scheduledAt
                    ? "Schedule Campaign"
                    : "Save as Draft"}
              </button>

              {/* Quick recipient import summary */}
              <div className="text-sm text-slate-500">
                Imported recipients:{" "}
                <strong className="text-slate-700">
                  {importedEmails.length}
                </strong>
              </div>
            </div>
          </div>

          <div className="space-y-5 lg:col-span-2">
            {/* Preview */}
            <div className="rounded-4xl border border-slate-200/60 bg-white p-6 shadow-sm ring-1 ring-slate-900/5">
              <h2 className="mb-3 font-serif text-lg font-semibold text-slate-900">
                Preview
              </h2>
              <p className="mb-4 text-sm text-slate-500">
                See how your email will look in a browser before sending.
              </p>
              <button
                onClick={() => setShowPreview(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200/60 px-5 py-2.5 text-sm font-semibold text-slate-600 ring-1 ring-slate-900/5 transition-all hover:border-emerald-200 hover:text-emerald-700"
              >
                <Eye className="h-4 w-4" />
                Open Preview
              </button>
            </div>

            {/* Template picker */}
            <div className="rounded-4xl border border-slate-200/60 bg-white p-6 shadow-sm ring-1 ring-slate-900/5">
              <h2 className="mb-3 font-serif text-lg font-semibold text-slate-900">
                Template
              </h2>
              <p className="mb-2 text-sm text-slate-500">
                Select a saved template to prefill content.
              </p>
              <select
                value={selectedTemplate ?? ""}
                onChange={(e) => setSelectedTemplate(e.target.value || null)}
                className="w-full rounded-xl border border-slate-200/60 bg-slate-50 px-3 py-2 text-sm text-slate-700"
              >
                <option value="">— choose a template —</option>
                {templates.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Recipient lists / import */}
            <div className="rounded-4xl border border-slate-200/60 bg-white p-6 shadow-sm ring-1 ring-slate-900/5">
              <h2 className="mb-3 font-serif text-lg font-semibold text-slate-900">
                Recipients
              </h2>
              <p className="mb-2 text-sm text-slate-500">
                Choose an existing recipient list or upload a CSV of emails.
              </p>
              <label className="mb-2 block text-xs font-semibold text-slate-600">
                Recipient list
              </label>
              <select
                value={selectedList ?? ""}
                onChange={(e) => setSelectedList(e.target.value || null)}
                className="mb-3 w-full rounded-xl border border-slate-200/60 bg-slate-50 px-3 py-2 text-sm text-slate-700"
              >
                <option value="">— choose a list —</option>
                {lists.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))}
              </select>
              <label className="block text-xs font-semibold text-slate-600">
                or Upload CSV
              </label>
              <input
                type="file"
                accept=".csv,text/csv"
                onChange={handleFile}
                className="mt-2 text-sm"
              />
              <p className="mt-3 text-xs text-slate-400">
                Files should contain one email address per line. Emails are
                deduplicated.
              </p>

              {csvFeedback && (
                <div className="mt-3 rounded-xl border border-slate-200/60 bg-slate-50 px-3 py-2 text-xs text-slate-600">
                  Parsed {csvFeedback.totalLines} line
                  {csvFeedback.totalLines === 1 ? "" : "s"}: added{" "}
                  <strong className="text-emerald-700">
                    {csvFeedback.addedCount}
                  </strong>{" "}
                  new, {csvFeedback.duplicateCount} duplicate
                  {csvFeedback.duplicateCount === 1 ? "" : "s"} skipped,{" "}
                  {csvFeedback.invalidCount} invalid row
                  {csvFeedback.invalidCount === 1 ? "" : "s"} skipped.
                </div>
              )}

              {importedEmails.length > 0 && (
                <div className="mt-3 max-h-40 space-y-1 overflow-y-auto rounded-xl border border-slate-200/60 p-2">
                  {importedEmails.map((email) => (
                    <div
                      key={email}
                      className="flex items-center justify-between gap-2 rounded-lg px-2 py-1 text-xs text-slate-600 hover:bg-slate-50"
                    >
                      <span className="truncate">{email}</span>
                      <button
                        type="button"
                        onClick={() => removeImportedEmail(email)}
                        className="shrink-0 text-slate-400 hover:text-red-600"
                        aria-label={`Remove ${email}`}
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Template variables */}
            <div className="rounded-4xl border border-slate-200/60 bg-white p-6 shadow-sm ring-1 ring-slate-900/5">
              <div className="mb-3 flex items-center gap-2">
                <Info className="h-4 w-4 text-emerald-600" />
                <h2 className="font-serif text-lg font-semibold text-slate-900">
                  Template Variables
                </h2>
              </div>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <code className="mt-0.5 shrink-0 rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-emerald-700">
                    {"{{full_name}}"}
                  </code>
                  <span>
                    Subscriber&apos;s full name. Falls back to
                    &ldquo;there&rdquo; if not set.
                  </span>
                </li>
              </ul>
              <p className="mt-4 text-xs text-slate-400">
                Campaigns send only to active, confirmed subscribers.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {showPreview && (
        <PreviewModal
          html={htmlContent}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
}
