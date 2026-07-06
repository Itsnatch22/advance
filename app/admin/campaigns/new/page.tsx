"use client";

import { useState } from "react";
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

// ── Preview modal ─────────────────────────────────────────────────────────────

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
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-3xl rounded-[2rem] border border-slate-200/60 bg-white ring-1 ring-slate-900/5 shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <h3 className="font-serif text-lg font-semibold text-slate-900">Email Preview</h3>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200/60 text-slate-400 ring-1 ring-slate-900/5 transition-colors hover:text-slate-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="h-[600px] w-full">
            <iframe
              srcDoc={html || "<p style='font-family:sans-serif;padding:2rem;color:#94a3b8'>No HTML content yet.</p>"}
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

// ── Page ─────────────────────────────────────────────────────────────────────

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

  async function handleSave() {
    setError(null);
    if (!title.trim()) { setError("Campaign title is required."); return; }
    if (!subject.trim()) { setError("Email subject is required."); return; }
    if (!htmlContent.trim()) { setError("HTML content is required."); return; }

    setSaving(true);
    try {
      const body: Record<string, unknown> = {
        title: title.trim(),
        subject: subject.trim(),
        html_content: htmlContent,
        plain_text_content: plainText.trim() || null,
        status: "draft",
      };
      if (scheduledAt) {
        body.scheduled_at = new Date(scheduledAt).toISOString();
        body.status = "scheduled";
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
      setSuccess(true);
      setTimeout(() => router.push(`/admin/campaigns/${data.campaign.id}`), 600);
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
          <p className="mt-1 text-slate-500">Compose and save a new email campaign.</p>
        </div>

        {/* Two-panel grid */}
        <div className="grid gap-8 lg:grid-cols-5">
          {/* Left — editor (3/5) */}
          <div className="lg:col-span-3 space-y-6">
            <div className="rounded-[2rem] border border-slate-200/60 bg-white ring-1 ring-slate-900/5 shadow-sm p-6 space-y-5">
              {/* Title */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Campaign Title
                  <span className="ml-1 font-normal text-slate-400">(internal reference)</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. July Newsletter"
                  className="w-full rounded-xl border border-slate-200/60 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 ring-1 ring-slate-900/5 placeholder:text-slate-400 focus:border-emerald-300 focus:outline-none focus:ring-emerald-200 transition-colors"
                />
              </div>

              {/* Subject */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Email Subject
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Your July update from EaziWage"
                  className="w-full rounded-xl border border-slate-200/60 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 ring-1 ring-slate-900/5 placeholder:text-slate-400 focus:border-emerald-300 focus:outline-none focus:ring-emerald-200 transition-colors"
                />
              </div>

              {/* HTML content */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Email HTML Content
                </label>
                <p className="mb-2 text-xs text-slate-500">
                  Use{" "}
                  <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-emerald-700">
                    {"{{full_name}}"}
                  </code>{" "}
                  for personalization. Subscribers without a profile receive{" "}
                  <em>there</em>.
                </p>
                <textarea
                  value={htmlContent}
                  onChange={(e) => setHtmlContent(e.target.value)}
                  placeholder="<h1>Hello {{full_name}}</h1>..."
                  rows={14}
                  className="w-full rounded-xl border border-slate-200/60 bg-slate-50 px-4 py-3 font-mono text-xs text-slate-900 ring-1 ring-slate-900/5 placeholder:text-slate-400 focus:border-emerald-300 focus:outline-none focus:ring-emerald-200 transition-colors resize-y min-h-64"
                />
              </div>

              {/* Plain text toggle */}
              <div>
                <button
                  type="button"
                  onClick={() => setShowPlainText((v) => !v)}
                  className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 transition-colors hover:text-emerald-700"
                >
                  {showPlainText ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                  {showPlainText ? "Hide" : "Add"} plain text version
                </button>
                <AnimatePresence>
                  {showPlainText && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <textarea
                        value={plainText}
                        onChange={(e) => setPlainText(e.target.value)}
                        placeholder="Plain text fallback content..."
                        rows={6}
                        className="mt-3 w-full rounded-xl border border-slate-200/60 bg-slate-50 px-4 py-3 font-mono text-xs text-slate-900 ring-1 ring-slate-900/5 placeholder:text-slate-400 focus:border-emerald-300 focus:outline-none focus:ring-emerald-200 transition-colors resize-y"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

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

            {/* Save button */}
            <button
              onClick={handleSave}
              disabled={saving || success}
              className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-emerald-600 to-green-600 px-6 py-3 font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all hover:scale-105 disabled:opacity-60 disabled:hover:scale-100"
            >
              {saving ? "Saving…" : "Save as Draft"}
            </button>
          </div>

          {/* Right — sidebar (2/5) */}
          <div className="lg:col-span-2 space-y-5">
            {/* Preview */}
            <div className="rounded-[2rem] border border-slate-200/60 bg-white ring-1 ring-slate-900/5 shadow-sm p-6">
              <h2 className="mb-3 font-serif text-lg font-semibold text-slate-900">Preview</h2>
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

            {/* Schedule */}
            <div className="rounded-[2rem] border border-slate-200/60 bg-white ring-1 ring-slate-900/5 shadow-sm p-6">
              <h2 className="mb-3 font-serif text-lg font-semibold text-slate-900">Schedule</h2>
              <p className="mb-3 text-sm text-slate-500">
                Leave blank to save as draft. Set a date to schedule automatically.
              </p>
              <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                Send at
              </label>
              <input
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                className="w-full rounded-xl border border-slate-200/60 bg-slate-50 px-3 py-2 text-sm text-slate-900 ring-1 ring-slate-900/5 focus:border-emerald-300 focus:outline-none focus:ring-emerald-200 transition-colors"
              />
            </div>

            {/* Template variables */}
            <div className="rounded-[2rem] border border-slate-200/60 bg-white ring-1 ring-slate-900/5 shadow-sm p-6">
              <div className="mb-3 flex items-center gap-2">
                <Info className="h-4 w-4 text-emerald-600" />
                <h2 className="font-serif text-lg font-semibold text-slate-900">
                  Template Variables
                </h2>
              </div>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <code className="mt-0.5 rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-emerald-700 shrink-0">
                    {"{{full_name}}"}
                  </code>
                  <span>Subscriber&apos;s full name. Falls back to &ldquo;there&rdquo; if not set.</span>
                </li>
              </ul>
              <p className="mt-4 text-xs text-slate-400">
                Campaigns send only to active, confirmed subscribers.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Preview modal */}
      {showPreview && (
        <PreviewModal html={htmlContent} onClose={() => setShowPreview(false)} />
      )}
    </div>
  );
}
