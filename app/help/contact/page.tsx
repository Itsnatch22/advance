"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { submitHelpContact, type ContactActionState } from "@/app/help/contact/actions";

const initialState: ContactActionState = {
  success: false,
  message: "",
};

export default function HelpContactPage() {
  const searchParams = useSearchParams();
  const initialArticle = searchParams.get("article") ?? "";
  const initialCode = searchParams.get("code") ?? "";
  const initialCountry = searchParams.get("country") ?? "KE";

  const [state, formAction, pending] = useActionState(submitHelpContact, initialState);

  return (
    <main className="mx-auto max-w-3xl px-4 py-20 sm:px-6 md:py-24 lg:py-28">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm md:p-10">
        <p className="text-xs font-semibold tracking-[0.2em] text-emerald-700 uppercase">Support request</p>
        <h1 className="mt-3 font-serif text-4xl font-bold text-slate-900">Contact the EaziWage support team</h1>

        <form action={formAction} className="mt-8 space-y-5">
          <input type="hidden" name="article" value={initialArticle} />
          <input type="hidden" name="code" value={initialCode} />
          <input type="hidden" name="country" value={initialCountry} />

          <div className="grid gap-5 md:grid-cols-2">
            <label className="space-y-2 text-sm font-medium text-slate-700">
              <span>Name</span>
              <input name="name" defaultValue="" className="h-11 w-full rounded-xl border border-slate-200 px-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10" />
              {state.errors?.name ? <span className="text-xs text-red-600">{state.errors.name}</span> : null}
            </label>

            <label className="space-y-2 text-sm font-medium text-slate-700">
              <span>Email</span>
              <input type="email" name="email" defaultValue="" className="h-11 w-full rounded-xl border border-slate-200 px-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10" />
              {state.errors?.email ? <span className="text-xs text-red-600">{state.errors.email}</span> : null}
            </label>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="space-y-2 text-sm font-medium text-slate-700">
              <span>Audience</span>
              <select name="audience" defaultValue="employees" className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10">
                <option value="employees">Employee</option>
                <option value="employers">Employer</option>
              </select>
            </label>

            <label className="space-y-2 text-sm font-medium text-slate-700">
              <span>Country</span>
              <input name="countryDisplay" defaultValue={initialCountry} className="h-11 w-full rounded-xl border border-slate-200 px-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10" disabled />
            </label>
          </div>

          <label className="block space-y-2 text-sm font-medium text-slate-700">
            <span>What do you need help with?</span>
            <textarea
              name="message"
              rows={6}
              defaultValue={initialArticle ? `I need help with ${initialArticle.replace(/-/g, " ")}${initialCode ? ` (${initialCode})` : ""}.` : ""}
              className="w-full rounded-xl border border-slate-200 px-3 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
            />
            {state.errors?.message ? <span className="text-xs text-red-600">{state.errors.message}</span> : null}
          </label>

          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
            We do not ask for PINs, passwords, or full wallet credentials. Share only what is needed to review the issue.
          </div>

          {state.message ? (
            <div className={state.success ? "rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-900" : "rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700"}>
              {state.message}
            </div>
          ) : null}

          <button type="submit" disabled={pending} className="inline-flex h-12 items-center justify-center rounded-xl bg-slate-900 px-6 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60">
            {pending ? "Sending…" : "Send request"}
          </button>
        </form>
      </div>
    </main>
  );
}
