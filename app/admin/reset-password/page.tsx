"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { AlertCircle, ArrowLeft, CheckCircle2, Mail } from "lucide-react";
import AdminAuthShell from "@/components/admin/AdminAuthShell";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type RecoveryMode = "loading" | "request" | "update" | "sent" | "complete";

export default function AdminResetPasswordPage() {
  const [mode, setMode] = useState<RecoveryMode>("loading");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const currentUrl = new URL(window.location.href);
    const isRecoveryRedirect =
      currentUrl.searchParams.get("flow") === "recovery" ||
      currentUrl.searchParams.has("code") ||
      new URLSearchParams(currentUrl.hash.slice(1)).get("type") === "recovery";

    setMode(isRecoveryRedirect ? "update" : "request");

    if (isRecoveryRedirect) {
      getSupabaseBrowserClient();
    }
  }, []);

  const requestReset = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const supabase = getSupabaseBrowserClient();
      const redirectTo = new URL(
        "/admin/reset-password?flow=recovery",
        window.location.origin
      ).toString();
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        { redirectTo }
      );

      if (resetError) {
        setError(
          "Unable to request a reset right now. Please try again later."
        );
        return;
      }

      setMode("sent");
    } catch {
      setError("Unable to request a reset right now. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("The passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const { error: updateError } =
        await getSupabaseBrowserClient().auth.updateUser({
          password,
        });

      if (updateError) {
        setError("This reset link is invalid or expired. Request a new one.");
        return;
      }

      setMode("complete");
    } catch {
      setError(
        "Unable to update the password. Request a new reset link and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminAuthShell>
      <div>
        <Link
          href="/admin/login"
          className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to sign in
        </Link>

        {mode === "loading" ? (
          <p className="text-sm text-slate-600" role="status">
            Checking password reset link…
          </p>
        ) : null}

        {mode === "request" ? (
          <>
            <h1 className="font-serif text-2xl font-bold text-slate-900">
              Reset your password
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Enter the email address for your admin account. If an account
              exists, we&apos;ll send instructions to reset its password.
            </p>

            <form onSubmit={requestReset} className="mt-8 space-y-5">
              <div className="space-y-2">
                <label
                  htmlFor="reset-email"
                  className="text-sm font-medium text-slate-700"
                >
                  Email address
                </label>
                <input
                  id="reset-email"
                  type="email"
                  autoComplete="email"
                  required
                  maxLength={254}
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 transition outline-none placeholder:text-slate-500 focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/10"
                />
              </div>

              {error ? <FormError message={error} /> : null}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-emerald-800 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-900 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Sending..." : "Send reset link"}
              </button>
            </form>
          </>
        ) : null}

        {mode === "sent" ? (
          <div role="status" aria-live="polite">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-800">
              <Mail className="h-5 w-5" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-slate-900">
              Check your email
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              If an account exists for that email address, password reset
              instructions will arrive shortly.
            </p>
          </div>
        ) : null}

        {mode === "update" ? (
          <>
            <h1 className="font-serif text-2xl font-bold text-slate-900">
              Choose a new password
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Use at least 12 characters for your new password.
            </p>

            <form onSubmit={updatePassword} className="mt-8 space-y-5">
              <div className="space-y-2">
                <label
                  htmlFor="new-password"
                  className="text-sm font-medium text-slate-700"
                >
                  New password
                </label>
                <input
                  id="new-password"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={12}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 transition outline-none focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/10"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="confirm-password"
                  className="text-sm font-medium text-slate-700"
                >
                  Confirm new password
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={12}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 transition outline-none focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/10"
                />
              </div>

              {error ? <FormError message={error} /> : null}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-emerald-800 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-900 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Updating..." : "Update password"}
              </button>
            </form>
          </>
        ) : null}

        {mode === "complete" ? (
          <div role="status" aria-live="polite">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-800">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-slate-900">
              Password updated
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Your password has been changed. Sign in with your new password.
            </p>
            <Link
              href="/admin/login"
              className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-emerald-800 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-900 active:scale-[0.99]"
            >
              Go to sign in
            </Link>
          </div>
        ) : null}
      </div>
    </AdminAuthShell>
  );
}

function FormError({ message }: { message: string }) {
  return (
    <p
      role="alert"
      className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
    >
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
      {message}
    </p>
  );
}
