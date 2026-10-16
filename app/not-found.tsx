import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[60dvh] items-center justify-center bg-linear-to-b from-green-50/70 via-white to-white px-6 py-32 text-center dark:from-emerald-950/30 dark:via-slate-950 dark:to-slate-950">
      <section aria-labelledby="not-found-title" className="mx-auto max-w-xl">
        <p className="font-mono text-sm font-semibold tracking-[0.2em] text-green-700 dark:text-emerald-400">
          ERROR 404
        </p>
        <h1
          id="not-found-title"
          className="mt-4 font-serif text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-white"
        >
          This page isn&apos;t here
        </h1>
        <p className="mx-auto mt-4 max-w-md text-base leading-7 text-slate-600 dark:text-slate-300">
          The address may be incorrect, or the page may have moved. Choose where
          you&apos;d like to go next.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-green-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700 active:scale-[0.98] dark:bg-emerald-600 dark:hover:bg-emerald-500"
          >
            Return home
          </Link>
          <Link
            href="/contact"
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-800 transition-colors hover:border-green-300 hover:bg-green-50 hover:text-green-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700 active:scale-[0.98] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-emerald-500/50 dark:hover:bg-slate-800"
          >
            Contact support
          </Link>
        </div>
      </section>
    </main>
  );
}
