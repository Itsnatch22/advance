import { GridSystem } from "@/components/grid";

export default function CareerApplyLoading() {
  return (
    <GridSystem variant="dots" opacity={0.03} className="min-h-[100dvh] bg-white pt-16">
      <main className="relative z-10 mx-auto max-w-3xl px-6 py-20 lg:px-8 lg:py-24">
        <div className="mb-10 h-10 w-32 animate-pulse rounded-full bg-slate-100" />
        <section className="rounded-[2rem] border border-slate-200/70 bg-white/75 p-1.5 shadow-2xl shadow-slate-900/5">
          <div className="rounded-[calc(2rem-0.375rem)] bg-white p-6 ring-1 ring-slate-900/5 sm:p-10 lg:p-12">
            <div className="mb-8">
              <div className="h-12 w-3/4 animate-pulse rounded-2xl bg-slate-100" />
              <div className="mt-4 h-5 w-5/6 animate-pulse rounded bg-slate-100" />
            </div>
            <div className="space-y-6">
              <div className="h-20 animate-pulse rounded-lg bg-slate-100" />
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="h-20 animate-pulse rounded-lg bg-slate-100" />
                <div className="h-20 animate-pulse rounded-lg bg-slate-100" />
              </div>
              <div className="h-32 animate-pulse rounded-lg bg-slate-100" />
              <div className="h-36 animate-pulse rounded-lg bg-slate-100" />
              <div className="h-16 animate-pulse rounded-lg bg-slate-100" />
              <div className="h-12 animate-pulse rounded-full bg-slate-100" />
            </div>
          </div>
        </section>
      </main>
    </GridSystem>
  );
}
