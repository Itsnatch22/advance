"use client";

import { useState } from "react";
import { AlertCircle, Eye, EyeOff, LogIn } from "lucide-react";
import Link from "next/link";
import AdminAuthShell from "@/components/admin/AdminAuthShell";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // reCAPTCHA is a supplementary bot-mitigation on top of rate-limiting
      // and real Supabase Auth credentials -- it should never be a hard
      // single point of failure for getting into the admin panel. If the
      // widget fails to load/execute for any reason (blocked script,
      // misconfigured site key, Google outage), fall through with no token
      // and let the server-side rate limit + honeypot carry the load.
      let recaptchaToken: string | null = null;
      try {
        const recaptchaPromise = new Promise<string>((resolve, reject) => {
          let attempts = 0;
          const maxAttempts = 10;

          const tryExecute = () => {
            attempts++;
            const windowWithRecaptcha = window as unknown as {
              grecaptcha?: {
                ready: (cb: () => void) => void;
                execute: (
                  siteKey: string,
                  options: { action: string }
                ) => Promise<string>;
              };
            };

            if (!windowWithRecaptcha.grecaptcha) {
              if (attempts < maxAttempts) {
                setTimeout(tryExecute, 100);
                return;
              }
              reject(new Error("reCAPTCHA not loaded after multiple attempts"));
              return;
            }

            const grecaptcha = windowWithRecaptcha.grecaptcha;
            grecaptcha.ready(() => {
              grecaptcha
                .execute(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!, {
                  action: "admin_login",
                })
                .then(resolve)
                .catch(reject);
            });
          };

          tryExecute();
        });

        // grecaptcha.ready()'s callback is not guaranteed to fire (e.g. a
        // half-initialized widget after a bad site key) -- a hard timeout
        // guarantees this never blocks the login form indefinitely.
        const timeoutPromise = new Promise<string>((_, reject) =>
          setTimeout(() => reject(new Error("reCAPTCHA timed out")), 4000)
        );

        recaptchaToken = await Promise.race([recaptchaPromise, timeoutPromise]);
      } catch (recaptchaErr) {
        console.warn("reCAPTCHA unavailable, continuing without a token:", recaptchaErr);
      }

      const precheck = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, honeypot, recaptchaToken }),
      });

      const precheckData = await precheck.json();

      if (!precheck.ok) {
        setError(precheckData.error || "Unable to sign in right now");
        return;
      }

      const supabase = getSupabaseBrowserClient();
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError || !authData.user) {
        console.error("signInWithPassword failed:", authError?.status, authError?.code, authError?.message);
        setError(
          authError?.code === "invalid_credentials"
            ? "Invalid email or password."
            : "Unable to sign in right now. Please try again."
        );
        return;
      }

      const meRes = await fetch("/api/admin/me");
      const me = await meRes.json();

      if (!meRes.ok || !me.data?.isAdmin) {
        console.error("Admin verification failed:", me);
        await supabase.auth.signOut();
        setError(me?.error || "This account is not authorized for admin access");
        return;
      }

      window.location.href = "/admin/campaigns";
    } catch (err) {
      console.error("Login error:", err);
      setError(err instanceof Error ? err.message : "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminAuthShell>
      <div className="mb-7">
        <h1 className="font-serif text-3xl font-bold tracking-tight text-slate-900">
          Admin sign in
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Sign in with your administrator account to continue.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          type="text"
          name="company"
          aria-hidden="true"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(event) => setHoneypot(event.target.value)}
          className="sr-only"
        />

        <div className="space-y-2">
          <label
            htmlFor="admin-email"
            className="text-sm font-medium text-slate-800"
          >
            Email address
          </label>
          <input
            id="admin-email"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-500 focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/10"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="admin-password"
            className="text-sm font-medium text-slate-800"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="admin-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-500 focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              className="absolute inset-y-0 right-0 flex items-center px-4 text-slate-500 hover:text-slate-800 focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-emerald-700"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Eye className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {error ? (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <p>{error}</p>
          </div>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-800 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-900 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <LogIn className="h-4 w-4" aria-hidden="true" />
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <div className="mt-5 flex items-center justify-between gap-4">
        <Link
          href="/admin/reset-password"
          className="text-sm font-medium text-emerald-800 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700"
        >
          Forgot password?
        </Link>
        <p className="text-right text-xs leading-5 text-slate-500">
          Protected by reCAPTCHA.{" "}
          <a
            href="https://policies.google.com/privacy"
            className="underline underline-offset-2 hover:text-slate-800"
          >
            Privacy
          </a>{" "}
          and{" "}
          <a
            href="https://policies.google.com/terms"
            className="underline underline-offset-2 hover:text-slate-800"
          >
            Terms
          </a>
        </p>
      </div>
    </AdminAuthShell>
  );
}
