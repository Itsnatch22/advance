import Image from "next/image";

export default function AdminAuthShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-[100dvh] items-center justify-center bg-slate-50 px-4 py-10 sm:px-6">
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center justify-center gap-3">
          <Image
            src="/logo.png"
            alt=""
            width={36}
            height={36}
            className="h-9 w-9"
          />
          <span className="font-serif text-2xl font-bold tracking-tight text-slate-900">
            EaziWage
          </span>
          <span className="rounded-md border border-emerald-800/15 bg-emerald-800/5 px-2 py-1 text-xs font-semibold text-emerald-800">
            Admin
          </span>
        </div>

        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm shadow-slate-900/5">
          <div className="h-1 bg-emerald-700" />
          <div className="p-6 sm:p-8">{children}</div>
        </section>

        <p className="mt-5 text-center text-xs text-slate-500">
          Restricted to authorized administrators
        </p>
      </div>
    </main>
  );
}
