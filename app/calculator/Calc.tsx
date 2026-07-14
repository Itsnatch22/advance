"use client";
import React, { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  getCurrencyFromCountry,
  type CountryCode,
} from "@/lib/currency/currency";
import { TiltCard } from "@/components/shared/TiltCard";
import { PLATFORM_CONFIG } from "@/constants/config";

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

const currencyAccessConfig: Record<Country, { accessCapPercent: number }> = {
  KE: { accessCapPercent: 60 },
  UG: { accessCapPercent: 60 },
  TZ: { accessCapPercent: 30 },
  RW: { accessCapPercent: 45 },
};

const fmt = (n: number, locale = "en-KE") =>
  new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(n || 0));

const formatNumberInput = (value: string) => {
  const numeric = value.replace(/[^\d]/g, "");
  if (!numeric) return "";
  return Intl.NumberFormat("en-KE").format(Number(numeric));
};

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
        <div className="rounded-xl border border-emerald-100 bg-white p-3 text-sm shadow-lg ring-1 ring-slate-900/5">
          <p className="font-semibold text-emerald-700">{label}</p>
          <p className="text-slate-600">
            <span className="font-medium">{currencySymbol}</span>{" "}
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
      className="mt-8 h-64 w-full rounded-2xl border border-slate-100 bg-slate-50/50 p-4 shadow-inner"
    >
      <h4 className="mb-3 text-center text-sm font-semibold text-slate-700">
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
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.4} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: "#64748b" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#64748b" }}
            tickFormatter={(v) =>
              `${currencySymbol} ${fmt(v, locale).slice(0, -3)}k`
            }
            axisLine={false}
            tickLine={false}
            width={80}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "rgba(16, 185, 129, 0.06)" }}
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

  const [daysWorked, setDaysWorked] = useState<number>(0);
  const [result, setResult] = useState<CalcResult | null>(null);

  const [allowancesChecked, setAllowancesChecked] = useState<
    Record<string, boolean>
  >({});
  const [allowancesAmount, setAllowancesAmount] = useState<
    Record<string, number | "">
  >({});

  const [asOfDate, setAsOfDate] = useState<string>("");

  useEffect(() => {
    const today = new Date();
    setAsOfDate(today.toISOString().split("T")[0]);
  }, []);

  const maxDays = useMemo(() => {
    if (!asOfDate) return 31;
    const d = new Date(asOfDate);
    return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  }, [asOfDate]);

  useEffect(() => {
    if (!asOfDate) return;
    const d = new Date(asOfDate);
    setDaysWorked(d.getDate());
  }, [asOfDate]);

  useEffect(() => {
    setDaysWorked((prev) => (prev > maxDays ? maxDays : prev));
  }, [maxDays]);

  useEffect(() => {
    if (!salary) setResult(null);
  }, [salary]);

  useEffect(() => {
    if (Object.values(allowancesAmount).every((v) => v === "")) {
      setResult(null);
    }
  }, [allowancesAmount]);

  const feePercent = PLATFORM_CONFIG.FEE_PERCENT * 100;
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
      toast.error("Please fill in your salary");
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
        toast.error("Backend calculation failed!");
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

      const accessCapPercent = currencyAccessConfig[country].accessCapPercent;
      const gross = Number(data.gross ?? data.totalIncome ?? 0);
      const net = Number(data.netPay ?? data.net ?? 0);

      const accessCap = (net * accessCapPercent) / 100;
      const platformFee = (accessCap * feePercent) / 100;
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
      toast.error("Failed to connect to backend");
    }
  };

  const handleCountryChange = (code: Country) => {
    setCountry(code);
    setAllowancesChecked({});
    setAllowancesAmount({});
    setResult(null);
    setSalary("");

    const today = new Date();
    setDaysWorked(today.getDate());
  };

  const currencyDetails = getCurrencyFromCountry(country as CountryCode);
  const currencySymbol = currencyDetails.symbol;
  const locale = currencyDetails.localeStr;

  return (
    <TiltCard className="mx-auto w-full max-w-sm p-6 ring-1 ring-slate-900/5 sm:max-w-md md:max-w-lg">
      <h2 className="mb-5 text-center font-serif text-3xl font-bold tracking-tight text-slate-900">
        Wage Access Calculator
      </h2>

      {/* Country Selector */}
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
            aria-label={`Select ${f.code}`}
            className={`h-11 w-11 overflow-hidden rounded-full border-2 transition-all duration-300 ${
              country === f.code
                ? "scale-110 border-emerald-600 shadow-md shadow-emerald-500/20 ring-2 ring-emerald-500/20"
                : "border-slate-200 opacity-60 hover:opacity-100"
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

      {/* Salary Input */}
      <label
        htmlFor="salary-input"
        className="text-sm font-medium text-slate-700"
      >
        Gross Monthly Salary ({currencySymbol})
      </label>
      <input
        id="salary-input"
        type="text"
        placeholder="e.g. 60,000"
        className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all duration-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 sm:text-base"
        value={salary ? formatNumberInput(salary.toString()) : ""}
        onChange={(e) => {
          const raw = e.target.value.replace(/,/g, "");
          setSalary(raw === "" ? "" : Number(raw));
        }}
      />

      {/* Contributions */}
      <AnimatePresence mode="wait">
        <motion.div
          key={country}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-5"
        >
          <p className="mb-2.5 text-sm font-semibold text-slate-700">
            Other Contributions
          </p>
          {countryAllowances[country].map((a) => (
            <div
              key={a.key}
              className="mb-2 flex flex-wrap items-center gap-3 transition-all duration-300"
            >
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="accent-emerald-600"
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
                <span className="text-sm text-slate-600">{a.label}</span>
              </label>
              <input
                id={`allowance-${a.key}`}
                type="text"
                placeholder="Amount"
                aria-label={`Enter amount for ${a.label}`}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none transition-all duration-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 sm:text-base"
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

      {/* Days Slider */}
      <div className="mt-5">
        <label
          htmlFor="days-worked-input"
          className="text-sm font-medium text-slate-700"
        >
          Days worked this cycle
        </label>
        <input
          id="days-worked-input"
          type="range"
          min={0}
          max={maxDays}
          value={daysWorked}
          onChange={(e) => setDaysWorked(Number(e.target.value))}
          className="mt-2 w-full accent-emerald-600"
        />
        <div className="mt-1 flex justify-between text-xs text-slate-500">
          <span>
            {daysWorked} / {maxDays} days
          </span>
          <span>{percentOfCycle}% of cycle</span>
        </div>
      </div>

      {/* Calculate */}
      <button
        onClick={callBackendCalc}
        disabled={!salary}
        className="group mt-5 w-full rounded-xl bg-linear-to-r from-emerald-600 to-green-600 px-4 py-3 font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-emerald-500/30 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
      >
        Calculate
      </button>

      {/* Results */}
      <AnimatePresence mode="wait">
        {result && result.success && (
          <motion.div
            key={`${country}-result`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.45 }}
            className="mt-6 rounded-2xl border border-emerald-100 bg-linear-to-br from-emerald-50 via-green-50/60 to-white p-5 shadow-sm ring-1 ring-emerald-500/10"
          >
            <h3 className="mb-4 font-serif text-lg font-bold text-slate-900">
              Wage Summary
            </h3>

            <div className="space-y-2">
              {[
                { label: "Net Earnings", value: result.netMonthly },
                { label: "Accrued Earnings", value: result.accruedGross },
                {
                  label: `Access Cap (${result.accessCapPercent}%)`,
                  value: result.accessCap,
                },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="flex justify-between border-b border-emerald-100/70 pb-2"
                >
                  <p className="text-sm text-slate-600">{label}</p>
                  <p className="text-sm font-semibold text-emerald-700">
                    {currencySymbol} {fmt(value, locale)}
                  </p>
                </div>
              ))}

              <div className="flex justify-between border-b border-emerald-100/70 pb-2">
                <p className="text-sm text-slate-600">Platform Fee (5%)</p>
                <p className="text-sm font-semibold text-red-500">
                  − {currencySymbol} {fmt(result.platformFee, locale)}
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-emerald-200 bg-white/70 p-4 text-center ring-1 ring-emerald-500/10">
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
                You Can Access Now
              </p>
              <p className="mt-1 font-serif text-3xl font-extrabold text-emerald-700">
                {currencySymbol} {fmt(result.accessibleNow, locale)}
              </p>
            </div>

            <div className="mt-4 rounded-xl border border-slate-200 bg-white/70 p-4 text-xs leading-relaxed text-slate-600">
              <p className="mb-2 font-semibold uppercase tracking-wide text-slate-500">
                Formula
              </p>
              <div className="space-y-1.5">
                <p>
                  Accrued earnings = gross income × days worked ÷ {cycleDays}
                </p>
                <p>
                  Access cap = net earnings × {result.accessCapPercent}%
                </p>
                <p>
                  Available now = access cap − platform fee ({feePercent}%)
                </p>
              </div>
            </div>

            <div className="mt-3 text-center text-xs text-slate-500">
              <span className="font-semibold text-slate-600">
                Remittances →{" "}
              </span>
              {Object.entries(result.deductions)
                .map(
                  ([key, val]) =>
                    `${key}: ${currencySymbol} ${fmt(val, locale)}`
                )
                .join(" | ")}
            </div>

            <WageGraph
              result={result}
              currencySymbol={currencySymbol}
              locale={locale}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </TiltCard>
  );
}
