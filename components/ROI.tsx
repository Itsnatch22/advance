"use client";

import React, { useEffect, useMemo, useState, useRef, MouseEvent } from "react";
import { CheckCircle2, RefreshCcw, TrendingUp, Calculator, Sparkles, ArrowRight } from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";

/* ---------- FX Config ---------- */
const FX_CACHE_KEY = "eazi_fx_v1";
const FX_CACHE_TTL = 1000 * 60 * 60; // 1 hour

const FALLBACK_RATES: Record<string, number> = {
  KES: 1,
  UGX: 36,
  TZS: 24,
  RWF: 8.2,
  BIF: 8.2,
  SOS: 575,
};

const CURRENCIES = {
  KE: { code: "KES", locale: "en-KE" },
  UG: { code: "UGX", locale: "en-UG" },
  TZ: { code: "TZS", locale: "en-TZ" },
  RW: { code: "RWF", locale: "rw-RW" },
  BI: { code: "BIF", locale: "fr-BI" },
  SO: { code: "SOS", locale: "sw-SO" },
} as const;

type CountryKey = keyof typeof CURRENCIES;

/* ---------- Helpers ---------- */
function formatCurrency(amountKES: number, country: CountryKey, rates: Record<string, number> | null) {
  const currencyCode = CURRENCIES[country].code;
  const locale = CURRENCIES[country].locale;
  const rate = rates?.[currencyCode] ?? FALLBACK_RATES[currencyCode] ?? 1;
  const converted = Math.round(amountKES * rate);
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currencyCode,
      maximumFractionDigits: 0,
    }).format(converted);
  } catch {
    return `${currencyCode} ${converted.toLocaleString()}`;
  }
}

async function fetchFxWithRetries(endpoint = "/api/fx", attempts = 2, delay = 700) {
  let lastErr: any = null;
  for (let i = 0; i <= attempts; i++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8_000);
      const res = await fetch(endpoint, { signal: controller.signal });
      clearTimeout(timeout);
      if (!res.ok) throw new Error("Bad FX response");
      const json = await res.json();
      return json.rates ?? null;
    } catch (err) {
      lastErr = err;
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  throw lastErr;
}

function saveFxToCache(rates: Record<string, number>) {
  try {
    const payload = { ts: Date.now(), rates };
    localStorage.setItem(FX_CACHE_KEY, JSON.stringify(payload));
  } catch (e) {}
}

function readFxFromCache(): { ts: number; rates: Record<string, number> } | null {
  try {
    const raw = localStorage.getItem(FX_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.ts || !parsed?.rates) return null;
    return parsed;
  } catch { return null; }
}

/* ---------- UI subcomponents ---------- */

const LabeledNumber = ({ label, value, onChange, min, max, step = 1 }: any) => (
  <label className="block group">
    <div className="mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-green-600 transition-colors">{label}</div>
    <input
      type="number"
      value={value}
      min={min}
      max={max}
      step={step}
      onChange={(e) => onChange(Number(e.target.value || 0))}
      className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-900 focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-500/10 transition-all outline-none shadow-sm"
    />
  </label>
);

const LabeledPercent = ({ label, value, onChange }: any) => (
  <label className="block group">
    <div className="mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-green-600 transition-colors">{label}</div>
    <div className="flex items-center gap-4">
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-green-600"
      />
      <span className="min-w-[3rem] text-right font-mono text-sm font-black text-slate-900">
        {Math.round(value * 100)}%
      </span>
    </div>
  </label>
);

const MetricCard = ({ title, value, accent = false }: any) => (
  <motion.div
    layout
    className={`relative overflow-hidden rounded-[2rem] border p-6 transition-all duration-500 ${
      accent 
        ? "border-green-500/20 bg-green-500/5 shadow-lg shadow-green-500/5 ring-1 ring-green-500/20" 
        : "border-slate-100 bg-white shadow-sm"
    }`}
  >
    <p className={`text-[10px] font-black uppercase tracking-widest ${accent ? "text-green-600" : "text-slate-400"}`}>{title}</p>
    <AnimatePresence mode="wait">
      <motion.p
        key={value}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="mt-2 text-2xl font-black tracking-tight text-slate-900"
      >
        {value}
      </motion.p>
    </AnimatePresence>
    {accent && <div className="absolute top-0 right-0 h-16 w-16 -translate-y-1/2 translate-x-1/2 rounded-full bg-green-500/10 blur-2xl" />}
  </motion.div>
);

const TiltROICard = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [5, -5]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-5, 5]), { stiffness: 150, damping: 20 });

  function handleMouseMove(event: MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - rect.left) / rect.width - 0.5);
    y.set((event.clientY - rect.top) / rect.height - 0.5);
    mouseX.set(event.clientX - rect.left);
    mouseY.set(event.clientY - rect.top);
  }

  return (
    <motion.div style={{ perspective: 1000 }} className="h-full">
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={() => { x.set(0); y.set(0); }}
        style={{ rotateX, rotateY }}
        className={`group relative h-full overflow-hidden rounded-[3rem] border border-slate-200/60 bg-white/40 p-8 md:p-12 backdrop-blur-2xl transition-shadow duration-500 hover:shadow-2xl hover:shadow-green-500/10 ${className}`}
      >
        <motion.div
          style={{
            background: useTransform(
              [mouseX, mouseY],
              ([mx, my]) => `radial-gradient(400px circle at ${mx}px ${my}px, rgba(34, 197, 94, 0.06), transparent 80%)`
            ),
          }}
          className="absolute inset-0 pointer-events-none rounded-[3rem]"
        />
        {children}
      </motion.div>
    </motion.div>
  );
};

/* ---------- Main Component ---------- */

export default function ROI() {
  const [headcount, setHeadcount] = useState(250);
  const [avgSalary, setAvgSalary] = useState(45000);
  const [adoption, setAdoption] = useState(0.6);
  const [productivityLift, setProductivityLift] = useState(0.01);
  const [turnoverRate, setTurnoverRate] = useState(0.28);
  const [turnoverReduction, setTurnoverReduction] = useState(0.05);
  const [advancesPerMonth, setAdvancesPerMonth] = useState(1.2);

  const [selectedCountry, setSelectedCountry] = useState<CountryKey>("KE");
  const [rates, setRates] = useState<Record<string, number> | null>(null);
  const [fxLoading, setFxLoading] = useState(false);
  const [fxError, setFxError] = useState<string | null>(null);

  const monthlySalary = avgSalary;
  const annualSalary = avgSalary * 12;
  const replacementCost = annualSalary * 0.25;

  const monthlyProductivityValue = useMemo(
    () => headcount * adoption * monthlySalary * productivityLift,
    [headcount, adoption, monthlySalary, productivityLift]
  );

  const annualTurnoverSavings = useMemo(() => {
    const reducedLeavers = headcount * turnoverRate * turnoverReduction;
    return reducedLeavers * replacementCost;
  }, [headcount, turnoverRate, turnoverReduction, replacementCost]);

  const monthlyTurnoverSavings = annualTurnoverSavings / 12;
  const monthlyImpact = monthlyProductivityValue + monthlyTurnoverSavings;

  useEffect(() => {
    let mounted = true;
    const cached = readFxFromCache();
    if (cached && Date.now() - cached.ts < FX_CACHE_TTL) {
      setRates(cached.rates);
    } else {
      setFxLoading(true);
      fetchFxWithRetries()
        .then((r) => {
          if (!mounted) return;
          if (r) {
            setRates(r);
            saveFxToCache(r);
            setFxError(null);
          } else {
            setRates(FALLBACK_RATES);
            setFxError("Using fallback FX rates.");
          }
        })
        .catch(() => {
          if (!mounted) return;
          setRates(FALLBACK_RATES);
          setFxError("Failed to fetch live FX.");
        })
        .finally(() => {
          if (!mounted) return;
          setFxLoading(false);
        });
    }
    return () => { mounted = false; };
  }, []);

  async function refreshRates() {
    setFxLoading(true);
    setFxError(null);
    try {
      const live = await fetchFxWithRetries();
      if (live) {
        setRates(live);
        saveFxToCache(live);
      } else {
        setRates(FALLBACK_RATES);
      }
    } catch {
      setRates(FALLBACK_RATES);
    } finally {
      setFxLoading(false);
    }
  }

  return (
    <section id="roi" className="relative overflow-hidden py-32">
      {/* Background Architectural elements */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-green-50/50 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-emerald-50/50 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-20 grid items-end gap-8 lg:grid-cols-2">
          <div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-500/10 bg-green-500/5 px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em] text-green-600"
            >
              <Calculator size={14} className="animate-pulse" />
              <span>Investment Return</span>
            </motion.div>
            <h2 className="font-serif text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">
              A wellbeing benefit with <br/>
              <span className="italic text-green-600">measurable outcomes</span>
            </h2>
          </div>

          <div className="flex flex-col items-start gap-4 lg:items-end">
            <div className="flex items-center gap-3">
              <div className="text-right text-[10px] font-bold uppercase tracking-widest text-slate-400">
                <div>Rates: <span className="text-green-600">{rates ? "Live" : "Fallback"}</span></div>
                {fxError && <div className="text-red-400">{fxError}</div>}
              </div>
              <button
                onClick={refreshRates}
                disabled={fxLoading}
                className="group flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 transition-all hover:border-green-500 hover:text-green-600 shadow-sm"
              >
                <RefreshCcw className={`h-3 w-3 ${fxLoading ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"}`} />
                <span>{fxLoading ? "Refreshing..." : "Refresh rates"}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
          {/* Left: Interactive Calculator */}
          <TiltROICard>
            <div className="grid gap-8 sm:grid-cols-2">
              <LabeledNumber label="Headcount" value={headcount} onChange={setHeadcount} min={1} max={100000} />
              <LabeledNumber label="Avg Salary (KES)" value={avgSalary} onChange={setAvgSalary} min={1500} max={5000000} step={500} />
              
              <div className="sm:col-span-2 space-y-8 py-4 border-y border-slate-100/50">
                <LabeledPercent label="Staff Adoption" value={adoption} onChange={setAdoption} />
                <LabeledPercent label="Productivity Lift" value={productivityLift} onChange={setProductivityLift} />
                <LabeledPercent label="Annual Turnover" value={turnoverRate} onChange={setTurnoverRate} />
                <LabeledPercent label="Turnover Reduction" value={turnoverReduction} onChange={setTurnoverReduction} />
              </div>

              <div className="sm:col-span-2 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="w-full space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Currency Display</p>
                  <select
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value as CountryKey)}
                    className="w-full rounded-2xl border border-slate-100 bg-white px-4 py-3 text-sm font-bold text-slate-900 shadow-sm outline-none focus:ring-4 focus:ring-green-500/10 transition-all cursor-pointer"
                  >
                    <option value="KE">Kenya — KES</option>
                    <option value="UG">Uganda — UGX</option>
                    <option value="TZ">Tanzania — TZS</option>
                    <option value="RW">Rwanda — RWF</option>
                    <option value="BI">Burundi — BIF</option>
                    <option value="SO">Somalia — SOS</option>
                  </select>
                </div>
                <div className="w-full md:text-right">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Base Currency</p>
                  <p className="text-sm font-bold text-slate-900">KES (Kenyan Shilling)</p>
                  <p className="text-[10px] font-bold text-green-600">Converted real-time for display</p>
                </div>
              </div>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-2">
              <MetricCard title="Monthly Productivity Value" value={formatCurrency(monthlyProductivityValue, selectedCountry, rates)} />
              <MetricCard title="Monthly Turnover Savings" value={formatCurrency(monthlyTurnoverSavings, selectedCountry, rates)} />
              <MetricCard title="Total Monthly Impact" value={formatCurrency(monthlyImpact, selectedCountry, rates)} accent />
              <MetricCard title="Employer Cash Cost" value={formatCurrency(0, selectedCountry, rates)} />
            </div>

            <p className="mt-8 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Pricing: Flat USD 2 + 5% application fee. <span className="text-green-600">0% Interest.</span>
            </p>
          </TiltROICard>

          {/* Right: Benefits Narrative */}
          <div className="lg:sticky lg:top-32 lg:pl-12 space-y-12">
            <div className="space-y-6">
              <h3 className="text-3xl font-serif font-bold text-slate-900">
                Why forward-thinking HR teams <span className="italic text-green-600">trust EaziWage</span>
              </h3>
              <p className="text-lg leading-relaxed text-slate-500">
                Accessing earned wages isn't just about financial flexibility — it's 
                a strategic lever for operational excellence and employee happiness.
              </p>
            </div>

            <div className="space-y-6">
              {[
                "Lower absenteeism and overtime leakage through better cash-flow timing.",
                "Higher engagement & retention, especially in shift-based and frontline teams.",
                "No lending exposure to the employer; settlement auto-reconciles in payroll.",
              ].map((text, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group flex items-start gap-4 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:border-green-500/30 hover:shadow-lg hover:shadow-green-500/5"
                >
                  <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-50 text-green-600 transition-colors group-hover:bg-green-600 group-hover:text-white">
                    <CheckCircle2 size={14} strokeWidth={3} />
                  </div>
                  <span className="font-bold text-slate-700 leading-relaxed transition-colors group-hover:text-slate-900">
                    {text}
                  </span>
                </motion.div>
              ))}
            </div>

            <div className="pt-8">
              <motion.div
                whileHover={{ y: -5 }}
                className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 p-8 shadow-2xl"
              >
                <div className="absolute inset-0 bg-linear-to-br from-green-500/20 to-transparent opacity-50" />
                <div className="relative z-10">
                  <p className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-green-400 mb-4">
                    <Sparkles size={14} /> Ready to see the difference?
                  </p>
                  <h4 className="text-xl font-serif font-bold text-white mb-6">
                    Join 100+ African enterprises empowering their workforce.
                  </h4>
                  <button className="flex w-full items-center justify-center gap-3 rounded-2xl bg-white py-4 font-black uppercase tracking-widest text-slate-900 transition-all hover:bg-green-500 hover:text-white">
                    Request a Demo <ArrowRight size={18} />
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
