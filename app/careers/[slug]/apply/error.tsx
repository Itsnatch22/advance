"use client";

import Link from "next/link";
import { AlertCircle, RotateCcw } from "lucide-react";
import { GridSystem } from "@/components/grid";

export default function CareerApplyError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <GridSystem variant="dots" opacity={0.03} className="min-h-[100dvh] bg-white pt-16">
      <main className="relative z-10 mx-auto max-w-3xl px-6 py-20 lg:px-8 lg:py-24">
        <section className="rounded-[2rem] border border-red-200 bg-red-50 p-6 text-red-950">
          <div className="flex items-start gap-4">
            <AlertCircle className="mt-1 h-5 w-5 shrink-0" strokeWidth={1.8} />
            <div>
              <h1 className="font-serif text-3xl font-bold text-slate-950">Unable to load the application form</h1>
              <p className="mt-3 text-sm leading-relaxed text-red-800">
                {error.message || "The application form could not be loaded."}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={reset}
                  className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-green-600"
                >
                  <RotateCcw className="h-4 w-4" />
                  Retry
                </button>
                <Link
                  href="/careers"
                  className="inline-flex items-center rounded-full bg-white px-5 py-2.5 text-sm font-bold text-slate-800 ring-1 ring-slate-200 transition-colors hover:bg-green-50 hover:text-green-700"
                >
                  Back to careers
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </GridSystem>
  );
}
