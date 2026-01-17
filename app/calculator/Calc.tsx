"use client";
import React, { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

// 📊 GRAPH IMPORTS (ADDED)
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
  TooltipProps,
} from "recharts";

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

const currencyMap: Record<
  Country,
  { symbol: string; locale: string; accessCapPercent: number }
> = {
  KE: { symbol: "KES", locale: "en-KE", accessCapPercent: 60 },
  UG: { symbol: "UGX", locale: "en-UG", accessCapPercent: 60 },
  TZ: { symbol: "TZS", locale: "en-TZ", accessCapPercent: 30 },
  RW: { symbol: "RWF", locale: "en-RW", accessCapPercent: 45 },
};

const fmt = (n: number, locale = "en-KE") =>
  new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(n || 0));

// 👉 FORMATTER FOR INPUT COMMAS
const formatNumberInput = (value: string) => {
  const numeric = value.replace(/[^\d]/g, "");
  if (!numeric) return "";
  return Intl.NumberFormat("en-KE").format(Number(numeric));
};

// 📊 CUSTOM GRAPH COMPONENT (INVESTOR WOW FACTOR)
const WageGraph = ({
  result,
  currencySymbol,
  locale,
}: {
  result: CalcResult;
  currencySymbol: string;
  locale: string;
}) => {
  const data = [
    { name: "Net Pay", value: result.netMonthly },
    { name: "Accrued", value: result.accruedGross },
    { name: "Access Cap", value: result.accessCap },
    { name: "Available", value: result.accessibleNow, isKey: true },
  ];

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-emerald-200 bg-white/80 p-3 text-sm shadow-lg backdrop-blur-sm dark:border-green-700 dark:bg-gray-800/80">
          <p className="font-bold text-emerald-700">{label}</p>
          <p className="text-gray-700 dark:text-gray-300">
            <span className="font-semibold">{currencySymbol}</span>{" "}
            {fmt(payload[0].value ?? 0, locale)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mt-8 h-64 w-full rounded-2xl border border-emerald-200 bg-gray-50/50 p-4 shadow-inner dark:border-green-800 dark:bg-gray-900/50"
    >
      <h4 className="mb-3 text-center text-base font-bold text-gray-700 dark:text-gray-200">
        Visual Breakdown
      </h4>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
        >
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.2} />
            </linearGradient>
            <linearGradient id="keyBarGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.9} />
              <stop offset="95%" stopColor="#059669" stopOpacity={0.4} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" opacity={0.2} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12, fill: "#6b7280" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "#6b7280" }}
            tickFormatter={(v) =>
              `${currencySymbol} ${fmt(v, locale).slice(0, -3)}k`
            }
            axisLine={false}
            tickLine={false}
            width={80}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "rgba(16, 185, 129, 0.1)" }}
          />
          <Bar dataKey="value" radius={[8, 8, 2, 2]}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  entry.isKey ? "url(#keyBarGradient)" : "url(#barGradient)"
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default function Calculator() {
  const [country, setCountry] = useState<Country>("KE");
  const [salary, setSalary] = useState<number | "">("");
  const cycleDays = 30;

  const [daysWorked, setDaysWorked] = useState<number>(0); // auto-set later
  const [result, setResult] = useState<CalcResult | null>(null);

  const [allowancesChecked, setAllowancesChecked] = useState<
    Record<string, boolean>
  >({});
  const [allowancesAmount, setAllowancesAmount] = useState<
    Record<string, number | "">
  >({});

  const [asOfDate, setAsOfDate] = useState<string>("");

  // → INTERNAL date (hidden) used to determine month days + today’s day
  useEffect(() => {
    const today = new Date();
    setAsOfDate(today.toISOString().split("T")[0]);
  }, []);

  // → Get max days in month
  const maxDays = useMemo(() => {
    if (!asOfDate) return 31;
    const d = new Date(asOfDate);
    return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  }, [asOfDate]);

  // → Auto-set slider to TODAY’S DAY (17, 25, etc.)
  useEffect(() => {
    if (!asOfDate) return;
    const d = new Date(asOfDate);
    setDaysWorked(d.getDate());
  }, [asOfDate]);

  // → Clamp if month changes
  useEffect(() => {
    if (daysWorked > maxDays) setDaysWorked(maxDays);
  }, [maxDays]);

  // → Kill results reactively
  useEffect(() => {
    if (!salary) setResult(null);
  }, [salary]);

  useEffect(() => {
    if (Object.values(allowancesAmount).every((v) => v === "")) {
      setResult(null);
    }
  }, [allowancesAmount]);

  // → Real-time calculation on slider move, only after initial calculation
  useEffect(() => {
    // Only proceed if a result has been calculated before
    if (result) {
      const handler = setTimeout(() => {
        if (typeof salary === "number" && salary > 0) {
          callBackendCalc();
        }
      }, 300); // Debounce for smoother slider experience

      return () => {
        clearTimeout(handler);
      };
    }
  }, [daysWorked]); // Dependency on only daysWorked

  const feePercent = 5;
  const percentOfCycle = useMemo(
    () => Math.min(100, Math.round((daysWorked / cycleDays) * 100)),
    [daysWorked]
  );

  const buildPayload = () => {
    const allowances = countryAllowances[country].reduce(
      (acc, item) => {
        acc[item.key] = allowancesChecked[item.key]
          ? Number(allowancesAmount[item.key] || 0)
          : 0;
        return acc;
      },
      {} as Record<string, number>
    );

    return {
      salary: Number(salary || 0),
      country,
      cycleDays,
      daysWorked,
      advanced: 0,
      feePercent,
      flatFee: 25,
      allowances,
    };
  };

  const callBackendCalc = async () => {
    if (!salary) {
      alert("Fill in salary fam");
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
        alert("Backend calculation failed!");
        return;
      }

      let deductions: Deductions = {};
      const payeAmount =
        data.payeAfterRelief ?? data.paye ?? data.payeBeforeRelief ?? 0;

      switch (country) {
        case "UG":
          deductions = {
            LST: data.lst ?? 0,
            "NSSF (Employee)": data.nssfEmployee ?? 0,
            "NSSF (Employer)": data.nssfEmployer ?? 0,
            PAYE: payeAmount,
          };
          break;

        case "TZ":
          const nhifEmployee = data.nhifEmployee ?? data.shif ?? 0;
          const nhifEmployer = data.nhifEmployer ?? 0;
          deductions = {
            "SDL (Employer)": data.sdl ?? 0,
            "WCF (Employer)": data.wcf ?? 0,
            "NHIF (Employer)": nhifEmployer,
            "NHIF (Employee)": nhifEmployee,
            "NSSF (Employer)": data.nssfEmployer ?? 0,
            "NSSF (Employee)": data.nssfEmployee ?? 0,
            PAYE: payeAmount,
          };
          break;

        case "RW":
          const rssbObj = data.rssb ?? {};
          deductions = {
            "RSSB Pension (Employee)": rssbObj.pensionEmployee ?? 0,
            "RSSB Medical (Employee)": rssbObj.medicalEmployee ?? 0,
            "RSSB Maternity (Employee)": rssbObj.maternityEmployee ?? 0,
            PAYE: payeAmount,
          };
          break;

        default:
          deductions = {
            "NSSF (Tier1+Tier2)": (data.nssf1 ?? 0) + (data.nssf2 ?? 0),
            "SHIF/NHIF": data.shif ?? data.nhif ?? 0,
            "Housing Levy": data.housingLevy ?? data.ahl ?? 0,
            PAYE: payeAmount,
          };
      }

      const accessCapPercent = currencyMap[country].accessCapPercent;
      const gross = Number(data.gross ?? data.totalIncome ?? 0);
      const net = Number(data.netPay ?? data.net ?? 0);

      const accessCap = (net * accessCapPercent) / 100;
      const platformFee = (accessCap * 5) / 100;
      const accessibleNow = accessCap - platformFee;

      const mapped: CalcResult = {
        success: true,
        accruedGross: gross,
        netMonthly: net,
        accessCapPercent,
        accessCap,
        platformFee,
        accessibleNow,
        deductions,
        payee: payeAmount,
      };

      setResult(mapped);
    } catch {
      alert("Failed to connect to backend");
    }
  };

  const handleCountryChange = (code: Country) => {
    setCountry(code);
    setAllowancesChecked({});
    setAllowancesAmount({});
    setResult(null);
    setSalary("");

    // Reset slider to today's date again
    const today = new Date();
    setDaysWorked(today.getDate());
  };

  const currency = currencyMap[country];
  const currencySymbol = currency.symbol;
  const locale = currency.locale;

  return (
    <div className="mx-auto mt-6 w-full max-w-sm rounded-2xl border border-green-100 bg-white p-6 shadow-2xl sm:max-w-md md:max-w-lg dark:border-green-800 dark:bg-gray-900">
      <h2 className="mb-5 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">
        Wage Access Calculator
      </h2>

      {/* 🌍 Country Selector */}
      <div className="mb-6 flex items-center justify-center gap-4">
        {[
          { code: "KE", flag: "/flag/KE.png" },
          { code: "UG", flag: "/flag/UG.png" },
          { code: "TZ", flag: "/flag/TZ.png" },
          { code: "RW", flag: "/flag/RW.png" },
        ].map((f) => (
          <button
            key={f.code}
            onClick={() => handleCountryChange(f.code as Country)}
            className={`h-11 w-11 overflow-hidden rounded-full border-2 transition-all duration-300 ${
              country === f.code
                ? "scale-110 border-emerald-600 shadow-md"
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

      {/* 💰 Salary Input */}
      <label className="text-sm text-gray-600 dark:text-gray-300">
        Gross Monthly Salary ({currencySymbol})
      </label>
      <input
        type="text"
        placeholder="e.g. 60,000"
        className="mt-1 w-full rounded-lg border border-gray-300 bg-white p-2 text-sm text-gray-900 focus:ring-emerald-500/60 sm:text-base dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
        value={salary ? formatNumberInput(salary.toString()) : ""}
        onChange={(e) => {
          const raw = e.target.value.replace(/,/g, "");
          setSalary(raw === "" ? "" : Number(raw));
        }}
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
          <p className="mb-2 text-sm font-semibold">Other Contributions</p>
          {countryAllowances[country].map((a) => (
            <div
              key={a.key}
              className="mb-1 flex flex-wrap items-center gap-3 transition-all duration-300"
            >
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={!!allowancesChecked[a.key]}
                  onChange={(e) => {
                    setAllowancesChecked((s) => ({
                      ...s,
                      [a.key]: e.target.checked,
                    }));
                    if (!e.target.checked) {
                      setAllowancesAmount((s) => ({ ...s, [a.key]: "" }));
                    }
                  }}
                />
                <span className="text-sm">{a.label}</span>
              </label>
              <input
                type="text"
                className="mt-1 w-full rounded-lg border p-2 text-sm focus:ring-emerald-500/60 sm:text-base"
                value={
                  allowancesAmount[a.key]
                    ? formatNumberInput(allowancesAmount[a.key]!.toString())
                    : ""
                }
                disabled={!allowancesChecked[a.key]}
                onChange={(e) =>
                  setAllowancesAmount((s) => {
                    const raw = e.target.value.replace(/,/g, "");
                    return { ...s, [a.key]: raw === "" ? "" : Number(raw) };
                  })
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
          className="mt-2 w-full accent-emerald-600"
        />
        <div className="mt-1 flex justify-between text-[11px] text-gray-500 sm:text-xs">
          <span>
            {daysWorked} / {maxDays} days
          </span>
          <span>{percentOfCycle}% of cycle</span>
        </div>
      </div>

      {/* 🔢 Calculate */}
      <button
        onClick={callBackendCalc}
        disabled={!salary}
        className="mt-5 w-full rounded-xl bg-gradient-to-r from-green-600 to-emerald-500 px-4 py-2.5 font-semibold text-white shadow transition-transform hover:scale-[1.02] active:scale-[0.99] disabled:opacity-60"
      >
        Calculate
      </button>

      {/* 📊 Results */}
      <AnimatePresence mode="wait">
        {result && result.success && (
          <motion.div
            key={`${country}-result`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.45 }}
            className="mt-6 rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-green-50 to-white p-5 shadow-lg dark:border-green-700 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800"
          >
            <h3 className="mb-3 text-lg font-extrabold text-green-800">
              Wage Summary
            </h3>

            <div className="flex justify-between border-b pb-1">
              <p>
                <b>Net Earnings</b>
              </p>
              <p className="font-semibold text-emerald-700">
                {currencySymbol} {fmt(result.netMonthly, locale)}
              </p>
            </div>

            <div className="flex justify-between border-b pb-1">
              <p>Accrued Earnings</p>
              <p className="font-semibold text-emerald-700">
                {currencySymbol} {fmt(result.accruedGross, locale)}
              </p>
            </div>

            <div className="flex justify-between border-b pb-1">
              <p>Access Cap ({result.accessCapPercent}%)</p>
              <p className="font-semibold text-emerald-700">
                {currencySymbol} {fmt(result.accessCap, locale)}
              </p>
            </div>

            <div className="flex justify-between border-b pb-1">
              <p>Platform Fee (5%)</p>
              <p className="font-semibold text-red-500">
                - {currencySymbol} {fmt(result.platformFee, locale)}
              </p>
            </div>

            <div className="mt-4 rounded-xl border border-green-200 bg-white/60 p-3 text-center dark:bg-gray-800/70">
              <p className="text-sm font-semibold text-emerald-800">
                You Can Access Now
              </p>
              <p className="mt-1 text-3xl font-extrabold text-emerald-700">
                {currencySymbol} {fmt(result.accessibleNow, locale)}
              </p>
            </div>

            <div className="mt-3 text-center text-xs text-gray-600">
              <p>
                <span className="font-semibold">Remittances → </span>
                {Object.entries(result.deductions)
                  .map(
                    ([key, val]) =>
                      `${key}: ${currencySymbol} ${fmt(val, locale)}`
                  )
                  .join(" | ")}
              </p>
            </div>

            <WageGraph
              result={result}
              currencySymbol={currencySymbol}
              locale={locale}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
