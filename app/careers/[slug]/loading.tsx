import { GridSystem } from "@/components/grid";

export default function CareerDetailLoading() {
  return (
    <GridSystem variant="dots" opacity={0.03} className="min-h-[100dvh] bg-white pt-16">
      <main className="relative z-10 mx-auto max-w-5xl px-6 py-20 lg:px-8 lg:py-24">
        <div className="mb-10 h-10 w-36 animate-pulse rounded-full bg-slate-100" />
        <section className="rounded-[2rem] border border-slate-200/70 bg-white/75 p-1.5 shadow-2xl shadow-slate-900/5">
          <div className="rounded-[calc(2rem-0.375rem)] bg-white p-6 ring-1 ring-slate-900/5 sm:p-10 lg:p-12">
            <div className="h-7 w-36 animate-pulse rounded-full bg-green-50" />
            <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_12rem]">
              <div>
                <div className="h-14 w-3/4 animate-pulse rounded-2xl bg-slate-100" />
                <div className="mt-5 flex gap-3">
                  <div className="h-8 w-24 animate-pulse rounded-full bg-slate-100" />
                  <div className="h-8 w-32 animate-pulse rounded-full bg-slate-100" />
                </div>
              </div>
              <div className="h-14 animate-pulse rounded-full bg-slate-100" />
            </div>
            <div className="mt-10 space-y-3">
              <div className="h-5 w-full animate-pulse rounded bg-slate-100" />
              <div className="h-5 w-5/6 animate-pulse rounded bg-slate-100" />
            </div>
          </div>
        </section>
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_20rem]">
          <div className="space-y-8">
            <SkeletonPanel />
            <SkeletonPanel />
          </div>
          <SkeletonPanel />
        </div>
      </main>
    </GridSystem>
  );
}

function SkeletonPanel() {
  return (
    <div className="rounded-[2rem] border border-slate-200/70 bg-white/75 p-1.5 shadow-xl shadow-slate-900/5">
      <div className="rounded-[calc(2rem-0.375rem)] bg-white p-6 ring-1 ring-slate-900/5 sm:p-8">
        <div className="h-8 w-40 animate-pulse rounded-xl bg-slate-100" />
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="h-20 animate-pulse rounded-[1.25rem] bg-slate-100" />
          <div className="h-20 animate-pulse rounded-[1.25rem] bg-slate-100" />
        </div>
      </div>
    </div>
  );
}
