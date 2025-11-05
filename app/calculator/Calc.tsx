"use client";
import React, { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

type Country = "KE" | "UG" | "TZ" | "RW";

const countryAllowances: Record<Country, { key: string; label: string }[]> = {
  KE: [
    { key: "otherRemuneration", label: "Other Remuneration" },
    { key: "mealAllowance", label: "Meal Allowance" },
    { key: "nightAllowance", label: "Night Out Allowance" },
    { key: "pensionCover", label: "Pension Cover" },
    { key: "medicalCover", label: "Medical Cover" },
  ],
  UG: [
    { key: "otherRemuneration", label: "Other Remuneration (Employer)" },
    { key: "businessTravel", label: "Business Travel Allowance" },
    { key: "pensionCover", label: "Pension Cover (Employer)" },
    { key: "medicalCover", label: "Medical Cover (Employer)" },
    { key: "lifeInsurance", label: "Life Insurance (Employer)" },
  ],
  TZ: [
    { key: "otherRemuneration", label: "Other Remuneration (Employer)" },
    { key: "businessTravel", label: "Business Travel Allowance" },
    { key: "housingAllowance", label: "Housing Allowance (Employer)" },
    { key: "medicalCover", label: "Medical Cover (Employer)" },
  ],
  RW: [
    { key: "otherRemuneration", label: "Other Remuneration (Employer)" },
    { key: "businessTravel", label: "Business Travel Allowance" },
    { key: "medicalCover", label: "Medical Cover (Employer)" },
  ],
};

type Deductions = Record<string, number>;
type CalcResult = {
  success: boolean;
  accruedGross: number;
  netMonthly: number;
  accessCapPercent: number;
  accessCap: number;
  platformFee: number;
  accessibleNow: number;
  deductions: Deductions;
  payee: number;
};

const fmt = (n: number) =>
  new Intl.NumberFormat("en-KE", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(n));

export default function Calculator() {
  const [country, setCountry] = useState<Country>("KE");
  const [salary, setSalary] = useState<number | "">("");
  const [daysWorked, setDaysWorked] = useState<number>(0);
  const [result, setResult] = useState<CalcResult | null>(null);

  const [allowancesChecked, setAllowancesChecked] = useState<Record<string, boolean>>({});
  const [allowancesAmount, setAllowancesAmount] = useState<Record<string, number | "">>({});
  const [asOfDate, setAsOfDate] = useState<string>("");

  useEffect(() => {
    const today = new Date();
    setAsOfDate(today.toISOString().split("T")[0]);
  }, []);

  const maxDays = useMemo(() => {
    if (!asOfDate) return 31;
    const date = new Date(asOfDate);
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  }, [asOfDate]);

  const cycleDays = 30;
  const feePercent = 5; // constant
  const percentOfCycle = useMemo(
    () => Math.min(100, Math.round((Number(daysWorked || 0) / cycleDays) * 100)),
    [daysWorked]
  );

  const buildPayload = () => {
    const allowances = countryAllowances[country].reduce((acc, item) => {
      acc[item.key] = allowancesChecked[item.key]
        ? Number(allowancesAmount[item.key] || 0)
        : 0;
      return acc;
    }, {} as Record<string, number>);
    return {
      salary: Number(salary || 0),
      country,
      cycleDays,
      daysWorked: Number(daysWorked || 0),
      advanced: 0,
      feePercent,
      flatFee: 25,
      allowances,
    };
  };

  const callBackendCalc = async () => {
    if (!salary) {
      alert("Fill in salary");
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

      if (!data.success) {
        console.error("❌ Backend failed:", data.error || data.detail);
        alert("Backend calculation failed!");
        return;
      }

      let deductions: Deductions;
      switch (country) {
        case "UG":
          deductions = {
            "LST Deductible": data.lst || 0,
            "NSSF Employee": data.nssfEmployee || 0,
            "NSSF Employer": data.nssfEmployer || 0,
            Payee: data.payee || 0,
          };
          break;
        case "TZ":
          deductions = {
            "SDL Employer": data.sdl || 0,
            "WCF Employer": data.wcf || 0,
            "UHI NHIF Employer": data.nhifEmployer || 0,
            "UHI NHIF Employee": data.nhifEmployee || 0,
            "NSSF Employer": data.nssfEmployer || 0,
            "NSSF Employee": data.nssfEmployee || 0,
            Payee: data.payee || 0,
          };
          break;
        case "RW":
          deductions = {
            "RSSB Medical Insurance": data.rssbMedical || 0,
            "RSSB Maternity": data.rssbMaternity || 0,
            "RSSB Pension": data.rssbPension || 0,
            Payee: data.payee || 0,
          };
          break;
        default: // Kenya
          deductions = {
            NSSF: (data.nssf1 || 0) + (data.nssf2 || 0),
            SHIF: data.shif || 0,
            Housing: data.ahl || 0,
            Payee: data.payee || 0,
          };
      }

      const accessCapPercent = country === "TZ" ? 30 : 60;
      const gross = data.gross || 0;
      const net = data.net || 0;
      const accessCap = (net * accessCapPercent) / 100;
      const platformFee = (accessCap * 5) / 100;

      const mappedResult: CalcResult = {
        success: true,
        accruedGross: gross,
        netMonthly: net,
        accessCapPercent,
        accessCap,
        platformFee,
        accessibleNow: accessCap - platformFee,
        deductions,
        payee: data.payee || 0,
      };

      setResult(mappedResult);
    } catch (err) {
      console.error("⚠️ Frontend fetch failed:", err);
      alert("Failed to connect to backend");
    }
  };

  // 🔁 Reset everything when switching country
  const handleCountryChange = (code: Country) => {
    setCountry(code);
    setAllowancesChecked({});
    setAllowancesAmount({});
    setResult(null);
    setSalary("");
    setDaysWorked(0);
  };

  const currencySymbol =
    country === "KE"
      ? "KES"
      : country === "UG"
      ? "UGX"
      : country === "TZ"
      ? "TZS"
      : "RWF";

  return (
    <div className="bg-white dark:bg-gray-900 w-full max-w-sm sm:max-w-md md:max-w-lg rounded-2xl shadow-2xl p-6 border border-green-100 dark:border-green-800 mx-auto mt-6">
      <h2 className="text-3xl font-extrabold mb-5 text-center text-gray-900 dark:text-gray-100">
        Wage Access Calculator
      </h2>

      {/* 🌍 Country Selector */}
      <div className="flex justify-center items-center gap-4 mb-6">
        {[
          { code: "KE", flag: "/flag/KE.png" },
          { code: "UG", flag: "/flag/UG.png" },
          { code: "TZ", flag: "/flag/TZ.png" },
          { code: "RW", flag: "/flag/RW.png" },
        ].map((f) => (
          <button
            key={f.code}
            onClick={() => handleCountryChange(f.code as Country)}
            className={`w-11 h-11 rounded-full overflow-hidden border-2 transition-all duration-300 ${
              country === f.code
                ? "border-emerald-600 scale-110 shadow-md"
                : "border-gray-300 opacity-70 hover:opacity-100"
            }`}
          >
            <Image src={f.flag} alt={f.code} width={44} height={44} className="object-cover" />
          </button>
        ))}
      </div>

      <p className="text-center text-sm font-medium text-gray-600 mb-4">
        Selected Country:{" "}
        <span className="font-bold text-emerald-700">{country}</span> ({currencySymbol})
      </p>

      {/* 💰 Salary Input */}
      <label className="text-sm text-gray-600 dark:text-gray-300">
        Gross Monthly Salary ({currencySymbol})
      </label>
      <input
        type="number"
        min={0}
        placeholder="e.g. 60000"
        className="mt-1 w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg p-2 text-sm sm:text-base focus:ring-emerald-500/60"
        value={salary}
        onChange={(e) => setSalary(e.target.value ? +e.target.value : "")}
      />

      {/* ⚡ Contributions */}
      <AnimatePresence mode="wait">
        <motion.div
          key={country}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-5"
        >
          <p className="text-sm font-semibold mb-2">Other Contributions</p>
          {countryAllowances[country].map((a) => (
            <div key={a.key} className="flex flex-wrap items-center gap-3 mb-1 transition-all duration-300">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={!!allowancesChecked[a.key]}
                  onChange={(e) =>
                    setAllowancesChecked((s) => ({ ...s, [a.key]: e.target.checked }))
                  }
                />
                <span className="text-sm">{a.label}</span>
              </label>
              <input
                type="number"
                min={0}
                className="mt-1 w-full border rounded-lg p-2 text-sm sm:text-base focus:ring-emerald-500/60"
                value={allowancesAmount[a.key] || ""}
                disabled={!allowancesChecked[a.key]}
                onChange={(e) =>
                  setAllowancesAmount((s) => ({
                    ...s,
                    [a.key]: e.target.value ? +e.target.value : "",
                  }))
                }
              />
            </div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* 🗓 Days Slider */}
      <div className="mt-5">
        <label className="text-sm text-gray-600">Days worked (drag)</label>
        <input
          type="range"
          min={0}
          max={maxDays}
          value={daysWorked}
          onChange={(e) => setDaysWorked(Number(e.target.value))}
          className="w-full mt-2 accent-emerald-600"
        />
        <div className="flex justify-between text-[11px] sm:text-xs text-gray-500 mt-1">
          <span>{daysWorked} / {maxDays} days</span>
          <span>{percentOfCycle}% of cycle</span>
        </div>
      </div>

      {/* 🔢 Calculate */}
      <button
        onClick={callBackendCalc}
        disabled={!salary}
        className="mt-5 bg-gradient-to-r from-green-600 to-emerald-500 text-white font-semibold py-2.5 px-4 rounded-xl shadow hover:scale-[1.02] active:scale-[0.99] transition-transform w-full disabled:opacity-60"
      >
        Calculate
      </button>

      {/* 📊 Results */}
      <AnimatePresence mode="wait">
        {result && result.success && (
          <motion.div
            key={`${country}-result`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-6 bg-gradient-to-br from-emerald-50 via-green-50 to-white dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 border border-emerald-200 dark:border-green-700 rounded-2xl p-5 shadow-lg"
          >
            <h3 className="font-extrabold text-green-800 text-lg mb-3">Wage Summary</h3>

            <div className="flex justify-between border-b pb-1">
              <p><b>Net Earnings</b></p>
              <p className="font-semibold text-emerald-700">
                {currencySymbol} {fmt(result.netMonthly)}
              </p>
            </div>

            <div className="flex justify-between border-b pb-1">
              <p>Accrued Earnings</p>
              <p className="font-semibold text-emerald-700">
                {currencySymbol} {fmt(result.accruedGross)}
              </p>
            </div>

            <div className="flex justify-between border-b pb-1">
              <p>Access Cap ({result.accessCapPercent}%)</p>
              <p className="font-semibold text-emerald-700">
                {currencySymbol} {fmt(result.accessCap)}
              </p>
            </div>

            <div className="flex justify-between border-b pb-1">
              <p>Platform Fee (5%)</p>
              <p className="font-semibold text-red-500">
                - {currencySymbol} {fmt(result.platformFee)}
              </p>
            </div>

            <div className="flex justify-between border-b pb-1">
              <p><b>Payee</b></p>
              <p className="font-semibold text-red-500">
                - {currencySymbol} {fmt(result.payee)}
              </p>
            </div>

            <div className="mt-4 bg-white/60 dark:bg-gray-800/70 border border-green-200 rounded-xl p-3 text-center">
              <p className="text-sm text-emerald-800 font-semibold">You Can Access Now</p>
              <p className="text-3xl font-extrabold text-emerald-700 mt-1">
                {currencySymbol} {fmt(result.accessibleNow)}
              </p>
            </div>

            <div className="mt-3 text-xs text-gray-600 text-center">
              <p>
                <span className="font-semibold">Remittances → </span>
                {Object.entries(result.deductions)
                  .map(([key, val]) => `${key}: ${currencySymbol} ${fmt(val)}`)
                  .join(" | ")}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
