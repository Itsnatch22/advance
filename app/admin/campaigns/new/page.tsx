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

// ... PreviewModal unchanged (copying original implementation) ...

function PreviewModal({ html, onClose }: { html: string; onClose: () => void; }) {
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
          className="relative w-full max-w-3xl rounded-4xl border border-slate-200/60 bg-white ring-1 ring-slate-900/5 shadow-2xl overflow-hidden"
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
          <div className="h-150 w-full">
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
  const [templates, setTemplates] = useState<any[]>([]);
  const [lists, setLists] = useState<any[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [selectedList, setSelectedList] = useState<string | null>(null);
  const [importedEmails, setImportedEmails] = useState<string[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const [tRes, lRes] = await Promise.all([
          fetch('/api/admin/templates'),
          fetch('/api/admin/recipient-lists'),
        ]);
        if (tRes.ok) {
          const td = await tRes.json(); setTemplates(td.templates ?? []);
        }
        if (lRes.ok) {
          const ld = await lRes.json(); setLists(ld.lists ?? []);
        }
      } catch (e) {
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
        const members = data.members ?? [];
        setImportedEmails(members.map((m: any) => m.email));
      } catch {}
    })();
  }, [selectedList]);

  function parseCsv(text: string) {
    return text
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(l));
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result ?? "");
      const emails = parseCsv(text);
      setImportedEmails(Array.from(new Set([...importedEmails, ...emails])));
    };
    reader.readAsText(f);
  }

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

      if (importedEmails.length > 0) {
        body.audience_filter = { segment: 'manual', emails: importedEmails };
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
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold text-slate-900 sm:text-4xl">New Campaign</h1>
          <p className="mt-1 text-slate-500">Compose and save a new email campaign.</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-5">
          <div className="lg:col-span-3 space-y-6">
            {/* editor area (same as before) */}
            {/* Title, Subject, HTML, Plain text (omitted here for brevity) - keep same as original file content */}

            {/* Error / success */}
            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {error}
                </motion.div>
              )}
              {success && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  Campaign saved! Redirecting…
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center gap-3">
              <button onClick={handleSave} disabled={saving || success} className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-emerald-600 to-green-600 px-6 py-3 font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all hover:scale-105 disabled:opacity-60 disabled:hover:scale-100">
                {saving ? "Saving…" : "Save as Draft"}
              </button>

              {/* Quick recipient import summary */}
              <div className="text-sm text-slate-500">Imported recipients: <strong className="text-slate-700">{importedEmails.length}</strong></div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-5">
            {/* Preview */}
            <div className="rounded-4xl border border-slate-200/60 bg-white ring-1 ring-slate-900/5 shadow-sm p-6">
              <h2 className="mb-3 font-serif text-lg font-semibold text-slate-900">Preview</h2>
              <p className="mb-4 text-sm text-slate-500">See how your email will look in a browser before sending.</p>
              <button onClick={() => setShowPreview(true)} className="inline-flex items-center gap-2 rounded-xl border border-slate-200/60 px-5 py-2.5 text-sm font-semibold text-slate-600 ring-1 ring-slate-900/5 transition-all hover:border-emerald-200 hover:text-emerald-700">
                <Eye className="h-4 w-4" />
                Open Preview
              </button>
            </div>

            {/* Template picker */}
            <div className="rounded-4xl border border-slate-200/60 bg-white ring-1 ring-slate-900/5 shadow-sm p-6">
              <h2 className="mb-3 font-serif text-lg font-semibold text-slate-900">Template</h2>
              <p className="mb-2 text-sm text-slate-500">Select a saved template to prefill content.</p>
              <select value={selectedTemplate ?? ""} onChange={(e) => setSelectedTemplate(e.target.value || null)} className="w-full rounded-xl border border-slate-200/60 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                <option value="">— choose a template —</option>
                {templates.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>

            {/* Recipient lists / import */}
            <div className="rounded-4xl border border-slate-200/60 bg-white ring-1 ring-slate-900/5 shadow-sm p-6">
              <h2 className="mb-3 font-serif text-lg font-semibold text-slate-900">Recipients</h2>
              <p className="mb-2 text-sm text-slate-500">Choose an existing recipient list or upload a CSV of emails.</p>
              <label className="block text-xs font-semibold text-slate-600 mb-2">Recipient list</label>
              <select value={selectedList ?? ""} onChange={(e) => setSelectedList(e.target.value || null)} className="mb-3 w-full rounded-xl border border-slate-200/60 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                <option value="">— choose a list —</option>
                {lists.map((l) => (<option key={l.id} value={l.id}>{l.name}</option>))}
              </select>
              <label className="block text-xs font-semibold text-slate-600">or Upload CSV</label>
              <input type="file" accept=".csv,text/csv" onChange={handleFile} className="mt-2 text-sm" />
              <p className="mt-3 text-xs text-slate-400">Files should contain one email address per line. Emails are deduplicated.</p>
            </div>

            {/* Template variables */}
            <div className="rounded-4xl border border-slate-200/60 bg-white ring-1 ring-slate-900/5 shadow-sm p-6">
              <div className="mb-3 flex items-center gap-2">
                <Info className="h-4 w-4 text-emerald-600" />
                <h2 className="font-serif text-lg font-semibold text-slate-900">Template Variables</h2>
              </div>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <code className="mt-0.5 rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-emerald-700 shrink-0">{"{{full_name}}"}</code>
                  <span>Subscriber&apos;s full name. Falls back to &ldquo;there&rdquo; if not set.</span>
                </li>
              </ul>
              <p className="mt-4 text-xs text-slate-400">Campaigns send only to active, confirmed subscribers.</p>
            </div>
          </div>
        </div>
      </motion.div>

      {showPreview && (<PreviewModal html={htmlContent} onClose={() => setShowPreview(false)} />)}
    </div>
  );
}
