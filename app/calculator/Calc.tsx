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
      className="mt-7 h-72 w-full rounded-xl border border-slate-200 bg-slate-50 p-4"
    >
      <h4 className="mb-3 text-center text-sm font-semibold text-slate-700">
        Visual Breakdown
      </h4>
      <ResponsiveContainer width="100%" height="85%">
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
  const [isCalculating, setIsCalculating] = useState(false);

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

    setIsCalculating(true);
    try {
      const res = await fetch(`/api/calc?country=${country}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        toast.error(
          "The calculation could not be completed. Please try again."
        );
        return;
      }

      const data = await res.json();
      if (!data.success) {
        toast.error(
          "The calculation could not be completed. Please try again."
        );
        return;
      }

      let deductions: Deductions = {};
      let employerContributions: Deductions | undefined;
      const payeAmount =
        data.payeAfterRelief ?? data.paye ?? data.payeBeforeRelief ?? 0;

      switch (country) {
        case "UG":
          deductions = {
            LST: data.lst ?? 0,
            "NSSF (Employee)": data.nssfEmployee ?? 0,
            PAYE: payeAmount,
          };
          employerContributions = {
            "NSSF (Employer)": data.nssfEmployer ?? 0,
          };
          break;

        case "TZ":
          const nhifEmployee = data.nhifEmployee ?? data.shif ?? 0;
          deductions = {
            "NHIF (Employee)": nhifEmployee,
            "NSSF (Employee)": data.nssfEmployee ?? 0,
            PAYE: payeAmount,
          };
          employerContributions = {
            "SDL (Employer)": data.sdl ?? 0,
            "WCF (Employer)": data.wcf ?? 0,
            "NHIF (Employer)": data.nhifEmployer ?? 0,
            "NSSF (Employer)": data.nssfEmployer ?? 0,
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
          employerContributions = {
            "RSSB Pension (Employer)": rssbObj.pensionEmployer ?? 0,
            "RSSB Medical (Employer)": rssbObj.medicalEmployer ?? 0,
            "RSSB Maternity (Employer)": rssbObj.maternityEmployer ?? 0,
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
          employerContributions = {
            "NSSF (Employer)": data.employerContributions?.nssf ?? 0,
            "Housing Levy (Employer)":
              data.employerContributions?.housingLevy ?? 0,
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
      toast.error(
        "Could not connect to the calculator. Check your connection and try again."
      );
    } finally {
      setIsCalculating(false);
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
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)] lg:items-start">
      <TiltCard className="w-full rounded-2xl p-5 shadow-sm sm:p-7 lg:p-8">
        <section aria-labelledby="calculator-input-heading">
          <div className="mb-7">
            <h2
              id="calculator-input-heading"
              className="font-serif text-2xl font-bold tracking-tight text-slate-900"
            >
              Your pay details
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Choose a country and enter your earnings to estimate what may be
              available before payday.
            </p>
          </div>

          <fieldset>
            <legend className="mb-3 text-sm font-semibold text-slate-800">
              Country
            </legend>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { code: "KE", name: "Kenya", flag: "/flag/KE.png" },
                { code: "UG", name: "Uganda", flag: "/flag/UG.png" },
                { code: "TZ", name: "Tanzania", flag: "/flag/TZ.png" },
                { code: "RW", name: "Rwanda", flag: "/flag/RW.png" },
              ].map((option) => (
                <button
                  key={option.code}
                  type="button"
                  onClick={() => handleCountryChange(option.code as Country)}
                  aria-pressed={country === option.code}
                  className={`flex min-h-14 items-center gap-2 rounded-xl border px-3 py-2 text-left transition-colors focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 ${
                    country === option.code
                      ? "border-emerald-700 bg-emerald-50 text-emerald-900"
                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <Image
                    src={option.flag}
                    alt=""
                    width={28}
                    height={28}
                    className="h-7 w-7 shrink-0 rounded-full object-cover"
                  />
                  <span className="text-sm font-medium">{option.name}</span>
                </button>
              ))}
            </div>
            <p className="mt-3 text-xs leading-relaxed text-slate-600">
              Changing country clears the entered values so they are not reused
              with another country&apos;s payroll rules.
            </p>
          </fieldset>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <label
              htmlFor="salary-input"
              className="text-sm font-semibold text-slate-800"
            >
              Gross monthly salary
              <span className="mt-1 block text-xs font-normal text-slate-500">
                Amount in {currencyDetails.code}
              </span>
              <input
                id="salary-input"
                type="text"
                inputMode="numeric"
                autoComplete="off"
                placeholder="For example, 60,000"
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 transition outline-none placeholder:text-slate-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20"
                value={salary ? formatNumberInput(salary.toString()) : ""}
                onChange={(event) => {
                  const raw = event.target.value.replace(/,/g, "");
                  setSalary(raw === "" ? "" : Number(raw));
                }}
              />
            </label>

            <div>
              <label
                htmlFor="days-worked-input"
                className="text-sm font-semibold text-slate-800"
              >
                Days worked this cycle
              </label>
              <p className="mt-1 text-xs text-slate-500">
                Adjust for a partial pay period, if needed.
              </p>
              <input
                id="days-worked-input"
                type="range"
                min={0}
                max={maxDays}
                value={daysWorked}
                onChange={(event) => setDaysWorked(Number(event.target.value))}
                aria-describedby="days-worked-value"
                className="mt-4 w-full accent-emerald-700"
              />
              <div
                id="days-worked-value"
                className="mt-1 flex justify-between text-xs text-slate-600"
              >
                <span>
                  {daysWorked} of {maxDays} days
                </span>
                <span>{percentOfCycle}% of cycle</span>
              </div>
            </div>
          </div>

          <fieldset className="mt-8 border-t border-slate-200 pt-7">
            <legend className="mb-4 text-sm font-semibold text-slate-800">
              {country === "KE"
                ? "Additional cash earnings"
                : "Other contributions"}
            </legend>
            <div className="grid gap-4 sm:grid-cols-2">
              {countryAllowances[country].map((allowance) => (
                <div
                  key={allowance.key}
                  className="rounded-xl border border-slate-200 p-4"
                >
                  <label
                    htmlFor={`allowance-enabled-${allowance.key}`}
                    className="flex min-h-10 items-start gap-3 text-sm leading-relaxed text-slate-700"
                  >
                    <input
                      id={`allowance-enabled-${allowance.key}`}
                      type="checkbox"
                      className="mt-1 h-4 w-4 shrink-0 accent-emerald-700"
                      checked={!!allowancesChecked[allowance.key]}
                      onChange={(event) => {
                        setAllowancesChecked((current) => ({
                          ...current,
                          [allowance.key]: event.target.checked,
                        }));
                        if (!event.target.checked) {
                          setAllowancesAmount((current) => ({
                            ...current,
                            [allowance.key]: "",
                          }));
                        }
                      }}
                    />
                    <span>{allowance.label}</span>
                  </label>
                  <label
                    htmlFor={`allowance-${allowance.key}`}
                    className="mt-3 block text-xs font-medium text-slate-600"
                  >
                    Monthly amount ({currencyDetails.code})
                    <input
                      id={`allowance-${allowance.key}`}
                      type="text"
                      inputMode="numeric"
                      placeholder="Enter amount"
                      className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
                      value={
                        allowancesAmount[allowance.key]
                          ? formatNumberInput(
                              allowancesAmount[allowance.key]!.toString()
                            )
                          : ""
                      }
                      disabled={!allowancesChecked[allowance.key]}
                      onChange={(event) =>
                        setAllowancesAmount((current) => {
                          const raw = event.target.value.replace(/,/g, "");
                          return {
                            ...current,
                            [allowance.key]: raw === "" ? "" : Number(raw),
                          };
                        })
                      }
                    />
                  </label>
                </div>
              ))}
            </div>
          </fieldset>

          {country === "KE" && (
            <details className="mt-6 rounded-xl border border-slate-200 bg-slate-50">
              <summary className="cursor-pointer px-4 py-4 text-sm font-semibold text-slate-800 marker:text-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700">
                Kenya tax details
                <span className="mt-1 block text-xs font-normal text-slate-600">
                  Optional details for a more tailored estimate
                </span>
              </summary>
              <div className="space-y-5 border-t border-slate-200 px-4 py-5">
                <label
                  htmlFor="pensionable-earnings"
                  className="block text-sm font-medium text-slate-700"
                >
                  Pensionable monthly earnings
                  <span className="mt-1 block text-xs font-normal text-slate-500">
                    Optional. Defaults to gross earnings.
                  </span>
                  <input
                    id="pensionable-earnings"
                    type="text"
                    inputMode="numeric"
                    placeholder="Defaults to salary plus allowances"
                    className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20"
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

                <label className="flex items-start gap-3 text-sm leading-relaxed text-slate-700">
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 shrink-0 accent-emerald-700"
                    checked={residentForTax}
                    onChange={(event) =>
                      setResidentForTax(event.target.checked)
                    }
                  />
                  <span>
                    I am eligible for Kenyan resident personal relief (KES 2,400
                    per month).
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
                    htmlFor={`deduction-${item.key}`}
                    className="block text-sm leading-relaxed font-medium text-slate-700"
                  >
                    {item.label}
                    <span className="mt-1 block text-xs font-normal text-slate-500">
                      Monthly amount in KES
                    </span>
                    <input
                      id={`deduction-${item.key}`}
                      type="text"
                      inputMode="numeric"
                      placeholder="0"
                      className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20"
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

                <p className="text-xs leading-relaxed text-slate-600">
                  Allowances entered here are treated as taxable cash earnings;
                  enter only any taxable portion. Non-cash benefits, employer
                  pension or medical cover, insurance relief, bonuses and
                  irregular payroll need separate review. Part-period results
                  are prorated estimates, and wage access is not a verified
                  withdrawable balance.
                </p>
              </div>
            </details>
          )}

          <button
            type="button"
            onClick={callBackendCalc}
            disabled={!salary || isCalculating}
            className="mt-8 min-h-12 w-full rounded-xl bg-emerald-700 px-5 py-3 text-base font-semibold text-white transition-colors hover:bg-emerald-800 focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2 active:bg-emerald-900 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {isCalculating ? "Calculating..." : "Calculate my estimate"}
          </button>
        </section>
      </TiltCard>

      <aside
        aria-labelledby="calculator-result-heading"
        className="lg:sticky lg:top-24"
      >
        {result && result.success ? (
          <AnimatePresence mode="wait">
            <motion.section
              key={`${country}-result`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"
            >
              <div
                className="border-b border-slate-200 pb-5"
                aria-live="polite"
                aria-atomic="true"
              >
                <h2
                  id="calculator-result-heading"
                  className="font-serif text-lg font-bold text-slate-900"
                >
                  Estimated wage access
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Based on the details you entered
                </p>
                <p className="mt-5 font-serif text-3xl font-bold tracking-tight text-emerald-800 sm:text-4xl">
                  {currencySymbol} {fmt(result.accessibleNow, locale)}
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Estimated amount available now
                </p>
              </div>

              {!!result.cashShortfall && result.cashShortfall > 0 && (
                <p className="mt-5 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm leading-relaxed text-amber-900">
                  Calculated deductions exceed this period&apos;s gross earnings
                  by {currencySymbol} {fmt(result.cashShortfall, locale)}. Net
                  pay is shown as zero; actual deduction handling requires
                  payroll review.
                </p>
              )}

              <section className="mt-6" aria-labelledby="wage-summary-heading">
                <h3
                  id="wage-summary-heading"
                  className="font-serif text-lg font-bold text-slate-900"
                >
                  Pay summary
                </h3>
                <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-4">
                  {[
                    { label: "Net earnings", value: result.netMonthly },
                    { label: "Accrued earnings", value: result.accruedGross },
                    ...(country === "KE" && result.taxableIncome !== undefined
                      ? [
                          {
                            label: "Taxable income",
                            value: result.taxableIncome,
                          },
                        ]
                      : []),
                    {
                      label: `Access cap (${result.accessCapPercent}%)`,
                      value: result.accessCap,
                    },
                    {
                      label: `Platform fee (${feePercent}%)`,
                      value: result.platformFee,
                      isFee: true,
                    },
                  ].map(({ label, value, isFee }) => (
                    <div key={label} className="min-w-0">
                      <dt className="text-xs leading-relaxed text-slate-600">
                        {label}
                      </dt>
                      <dd
                        className={`mt-1 text-sm font-semibold break-words ${
                          isFee ? "text-slate-700" : "text-slate-900"
                        }`}
                      >
                        {isFee ? "- " : ""}
                        {currencySymbol} {fmt(value, locale)}
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>

              <section
                className="mt-7 border-t border-slate-200 pt-6"
                aria-labelledby="deductions-heading"
              >
                <h3
                  id="deductions-heading"
                  className="font-serif text-lg font-bold text-slate-900"
                >
                  Employee deductions
                </h3>
                <dl className="mt-3 grid grid-cols-1 gap-x-5 gap-y-3 sm:grid-cols-2">
                  {Object.entries(result.deductions).map(([label, value]) => (
                    <div
                      key={label}
                      className="flex min-w-0 justify-between gap-3 text-sm"
                    >
                      <dt className="text-slate-600">{label}</dt>
                      <dd className="shrink-0 font-medium text-slate-900">
                        {currencySymbol} {fmt(value, locale)}
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>

              {result.employerContributions &&
                Object.values(result.employerContributions).some(
                  (amount) => amount > 0
                ) && (
                  <section
                    className="mt-7 border-t border-slate-200 pt-6"
                    aria-labelledby="employer-contributions-heading"
                  >
                    <h3
                      id="employer-contributions-heading"
                      className="font-serif text-lg font-bold text-slate-900"
                    >
                      Employer contributions
                    </h3>
                    <p className="mt-1 text-xs text-slate-600">
                      These amounts are not deducted from employee pay.
                    </p>
                    <dl className="mt-3 grid grid-cols-1 gap-x-5 gap-y-3 sm:grid-cols-2">
                      {Object.entries(result.employerContributions).map(
                        ([label, value]) => (
                          <div
                            key={label}
                            className="flex min-w-0 justify-between gap-3 text-sm"
                          >
                            <dt className="text-slate-600">{label}</dt>
                            <dd className="shrink-0 font-medium text-slate-900">
                              {currencySymbol} {fmt(value, locale)}
                            </dd>
                          </div>
                        )
                      )}
                    </dl>
                  </section>
                )}

              <details className="mt-7 border-t border-slate-200 pt-5">
                <summary className="cursor-pointer text-sm font-semibold text-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700">
                  How this estimate is calculated
                </summary>
                <div className="mt-4 space-y-2 text-sm leading-relaxed text-slate-600">
                  <p>
                    Accrued earnings = gross income × days worked ÷ {cycleDays}
                  </p>
                  <p>Access cap = net earnings × {result.accessCapPercent}%</p>
                  <p>
                    Available now = access cap - platform fee ({feePercent}%)
                  </p>
                  {result.ruleVersion && (
                    <p className="border-t border-slate-200 pt-3 text-xs">
                      Payroll rules {result.ruleVersion}
                      {result.effectiveFrom
                        ? `, effective ${result.effectiveFrom}`
                        : ""}
                      {result.engineVersion
                        ? `, calculation engine ${result.engineVersion}`
                        : ""}
                    </p>
                  )}
                </div>
              </details>

              <WageGraph
                result={result}
                currencySymbol={currencySymbol}
                locale={locale}
              />
            </motion.section>
          </AnimatePresence>
        ) : (
          <section className="flex min-h-72 flex-col justify-center rounded-2xl border border-dashed border-slate-300 bg-white/70 p-7 text-center sm:min-h-96">
            <h2
              id="calculator-result-heading"
              className="font-serif text-lg font-bold text-slate-900"
            >
              Your estimate will appear here
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-slate-600">
              Enter your salary and pay-period details, then calculate to see
              your estimated wage access and a breakdown.
            </p>
          </section>
        )}
      </aside>
    </div>
  );
}
