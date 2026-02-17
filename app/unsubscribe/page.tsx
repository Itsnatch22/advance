"use client";

import { useEffect, useState } from "react";

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
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error" | null>(null);
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
    setStatus("idle");
    setMounted(true);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    const combinedFeedback = [
      selectedReason,
      feedback,
    ]
      .filter(Boolean)
      .join(" — ");

    try {
      const res = await fetch("/api/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, product, feedback: combinedFeedback, token }),
      });

      const body = await res.json();
      if (!res.ok) throw new Error(body?.message || "Unknown error");

      setStatus("success");
      setMessage(body.message ?? "You have been unsubscribed.");
    } catch (err: any) {
      setStatus("error");
      setMessage(err?.message ?? "Unsubscribe failed. Please try again.");
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --ink: #1a1a2e;
          --ink-soft: #4a4a6a;
          --ink-muted: #8888aa;
          --surface: #fafaf8;
          --card: #ffffff;
          --border: #e8e8f0;
          --accent: #16a34a;
          --accent-light: #dcfce7;
          --accent-dark: #166534;
          --danger: #dc2626;
          --danger-light: #fef2f2;
          --radius: 16px;
          --radius-sm: 8px;
          --shadow: 0 1px 3px rgba(26,26,46,0.08), 0 8px 32px rgba(26,26,46,0.06);
          --shadow-focus: 0 0 0 3px rgba(22,163,74,0.18);
        }

        body {
          font-family: 'DM Sans', sans-serif;
          background: var(--surface);
          color: var(--ink);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          background-image: radial-gradient(ellipse 80% 50% at 50% -10%, rgba(22,163,74,0.07) 0%, transparent 70%);
        }

        .page-wrapper {
          width: 100%;
          max-width: 520px;
          opacity: 0;
          transform: translateY(18px);
          transition: opacity 0.5s ease, transform 0.5s ease;
        }
        .page-wrapper.mounted {
          opacity: 1;
          transform: translateY(0);
        }

        .card {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          box-shadow: var(--shadow);
          overflow: hidden;
        }

        /* Header */
        .card-header {
          padding: 24px 32px 20px;
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .logo-mark {
          width: 32px;
          height: 32px;
          background: var(--accent);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .logo-mark svg { width: 18px; height: 18px; fill: white; }
        .logo-text {
          font-family: 'DM Serif Display', serif;
          font-size: 20px;
          color: var(--ink);
          letter-spacing: -0.3px;
        }

        /* Body */
        .card-body { padding: 32px; }

        .heading {
          font-family: 'DM Serif Display', serif;
          font-size: 26px;
          color: var(--ink);
          line-height: 1.2;
          letter-spacing: -0.4px;
        }
        .subtext {
          margin-top: 8px;
          font-size: 14.5px;
          color: var(--ink-soft);
          line-height: 1.6;
        }
        .product-pill {
          display: inline-block;
          background: var(--accent-light);
          color: var(--accent-dark);
          border-radius: 20px;
          padding: 1px 10px;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.1px;
        }

        /* Form */
        form { margin-top: 28px; display: flex; flex-direction: column; gap: 20px; }

        .field { display: flex; flex-direction: column; gap: 6px; }
        label {
          font-size: 13px;
          font-weight: 600;
          color: var(--ink-soft);
          letter-spacing: 0.3px;
          text-transform: uppercase;
        }

        input[type="email"], select, textarea {
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          color: var(--ink);
          background: var(--surface);
          border: 1.5px solid var(--border);
          border-radius: var(--radius-sm);
          padding: 10px 14px;
          width: 100%;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          appearance: none;
        }
        input[type="email"]:focus, select:focus, textarea:focus {
          border-color: var(--accent);
          box-shadow: var(--shadow-focus);
          background: #fff;
        }
        textarea { resize: vertical; min-height: 90px; line-height: 1.5; }

        select {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%238888aa' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 14px center;
          padding-right: 36px;
        }

        /* Reason chips */
        .reason-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 2px;
        }
        .reason-chip {
          padding: 6px 14px;
          border-radius: 20px;
          border: 1.5px solid var(--border);
          font-size: 13px;
          font-weight: 500;
          color: var(--ink-soft);
          cursor: pointer;
          background: var(--surface);
          transition: all 0.15s ease;
          user-select: none;
        }
        .reason-chip:hover { border-color: var(--accent); color: var(--accent); }
        .reason-chip.selected {
          border-color: var(--accent);
          background: var(--accent-light);
          color: var(--accent-dark);
        }

        /* Actions */
        .actions {
          display: flex;
          align-items: center;
          gap: 16px;
          padding-top: 4px;
        }

        .btn-primary {
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 600;
          background: var(--ink);
          color: #fff;
          border: none;
          border-radius: var(--radius-sm);
          padding: 11px 22px;
          cursor: pointer;
          transition: background 0.2s, transform 0.1s;
          display: flex;
          align-items: center;
          gap: 8px;
          white-space: nowrap;
        }
        .btn-primary:hover:not(:disabled) { background: #2d2d4e; }
        .btn-primary:active:not(:disabled) { transform: scale(0.98); }
        .btn-primary:disabled { opacity: 0.55; cursor: not-allowed; }

        .spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .link-keep {
          font-size: 14px;
          color: var(--ink-muted);
          text-decoration: none;
          font-weight: 500;
          transition: color 0.15s;
        }
        .link-keep:hover { color: var(--accent); }

        /* Alerts */
        .alert {
          padding: 14px 16px;
          border-radius: var(--radius-sm);
          font-size: 14.5px;
          line-height: 1.5;
          display: flex;
          gap: 10px;
          align-items: flex-start;
        }
        .alert-error {
          background: var(--danger-light);
          border: 1px solid #fecaca;
          color: var(--danger);
        }
        .alert-icon { flex-shrink: 0; margin-top: 1px; }

        /* Success state */
        .success-state {
          text-align: center;
          padding: 12px 0 8px;
        }
        .success-icon {
          width: 56px; height: 56px;
          background: var(--accent-light);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
        }
        .success-icon svg { width: 28px; height: 28px; stroke: var(--accent); }
        .success-heading {
          font-family: 'DM Serif Display', serif;
          font-size: 22px;
          color: var(--ink);
        }
        .success-sub {
          margin-top: 8px;
          font-size: 14.5px;
          color: var(--ink-soft);
          line-height: 1.6;
        }
        .success-note {
          margin-top: 16px;
          font-size: 13px;
          color: var(--ink-muted);
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          padding: 10px 14px;
          line-height: 1.5;
        }

        /* Footer */
        .card-footer {
          padding: 16px 32px;
          border-top: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 13px;
          color: var(--ink-muted);
        }
        .card-footer a { color: var(--ink-muted); text-decoration: none; }
        .card-footer a:hover { color: var(--accent); text-decoration: underline; }
        .footer-links { display: flex; gap: 16px; }
      `}</style>

      <div className={`page-wrapper${mounted ? " mounted" : ""}`}>
        <div className="card">
          {/* Header */}
          <div className="card-header">
            <div className="logo-mark">
              <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/></svg>
            </div>
            <span className="logo-text">EaziWage</span>
          </div>

          {/* Body */}
          <div className="card-body">
            {status === "success" ? (
              <div className="success-state">
                <div className="success-icon">
                  <svg fill="none" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>
                </div>
                <h2 className="success-heading">You're unsubscribed</h2>
                <p className="success-sub">{message}</p>
                <div className="success-note">
                  📬 A confirmation email has been sent to <strong>{email}</strong>. Please allow a few days for all emails to stop.
                </div>
              </div>
            ) : (
              <>
                <h2 className="heading">We&apos;re sorry to see you go</h2>
                <p className="subtext">
                  You&apos;re unsubscribing from{" "}
                  <span className="product-pill">{PRODUCT_LABELS[product]}</span>
                </p>

                <form onSubmit={handleSubmit}>
                  <div className="field">
                    <label>Email address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                    />
                  </div>

                  <div className="field">
                    <label>Unsubscribe from</label>
                    <select
                      value={product}
                      onChange={(e) => setProduct(e.target.value as Product)}
                    >
                      <option value="newsletter">Newsletter</option>
                      <option value="partners">Partner Emails</option>
                      <option value="sales">Sales &amp; Leads</option>
                      <option value="all">All EaziWage Emails</option>
                    </select>
                  </div>

                  <div className="field">
                    <label>Why are you leaving?</label>
                    <div className="reason-grid">
                      {LEAVE_REASONS.map((r) => (
                        <span
                          key={r}
                          className={`reason-chip${selectedReason === r ? " selected" : ""}`}
                          onClick={() => setSelectedReason(selectedReason === r ? "" : r)}
                        >
                          {r}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="field">
                    <label>Additional feedback</label>
                    <textarea
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Anything else we should know? (optional)"
                    />
                  </div>

                  <input type="hidden" value={token} readOnly />

                  {status === "error" && (
                    <div className="alert alert-error">
                      <span className="alert-icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                      </span>
                      {message}
                    </div>
                  )}

                  <div className="actions">
                    <button
                      type="submit"
                      className="btn-primary"
                      disabled={status === "loading"}
                    >
                      {status === "loading" ? (
                        <>
                          <span className="spinner" />
                          Unsubscribing…
                        </>
                      ) : (
                        "Confirm unsubscribe"
                      )}
                    </button>
                    <a href="/" className="link-keep">
                      Keep me subscribed
                    </a>
                  </div>
                </form>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="card-footer">
            <span>© {new Date().getFullYear()} EaziWage</span>
            <div className="footer-links">
              <a href="https://eaziwage.com/data.pdf" target="_blank" rel="noopener noreferrer">Privacy</a>
              <a href="https://eaziwage.com/terms.pdf" target="_blank" rel="noopener noreferrer">Terms</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}