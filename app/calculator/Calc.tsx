"use client";
import React, { useEffect, useMemo, useState } from "react";

//@typescript-eslint
const fmt = (n: number) =>
  new Intl.NumberFormat("en-KE", { maximumFractionDigits: 0 }).format(
    Math.round(n)
  );

export default function Calculator(){
  const [salary, setSalary] = useState<number | "">("");
  const [cycleDays, setCycleDays] = useState<number | "">(30);
  const [startDate, setStartDate] = useState<string>("");
  const [asOfDate, setAsOfDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [workedDays, setWorkedDays] = useState<number>(0);
  const [accessPercent, setAccessPercent] = useState<number | "">(50);
  const [advanced, setAdvanced] = useState<number | "">(0);
  const [flatFee, setFlatFee] = useState<number | "">(0);
  const [feePercent, setFeePercent] = useState<number | "">(2);
  type Result = {
    accruedGross: number;
    netMonthly: number;
    accessCap: number;
    platformFee: number;
    accessibleNow: number;
    deductions: {
      NSSF: number;
      NHIF: number;
      Housing: number;
      Total: number;
    };
  } | null;

  const [result, setResult] = useState<Result>(null);

  // Auto-calc worked days
  useEffect(() => {
    if (!startDate || !asOfDate) {
      setWorkedDays(0);
      return;
    }
    const start = new Date(startDate);
    const end = new Date(asOfDate);
    const diffMs = end.getTime() - start.getTime();
    const rawDays = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
    const cap = typeof cycleDays === "number" && cycleDays > 0 ? cycleDays : 30;
    setWorkedDays(rawDays > cap ? cap : rawDays);
  }, [startDate, asOfDate, cycleDays]);

  // Deductions
  type Deductions = { NSSF: number; NHIF: number; Housing: number; Total: number };
  const calculateDeductions = (gross: number): Deductions => {
    const NSSF = Math.min(gross * 0.06, 2160);
    let NHIF = 0;
    if (gross <= 5999) NHIF = 150;
    else if (gross <= 7999) NHIF = 300;
    else if (gross <= 11999) NHIF = 400;
    else if (gross <= 14999) NHIF = 500;
    else if (gross <= 19999) NHIF = 600;
    else if (gross <= 24999) NHIF = 750;
    else if (gross <= 29999) NHIF = 850;
    else if (gross <= 34999) NHIF = 900;
    else if (gross <= 39999) NHIF = 950;
    else if (gross <= 44999) NHIF = 1000;
    else if (gross <= 49999) NHIF = 1100;
    else if (gross <= 59999) NHIF = 1200;
    else if (gross <= 69999) NHIF = 1300;
    else if (gross <= 79999) NHIF = 1400;
    else if (gross <= 89999) NHIF = 1500;
    else if (gross <= 99999) NHIF = 1600;
    else NHIF = 1700;
    const Housing = gross * 0.015;
    const Total = NSSF + NHIF + Housing;
    return { NSSF, NHIF, Housing, Total };
  };

  const handleCalculate = () => {
    if (!salary || !cycleDays) {
      alert("Enter all required inputs ⚠️");
      return;
    }

    const gross = Number(salary);
    const cycle = Number(cycleDays);
    const days = Number(workedDays);
    const accPct = Number(accessPercent);
    const adv = Number(advanced);
    const flat = Number(flatFee);
    const feeP = Number(feePercent);

    const deductions = calculateDeductions(gross);
    const netMonthly = gross - deductions.Total;
    const accruedGross = (gross / cycle) * days;
    const accessCap = (accruedGross * accPct) / 100;
    const availableBeforeFees = Math.max(0, accessCap - adv);
    const platformFee = Math.max(0, (availableBeforeFees * feeP) / 100 + flat);
    const accessibleNow = Math.max(0, availableBeforeFees - platformFee);

    setResult({
      accruedGross,
      netMonthly,
      accessCap,
      platformFee,
      accessibleNow,
      deductions,
    });
  };

  const percentOfCycle = useMemo(() => {
    const cycle = Number(cycleDays) || 30;
    return Math.min(100, Math.round((Number(workedDays || 0) / cycle) * 100));
  }, [workedDays, cycleDays]);

return (
  <div className="bg-white rounded-2xl shadow-2xl p-6 border border-green-100 max-w-lg mx-auto mt-6">
    <h2 className="text-2xl font-extrabold mb-4 text-gray-900">
      Wage Access Calculator 🇰🇪
    </h2>

    {/* INPUTS */}
      <div className="grid gap-3">
        <div>
          <label className="text-sm text-gray-600">
            Gross Monthly Salary (KES)
          </label>
          <input
            type="number"
            placeholder="e.g. 60000"
            className="mt-1 w-full border rounded-lg p-2"
            value={salary}
            onChange={(e) => setSalary(e.target.value ? +e.target.value : "")}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-gray-600">Cycle Days</label>
            <input
              type="number"
              className="mt-1 w-full border rounded-lg p-2"
              value={cycleDays}
              onChange={(e) =>
                setCycleDays(e.target.value ? +e.target.value : "")
              }
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">Access Cap (%)</label>
            <input
              type="number"
              className="mt-1 w-full border rounded-lg p-2"
              value={accessPercent}
              onChange={(e) =>
                setAccessPercent(e.target.value ? +e.target.value : "")
              }
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-gray-600">Start Date</label>
            <input
              type="date"
              className="mt-1 w-full border rounded-lg p-2"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">As of Date</label>
            <input
              type="date"
              className="mt-1 w-full border rounded-lg p-2"
              value={asOfDate}
              onChange={(e) => setAsOfDate(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-600">Days Worked (auto)</label>
          <input
            type="number"
            className="mt-1 w-full border rounded-lg p-2 bg-gray-50"
            value={workedDays}
            readOnly
          />
          <div className="mt-2 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
              style={{ width: `${percentOfCycle}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {percentOfCycle}% of cycle
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-gray-600">
              Already Advanced (KES)
            </label>
            <input
              type="number"
              className="mt-1 w-full border rounded-lg p-2"
              value={advanced}
              onChange={(e) =>
                setAdvanced(e.target.value ? +e.target.value : "")
              }
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">Flat Fee (KES)</label>
            <input
              type="number"
              className="mt-1 w-full border rounded-lg p-2"
              value={flatFee}
              onChange={(e) =>
                setFlatFee(e.target.value ? +e.target.value : "")
              }
            />
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-600">Platform Fee (%)</label>
          <input
            type="number"
            className="mt-1 w-full border rounded-lg p-2"
            value={feePercent}
            onChange={(e) =>
              setFeePercent(e.target.value ? +e.target.value : "")
            }
          />
        </div>

        <button
          onClick={handleCalculate}
          className="mt-3 bg-gradient-to-r from-green-600 to-emerald-500 text-white font-semibold py-2 rounded-xl shadow hover:scale-[1.01] transition-transform"
        >
          Calculate
        </button>
      </div>

      {result && (
        <div className="mt-8 bg-gradient-to-br from-emerald-50 via-green-50 to-white border border-emerald-200 rounded-2xl p-6 shadow-lg backdrop-blur-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-extrabold text-green-800 text-lg flex items-center gap-2">
              💼 Wage Access Summary
            </h3>
            <span className="text-xs text-gray-500 italic">
              Updated {new Date().toLocaleDateString()}
            </span>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between border-b border-green-100 pb-1">
              <p className="text-gray-700">Accrued Earnings</p>
              <p className="font-semibold text-emerald-700">
                Ksh {fmt(result.accruedGross)}
              </p>
            </div>
            <div className="flex justify-between border-b border-green-100 pb-1">
              <p className="text-gray-700">Net Salary (After Deductions)</p>
              <p className="font-semibold text-emerald-700">
                Ksh {fmt(result.netMonthly)}
              </p>
            </div>
            <div className="flex justify-between border-b border-green-100 pb-1">
              <p className="text-gray-700">Access Cap ({accessPercent}%)</p>
              <p className="font-semibold text-emerald-700">
                Ksh {fmt(result.accessCap)}
              </p>
            </div>
            <div className="flex justify-between border-b border-green-100 pb-1">
              <p className="text-gray-700">Platform Fee</p>
              <p className="font-semibold text-red-500">
                - Ksh {fmt(result.platformFee)}
              </p>
            </div>

            <div className="pt-3 flex justify-between items-center bg-white/80 rounded-xl shadow-inner px-3 py-2 border border-emerald-100">
              <p className="font-bold text-gray-800 text-base">
                You Can Access Now
              </p>
              <p className="text-right font-extrabold text-green-700 text-xl">
                Ksh {fmt(result.accessibleNow)}
              </p>
            </div>
          </div>

          <div className="mt-4 bg-white/70 border border-green-200 rounded-lg p-2 text-xs text-gray-600 text-center shadow-sm">
            <p>
              <span className="font-semibold">Deductions →</span> NSSF: Ksh{" "}
              {fmt(result.deductions.NSSF)} | NHIF: Ksh{" "}
              {fmt(result.deductions.NHIF)} | Housing Levy: Ksh{" "}
              {fmt(result.deductions.Housing)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
