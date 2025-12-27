"use client"
import { useState, useMemo } from "react";
import { BarChart3, CheckCircle2} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion";

function currency(n: number) {
  return "KSh " + Math.round(n).toLocaleString();
}

const BRAND = "#15803D";
export default function ROI() {
  const [headcount, setHeadcount] = useState(250);
  const [avgSalary, setAvgSalary] = useState(45000); // KES
  const [adoption, setAdoption] = useState(0.6); // 60%
  const [productivityLift, setProductivityLift] = useState(0.01); // 1% baseline
  const [turnoverRate, setTurnoverRate] = useState(0.28); // 28% annual
  const [turnoverReduction, setTurnoverReduction] = useState(0.05); // 5% relative
  const [advancesPerMonth, setAdvancesPerMonth] = useState(1.2);

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

  return (
    <section id="roi" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
        <div className="rounded-3xl border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">ROI & impact (illustrative)</h3>
            <BarChart3 className="h-6 w-6" style={{ color: BRAND }} />
          </div>

          {/* Inputs */}
          <div className="mt-4 grid sm:grid-cols-2 gap-4">
            <LabeledNumber label="Headcount" value={headcount} onChange={setHeadcount} min={10} max={100000} step={10} />
            <LabeledNumber label="Avg monthly salary (KES)" value={avgSalary} onChange={setAvgSalary} min={15000} max={500000} step={1000} />
            <LabeledPercent label="Adoption" value={adoption} onChange={setAdoption} />
            <LabeledPercent label="Productivity lift" value={productivityLift} onChange={setProductivityLift} />
            <LabeledPercent label="Annual turnover rate" value={turnoverRate} onChange={setTurnoverRate} />
            <LabeledPercent label="Turnover reduction" value={turnoverReduction} onChange={setTurnoverReduction} />
            <LabeledNumber label="Advances / employee / month" value={advancesPerMonth} onChange={setAdvancesPerMonth} min={0} max={6} step={0.1} />
          </div>

          {/* Outputs */}
          <div className="mt-6 grid sm:grid-cols-2 gap-4">
            <MetricCard title="Monthly productivity value" value={currency(monthlyProductivityValue)} />
            <MetricCard title="Monthly turnover savings" value={currency(monthlyTurnoverSavings)} />
            <MetricCard title="Estimated monthly impact" value={currency(monthlyImpact)} accent />
            <MetricCard title="Employer cash cost" value="~ KSh 0 (fees paid by employees)" />
          </div>
          <p className="mt-3 text-xs text-gray-600">
            Fees shown in-app to employees before confirmation: Flat KSh 25 + 5% application; no interest. Configurable employer policies ensure responsible usage.
          </p>
        </div>

        {/* Copy */}
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
};

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
    <div className="text-xs text-gray-600 mb-1">{label}</div>
    <input
      type="number"
      value={value}
      min={min}
      max={max}
      step={step}
      onChange={(e) => onChange(Number(e.target.value || 0))}
      className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2"
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
    <div className="text-xs text-gray-600 mb-1">{label}</div>
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
      <span className="text-sm tabular-nums w-12 text-right">{Math.round(value * 100)}%</span>
    </div>
  </label>
);

const MetricCard = ({ title, value, accent = false }: { title: string; value: string; accent?: boolean }) => (
  <motion.div 
    layout
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3 }}
    className={`rounded-2xl border p-4 ${accent ? "border-[rgba(21,128,61,0.35)] bg-[rgba(21,128,61,0.04)]" : "border-gray-100 bg-gray-50"}`}
  >
    <p className="text-xs text-gray-600">{title}</p>
    <AnimatePresence mode="wait">
        <motion.p 
        key={value}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -5 }}
        transition={{ duration: 0.2 }}
        className="text-2xl font-semibold text-gray-900"
        >
            {value}
        </motion.p>
    </AnimatePresence>
  </motion.div>
);