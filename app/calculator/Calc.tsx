"use client";
import React, { useEffect, useMemo, useState } from "react";

type AllowanceKey =
  | "otherRemuneration"
  | "mealAllowance"
  | "nightAllowance"
  | "pensionCover"
  | "medicalCover";

type AllowancesChecked = Record<AllowanceKey, boolean>;
type AllowancesAmount = Record<AllowanceKey, number>;

type CalcResult = {
  success: boolean;
  accruedGross: number;
  netMonthly: number;
  accessCapPercent: number;
  accessCap: number;
  platformFee: number;
  accessibleNow: number;
  deductions: {
    NSSF: number;
    SHIF: number;
    Housing: number;
  };
  error?: string;
};

const fmt = (n: number) =>
  new Intl.NumberFormat("en-KE", { maximumFractionDigits: 0 }).format(Math.round(n));

export default function Calculator() {
  const [salary, setSalary] = useState<number | "">("");
  const [daysWorked, setDaysWorked] = useState<number>(0);

  // Fixed values
  const feePercent = 5; // 💰 Fixed 5%
  const flatFee = 25; // 💵 Fixed 25 KES
  const cycleDays = 30; // 🔒 Fixed cycle days

  const [allowancesChecked, setAllowancesChecked] = useState<AllowancesChecked>({
    otherRemuneration: false,
    mealAllowance: false,
    nightAllowance: false,
    pensionCover: false,
    medicalCover: false,
  });

  const [allowancesAmount, setAllowancesAmount] = useState<AllowancesAmount>({
    otherRemuneration: 0,
    mealAllowance: 0,
    nightAllowance: 0,
    pensionCover: 0,
    medicalCover: 0,
  });

  const [result, setResult] = useState<CalcResult | null>(null);

  const percentOfCycle = useMemo(() => {
    return Math.min(100, Math.round((Number(daysWorked || 0) / cycleDays) * 100));
  }, [daysWorked]);

  const buildPayload = () => ({
    salary: Number(salary || 0),
    cycleDays, // fixed 30
    daysWorked: Number(daysWorked || 0),
    advanced: 0,
    feePercent,
    flatFee,
    allowances: {
      otherRemuneration: allowancesChecked.otherRemuneration
        ? Number(allowancesAmount.otherRemuneration || 0)
        : 0,
      mealAllowance: allowancesChecked.mealAllowance
        ? Number(allowancesAmount.mealAllowance || 0)
        : 0,
      nightAllowance: allowancesChecked.nightAllowance
        ? Number(allowancesAmount.nightAllowance || 0)
        : 0,
      pensionCover: allowancesChecked.pensionCover
        ? Number(allowancesAmount.pensionCover || 0)
        : 0,
      medicalCover: allowancesChecked.medicalCover
        ? Number(allowancesAmount.medicalCover || 0)
        : 0,
    },
  });

  const callBackendCalc = async () => {
    if (!salary) {
      alert("Fill in salary ⚠️");
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
      console.error("Server calc failed — check console.", err);
    }
  };

  useEffect(() => {
    if (salary) callBackendCalc();
  }, [salary, daysWorked, allowancesChecked, allowancesAmount]);

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8 border border-green-100 max-w-5xl mx-auto mt-10">
      <h2 className="text-3xl font-extrabold mb-6 text-gray-900 text-center">
        Wage Access Calculator 💼
      </h2>

      <div className="grid gap-5">
        {/* BASIC INPUTS (Cycle Days removed, Salary expanded) */}
        <div className="grid grid-cols-1 gap-4">
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
        </div>

        {/* ALLOWANCES SECTION */}
        <div className="grid gap-2 mt-4">
          <p className="text-sm font-semibold">Allowances (toggle + enter amount)</p>
          {([
            { key: "otherRemuneration", label: "Other Remuneration (bonuses, travel, car etc)" },
            { key: "mealAllowance", label: "Meal Allowance" },
            { key: "nightAllowance", label: "Night Out Allowance" },
            { key: "pensionCover", label: "Pension Cover" },
            { key: "medicalCover", label: "Medical Cover" },
          ] as const).map((a) => (
            <div key={a.key} className="flex items-center gap-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={allowancesChecked[a.key as AllowanceKey]}
                  onChange={(e) =>
                    setAllowancesChecked((s) => ({
                      ...s,
                      [a.key as AllowanceKey]: e.target.checked,
                    }))
                  }
                />
                <span className="text-sm">{a.label}</span>
              </label>
              <input
                type="number"
                className="ml-auto w-48 border rounded-lg p-2"
                value={allowancesAmount[a.key as AllowanceKey]}
                disabled={!allowancesChecked[a.key as AllowanceKey]}
                onChange={(e) =>
                  setAllowancesAmount((s) => ({
                    ...s,
                    [a.key as AllowanceKey]: e.target.value ? +e.target.value : 0,
                  }))
                }
              />
            </div>
          ))}
        </div>

        {/* DAYS WORKED SLIDER */}
        <div>
          <label className="text-sm text-gray-600">Days worked (drag)</label>
          <input
            type="range"
            min={0}
            max={cycleDays}
            value={daysWorked}
            onChange={(e) => setDaysWorked(Number(e.target.value))}
            className="w-full mt-2"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{daysWorked} days</span>
            <span>{percentOfCycle}% of cycle</span>
          </div>
        </div>

        <button
          onClick={callBackendCalc}
          className="mt-3 bg-gradient-to-r from-green-600 to-emerald-500 text-white font-semibold py-2 px-4 rounded-xl shadow hover:scale-[1.02] transition-transform w-full"
        >
          Calculate
        </button>
      </div>

      {/* RESULTS */}
      {result && result.success && (
        <div className="mt-10 bg-gradient-to-br from-emerald-50 via-green-50 to-white border border-emerald-200 rounded-2xl p-8 shadow-lg">
          <h3 className="font-extrabold text-green-800 text-xl mb-4">Wage Summary</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between border-b border-green-100 pb-1">
              <p>Accrued Earnings</p>
              <p className="font-semibold text-emerald-700">Ksh {fmt(result.accruedGross)}</p>
            </div>
            <div className="flex justify-between border-b border-green-100 pb-1">
              <p>Net Salary (After Deductions + Allowances)</p>
              <p className="font-semibold text-emerald-700">Ksh {fmt(result.netMonthly)}</p>
            </div>
            <div className="flex justify-between border-b border-green-100 pb-1">
              <p>Access Cap ({result.accessCapPercent}%)</p>
              <p className="font-semibold text-emerald-700">Ksh {fmt(result.accessCap)}</p>
            </div>
            <div className="flex justify-between border-b border-green-100 pb-1">
              <p>Platform Fee (5%)</p>
              <p className="font-semibold text-red-500">- Ksh {fmt(result.platformFee)}</p>
            </div>
            <div className="pt-3 flex justify-between items-center bg-white/80 rounded-xl shadow-inner px-3 py-2 border border-emerald-100">
              <p className="font-bold text-gray-800 text-base">You Can Access Now</p>
              <p className="text-right font-extrabold text-green-700 text-xl">
                Ksh {fmt(result.accessibleNow)}
              </p>
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
