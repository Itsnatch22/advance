// "use client";
import React, { useEffect, useMemo, useState } from "react";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-KE", { maximumFractionDigits: 0 }).format(Math.round(n));

export default function Calculator() {
  const [salary, setSalary] = useState<number | "">("");
  const [cycleDays, setCycleDays] = useState<number | "">(30);
  // replaced start/asOf with slider daysWorked
  const [daysWorked, setDaysWorked] = useState<number>(0);

  const [accessPercentIgnored, setAccessPercentIgnored] = useState<number>(60); // still show but not used client-side
  const [advanced, setAdvanced] = useState<number | "">(0);
  const [flatFee, setFlatFee] = useState<number | "">(0);
  const [feePercent, setFeePercent] = useState<number | "">(2);

  // allowances: checkboxes + amount (if checkbox unchecked, amount is 0)
  const [allowancesChecked, setAllowancesChecked] = useState({
    otherRemuneration: false,
    mealAllowance: false,
    nightAllowance: false,
    pensionCover: false,
    medicalCover: false,
  });
  const [allowancesAmount, setAllowancesAmount] = useState({
    otherRemuneration: 0,
    mealAllowance: 0,
    nightAllowance: 0,
    pensionCover: 0,
    medicalCover: 0,
  });

  const [result, setResult] = useState<any>(null);

  // widen the card — changed max-w to bigger width
  const containerClass = "bg-white rounded-2xl shadow-2xl p-6 border border-green-100 max-w-3xl mx-auto mt-6";

  const percentOfCycle = useMemo(() => {
    const cycle = Number(cycleDays) || 30;
    return Math.min(100, Math.round((Number(daysWorked || 0) / cycle) * 100));
  }, [daysWorked, cycleDays]);

  const buildPayload = () => {
    return {
      salary: Number(salary || 0),
      cycleDays: Number(cycleDays || 30),
      daysWorked: Number(daysWorked || 0),
      advanced: Number(advanced || 0),
      feePercent: Number(feePercent || 0),
      flatFee: Number(flatFee || 0),
      allowances: {
        otherRemuneration: allowancesChecked.otherRemuneration ? Number(allowancesAmount.otherRemuneration || 0) : 0,
        mealAllowance: allowancesChecked.mealAllowance ? Number(allowancesAmount.mealAllowance || 0) : 0,
        nightAllowance: allowancesChecked.nightAllowance ? Number(allowancesAmount.nightAllowance || 0) : 0,
        pensionCover: allowancesChecked.pensionCover ? Number(allowancesAmount.pensionCover || 0) : 0,
        medicalCover: allowancesChecked.medicalCover ? Number(allowancesAmount.medicalCover || 0) : 0,
      },
    };
  };

  const callBackendCalc = async () => {
    // minimal validation
    if (!salary || !cycleDays) {
      alert("fill salary & cycle days ⚠️");
      return;
    }
    const payload = buildPayload();
    try {
      const res = await fetch("/api/calc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "calc failed");
      setResult(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error("Server calc failed — check console.", message);
    }
  };

  // auto recalc on relevant changes
  useEffect(() => {
    // debounce lightly? nah — fire immediately as user wanted dynamic
    if (salary && cycleDays) {
      callBackendCalc();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [salary, cycleDays, daysWorked, advanced, flatFee, feePercent, allowancesChecked, allowancesAmount]);

  return (
    <div className={containerClass}>
      <h2 className="text-2xl font-extrabold mb-4 text-gray-900">Wage Access Calculator</h2>

      <div className="grid gap-3">
        <div>
          <label className="text-sm text-gray-600">Gross Monthly Salary (KES)</label>
          <input
            type="number"
            placeholder="e.g. 60000"
            className="mt-1 w-full border rounded-lg p-2"
            value={salary}
            onChange={(e) => setSalary(e.target.value ? +e.target.value : "")}
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-sm text-gray-600">Cycle Days</label>
            <input
              type="number"
              className="mt-1 w-full border rounded-lg p-2"
              value={cycleDays}
              onChange={(e) => setCycleDays(e.target.value ? +e.target.value : "")}
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Already Advanced (KES)</label>
            <input
              type="number"
              className="mt-1 w-full border rounded-lg p-2"
              value={advanced}
              onChange={(e) => setAdvanced(e.target.value ? +e.target.value : "")}
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Platform Fee % (server)</label>
            <input
              type="number"
              className="mt-1 w-full border rounded-lg p-2"
              value={feePercent}
              onChange={(e) => setFeePercent(e.target.value ? +e.target.value : "")}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-gray-600">Flat Fee (KES)</label>
            <input
              type="number"
              className="mt-1 w-full border rounded-lg p-2"
              value={flatFee}
              onChange={(e) => setFlatFee(e.target.value ? +e.target.value : "")}
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Access Cap  — shown for info</label>
            <input
              type="number"
              className="mt-1 w-full border rounded-lg p-2 bg-gray-50"
              value={accessPercentIgnored}
              readOnly
            />
          </div>
        </div>

        {/* DAYS WORKED SLIDER */}
        <div>
          <label className="text-sm text-gray-600">Days worked (drag)</label>
          <input
            type="range"
            min={0}
            max={Number(cycleDays || 30)}
            value={daysWorked}
            onChange={(e) => setDaysWorked(Number(e.target.value))}
            className="w-full mt-2"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{daysWorked} days</span>
            <span>{percentOfCycle}% of cycle</span>
          </div>
        </div>

        {/* Allowances checkboxes */}
        <div className="grid gap-2">
          <p className="text-sm font-semibold">Allowances (toggle to enable amount)</p>

          {([
            { key: "otherRemuneration", label: "Other Remuneration (inc bonuses, travel, car etc)" },
            { key: "mealAllowance", label: "Meal Allowance" },
            { key: "nightAllowance", label: "Night Out Allowance" },
            { key: "pensionCover", label: "Pension Cover" },
            { key: "medicalCover", label: "Medical Cover" },
          ] as const).map((a) => (
            <div key={a.key} className="flex items-center gap-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={(allowancesChecked as any)[a.key]}
                  onChange={(e) => setAllowancesChecked((s) => ({ ...s, [a.key]: e.target.checked }))}
                />
                <span className="text-sm">{a.label}</span>
              </label>
              <input
                type="number"
                className="ml-auto w-40 border rounded-lg p-2"
                value={(allowancesAmount as any)[a.key]}
                disabled={!(allowancesChecked as any)[a.key]}
                onChange={(e) =>
                  setAllowancesAmount((s) => ({ ...s, [a.key]: e.target.value ? +e.target.value : 0 }))
                }
              />
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={callBackendCalc}
            className="mt-3 bg-gradient-to-r from-green-600 to-emerald-500 text-white font-semibold py-2 px-4 rounded-xl shadow hover:scale-[1.01] transition-transform"
          >
            Calculate 
          </button>
          <div className="mt-3 ml-auto text-sm text-gray-500">Access cap = 60% & platform fee</div>
        </div>
      </div>

      {/* Result */}
      {result && result.success && (
        <div className="mt-8 bg-gradient-to-br from-emerald-50 via-green-50 to-white border border-emerald-200 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-extrabold text-green-800 text-lg">💼 Wage Access Summary</h3>
            <span className="text-xs text-gray-500 italic">Updated {new Date().toLocaleDateString()}</span>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between border-b border-green-100 pb-1">
              <p className="text-gray-700">Accrued Earnings</p>
              <p className="font-semibold text-emerald-700">Ksh {fmt(result.accruedGross)}</p>
            </div>
            <div className="flex justify-between border-b border-green-100 pb-1">
              <p className="text-gray-700">Net Salary (After Deductions + allowances)</p>
              <p className="font-semibold text-emerald-700">Ksh {fmt(result.netMonthly)}</p>
            </div>
            <div className="flex justify-between border-b border-green-100 pb-1">
              <p className="text-gray-700">Access Cap ({result.accessCapPercent}%)</p>
              <p className="font-semibold text-emerald-700">Ksh {fmt(result.accessCap)}</p>
            </div>

            <div className="flex justify-between border-b border-green-100 pb-1">
              <p className="text-gray-700">Platform Fee </p>
              <p className="font-semibold text-red-500">- Ksh {fmt(result.platformFee)}</p>
            </div>

            <div className="pt-3 flex justify-between items-center bg-white/80 rounded-xl shadow-inner px-3 py-2 border border-emerald-100">
              <p className="font-bold text-gray-800 text-base">You Can Access Now</p>
              <p className="text-right font-extrabold text-green-700 text-xl">Ksh {fmt(result.accessibleNow)}</p>
            </div>
          </div>

          <div className="mt-4 bg-white/70 border border-green-200 rounded-lg p-2 text-xs text-gray-600 text-center shadow-sm">
            <p>
              <span className="font-semibold">Deductions →</span> NSSF: Ksh {fmt(result.deductions.NSSF)} |
              SHIF: Ksh {fmt(result.deductions.SHIF)} | Housing Lev: Ksh {fmt(result.deductions.Housing)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
