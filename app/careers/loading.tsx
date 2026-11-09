
export default function CareersLoading() {
  return (
    <section className="overflow-hidden relative min-h-screen bg-white pt-16"><div className="relative z-10">
      <main className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <div className="max-w-3xl">
          <div className="h-7 w-28 animate-pulse rounded-full bg-green-100" />
          <div className="mt-7 h-16 w-full max-w-2xl animate-pulse rounded-2xl bg-slate-100" />
          <div className="mt-5 h-7 w-full max-w-xl animate-pulse rounded-full bg-slate-100" />
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-[18rem_1fr]">
          <div className="h-80 animate-pulse rounded-[2rem] bg-slate-100" />
          <div className="grid gap-5">
            <div className="h-36 animate-pulse rounded-[2rem] bg-slate-100" />
            <div className="h-36 animate-pulse rounded-[2rem] bg-slate-100" />
            <div className="h-36 animate-pulse rounded-[2rem] bg-slate-100" />
          </div>
        </div>
      </main>
      </div></section>
  );
}
