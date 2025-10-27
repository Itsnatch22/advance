"use client";
import React, { useMemo, useState } from "react";
import Image from "next/image";

type AllowanceKey =
  | "otherRemuneration"
  | "mealAllowance"
  | "nightAllowance"
  | "pensionCover"
  | "medicalCover";

type AllowancesChecked = Record<AllowanceKey, boolean>;
type AllowancesAmount = Record<AllowanceKey, number | "">;

type Country = "KE" | "UG" | "TZ" | "ZA";

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
  new Intl.NumberFormat("en-KE", { maximumFractionDigits: 0 }).format(
    Math.round(n)
  );

export default function Calculator() {
  const [salary, setSalary] = useState<number | "">("");
  const [daysWorked, setDaysWorked] = useState<number>(0);
  const [result, setResult] = useState<CalcResult | null>(null);
  const [country, setCountry] = useState<Country>("KE");

  const feePercent = 5;
  const flatFee = 25;
  const cycleDays = 30;

  const [allowancesChecked, setAllowancesChecked] = useState<AllowancesChecked>({
    otherRemuneration: false,
    mealAllowance: false,
    nightAllowance: false,
    pensionCover: false,
    medicalCover: false,
  });

  const [allowancesAmount, setAllowancesAmount] = useState<
    Record<AllowanceKey, number | "">
  >({
    otherRemuneration: "",
    mealAllowance: "",
    nightAllowance: "",
    pensionCover: "",
    medicalCover: "",
  });

  const percentOfCycle = useMemo(() => {
    return Math.min(100, Math.round((Number(daysWorked || 0) / cycleDays) * 100));
  }, [daysWorked]);

  const buildPayload = () => ({
    salary: Number(salary || 0),
    country,
    cycleDays,
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
      setResult(null);
      return;
    }

    const payload = buildPayload();
    try {
      const res = await fetch(`/api/calc?country=${country}`, {
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

  React.useEffect(() => {
    if (!salary) setResult(null);
  }, [salary]);

  const currencySymbol =
    country === "KE"
      ? "KES"
      : country === "UG"
      ? "UGX"
      : country === "TZ"
      ? "TZS"
      : "ZAR";

  return (
    <div className="bg-white w-full max-w-sm sm:max-w-md md:max-w-lg rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 border border-green-100 mx-auto mt-4 sm:mt-6 md:mt-8">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-3 sm:mb-5 text-gray-900 text-center">
        Wage Access Calculator 💼
      </h2>

      {/* FLAGS SECTION */}
      <div className="flex justify-center items-center gap-3 sm:gap-4 mb-5 sm:mb-6">
        {[
          { code: "KE", flag: "/flag/KE.png" },
          { code: "UG", flag: "/flag/UG.png" },
          { code: "TZ", flag: "/flag/TZ.png" },
          { code: "ZA", flag: "/flag/SA.png" },
        ].map((f) => (
          <button
            key={f.code}
            onClick={() => setCountry(f.code as Country)}
            className={`w-11 h-11 rounded-full overflow-hidden border-2 transition-all duration-200 ${
              country === f.code
                ? "border-emerald-600 scale-110 shadow-md"
                : "border-gray-300 opacity-70 hover:opacity-100"
            }`}
          >
            <Image
              src={f.flag}
              alt={f.code}
              width={44}
              height={44}
              className="object-cover"
            />
          </button>
        ))}
      </div>

      <p className="text-center text-xs sm:text-sm font-medium text-gray-600 mb-3 sm:mb-4">
        Selected Country:{" "}
        <span className="font-bold text-emerald-700">{country}</span> (
        {currencySymbol})
      </p>

      <div className="grid gap-4 sm:gap-5">
        {/* SALARY INPUT */}
        <div>
          <label htmlFor="salary" className="text-sm text-gray-600">
            Gross Monthly Salary ({currencySymbol})
          </label>
          <input
            id="salary"
            inputMode="numeric"
            min={0}
            type="number"
            placeholder="e.g. 60000"
            className="mt-1 w-full border rounded-lg p-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-emerald-500/60"
            value={salary}
            onChange={(e) => setSalary(e.target.value ? +e.target.value : "")}
          />
          {!salary && (
            <p className="mt-1 text-xs text-amber-600">
              Enter your gross salary to begin.
            </p>
          )}
        </div>

        {/* ALLOWANCES SECTION */}
        <div className="grid gap-2 mt-2 sm:mt-4">
          <p className="text-sm font-semibold">
            Allowances (toggle + enter amount)
          </p>
          {(
            [
              {
                key: "otherRemuneration",
                label: "Other Remuneration ",
              },
              { key: "mealAllowance", label: "Meal Allowance" },
              { key: "nightAllowance", label: "Night Out Allowance" },
              { key: "pensionCover", label: "Pension Cover" },
              { key: "medicalCover", label: "Medical Cover" },
            ] as const
          ).map((a) => (
            <div key={a.key} className="flex flex-wrap items-center gap-3">
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
                inputMode="numeric"
                min={0}
                className="ml-auto w-28 sm:w-36 md:w-44 border rounded-lg p-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-emerald-500/60 disabled:bg-gray-100"
                value={allowancesAmount[a.key as AllowanceKey]}
                disabled={!allowancesChecked[a.key as AllowanceKey]}
                onChange={(e) =>
                  setAllowancesAmount((s) => ({
                    ...s,
                    [a.key as AllowanceKey]: e.target.value
                      ? +e.target.value
                      : "",
                  }))
                }
              />
            </div>
          ))}
        </div>

        {/* DAYS WORKED SLIDER */}
        <div>
          <label htmlFor="days" className="text-sm text-gray-600">
            Days worked (drag)
          </label>
          <input
            id="days"
            type="range"
            min={0}
            max={cycleDays}
            value={daysWorked}
            onChange={(e) => setDaysWorked(Number(e.target.value))}
            className="w-full mt-2 accent-emerald-600"
          />
          <div className="flex justify-between text-[11px] sm:text-xs text-gray-500 mt-1">
            <span>{daysWorked} days</span>
            <span>{percentOfCycle}% of cycle</span>
          </div>
        </div>

        {/* CALCULATE BUTTON */}
        <button
          onClick={callBackendCalc}
          className="mt-3 bg-gradient-to-r from-green-600 to-emerald-500 text-white font-semibold py-2.5 px-4 rounded-xl shadow hover:scale-[1.02] active:scale-[0.99] transition-transform w-full disabled:opacity-60"
          disabled={!salary}
        >
          Calculate
        </button>
      </div>

      {/* RESULTS SECTION */}
      {result && result.success && (
        <div className="mt-6 sm:mt-8 bg-gradient-to-br from-emerald-50 via-green-50 to-white border border-emerald-200 rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg">
          <h3 className="font-extrabold text-green-800 text-base sm:text-xl mb-2 sm:mb-4">
            Wage Summary
          </h3>

          <div className="space-y-2 sm:space-y-3 text-[13px] sm:text-sm">
            <div className="flex justify-between gap-3 border-b border-green-100 pb-1">
              <p>Accrued Earnings</p>
              <p className="font-semibold text-emerald-700">
                {currencySymbol} {fmt(result.accruedGross)}
              </p>
            </div>
            <div className="flex justify-between gap-3 border-b border-green-100 pb-1">
              <p>Net Salary (After Deductions + Allowances)</p>
              <p className="font-semibold text-emerald-700">
                {currencySymbol} {fmt(result.netMonthly)}
              </p>
            </div>
            <div className="flex justify-between gap-3 border-b border-green-100 pb-1">
              <p>Access Cap ({result.accessCapPercent}%)</p>
              <p className="font-semibold text-emerald-700">
                {currencySymbol} {fmt(result.accessCap)}
              </p>
            </div>
            <div className="flex justify-between gap-3 border-b border-green-100 pb-1">
              <p>Platform Fee (5%)</p>
              <p className="font-semibold text-red-500">
                - {currencySymbol} {fmt(result.platformFee)}
              </p>
            </div>
            <div className="pt-3 flex flex-wrap justify-between items-center gap-3 bg-white/80 rounded-xl shadow-inner px-3 py-2 border border-emerald-100">
              <p className="font-bold text-gray-800 text-sm sm:text-base">
                You Can Access Now
              </p>
              <p className="text-right font-extrabold text-green-700 text-lg sm:text-xl">
                {currencySymbol} {fmt(result.accessibleNow)}
              </p>
            </div>
          </div>

          <div className="mt-3 sm:mt-4 bg-white/70 border border-green-200 rounded-lg p-2 text-[10px] sm:text-xs text-gray-600 text-center shadow-sm">
            <p>
              <span className="font-semibold">Deductions →</span> NSSF:{" "}
              {currencySymbol} {fmt(result.deductions.NSSF)} | SHIF:{" "}
              {currencySymbol} {fmt(result.deductions.SHIF)} | Housing Lev:{" "}
              {currencySymbol} {fmt(result.deductions.Housing)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
