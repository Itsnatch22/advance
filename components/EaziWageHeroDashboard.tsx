"use client";

import { useEffect, useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  CreditCard,
  Users,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { useCurrency } from "@/components/CurrencyProvider";
import {
  formatCurrency,
  getCurrencyFromLocale,
  type Locale,
} from "@/lib/currency/currency";

const availableWages = 18_420;
const quickAmounts = [5_000, 10_000, 15_000];

const transactions = [
  {
    id: "earned-today",
    label: "Wages earned",
    amount: 6_420,
    incoming: true,
  },
  {
    id: "withdrawal-yesterday",
    label: "M-Pesa withdrawal",
    amount: 8_000,
    incoming: false,
  },
  {
    id: "earned-yesterday",
    label: "Wages earned",
    amount: 4_860,
    incoming: true,
  },
];

const mobileMoneyByLocale: Record<Locale, string> = {
  "en-ke": "M-Pesa",
  "en-tz": "M-Pesa",
  "en-ug": "MTN MoMo",
  "en-rw": "MTN MoMo",
};

const sampleRequests = [
  { id: "amina", name: "Amina N.", department: "Finance", amount: 8_500 },
  { id: "david", name: "David K.", department: "Operations", amount: 6_200 },
  {
    id: "grace",
    name: "Grace W.",
    department: "Customer support",
    amount: 4_800,
  },
];

type DashboardAudience = "employee" | "employer";

function getGreeting(date: Date | null) {
  if (!date) return "Good morning";

  const hour = date.getHours();
  return hour < 12
    ? "Good morning"
    : hour < 17
      ? "Good afternoon"
      : "Good evening";
}

function getActivityDate(daysAgo: number, now: Date | null, locale: string) {
  if (!now) return "Recent activity";

  const date = new Date(now);
  date.setDate(date.getDate() - daysAgo);

  if (daysAgo === 0) return "Today";
  if (daysAgo === 1) return "Yesterday";

  return date.toLocaleDateString(locale, { month: "short", day: "numeric" });
}

function DashboardHeader({
  greeting,
  monthName,
  dateLabel,
  audience,
}: {
  greeting: string;
  monthName: string;
  dateLabel: string;
  audience: DashboardAudience;
}) {
  const isEmployer = audience === "employer";

  return (
    <header className="flex min-h-14 items-center justify-between gap-4 border-b border-slate-200/70 bg-white px-4 sm:px-5">
      <div className="flex min-w-0 items-center gap-2.5">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white">
            <Wallet className="size-4" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold tracking-tight text-slate-900">
            EaziWage
          </p>
          <p className="hidden text-[10px] text-slate-500 sm:block">
            {isEmployer ? "Employer portal" : "Employee dashboard"}
          </p>
        </div>
      </div>
      <div className="flex min-w-0 items-center gap-3">
        <span className="hidden text-right text-[10px] text-slate-500 sm:block">
          <span className="block font-medium text-slate-700">{greeting}</span>
          <span>
            {dateLabel} · {monthName}
          </span>
        </span>
        <span className="hidden items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-medium text-emerald-700 md:inline-flex">
          <ShieldCheck className="size-3.5" aria-hidden="true" />
          Sample account
        </span>
        <span className="flex size-8 items-center justify-center rounded-full bg-slate-100 text-[11px] font-semibold text-slate-700">
          {isEmployer ? "HR" : "AM"}
        </span>
      </div>
    </header>
  );
}

function EmployeeDashboard({
  fmt,
  mobileMoney,
  monthName,
  lastDayOfMonth,
  greeting,
  activityDates,
}: {
  fmt: (amountKES: number) => string;
  mobileMoney: string;
  monthName: string;
  lastDayOfMonth: number;
  greeting: string;
  activityDates: string[];
}) {
  const [selectedAmount, setSelectedAmount] = useState(10_000);
  const [previewReady, setPreviewReady] = useState(false);
  const platformFee = Math.round(selectedAmount * 0.06);
  const payoutAmount = selectedAmount - platformFee;

  return (
    <div className="grid gap-3 bg-slate-50/80 p-3 sm:gap-4 sm:p-4 md:grid-cols-[minmax(0,1fr)_260px] xl:grid-cols-[360px_260px_300px] xl:gap-4">
      <section className="min-w-0 rounded-xl border border-slate-200/70 bg-white p-4">
        <div className="mb-4 flex items-start justify-between gap-2">
          <div>
            <p className="text-xs font-medium text-slate-500">
              {greeting}, Amina
            </p>
            <h2 className="mt-1 text-base font-bold tracking-tight text-slate-900">
              Your earnings
            </h2>
          </div>
          <span className="inline-flex items-center gap-1 text-[10px] text-slate-500">
            <CalendarDays className="size-3.5" aria-hidden="true" />
            1-{lastDayOfMonth} {monthName}
          </span>
        </div>

        <div className="rounded-lg bg-emerald-700 p-4 text-white">
          <p className="text-[11px] font-medium text-emerald-50/80">
            Available earned wages
          </p>
          <p className="mt-1 text-2xl font-bold tracking-tight">
            {fmt(availableWages)}
          </p>
          <p className="mt-1 text-[10px] text-emerald-50/75">
            Ready to access, subject to your employer&apos;s limits
          </p>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[11px] font-semibold text-slate-800">
              Salary progress
            </p>
            <p className="text-[10px] text-slate-500">52% of pay period</p>
          </div>
          <div
            className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100"
            role="progressbar"
            aria-label="Salary progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={52}
          >
            <div className="h-full w-[52%] rounded-full bg-emerald-500" />
          </div>
          <div className="mt-1.5 flex justify-between text-[10px] text-slate-400">
            <span>Earned {fmt(48_600)}</span>
            <span>Monthly pay {fmt(93_500)}</span>
          </div>
        </div>

        <div className="mt-5 border-t border-slate-100 pt-3">
          <div className="mb-1.5 flex items-center justify-between">
            <h3 className="text-[11px] font-semibold text-slate-800">
              Recent transactions
            </h3>
            <span className="text-[10px] font-medium text-emerald-700">
              Sample activity
            </span>
          </div>
          <ul className="divide-y divide-slate-100">
            {transactions.map((transaction, index) => (
              <li
                key={transaction.id}
                className={`flex items-center justify-between gap-2 py-2 ${
                  index === transactions.length - 1 ? "pb-0" : ""
                }`}
              >
                <span
                  className={`flex size-7 shrink-0 items-center justify-center rounded-full ${
                    transaction.incoming
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {transaction.incoming ? (
                    <ArrowDownLeft className="size-3.5" aria-hidden="true" />
                  ) : (
                    <ArrowUpRight className="size-3.5" aria-hidden="true" />
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[10px] font-medium text-slate-700">
                    {transaction.label}
                  </span>
                  <span className="block text-[9px] text-slate-400">
                    {activityDates[index]}
                  </span>
                </span>
                <span
                  className={`shrink-0 text-[10px] font-semibold ${
                    transaction.incoming ? "text-emerald-700" : "text-slate-700"
                  }`}
                >
                  {transaction.incoming ? "+" : "-"}
                  {fmt(transaction.amount)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="min-w-0 rounded-xl border border-slate-200/70 bg-white p-4">
        <div className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
            <CreditCard className="size-3.5" aria-hidden="true" />
          </span>
          <h2 className="text-sm font-bold text-slate-900">Withdraw wages</h2>
        </div>
        <p className="mt-3 text-[10px] text-slate-500">
          Choose a sample amount
        </p>
        <div className="mt-2 grid grid-cols-3 gap-1.5">
          {quickAmounts.map((amount) => (
            <button
              key={amount}
              type="button"
              aria-pressed={selectedAmount === amount}
              onClick={() => {
                setSelectedAmount(amount);
                setPreviewReady(false);
              }}
              className={`rounded-md border px-1 py-2 text-[10px] font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:outline-none ${
                selectedAmount === amount
                  ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                  : "border-slate-200 text-slate-600 hover:border-emerald-300"
              }`}
            >
              {fmt(amount)}
            </button>
          ))}
        </div>

        <div className="mt-4 rounded-lg bg-slate-50 p-3">
          <p className="text-[10px] text-slate-500">Payout method</p>
          <div className="mt-1 flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-slate-800">
              {mobileMoney}
            </span>
            <span className="text-[10px] text-slate-500">•••• 4821</span>
          </div>
        </div>

        <dl className="mt-3 space-y-2 border-b border-slate-100 pb-3 text-[10px]">
          <div className="flex justify-between gap-2">
            <dt className="text-slate-500">Requested amount</dt>
            <dd className="font-medium text-slate-800">
              {fmt(selectedAmount)}
            </dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-slate-500">Platform fee (6%)</dt>
            <dd className="font-medium text-slate-800">{fmt(platformFee)}</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="font-medium text-slate-700">You receive</dt>
            <dd className="font-bold text-emerald-700">{fmt(payoutAmount)}</dd>
          </div>
        </dl>

        <button
          type="button"
          onClick={() => setPreviewReady(true)}
          className="mt-3 w-full rounded-lg bg-green-600 px-3 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-green-700 focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          Preview withdrawal
        </button>
        <p
          aria-live="polite"
          className="mt-2 min-h-8 text-[9px] leading-4 text-slate-500"
        >
          {previewReady ? (
            <span className="flex gap-1 text-emerald-700">
              <Check className="mt-0.5 size-3 shrink-0" aria-hidden="true" />
              Demo preview ready. No payout will be made.
            </span>
          ) : (
            "Sample only. No request or payment is submitted."
          )}
        </p>
      </section>

      <section className="min-w-0 rounded-xl border border-slate-200/70 bg-white p-4">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-[10px] font-medium text-slate-500">Pay cycle</p>
            <h2 className="mt-1 text-sm font-bold text-slate-900">
              Payday outlook
            </h2>
          </div>
          <Clock3 className="size-4 text-emerald-700" aria-hidden="true" />
        </div>
        <div className="mt-5 rounded-lg border border-slate-100 p-3">
          <p className="text-[10px] text-slate-500">Next payday</p>
          <p className="mt-1 text-xl font-bold tracking-tight text-slate-900">
            {lastDayOfMonth} {monthName}
          </p>
          <p className="mt-1 text-[10px] text-slate-500">
            Salary is scheduled for the end of this pay period.
          </p>
        </div>
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-emerald-50/70 p-3">
          <ShieldCheck
            className="size-4 shrink-0 text-emerald-700"
            aria-hidden="true"
          />
          <p className="text-[10px] leading-relaxed text-slate-600">
            Your employer&apos;s access limits and payroll rules apply.
          </p>
        </div>
      </section>
    </div>
  );
}

function EmployerDashboard({
  fmt,
  monthName,
  lastDayOfMonth,
  greeting,
  activityDates,
}: {
  fmt: (amountKES: number) => string;
  monthName: string;
  lastDayOfMonth: number;
  greeting: string;
  activityDates: string[];
}) {
  const [reviewedRequests, setReviewedRequests] = useState<Set<string>>(
    () => new Set()
  );
  const pendingRequestCount = sampleRequests.length - reviewedRequests.size;

  return (
    <div className="grid gap-3 bg-slate-50/80 p-3 sm:gap-4 sm:p-4 md:grid-cols-[minmax(0,1fr)_260px] xl:grid-cols-[360px_260px_300px] xl:gap-4">
      <section className="min-w-0 rounded-xl border border-slate-200/70 bg-white p-4">
        <div className="mb-4 flex items-start justify-between gap-2">
          <div>
            <p className="text-xs font-medium text-slate-500">
              {greeting}, HR team
            </p>
            <h2 className="mt-1 text-base font-bold tracking-tight text-slate-900">
              Workforce overview
            </h2>
          </div>
          <span className="inline-flex items-center gap-1 text-[10px] text-slate-500">
            <CalendarDays className="size-3.5" aria-hidden="true" />
            {monthName} 1-{lastDayOfMonth}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg bg-emerald-700 p-3 text-white">
            <p className="text-[10px] font-medium text-emerald-50/80">
              Staff enrolled
            </p>
            <p className="mt-1 text-xl font-bold tracking-tight">157</p>
            <p className="mt-1 text-[9px] text-emerald-50/75">
              of 248 employees
            </p>
          </div>
          <div className="rounded-lg bg-slate-50 p-3">
            <p className="text-[10px] font-medium text-slate-500">
              Settled this month
            </p>
            <p className="mt-1 truncate text-base font-bold tracking-tight text-slate-900">
              {fmt(1_200_000)}
            </p>
            <p className="mt-1 text-[9px] text-slate-500">
              {monthName} payroll
            </p>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[11px] font-semibold text-slate-800">
              Staff adoption
            </p>
            <p className="text-[10px] text-slate-500">63%</p>
          </div>
          <div
            className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100"
            role="progressbar"
            aria-label="Staff adoption"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={63}
          >
            <div className="h-full w-[63%] rounded-full bg-emerald-500" />
          </div>
          <p className="mt-1.5 text-[10px] text-slate-400">
            157 of 248 staff enrolled
          </p>
        </div>

        <div className="mt-5 border-t border-slate-100 pt-3">
          <div className="mb-1.5 flex items-center justify-between gap-2">
            <h3 className="text-[11px] font-semibold text-slate-800">
              Payroll activity
            </h3>
            <span className="text-[10px] font-medium text-emerald-700">
              {monthName}
            </span>
          </div>
          <ul className="divide-y divide-slate-100">
            {[
              {
                label: "Payroll settlement",
                amount: fmt(482_600),
                icon: CheckCircle2,
              },
              {
                label: "Wage access requests",
                amount: "3 pending review",
                icon: Clock3,
              },
              {
                label: "Employee enrolments",
                amount: "+12 this period",
                icon: Users,
              },
            ].map(({ label, amount, icon: Icon }, index) => (
              <li
                key={label}
                className="flex items-center gap-2.5 py-2 last:pb-0"
              >
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                  <Icon className="size-3.5" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[10px] font-medium text-slate-700">
                    {label}
                  </span>
                  <span className="block text-[9px] text-slate-400">
                    {activityDates[index]}
                  </span>
                </span>
                <span className="shrink-0 text-[10px] font-semibold text-slate-700">
                  {amount}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="min-w-0 rounded-xl border border-slate-200/70 bg-white p-4">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-[10px] text-slate-500">Review queue</p>
            <h2 className="mt-1 text-sm font-bold text-slate-900">
              Employee requests
            </h2>
          </div>
          <span className="rounded-full bg-amber-50 px-2 py-1 text-[10px] font-semibold text-amber-700">
            {pendingRequestCount} pending
          </span>
        </div>
        <ul className="mt-3 divide-y divide-slate-100">
          {sampleRequests.map((request) => {
            const reviewed = reviewedRequests.has(request.id);

            return (
              <li key={request.id} className="py-3 first:pt-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-[11px] font-semibold text-slate-800">
                      {request.name}
                    </p>
                    <p className="truncate text-[9px] text-slate-500">
                      {request.department}
                    </p>
                  </div>
                  <p className="shrink-0 text-[10px] font-semibold text-slate-800">
                    {fmt(request.amount)}
                  </p>
                </div>
                <div className="mt-2 flex items-center justify-between gap-2">
                  <span className="text-[9px] text-slate-400">
                    {reviewed ? "Marked reviewed in demo" : "Sample request"}
                  </span>
                  <button
                    type="button"
                    disabled={reviewed}
                    onClick={() =>
                      setReviewedRequests((current) => {
                        const next = new Set(current);
                        next.add(request.id);
                        return next;
                      })
                    }
                    className="rounded-md border border-emerald-200 px-2 py-1 text-[9px] font-semibold text-emerald-800 transition-colors hover:bg-emerald-50 focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:outline-none disabled:cursor-default disabled:border-slate-200 disabled:text-slate-400"
                  >
                    {reviewed ? "Reviewed" : "Review"}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
        <p aria-live="polite" className="text-[9px] leading-4 text-slate-500">
          Review actions are local demo feedback only. No employee request is
          approved or changed.
        </p>
      </section>

      <section className="min-w-0 rounded-xl border border-slate-200/70 bg-white p-4">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-[10px] font-medium text-slate-500">
              Payroll controls
            </p>
            <h2 className="mt-1 text-sm font-bold text-slate-900">
              Employer settings
            </h2>
          </div>
          <ShieldCheck className="size-4 text-emerald-700" aria-hidden="true" />
        </div>
        <div className="mt-4 rounded-lg border border-slate-100 p-3">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[10px] font-medium text-slate-700">
              Payroll connection
            </p>
            <span className="rounded-full bg-slate-100 px-2 py-1 text-[9px] font-semibold text-slate-600">
              Preview
            </span>
          </div>
          <p className="mt-1 text-[9px] leading-relaxed text-slate-500">
            Illustrative status only. No payroll account is connected.
          </p>
        </div>
        <dl className="mt-3 space-y-3">
          <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
            <dt className="text-[10px] text-slate-500">Access limit</dt>
            <dd className="text-[10px] font-semibold text-slate-800">
              40% of earned wages
            </dd>
          </div>
          <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
            <dt className="text-[10px] text-slate-500">Pending reviews</dt>
            <dd className="text-[10px] font-semibold text-slate-800">
              {pendingRequestCount} requests
            </dd>
          </div>
        </dl>
        <div className="mt-4 rounded-lg bg-emerald-50/70 p-3">
          <div className="flex items-center gap-2">
            <CalendarDays
              className="size-3.5 shrink-0 text-emerald-700"
              aria-hidden="true"
            />
            <p className="text-[10px] font-semibold text-slate-800">
              Next payroll date
            </p>
          </div>
          <p className="mt-1 text-xs font-bold text-emerald-800">
            {lastDayOfMonth} {monthName}
          </p>
          <p className="mt-1 text-[9px] text-slate-500">
            Review deductions before the pay run.
          </p>
        </div>
      </section>
    </div>
  );
}

export default function EaziWageHeroDashboard({
  audience = "employee",
}: {
  audience?: DashboardAudience;
}) {
  const { locale } = useCurrency();
  const fmt = (amountKES: number) => formatCurrency(amountKES, locale);
  const mobileMoney = mobileMoneyByLocale[locale];
  const [now, setNow] = useState<Date | null>(null);
  const currencyLocale = getCurrencyFromLocale(locale).localeStr;
  const monthName =
    now?.toLocaleDateString(currencyLocale, { month: "long" }) ?? "this month";
  const dateLabel =
    now?.toLocaleDateString(currencyLocale, {
      weekday: "long",
      day: "numeric",
    }) ?? "Today";
  const lastDayOfMonth = now
    ? new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
    : 30;
  const greeting = getGreeting(now);
  const activityDates = [0, 1, 2].map((daysAgo) =>
    getActivityDate(daysAgo, now, currencyLocale)
  );

  useEffect(() => {
    const updateTime = () => setNow(new Date());
    updateTime();
    const intervalId = window.setInterval(updateTime, 60_000);
    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <div className="relative min-w-0 xl:overflow-visible">
      <div className="w-full overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_24px_64px_-32px_rgba(15,23,42,0.28),0_8px_24px_-16px_rgba(16,185,129,0.22)] xl:w-270 xl:max-w-none">
        <DashboardHeader
          greeting={greeting}
          monthName={monthName}
          dateLabel={dateLabel}
          audience={audience}
        />
        {audience === "employer" ? (
          <EmployerDashboard
            fmt={fmt}
            monthName={monthName}
            lastDayOfMonth={lastDayOfMonth}
            greeting={greeting}
            activityDates={activityDates}
          />
        ) : (
          <EmployeeDashboard
            fmt={fmt}
            mobileMoney={mobileMoney}
            monthName={monthName}
            lastDayOfMonth={lastDayOfMonth}
            greeting={greeting}
            activityDates={activityDates}
          />
        )}
      </div>
    </div>
  );
}
