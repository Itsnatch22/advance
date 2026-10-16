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
    { key: "otherRemuneration", label: "Other Taxable Cash Earnings" },
    { key: "mealAllowance", label: "Taxable Meal Allowance" },
    { key: "nightAllowance", label: "Taxable Night-out Allowance" },
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
  taxableIncome?: number;
  cashShortfall?: number;
  accessCapPercent: number;
  accessCap: number;
  platformFee: number;
  accessibleNow: number;
  deductions: Deductions;
  employerContributions?: Deductions;
  ruleVersion?: string;
  effectiveFrom?: string;
  engineVersion?: string;
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
    minimumFractionDigits: locale === "en-KE" ? 2 : 0,
    maximumFractionDigits: 2,
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
            tickFormatter={(v) => `${currencySymbol} ${Math.round(v / 1000)}k`}
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

  const [daysWorked, setDaysWorked] = useState<number>(0);
  const [result, setResult] = useState<CalcResult | null>(null);

  const [allowancesChecked, setAllowancesChecked] = useState<
    Record<string, boolean>
  >({});
  const [allowancesAmount, setAllowancesAmount] = useState<
    Record<string, number | "">
  >({});
  const [pensionableEarnings, setPensionableEarnings] = useState<number | "">(
    ""
  );
  const [residentForTax, setResidentForTax] = useState(false);
  const [allowableDeductions, setAllowableDeductions] = useState<
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
  const cycleDays = country === "KE" ? maxDays : 30;

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
    [daysWorked, cycleDays]
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
      ...(country === "KE"
        ? {
            pensionableEarnings:
              pensionableEarnings === "" ? undefined : pensionableEarnings,
            residentForTax,
            allowableDeductions: {
              pensionContributions: Number(
                allowableDeductions.pensionContributions || 0
              ),
              mortgageInterest: Number(
                allowableDeductions.mortgageInterest || 0
              ),
              postRetirementMedicalFund: Number(
                allowableDeductions.postRetirementMedicalFund || 0
              ),
            },
          }
        : {}),
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
            PAYE: payeAmount,
          };
          break;

        case "TZ":
          const nhifEmployee = data.nhifEmployee ?? data.shif ?? 0;
          deductions = {
            "NHIF (Employee)": nhifEmployee,
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
            SHIF: data.shif ?? data.nhif ?? 0,
            "Housing Levy": data.housingLevy ?? data.ahl ?? 0,
            "Pension contributions":
              data.employeeDeductions?.pensionContributions ?? 0,
            "Mortgage interest": data.employeeDeductions?.mortgageInterest ?? 0,
            "Post-retirement medical fund":
              data.employeeDeductions?.postRetirementMedicalFund ?? 0,
            PAYE: payeAmount,
          };
      }

      const accessCapPercent = currencyAccessConfig[country].accessCapPercent;
      const gross = Number(data.gross ?? data.totalIncome ?? 0);
      const net = Number(data.netPay ?? data.net ?? 0);

      const accessCap = (net * accessCapPercent) / 100;
      const platformFee = (accessCap * feePercent) / 100;
      const accessibleNow = accessCap - platformFee;
      const employerContributions: Deductions =
        country === "KE"
          ? {
              "NSSF (Employer)": data.employerContributions?.nssf ?? 0,
              "Housing Levy (Employer)":
                data.employerContributions?.housingLevy ?? 0,
            }
          : country === "UG"
            ? { "NSSF (Employer)": data.nssfEmployer ?? 0 }
            : country === "TZ"
              ? {
                  "NSSF (Employer)": data.nssfEmployer ?? 0,
                  "SDL (Employer)": data.sdl ?? 0,
                  "WCF (Employer)": data.wcf ?? 0,
                }
              : {
                  "RSSB Pension (Employer)": data.rssb?.pensionEmployer ?? 0,
                  "RSSB Medical (Employer)": data.rssb?.medicalEmployer ?? 0,
                  "RSSB Maternity (Employer)":
                    data.rssb?.maternityEmployer ?? 0,
                };

      const mapped: CalcResult = {
        success: true,
        accruedGross: gross,
        netMonthly: net,
        taxableIncome: data.taxableIncome,
        cashShortfall: data.cashShortfall,
        accessCapPercent,
        accessCap,
        platformFee,
        accessibleNow,
        deductions,
        employerContributions,
        ruleVersion: data.ruleVersion,
        effectiveFrom: data.effectiveFrom,
        engineVersion: data.engineVersion,
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
    setPensionableEarnings("");
    setResidentForTax(false);
    setAllowableDeductions({});
    setResult(null);
    setSalary("");

    const today = new Date();
    setDaysWorked(today.getDate());
  };

  const currencyDetails = getCurrencyFromCountry(country as CountryCode);
  const currencySymbol = currencyDetails.symbol;
  const locale = currencyDetails.localeStr;

  return (
    <TiltCard className="mx-auto w-full max-w-6xl p-5 ring-1 ring-slate-900/5 sm:p-7">
      <h2 className="mb-2 text-center font-serif text-3xl font-bold tracking-tight text-slate-900">
        Wage Access Calculator
      </h2>
      <p className="mb-5 text-center text-sm text-slate-500">
        Estimate pay and available wage access for{" "}
        <span className="font-semibold text-slate-700">{country}</span>
        {" · "}
        {currencyDetails.code} · Monthly
        <span className="mt-1 block text-xs">
          Changing country clears the figures entered for the current country.
        </span>
      </p>

      {/* Country Selector */}
      <div
        className="mb-6 flex items-center justify-center gap-4"
        role="group"
        aria-label="Choose calculator country"
      >
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
            aria-pressed={country === f.code}
            className={`h-11 w-11 overflow-hidden rounded-full border-2 transition-all duration-300 ${
              country === f.code
                ? "scale-110 border-emerald-600 shadow-md ring-2 shadow-emerald-500/20 ring-emerald-500/20"
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

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.9fr)]">
        <div className="space-y-5">
          <section
            aria-labelledby="earnings-heading"
            className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5"
          >
            <h3
              id="earnings-heading"
              className="mb-4 text-sm font-semibold text-slate-800"
            >
              Earnings and pay period
            </h3>
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
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-all duration-200 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 sm:text-base"
              value={salary ? formatNumberInput(salary.toString()) : ""}
              onChange={(e) => {
                const raw = e.target.value.replace(/,/g, "");
                setSalary(raw === "" ? "" : Number(raw));
              }}
            />

            <details className="mt-4 rounded-xl border border-slate-200 px-4 py-3">
              <summary className="cursor-pointer text-sm font-semibold text-slate-700">
                Additional earnings and allowances
              </summary>
              <AnimatePresence mode="wait">
                <motion.div
                  key={country}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="mt-3"
                >
                  <p className="mb-2 text-xs leading-relaxed text-slate-500">
                    {country === "KE"
                      ? "Enter only taxable cash earnings for the selected allowance."
                      : "Optional inputs available for this market."}
                  </p>
                  {countryAllowances[country].map((a) => (
                    <div
                      key={a.key}
                      className="mb-3 grid gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(8rem,0.7fr)] sm:items-center"
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
                              setAllowancesAmount((s) => ({
                                ...s,
                                [a.key]: "",
                              }));
                            }
                          }}
                        />
                        <span className="text-sm text-slate-600">
                          {a.label}
                        </span>
                      </label>
                      <input
                        id={`allowance-${a.key}`}
                        type="text"
                        inputMode="numeric"
                        placeholder="Amount"
                        aria-label={`Enter amount for ${a.label}`}
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 transition-all outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                        value={
                          allowancesAmount[a.key]
                            ? formatNumberInput(
                                allowancesAmount[a.key]!.toString()
                              )
                            : ""
                        }
                        disabled={!allowancesChecked[a.key]}
                        onChange={(e) =>
                          setAllowancesAmount((s) => {
                            const raw = e.target.value.replace(/,/g, "");
                            return {
                              ...s,
                              [a.key]: raw === "" ? "" : Number(raw),
                            };
                          })
                        }
                      />
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </details>

            {country === "KE" && (
              <details className="mt-4 rounded-xl border border-slate-200 px-4 py-3">
                <summary className="cursor-pointer text-sm font-semibold text-slate-700">
                  Tax eligibility and other deductions
                </summary>
                <div className="mt-3 space-y-3">
                  <p className="text-xs leading-relaxed text-slate-500">
                    Optional details used only for the Kenya estimate.
                  </p>
                  <label className="block text-sm text-slate-600">
                    Pensionable monthly earnings (optional; defaults to gross
                    earnings)
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="Defaults to salary plus allowances"
                      className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                      value={
                        pensionableEarnings === ""
                          ? ""
                          : formatNumberInput(pensionableEarnings.toString())
                      }
                      onChange={(event) => {
                        const raw = event.target.value.replace(/,/g, "");
                        setPensionableEarnings(raw === "" ? "" : Number(raw));
                      }}
                    />
                  </label>
                  <label className="flex items-start gap-2 text-sm text-slate-600">
                    <input
                      type="checkbox"
                      className="mt-1 accent-emerald-600"
                      checked={residentForTax}
                      onChange={(event) =>
                        setResidentForTax(event.target.checked)
                      }
                    />
                    <span>
                      I am eligible for Kenyan resident personal relief (KES
                      2,400 per month).
                    </span>
                  </label>
                  {[
                    {
                      key: "pensionContributions",
                      label:
                        "Additional qualifying pension contribution (KES 30,000 combined limit)",
                    },
                    {
                      key: "mortgageInterest",
                      label:
                        "Eligible mortgage interest (KES 30,000 monthly limit)",
                    },
                    {
                      key: "postRetirementMedicalFund",
                      label:
                        "Post-retirement medical fund contribution (KES 15,000 monthly limit)",
                    },
                  ].map((item) => (
                    <label
                      key={item.key}
                      className="block text-sm text-slate-600"
                    >
                      {item.label} (monthly)
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="0"
                        className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                        value={
                          allowableDeductions[item.key]
                            ? formatNumberInput(
                                allowableDeductions[item.key]!.toString()
                              )
                            : ""
                        }
                        onChange={(event) => {
                          const raw = event.target.value.replace(/,/g, "");
                          setAllowableDeductions((current) => ({
                            ...current,
                            [item.key]: raw === "" ? "" : Number(raw),
                          }));
                        }}
                      />
                    </label>
                  ))}
                </div>
              </details>
            )}

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
          </section>

          {/* Calculate */}
          <button
            onClick={callBackendCalc}
            disabled={!salary}
            className="group mt-5 w-full rounded-xl bg-linear-to-r from-emerald-600 to-green-600 px-4 py-3 font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-emerald-500/30 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
          >
            Calculate
          </button>
        </div>

        {/* Results */}
        <AnimatePresence mode="wait">
          {result && result.success && (
            <motion.div
              key={`${country}-result`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.45 }}
              aria-live="polite"
              className="rounded-2xl border border-emerald-100 bg-linear-to-br from-emerald-50 via-green-50/60 to-white p-5 shadow-sm ring-1 ring-emerald-500/10"
            >
              <h3 className="text-sm font-semibold text-slate-700">
                Estimated employee take-home pay
              </h3>
              <p className="mt-1 font-serif text-4xl font-extrabold tracking-tight text-emerald-700">
                {currencySymbol} {fmt(result.netMonthly, locale)}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                After the deductions shown below; this is an estimate.
              </p>

              <div className="mt-5 grid grid-cols-2 gap-3">
                {[
                  { label: "Gross earnings", value: result.accruedGross },
                  ...(country === "KE" && result.taxableIncome !== undefined
                    ? [
                        {
                          label: "Taxable Employment Income",
                          value: result.taxableIncome,
                        },
                      ]
                    : []),
                  { label: "Access cap", value: result.accessCap },
                  { label: "Available after fee", value: result.accessibleNow },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="rounded-xl border border-emerald-100 bg-white/70 p-3"
                  >
                    <p className="text-xs text-slate-500">{label}</p>
                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {currencySymbol} {fmt(value, locale)}
                    </p>
                  </div>
                ))}
              </div>

              {!!result.cashShortfall && result.cashShortfall > 0 && (
                <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs leading-relaxed text-amber-800">
                  Calculated deductions exceed this period&apos;s gross earnings
                  by {currencySymbol} {fmt(result.cashShortfall, locale)}. Net
                  pay is shown as zero; actual deduction handling requires
                  payroll review.
                </p>
              )}

              <details className="mt-5 rounded-xl border border-emerald-100 bg-white/70 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-700">
                  View calculation breakdown
                </summary>
                <div className="mt-4 space-y-4">
                  <section aria-labelledby="employee-deductions-heading">
                    <h4
                      id="employee-deductions-heading"
                      className="mb-2 text-xs font-semibold tracking-wide text-slate-500 uppercase"
                    >
                      Employee deductions
                    </h4>
                    <dl className="space-y-2">
                      {Object.entries(result.deductions).map(
                        ([label, value]) => (
                          <div
                            key={label}
                            className="flex justify-between gap-3 text-sm"
                          >
                            <dt className="text-slate-600">{label}</dt>
                            <dd className="font-medium text-slate-800">
                              {currencySymbol} {fmt(value, locale)}
                            </dd>
                          </div>
                        )
                      )}
                    </dl>
                  </section>

                  {result.employerContributions &&
                    Object.values(result.employerContributions).some(
                      (amount) => amount > 0
                    ) && (
                      <section aria-labelledby="employer-costs-heading">
                        <h4
                          id="employer-costs-heading"
                          className="mb-2 text-xs font-semibold tracking-wide text-slate-500 uppercase"
                        >
                          Employer contributions (not deducted from take-home
                          pay)
                        </h4>
                        <dl className="space-y-2">
                          {Object.entries(result.employerContributions).map(
                            ([label, value]) => (
                              <div
                                key={label}
                                className="flex justify-between gap-3 text-sm"
                              >
                                <dt className="text-slate-600">{label}</dt>
                                <dd className="font-medium text-slate-800">
                                  {currencySymbol} {fmt(value, locale)}
                                </dd>
                              </div>
                            )
                          )}
                        </dl>
                      </section>
                    )}

                  <div className="border-t border-slate-100 pt-3 text-xs leading-relaxed text-slate-500">
                    <p>
                      Accrued earnings = gross income × days worked ÷{" "}
                      {cycleDays}
                    </p>
                    <p className="mt-1">
                      Access cap = net earnings × {result.accessCapPercent}%;
                      available now is reduced by the {feePercent}% platform
                      fee.
                    </p>
                    {result.ruleVersion && (
                      <p className="mt-2">
                        Rules {result.ruleVersion}
                        {result.effectiveFrom
                          ? ` · effective ${result.effectiveFrom}`
                          : ""}
                        {result.engineVersion
                          ? ` · engine ${result.engineVersion}`
                          : ""}
                      </p>
                    )}
                  </div>

                  <WageGraph
                    result={result}
                    currencySymbol={currencySymbol}
                    locale={locale}
                  />
                </div>
              </details>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </TiltCard>
  );
}
