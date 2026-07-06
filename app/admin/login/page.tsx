"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, LogIn, Eye, EyeOff } from "lucide-react";
import Script from "next/script";

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
      // Get reCAPTCHA token
      const recaptchaToken = await new Promise<string>((resolve, reject) => {
        const windowWithRecaptcha = window as unknown as {
          grecaptcha: {
            ready: (cb: () => void) => void;
            execute: (
              siteKey: string,
              options: { action: string }
            ) => Promise<string>;
          };
        };
        if (typeof window === "undefined" || !windowWithRecaptcha.grecaptcha) {
          reject("reCAPTCHA not loaded");
          return;
        }
        windowWithRecaptcha.grecaptcha.ready(() => {
          windowWithRecaptcha.grecaptcha
            .execute(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!, {
              action: "admin_login",
            })
            .then(resolve)
            .catch(reject);
        });
      });

      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, honeypot, recaptchaToken }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid credentials");
        return;
      }

      // Redirect to campaigns
      window.location.href = "/admin/campaigns";
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <Script
        src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="rounded-2xl border border-slate-200/60 bg-white shadow-lg p-10">
          {/* Header */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <img src="/eaziwage/EW-LOGO.png" alt="EaziWage" className="h-7" />
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-500/10">
                Admin
              </span>
            </div>
            <h1 className="font-serif text-3xl font-bold text-slate-900 mb-2">
              Secure Access
            </h1>
            <p className="text-slate-500">
              Sign in with your admin credentials to manage email campaigns
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
              <label className="ml-1 text-xs font-black tracking-widest text-slate-400 uppercase">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
                className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4 text-base transition-all focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:outline-none"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="ml-1 text-xs font-black tracking-widest text-slate-400 uppercase">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4 pr-12 text-base transition-all focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
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
                  className="flex items-gap-2 rounded-2xl border border-red-100 bg-red-50 p-4 text-red-700"
                >
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <p className="text-sm font-medium">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-8 px-5 py-4 rounded-2xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* reCAPTCHA notice */}
          <p className="text-center text-xs text-slate-400 mt-4">
            This site is protected by reCAPTCHA and the Google{" "}
            <a href="https://policies.google.com/privacy" className="underline">
              Privacy Policy
            </a>{" "}
            and{" "}
            <a href="https://policies.google.com/terms" className="underline">
              Terms of Service
            </a>{" "}
            apply.
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-500 mt-4">
          Admin area · Restricted access only
        </p>
      </motion.div>
    </div>
  );
}
