"use client";

import { useEffect, useMemo, useState } from "react";
import { BarChart3, CheckCircle2, RefreshCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Production-ready ROI component:
 * - Uses server-side API /api/fx to get live rates (base KES)
 * - Falls back to embedded safe rates if network fails
 * - Caches rates in localStorage with TTL
 * - Formats numbers with Intl.NumberFormat for each currency
 */

/* ---------- Config ---------- */

const BRAND = "#15803D";
const FX_CACHE_KEY = "eazi_fx_v1";
const FX_CACHE_TTL = 1000 * 60 * 60; // 1 hour

const FALLBACK_RATES: Record<string, number> = {
  KES: 1,
  UGX: 36, // fallback approx
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

function formatCurrency(
  amountKES: number,
  country: CountryKey,
  rates: Record<string, number> | null
) {
  const currencyCode = CURRENCIES[country].code;
  const locale = CURRENCIES[country].locale;
  const rate = rates?.[currencyCode] ?? FALLBACK_RATES[currencyCode] ?? 1;
  const converted = Math.round(amountKES * rate);

  // Use Intl.NumberFormat for robust currency formatting
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currencyCode,
      maximumFractionDigits: 0,
    }).format(converted);
  } catch {
    // fallback to simple formatting
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
      // server returns { rates: { KES:1, UGX:..}, fetchedAt }
      return json.rates ?? null;
    } catch (err) {
      lastErr = err;
      // short backoff
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  throw lastErr;
}

function saveFxToCache(rates: Record<string, number>) {
  try {
    const payload = { ts: Date.now(), rates };
    localStorage.setItem(FX_CACHE_KEY, JSON.stringify(payload));
  } catch (e) {
    // ignore
  }
}

function readFxFromCache(): { ts: number; rates: Record<string, number> } | null {
  try {
    const raw = localStorage.getItem(FX_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.ts || !parsed?.rates) return null;
    return parsed;
  } catch {
    return null;
  }
}

/* ---------- UI subcomponents (small, unchanged) ---------- */

const LabeledNumber = ({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
  step?: number;
}) => (
  <label className="block">
    <div className="mb-1 text-xs text-gray-600">{label}</div>
    <input
      type="number"
      value={value}
      min={min}
      max={max}
      step={step}
      onChange={(e) => onChange(Number(e.target.value || 0))}
      className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:outline-none"
      style={{ accentColor: BRAND }}
    />
  </label>
);

const LabeledPercent = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number; // 0–1
  onChange: (n: number) => void;
}) => (
  <label className="block">
    <div className="mb-1 text-xs text-gray-600">{label}</div>
    <div className="flex items-center gap-2">
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
        style={{ accentColor: BRAND }}
      />
      <span className="w-12 text-right text-sm tabular-nums">
        {Math.round(value * 100)}%
      </span>
    </div>
  </label>
);

const MetricCard = ({
  title,
  value,
  accent = false,
}: {
  title: string;
  value: string;
  accent?: boolean;
}) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.98 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.25 }}
    className={`rounded-2xl border p-4 ${accent ? "border-[rgba(21,128,61,0.35)] bg-[rgba(21,128,61,0.04)]" : "border-gray-100 bg-gray-50"}`}
  >
    <p className="text-xs text-gray-600">{title}</p>
    <AnimatePresence mode="wait">
      <motion.p
        key={value}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -5 }}
        transition={{ duration: 0.18 }}
        className="text-2xl font-semibold text-gray-900"
      >
        {value}
      </motion.p>
    </AnimatePresence>
  </motion.div>
);

/* ---------- Main Component ---------- */

export default function ROI() {
  // inputs (base values are KES)
  const [headcount, setHeadcount] = useState(250);
  const [avgSalary, setAvgSalary] = useState(45000); // in KES
  const [adoption, setAdoption] = useState(0.6);
  const [productivityLift, setProductivityLift] = useState(0.01);
  const [turnoverRate, setTurnoverRate] = useState(0.28);
  const [turnoverReduction, setTurnoverReduction] = useState(0.05);
  const [advancesPerMonth, setAdvancesPerMonth] = useState(1.2);

  // currency / FX
  const [selectedCountry, setSelectedCountry] = useState<CountryKey>("KE");
  const [rates, setRates] = useState<Record<string, number> | null>(null);
  const [fxLoading, setFxLoading] = useState(false);
  const [fxError, setFxError] = useState<string | null>(null);

  // derived numbers (all based on KES amounts)
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

  /* ---------- FX load logic ---------- */
  useEffect(() => {
    let mounted = true;
    const cached = readFxFromCache();
    if (cached && Date.now() - cached.ts < FX_CACHE_TTL) {
      setRates(cached.rates);
    } else {
      // fetch from server route
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
          setFxError("Failed to fetch live FX; using fallback rates.");
        })
        .finally(() => {
          if (!mounted) return;
          setFxLoading(false);
        });
    }
    return () => {
      mounted = false;
    };
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
        setFxError("No live FX returned; using fallback.");
        setRates(FALLBACK_RATES);
      }
    } catch {
      setFxError("Refresh failed; using cached/fallback rates.");
    } finally {
      setFxLoading(false);
    }
  }

  return (
    <section id="roi" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">ROI & impact (illustrative)</h3>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right text-xs text-gray-500">
            <div>Rates: {rates ? "live" : "fallback"}</div>
            <div className="text-[11px] text-gray-400">{fxError ?? ""}</div>
          </div>
          <button
            onClick={refreshRates}
            className="flex items-center gap-2 rounded-xl border px-3 py-2 text-sm"
            aria-label="Refresh FX rates"
            disabled={fxLoading}
            title="Refresh FX rates"
          >
            <RefreshCcw className="h-4 w-4" />
            <span>{fxLoading ? "Refreshing…" : "Refresh rates"}</span>
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:items-start">
        <div className="rounded-3xl border border-gray-200 bg-white p-6">
          <div className="mt-2 grid gap-4 sm:grid-cols-2">
            <LabeledNumber
              label="Headcount"
              value={headcount}
              onChange={setHeadcount}
              min={1}
              max={100000}
              step={1}
            />
            <LabeledNumber
              label="Avg monthly salary (KES)"
              value={avgSalary}
              onChange={setAvgSalary}
              min={1500}
              max={5_000_000}
              step={500}
            />
            <LabeledPercent label="Adoption" value={adoption} onChange={setAdoption} />
            <LabeledPercent label="Productivity lift" value={productivityLift} onChange={setProductivityLift} />
            <LabeledPercent label="Annual turnover rate" value={turnoverRate} onChange={setTurnoverRate} />
            <LabeledPercent label="Turnover reduction" value={turnoverReduction} onChange={setTurnoverReduction} />
            <LabeledNumber
              label="Advances / employee / month"
              value={advancesPerMonth}
              onChange={setAdvancesPerMonth}
              min={0}
              max={6}
              step={0.1}
            />
          </div>

          <div className="mt-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <label className="text-xs text-gray-600">View currency</label>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value as CountryKey)}
                className="rounded-xl border px-3 py-2 text-sm"
              >
                <option value="KE">Kenya — KES</option>
                <option value="UG">Uganda — UGX</option>
                <option value="TZ">Tanzania — TZS</option>
                <option value="RW">Rwanda — RWF</option>
                <option value="BI">Burundi — BIF</option>
                <option value="SO">Somalia — SOS</option>
              </select>
            </div>

            <div className="text-right text-xs text-gray-500">
              <div>Base currency: KES</div>
              <div className="text-[11px] text-gray-400">All inputs in KES; converted for display</div>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <MetricCard
              title="Monthly productivity value"
              value={formatCurrency(monthlyProductivityValue, selectedCountry, rates)}
            />
            <MetricCard
              title="Monthly turnover savings"
              value={formatCurrency(monthlyTurnoverSavings, selectedCountry, rates)}
            />
            <MetricCard
              title="Estimated monthly impact"
              value={formatCurrency(monthlyImpact, selectedCountry, rates)}
              accent
            />
            <MetricCard
              title="Employer cash cost"
              value={formatCurrency(0, selectedCountry, rates)}
            />
          </div>

          <p className="mt-3 text-xs text-gray-600">
            Fees shown in-app to employees before confirmation: Flat USD 2 + 5% application; no interest.
            Configurable employer policies ensure responsible usage.
          </p>
        </div>

        <div>
          <h3 className="text-2xl font-semibold text-gray-900">A wellbeing benefit with measurable outcomes</h3>
          <ul className="mt-4 space-y-3 text-gray-700">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5" style={{ color: BRAND }} />
              <span>Lower absenteeism and overtime leakage through better cash-flow timing.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5" style={{ color: BRAND }} />
              <span>Higher engagement & retention, especially in shift-based and frontline teams.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5" style={{ color: BRAND }} />
              <span>No lending exposure to the employer; settlement auto-reconciles in payroll.</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
