import Calculator from "./Calc";
import { FloatingOrb } from "@/components/shared/FloatingOrb";

export default function CalculatorPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-50 text-slate-900">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <FloatingOrb
          color="bg-green-100"
          delay={0}
          className="top-24 left-[8%]"
        />
        <FloatingOrb
          color="bg-emerald-100"
          delay={2}
          className="right-[6%] bottom-24"
        />
      </div>
      <section className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <header className="mb-8 max-w-3xl sm:mb-10">
          <h1 className="font-serif text-4xl leading-[1.1] font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Estimate your wage access
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-600">
            Enter your pay details to see an estimate of the wages you may be
            able to access before payday.
          </p>
        </header>

        <Calculator />

        <p className="mt-8 max-w-4xl text-sm leading-relaxed text-slate-600">
          This calculator provides an estimate for informational purposes.
          Actual amounts depend on payroll verification, tax residency and
          EaziWage eligibility requirements. A calculated amount is not a
          verified withdrawable balance.
        </p>
      </section>
    </main>
  );
}
