"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, LogIn, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import FloatingOrb from "@/components/shared/FloatingOrb";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { BorderBeam } from "@/components/ui/border-beam";

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
        console.error("Supabase Auth Error:", authError, "Auth Data:", authData);
        setError(authError?.message || "Invalid credentials");
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
    <div className="relative min-h-screen overflow-hidden bg-white">
      {/* Background orbs — matches site style */}
      <div className="pointer-events-none fixed inset-0">
        <FloatingOrb color="bg-green-100" delay={0} className="-top-24 -right-24" />
        <FloatingOrb color="bg-emerald-100" delay={2} className="-bottom-24 -left-24" />
        <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px]" />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <div className="relative overflow-hidden rounded-3xl border border-slate-200/60 bg-white/40 p-10 shadow-2xl shadow-green-500/5 backdrop-blur-xl">
            <BorderBeam colorFrom="#00B37E" colorTo="#006F42" size={120} duration={8} />
            {/* Header */}
            <div className="mb-10">
              <div className="mb-6 flex items-center gap-3">
                <Image src="/logo.png" alt="EaziWage" width={28} height={28} className="h-7 w-7" />
                <span className="rounded-full border border-green-500/10 bg-green-500/5 px-2.5 py-0.5 text-xs font-black tracking-widest text-green-600 uppercase">
                  Admin
                </span>
              </div>
              <h1 className="mb-2 font-serif text-3xl font-bold tracking-tight text-slate-900">
                Secure Access
              </h1>
              <p className="text-slate-500">
                Sign in with your admin credentials to manage email campaigns.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Honeypot */}
              <input
                type="text"
                className="sr-only"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
              />

              {/* Email */}
              <div className="space-y-2">
                <label className="ml-1 text-xs font-black tracking-[0.2em] text-green-600/60 uppercase">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@eaziwage.com"
                  required
                  className="w-full rounded-2xl border border-slate-200/60 bg-white/40 px-5 py-4 text-base text-slate-900 placeholder-slate-400 backdrop-blur-sm transition-all focus:border-green-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-green-500/10"
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="ml-1 text-xs font-black tracking-[0.2em] text-green-600/60 uppercase">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full rounded-2xl border border-slate-200/60 bg-white/40 px-5 py-4 pr-12 text-base text-slate-900 placeholder-slate-400 backdrop-blur-sm transition-all focus:border-green-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-green-500/10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-start gap-2 rounded-2xl border border-red-100 bg-red-50/60 p-4 text-red-700"
                  >
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                    <p className="text-sm font-medium">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-green-600 px-5 py-4 font-bold text-white transition-all hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <LogIn className="h-4 w-4" />
                {loading ? "Signing in…" : "Sign In"}
              </button>
            </form>

            {/* reCAPTCHA notice */}
            <p className="mt-6 text-center text-xs text-slate-400">
              Protected by reCAPTCHA —{" "}
              <a href="https://policies.google.com/privacy" className="underline hover:text-slate-600">
                Privacy
              </a>{" "}
              &amp;{" "}
              <a href="https://policies.google.com/terms" className="underline hover:text-slate-600">
                Terms
              </a>
            </p>
          </div>

          <p className="mt-4 text-center text-xs text-slate-400">
            Admin area · Restricted access only
          </p>
        </motion.div>
      </div>
    </div>
  );
}
