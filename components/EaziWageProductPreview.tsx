"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  CalendarDays,
  CircleHelp,
  LayoutDashboard,
  ShieldCheck,
  Wallet,
  WalletCards,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { useCurrency } from "@/components/CurrencyProvider";
import {
  getCurrencyFromCountry,
  type CountryCode,
  type Locale,
} from "@/lib/currency/currency";
import {
  calculateHeroDemo,
  calculateHeroDemoRequest,
  type HeroDemoCalculation,
  type HeroDemoRequest,
} from "@/lib/finance/hero-demo";

const chartConfig = {
  earned: {
    label: "Wages earned",
    color: "var(--color-green-600)",
  },
} satisfies ChartConfig;

const countryForLocale: Record<Locale, CountryCode> = {
  "en-ke": "KE",
  "en-ug": "UG",
  "en-tz": "TZ",
  "en-rw": "RW",
};

const countryOptions: { code: CountryCode; label: string }[] = [
  { code: "KE", label: "Kenya" },
  { code: "UG", label: "Uganda" },
  { code: "TZ", label: "Tanzania" },
  { code: "RW", label: "Rwanda" },
];

const currencyLabels: Record<CountryCode, string> = {
  KE: "Ksh",
  UG: "UGX",
  TZ: "TSh",
  RW: "RWF",
};

function formatCurrency(amount: number, country: CountryCode): string {
  const currency = getCurrencyFromCountry(country);
  const formattedAmount = new Intl.NumberFormat(currency.localeStr, {
    maximumFractionDigits: country === "KE" || country === "TZ" ? 2 : 0,
  }).format(amount);

  return `${currencyLabels[country]} ${formattedAmount}`;
}

function getEarningsData(today: Date, earnedWage: number, daysWorked: number) {
  const pointCount = Math.min(6, Math.max(1, daysWorked));

  return Array.from({ length: pointCount }, (_, index) => {
    const progress = pointCount === 1 ? 0 : index / (pointCount - 1);
    const day = Math.round(progress * (daysWorked - 1)) + 1;
    const date = new Date(today.getFullYear(), today.getMonth(), day);

    return {
      day: date.toLocaleDateString("en", { month: "short", day: "numeric" }),
      earned: Math.round((earnedWage * day) / Math.max(1, daysWorked)),
    };
  });
}

const navigation = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "wage-access", label: "Wage access", icon: WalletCards },
  { id: "pay-calendar", label: "Pay calendar", icon: CalendarDays },
  { id: "support", label: "Support", icon: CircleHelp },
] as const;

type DashboardView = (typeof navigation)[number]["id"];

const viewCopy: Record<DashboardView, { title: string; description: string }> =
  {
    overview: {
      title: "Overview",
      description: "Here's your pay at a glance.",
    },
    "wage-access": {
      title: "Wage access",
      description: "A sample view of your available earned wages.",
    },
    "pay-calendar": {
      title: "Pay calendar",
      description: "Keep track of your pay period and upcoming payday.",
    },
    support: {
      title: "How can we help?",
      description: "Find support for your EaziWage account.",
    },
  };

export default function EaziWageProductPreview() {
  const { locale } = useCurrency();
  const dashboardRef = useRef<HTMLDivElement>(null);
  const [greeting, setGreeting] = useState("Good morning");
  const today = new Date();
  const monthName = today.toLocaleDateString("en", { month: "long" });
  const shortMonth = today.toLocaleDateString("en", { month: "short" });
  const lastDayOfMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    0
  ).getDate();
  const currentDay = today.getDate();
  const [country, setCountry] = useState<CountryCode>(
    () => countryForLocale[locale]
  );
  const [salaryKES, setSalaryKES] = useState(100_000);
  const [outstandingAdvance, setOutstandingAdvance] = useState(0);
  const cycleDays = country === "KE" ? lastDayOfMonth : 30;
  const [daysWorked, setDaysWorked] = useState(() =>
    Math.min(currentDay, cycleDays)
  );
  const effectiveDaysWorked = Math.min(daysWorked, cycleDays);
  const [requestedAmount, setRequestedAmount] = useState(10_000);
  const calculation = calculateHeroDemo(
    country,
    salaryKES,
    effectiveDaysWorked,
    cycleDays,
    outstandingAdvance
  );
  const request = calculateHeroDemoRequest(calculation, requestedAmount);
  const earnings = getEarningsData(
    today,
    calculation.payroll.earnedWage,
    effectiveDaysWorked
  );
  const [activeView, setActiveView] = useState<DashboardView>("overview");
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const dashboard = dashboardRef.current;
    const supportsTilt = window.matchMedia(
      "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)"
    );

    if (!dashboard || prefersReducedMotion !== false || !supportsTilt.matches) {
      return;
    }

    let animationFrame: number | null = null;
    const restingTransform = "perspective(1600px) translateZ(8px)";

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;

      if (animationFrame !== null) {
        window.cancelAnimationFrame(animationFrame);
      }

      animationFrame = window.requestAnimationFrame(() => {
        const bounds = dashboard.getBoundingClientRect();
        const horizontalPosition =
          (event.clientX - bounds.left) / bounds.width - 0.5;
        const verticalPosition =
          (event.clientY - bounds.top) / bounds.height - 0.5;
        const rotateX = -verticalPosition * 3;
        const rotateY = horizontalPosition * 3;

        dashboard.style.transform = `perspective(1600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(8px)`;
        animationFrame = null;
      });
    };

    const resetTilt = () => {
      if (animationFrame !== null) {
        window.cancelAnimationFrame(animationFrame);
        animationFrame = null;
      }

      dashboard.style.transform = restingTransform;
    };

    dashboard.addEventListener("pointermove", handlePointerMove);
    dashboard.addEventListener("pointerleave", resetTilt);

    return () => {
      dashboard.removeEventListener("pointermove", handlePointerMove);
      dashboard.removeEventListener("pointerleave", resetTilt);
      resetTilt();
    };
  }, [prefersReducedMotion]);

  useEffect(() => {
    setCountry(countryForLocale[locale]);
    setDaysWorked(
      Math.min(
        currentDay,
        countryForLocale[locale] === "KE" ? lastDayOfMonth : 30
      )
    );
  }, [currentDay, lastDayOfMonth, locale]);

  useEffect(() => {
    setDaysWorked(Math.min(currentDay, cycleDays));
  }, [country, cycleDays, currentDay]);

  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      setGreeting(
        hour < 12
          ? "Good morning"
          : hour < 17
            ? "Good afternoon"
            : "Good evening"
      );
    };

    updateGreeting();
    const intervalId = window.setInterval(updateGreeting, 60_000);
    return () => window.clearInterval(intervalId);
  }, []);

  const selectView = (view: DashboardView) => {
    setActiveView(view);
  };
  const activeCopy = viewCopy[activeView];

  return (
    <div
      ref={dashboardRef}
      role="region"
      aria-label="Interactive sample EaziWage employee dashboard"
      className="overflow-hidden rounded-3xl border border-slate-200/60 bg-white/70 text-left shadow-2xl shadow-green-500/10 backdrop-blur-xl motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out motion-reduce:transition-none"
      style={{ transform: "perspective(1600px) translateZ(8px)" }}
    >
      <div className="flex min-h-14 items-center justify-between gap-3 border-b border-slate-200/60 bg-white/70 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-emerald-500/20 to-green-500/20 ring-1 ring-emerald-500/20">
            <Wallet
              className="size-6 text-emerald-700"
              strokeWidth={2}
              aria-hidden="true"
            />
          </div>
          <span className="truncate text-sm font-bold tracking-tight text-slate-900 sm:text-base">
            EaziWage
          </span>
        </div>
        <Badge
          variant="outline"
          className="shrink-0 rounded-full border-green-500/20 bg-green-500/5 px-3 py-1 text-[11px] font-medium text-green-700"
        >
          Sample account
        </Badge>
      </div>

      <div className="grid min-h-[420px] grid-cols-1 md:grid-cols-[176px_minmax(0,1fr)]">
        <aside className="hidden border-r border-slate-200/60 bg-slate-50/50 p-4 md:block">
          <p className="mb-3 px-2 text-[10px] font-semibold tracking-[0.12em] text-slate-400 uppercase">
            User portal
          </p>
          <nav aria-label="Sample dashboard navigation" className="space-y-1">
            {navigation.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                aria-current={activeView === id ? "page" : undefined}
                onClick={() => selectView(id)}
                className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:outline-none ${
                  activeView === id
                    ? "bg-green-500/10 text-green-700"
                    : "text-slate-500 hover:bg-green-500/5 hover:text-green-700"
                }`}
              >
                <Icon className="size-4 shrink-0" aria-hidden="true" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
          <div className="mt-7 rounded-xl border border-slate-200/60 bg-white/70 p-3">
            <ShieldCheck
              className="mb-2 size-4 text-green-600"
              aria-hidden="true"
            />
            <p className="text-xs font-medium text-slate-700">
              Your pay, protected
            </p>
            <p className="mt-1 text-[11px] leading-4 text-slate-500">
              Secure access through your employer.
            </p>
          </div>
        </aside>

        <main className="min-w-0 bg-slate-50/50 p-4 sm:p-6">
          <nav
            aria-label="Sample dashboard navigation"
            className="mb-4 flex gap-1 overflow-x-auto md:hidden"
          >
            {navigation.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                aria-current={activeView === id ? "page" : undefined}
                onClick={() => selectView(id)}
                className={`shrink-0 rounded-lg px-3 py-2 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:outline-none ${
                  activeView === id
                    ? "bg-green-500/10 text-green-700"
                    : "text-slate-500 hover:bg-green-500/5 hover:text-green-700"
                }`}
              >
                {label}
              </button>
            ))}
          </nav>

          <motion.div
            key={activeView}
            initial={
              prefersReducedMotion === false ? { opacity: 0, y: 8 } : false
            }
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: prefersReducedMotion === false ? 0.25 : 0,
            }}
          >
            <div className="mb-5 flex flex-wrap items-end justify-between gap-2">
              <div>
                <h2 className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
                  {activeView === "overview"
                    ? `${greeting}, Amina`
                    : activeCopy.title}
                </h2>
                <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                  {activeCopy.description}
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <CalendarDays className="size-3.5" aria-hidden="true" />
                <span>
                  Pay period: 1-{lastDayOfMonth} {monthName}
                </span>
              </div>
              <label className="flex items-center gap-2 text-xs text-slate-500">
                <span>Sample market</span>
                <select
                  aria-label="Sample market"
                  value={country}
                  onChange={(event) => {
                    const selectedCountry = event.target.value as CountryCode;
                    setCountry(selectedCountry);
                    setDaysWorked(
                      Math.min(
                        currentDay,
                        selectedCountry === "KE" ? lastDayOfMonth : 30
                      )
                    );
                  }}
                  className="max-w-32 rounded-md border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-700 focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:outline-none"
                >
                  {countryOptions.map(({ code, label }) => (
                    <option key={code} value={code}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {activeView === "overview" && (
              <>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {[
                    {
                      label: "Net monthly pay",
                      amount: calculation.payroll.netPay,
                    },
                    {
                      label: "Earned wages",
                      amount: calculation.payroll.earnedWage,
                    },
                    {
                      label: "Available to access",
                      amount: calculation.maxRequest,
                    },
                  ].map((metric) => (
                    <Card
                      key={metric.label}
                      className="min-w-0 gap-0 rounded-xl border-slate-200/60 bg-white/70 py-0 shadow-none"
                    >
                      <CardHeader className="gap-2 p-4">
                        <CardDescription className="text-xs">
                          {metric.label}
                        </CardDescription>
                        <CardTitle className="truncate text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
                          {formatCurrency(metric.amount, country)}
                        </CardTitle>
                      </CardHeader>
                    </Card>
                  ))}
                </div>

                <Card className="mt-3 gap-0 rounded-xl border-slate-200/60 bg-white/70 py-0 shadow-none">
                  <CardHeader className="flex-row items-start justify-between gap-3 p-4 pb-0">
                    <div>
                      <CardTitle className="text-sm font-bold text-slate-900">
                        Wages earned
                      </CardTitle>
                      <CardDescription className="mt-1 text-xs">
                        Earnings so far this pay period
                      </CardDescription>
                    </div>
                    <span className="shrink-0 text-xs font-medium text-green-700">
                      {formatCurrency(calculation.payroll.earnedWage, country)}
                    </span>
                  </CardHeader>
                  <CardContent className="px-2 pt-3 pb-3 sm:px-4">
                    <ChartContainer
                      config={chartConfig}
                      className="aspect-auto h-[150px] w-full sm:h-[174px]"
                    >
                      <AreaChart
                        accessibilityLayer
                        data={earnings}
                        margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient
                            id="eaziwage-earned-fill"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor="var(--color-earned)"
                              stopOpacity={0.2}
                            />
                            <stop
                              offset="100%"
                              stopColor="var(--color-earned)"
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis
                          dataKey="day"
                          tickLine={false}
                          axisLine={false}
                          tickMargin={8}
                          tick={{ fontSize: 10 }}
                          minTickGap={24}
                        />
                        <Area
                          dataKey="earned"
                          type="monotone"
                          stroke="var(--color-earned)"
                          strokeWidth={2}
                          fill="url(#eaziwage-earned-fill)"
                          dot={false}
                        />
                      </AreaChart>
                    </ChartContainer>
                  </CardContent>
                </Card>

                <WageRequestPanel
                  country={country}
                  request={request}
                  maxRequest={calculation.maxRequest}
                  onAmountChange={setRequestedAmount}
                />
              </>
            )}

            {activeView === "wage-access" && (
              <WageAccessView
                country={country}
                calculation={calculation}
                request={request}
                salaryKES={salaryKES}
                daysWorked={effectiveDaysWorked}
                outstandingAdvance={outstandingAdvance}
                onSalaryChange={setSalaryKES}
                onDaysWorkedChange={setDaysWorked}
                onOutstandingAdvanceChange={setOutstandingAdvance}
                onAmountChange={setRequestedAmount}
              />
            )}

            {activeView === "pay-calendar" && (
              <PayCalendarView
                monthName={monthName}
                shortMonth={shortMonth}
                lastDayOfMonth={lastDayOfMonth}
                currentDay={currentDay}
              />
            )}

            {activeView === "support" && <SupportView />}
          </motion.div>
        </main>
      </div>
    </div>
  );
}

function WageAccessView({
  country,
  calculation,
  request,
  salaryKES,
  daysWorked,
  outstandingAdvance,
  onSalaryChange,
  onDaysWorkedChange,
  onOutstandingAdvanceChange,
  onAmountChange,
}: {
  country: CountryCode;
  calculation: HeroDemoCalculation;
  request: HeroDemoRequest;
  salaryKES: number;
  daysWorked: number;
  outstandingAdvance: number;
  onSalaryChange: (salaryKES: number) => void;
  onDaysWorkedChange: (daysWorked: number) => void;
  onOutstandingAdvanceChange: (amount: number) => void;
  onAmountChange: (amount: number) => void;
}) {
  const currency = getCurrencyFromCountry(country);
  const monthlySalary = Math.round(salaryKES * currency.rateFromKES);

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <Card className="gap-0 rounded-xl border-slate-200/60 bg-white/70 py-0 shadow-none">
          <CardHeader className="gap-2 p-4">
            <CardDescription className="text-xs">
              Available to access
            </CardDescription>
            <CardTitle className="text-2xl font-bold tracking-tight text-green-700">
              {formatCurrency(calculation.maxRequest, country)}
            </CardTitle>
            <p className="text-xs leading-relaxed text-slate-500">
              Available request amount before the 6% fee.
            </p>
          </CardHeader>
        </Card>
        <Card className="gap-0 rounded-xl border-slate-200/60 bg-white/70 py-0 shadow-none">
          <CardHeader className="gap-2 p-4">
            <CardDescription className="text-xs">Earned wages</CardDescription>
            <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">
              {formatCurrency(calculation.payroll.earnedWage, country)}
            </CardTitle>
            <p className="text-xs leading-relaxed text-slate-500">
              Net pay accrued across {daysWorked} of{" "}
              {calculation.payroll.earnedWageDays ?? calculation.cycleDays}{" "}
              earning days.
            </p>
          </CardHeader>
        </Card>
      </div>
      <Card className="gap-0 rounded-xl border-slate-200/60 bg-white/70 py-0 shadow-none">
        <CardHeader className="p-4">
          <CardTitle className="text-sm font-bold text-slate-900">
            Sample payroll inputs
          </CardTitle>
          <CardDescription className="text-xs">
            Adjust the illustrative pay and worked days to recalculate
            eligibility.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 px-4 pb-4 sm:grid-cols-2">
          <label className="space-y-2 text-xs text-slate-600">
            <span className="flex items-center justify-between gap-2">
              <span>Sample gross monthly salary</span>
              <span className="font-semibold text-slate-900">
                {formatCurrency(monthlySalary, country)}
              </span>
            </span>
            <input
              type="range"
              min={25_000}
              max={300_000}
              step={5_000}
              value={salaryKES}
              onChange={(event) => onSalaryChange(Number(event.target.value))}
              className="w-full accent-green-600"
              aria-label="Sample monthly salary"
            />
            <span className="block leading-relaxed text-slate-400">
              The selected country&apos;s payroll rules calculate statutory
              deductions and net pay from this sample gross salary.
            </span>
          </label>
          <label className="space-y-2 text-xs text-slate-600">
            <span className="flex items-center justify-between gap-2">
              <span>Days worked</span>
              <span className="font-semibold text-slate-900">
                {daysWorked} / {calculation.cycleDays}
              </span>
            </span>
            <input
              type="range"
              min={0}
              max={calculation.cycleDays}
              step={1}
              value={daysWorked}
              onChange={(event) =>
                onDaysWorkedChange(Number(event.target.value))
              }
              className="w-full accent-green-600"
              aria-label="Sample days worked"
            />
            <span className="block leading-relaxed text-slate-400">
              {country === "KE"
                ? `Kenya's configured earning period is ${calculation.payroll.earnedWageDays} days.`
                : `The calculation uses the ${calculation.cycleDays}-day pay cycle.`}
            </span>
          </label>
          <label className="space-y-2 text-xs text-slate-600 sm:col-span-2">
            <span className="flex items-center justify-between gap-2">
              <span>Outstanding advance balance</span>
              <span className="font-semibold text-slate-900">
                {formatCurrency(outstandingAdvance, country)}
              </span>
            </span>
            <input
              type="range"
              min={0}
              max={calculation.maxOutstandingAdvance}
              step={1}
              value={Math.min(
                outstandingAdvance,
                calculation.maxOutstandingAdvance
              )}
              onChange={(event) =>
                onOutstandingAdvanceChange(Number(event.target.value))
              }
              className="w-full accent-green-600"
              aria-label="Sample outstanding advance balance"
            />
            <span className="block leading-relaxed text-slate-400">
              This illustrative balance reduces the available amount; the
              default sample has no outstanding advances.
            </span>
          </label>
        </CardContent>
      </Card>
      <WageRequestPanel
        country={country}
        request={request}
        maxRequest={calculation.maxRequest}
        onAmountChange={onAmountChange}
      />
      <p className="px-1 text-[11px] leading-relaxed text-slate-500">
        Sample scenario: no account or employer restrictions are applied. Real
        eligibility may be lower. No request is submitted and no payout is made.
      </p>
    </div>
  );
}

function WageRequestPanel({
  country,
  request,
  maxRequest,
  onAmountChange,
}: {
  country: CountryCode;
  request: HeroDemoRequest;
  maxRequest: number;
  onAmountChange: (amount: number) => void;
}) {
  return (
    <Card className="gap-0 rounded-xl border-slate-200/60 bg-white/70 py-0 shadow-none">
      <CardHeader className="flex-row items-start justify-between gap-3 p-4 pb-2">
        <div>
          <CardTitle className="text-sm font-bold text-slate-900">
            Try a sample advance
          </CardTitle>
          <CardDescription className="mt-1 text-xs">
            Adjust the request to see the fee and payroll deduction.
          </CardDescription>
        </div>
        <Badge
          variant="outline"
          className="shrink-0 rounded-full border-green-500/20 bg-green-500/5 px-2 py-1 text-[10px] font-medium text-green-700"
        >
          Demo only
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4 px-4 pb-4">
        <label className="block space-y-2 text-xs text-slate-600">
          <span className="flex items-center justify-between gap-2">
            <span>Requested amount</span>
            <span className="font-semibold text-slate-900">
              {formatCurrency(request.requestedAmount, country)}
            </span>
          </span>
          <input
            type="range"
            min={0}
            max={maxRequest}
            step={1}
            value={request.requestedAmount}
            disabled={maxRequest === 0}
            onChange={(event) => onAmountChange(Number(event.target.value))}
            className="w-full accent-green-600 disabled:opacity-50"
            aria-label="Requested wage access amount"
          />
          <span className="flex justify-between text-[11px] text-slate-400">
            <span>{formatCurrency(0, country)}</span>
            <span>Up to {formatCurrency(maxRequest, country)}</span>
          </span>
        </label>
        <dl className="divide-y divide-slate-100 rounded-lg border border-slate-200/60 px-3">
          <div className="flex items-center justify-between gap-3 py-2.5 text-xs">
            <dt className="text-slate-500">Platform fee (6%)</dt>
            <dd className="font-medium text-slate-800">
              {formatCurrency(request.platformFee, country)}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-3 py-2.5 text-xs">
            <dt className="text-slate-500">Net disbursement</dt>
            <dd className="font-semibold text-green-700">
              {formatCurrency(request.netDisbursement, country)}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-3 py-2.5 text-xs">
            <dt className="text-slate-500">Transaction cost</dt>
            <dd className="font-medium text-slate-800">
              {formatCurrency(request.transactionCost, country)}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-3 py-2.5 text-xs">
            <dt className="text-slate-500">Salary deduction</dt>
            <dd className="font-semibold text-slate-900">
              {formatCurrency(request.salaryDeduction, country)}
            </dd>
          </div>
        </dl>
        <p className="text-[11px] leading-relaxed text-slate-500">
          Illustrative figures only. Changing the amount does not create an
          advance or initiate a payment.
        </p>
      </CardContent>
    </Card>
  );
}

function PayCalendarView({
  monthName,
  shortMonth,
  lastDayOfMonth,
  currentDay,
}: {
  monthName: string;
  shortMonth: string;
  lastDayOfMonth: number;
  currentDay: number;
}) {
  const payDates = [
    {
      date: `01 ${shortMonth}`,
      label: "Pay period started",
      state: "Complete",
    },
    {
      date: `${String(currentDay).padStart(2, "0")} ${shortMonth}`,
      label: "Current date",
      state: "In progress",
    },
    {
      date: `${lastDayOfMonth} ${shortMonth}`,
      label: "Expected payday",
      state: "Upcoming",
    },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-[minmax(0,1.3fr)_minmax(220px,0.7fr)]">
      <Card className="gap-0 rounded-xl border-slate-200/60 bg-white/70 py-0 shadow-none">
        <CardHeader className="flex-row items-center justify-between p-4">
          <div>
            <CardTitle className="text-sm font-bold text-slate-900">
              {monthName} pay period
            </CardTitle>
            <CardDescription className="mt-1 text-xs">
              Your upcoming payroll dates
            </CardDescription>
          </div>
          <CalendarDays className="size-4 text-green-600" aria-hidden="true" />
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="space-y-4">
            {payDates.map(({ date, label, state }) => (
              <div
                key={date}
                className="flex items-center justify-between gap-3 border-t border-slate-200/60 pt-3"
              >
                <div className="flex items-center gap-3">
                  <span className="min-w-12 text-xs font-semibold text-slate-700">
                    {date}
                  </span>
                  <span className="text-sm text-slate-600">{label}</span>
                </div>
                <span
                  className={`shrink-0 text-[11px] font-medium ${
                    state === "Complete" ? "text-green-700" : "text-slate-500"
                  }`}
                >
                  {state}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card className="gap-0 rounded-xl border-slate-200/60 bg-white/70 py-0 shadow-none">
        <CardHeader className="gap-2 p-4">
          <CardDescription className="text-xs">Next payday</CardDescription>
          <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">
            {lastDayOfMonth} {shortMonth}
          </CardTitle>
          <p className="text-xs leading-relaxed text-slate-500">
            Your salary is scheduled for the end of this pay period.
          </p>
        </CardHeader>
      </Card>
    </div>
  );
}

function SupportView() {
  const supportTopics = [
    {
      title: "Wage access",
      description:
        "Learn about your available earned wages and recent activity.",
      icon: WalletCards,
    },
    {
      title: "Pay dates",
      description: "Review your pay period and upcoming payday.",
      icon: CalendarDays,
    },
    {
      title: "Account security",
      description:
        "Find guidance for keeping your account and information safe.",
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {supportTopics.map(({ title, description, icon: Icon }) => (
        <Card
          key={title}
          className="gap-0 rounded-xl border-slate-200/60 bg-white/70 py-0 shadow-none"
        >
          <CardHeader className="gap-3 p-4">
            <Icon className="size-5 text-green-600" aria-hidden="true" />
            <div>
              <CardTitle className="text-sm font-bold text-slate-900">
                {title}
              </CardTitle>
              <CardDescription className="mt-1 text-xs leading-relaxed">
                {description}
              </CardDescription>
            </div>
          </CardHeader>
        </Card>
      ))}
      <div className="flex items-center gap-3 rounded-xl border border-green-500/10 bg-green-500/5 p-4 sm:col-span-2">
        <CircleHelp
          className="size-5 shrink-0 text-green-700"
          aria-hidden="true"
        />
        <p className="text-xs leading-relaxed text-slate-600">
          This sample dashboard is for illustration only. For account help,
          visit the main EaziWage app.
        </p>
      </div>
    </div>
  );
}
