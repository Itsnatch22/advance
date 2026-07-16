"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Wallet, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { BorderBeam } from "@/components/ui/border-beam";

type Product = "newsletter" | "partners" | "sales" | "all";

const PRODUCT_LABELS: Record<Product, string> = {
  newsletter: "Newsletter",
  partners: "Partner Emails",
  sales: "Sales & Leads",
  all: "All EaziWage Emails",
};

const LEAVE_REASONS = [
  "Too many emails",
  "Content isn't relevant",
  "I never signed up",
  "I found what I needed",
  "Other",
];

export default function UnsubscribePage() {
  const [email, setEmail] = useState("");
  const [product, setProduct] = useState<Product>("newsletter");
  const [token, setToken] = useState("");
  const [feedback, setFeedback] = useState("");
  const [selectedReason, setSelectedReason] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const e = params.get("email");
    const p = params.get("product");
    const t = params.get("token");

    if (e) setEmail(e);
    if (p && ["newsletter", "partners", "sales", "all"].includes(p))
      setProduct(p as Product);
    if (t) setToken(t);
    setMounted(true);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    const combinedFeedback = [selectedReason, feedback].filter(Boolean).join(" — ");

    try {
      const res = await fetch("/api/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, product, token, feedback: combinedFeedback }),
      });

      const body = await res.json();
      if (!res.ok) throw new Error(body?.message || "Unknown error");

      setStatus("success");
      setMessage(body.message ?? "You have been unsubscribed.");
    } catch (err) {
      const error = err as Error;
      setStatus("error");
      setMessage(error?.message ?? "Unsubscribe failed. Please try again.");
    }
  }

  return (
    <div
      className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12"
      style={{
        backgroundImage:
          "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(22,163,74,0.07) 0%, transparent 70%)",
      }}
    >
      <div
        className={`w-full max-w-lg transition-all duration-500 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <div className="relative bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <BorderBeam colorFrom="#00B37E" colorTo="#006F42" size={100} duration={8} />
          {/* Header */}
          <div className="px-8 py-5 border-b border-slate-200 flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <Wallet className="h-4 w-4 text-white" strokeWidth={2} aria-hidden="true" />
            </div>
            <span className="font-serif text-xl text-slate-900 tracking-tight">EaziWage</span>
          </div>

          {/* Body */}
          <div className="px-8 py-8">
            {status === "success" ? (
              <div className="text-center py-4">
                <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-7 w-7 text-emerald-600" strokeWidth={2} />
                </div>
                <h2 className="font-serif text-2xl text-slate-900">You&apos;re unsubscribed</h2>
                <p className="mt-2 text-sm text-slate-500 leading-relaxed">{message}</p>
                <div className="mt-4 text-sm text-slate-500 bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 leading-relaxed">
                  📬 A confirmation email has been sent to{" "}
                  <strong className="text-slate-700">{email}</strong>. Please allow a few days for
                  all emails to stop.
                </div>
              </div>
            ) : (
              <>
                <h2 className="font-serif text-2xl text-slate-900 tracking-tight">
                  We&apos;re sorry to see you go
                </h2>
                <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                  You&apos;re unsubscribing from{" "}
                  <span className="inline-block bg-emerald-50 text-emerald-700 rounded-full px-3 py-0.5 text-xs font-semibold">
                    {PRODUCT_LABELS[product]}
                  </span>
                </p>

                <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Email address
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Unsubscribe from
                    </label>
                    <select
                      value={product}
                      onChange={(e) => setProduct(e.target.value as Product)}
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 appearance-none"
                    >
                      <option value="newsletter">Newsletter</option>
                      <option value="partners">Partner Emails</option>
                      <option value="sales">Sales &amp; Leads</option>
                      <option value="all">All EaziWage Emails</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Why are you leaving?
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {LEAVE_REASONS.map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setSelectedReason(selectedReason === r ? "" : r)}
                          className={`px-3.5 py-1.5 rounded-full border text-xs font-medium transition-all ${
                            selectedReason === r
                              ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                              : "border-slate-200 bg-slate-50 text-slate-500 hover:border-emerald-400 hover:text-emerald-600"
                          }`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Additional feedback
                    </label>
                    <textarea
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Anything else we should know? (optional)"
                      rows={3}
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 resize-y"
                    />
                  </div>

                  {status === "error" && (
                    <div className="flex items-start gap-2.5 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                      <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" strokeWidth={2} />
                      {message}
                    </div>
                  )}

                  <div className="flex items-center gap-5 pt-1">
                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {status === "loading" ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Unsubscribing…
                        </>
                      ) : (
                        "Confirm unsubscribe"
                      )}
                    </button>
                    <Link
                      href="/"
                      className="text-sm text-slate-400 font-medium hover:text-emerald-600 transition-colors"
                    >
                      Keep me subscribed
                    </Link>
                  </div>
                </form>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="px-8 py-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-400">
            <span>© {new Date().getFullYear()} EaziWage</span>
            <div className="flex gap-4">
              <a
                href="https://eaziwage.com/data.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-600 transition-colors"
              >
                Privacy
              </a>
              <a
                href="https://eaziwage.com/terms.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-600 transition-colors"
              >
                Terms
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
