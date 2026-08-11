"use client";

import { useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { GridSystem } from "@/components/grid";

export default function CareersError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Careers route error:", error);
  }, [error]);

  return (
    <GridSystem
      variant="dots"
      opacity={0.03}
      className="min-h-screen bg-white pt-16"
    >
      <main className="mx-auto flex min-h-[70dvh] max-w-3xl items-center px-6 py-24">
        <div className="rounded-[2rem] border border-red-200 bg-red-50 p-8 text-red-950 shadow-xl shadow-red-900/5">
          <div className="flex items-start gap-4">
            <AlertCircle className="mt-1 h-6 w-6 shrink-0" strokeWidth={1.8} />
            <div>
              <h1 className="text-2xl font-black tracking-tight">
                Careers could not load
              </h1>
              <p className="mt-3 leading-relaxed text-red-800">
                Please try again. The roles feed may be temporarily unavailable.
              </p>
              <button
                type="button"
                onClick={reset}
                className="mt-6 rounded-full bg-slate-900 px-5 py-3 text-sm font-bold text-white transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-green-600 active:scale-[0.98]"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      </main>
    </GridSystem>
  );
}
