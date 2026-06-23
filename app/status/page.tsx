"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  AlertCircle,
  XCircle,
  Activity,
  Database,
  HardDrive,
  Mail,
  RefreshCcw,
  Server,
  Globe,
  Smartphone,
  HelpCircle,
  Clock,
  CalendarDays,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type APIStatus = "healthy" | "degraded" | "down" | "unknown";

interface ServiceEntry {
  name: string;
  status: APIStatus;
  message: string;
  stale: boolean;
}

interface IncidentDay {
  date: string; // YYYY-MM-DD
  status: APIStatus;
  affected_services: string[];
  note: string | null;
}

interface StatusData {
  status: APIStatus;
  stale: boolean;
  last_checked_at: string | null;
  last_checked_ago_seconds: number;
  avg_latency_ms: number;
  services: Record<string, ServiceEntry>;
  incident_history: IncidentDay[];
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STALE_WARNING_SECONDS = 30 * 60;
const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// ---------------------------------------------------------------------------
// Calendar helpers
// ---------------------------------------------------------------------------

interface CalendarDay {
  date: Date;
  dateStr: string; // YYYY-MM-DD — used to look up incident_history
  isCurrentMonth: boolean;
  isToday: boolean;
}

function buildCalendarDays(baseDate: Date): CalendarDay[] {
  const startOfMonth = new Date(baseDate.getFullYear(), baseDate.getMonth(), 1);
  const endOfMonth = new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 0);

  const start = new Date(startOfMonth);
  start.setDate(start.getDate() - start.getDay());

  const end = new Date(endOfMonth);
  end.setDate(end.getDate() + (6 - end.getDay()));

  const days: CalendarDay[] = [];
  const cursor = new Date(start);
  const today = new Date();

  while (cursor <= end) {
    const y = cursor.getFullYear();
    const m = String(cursor.getMonth() + 1).padStart(2, "0");
    const d = String(cursor.getDate()).padStart(2, "0");
    days.push({
      date: new Date(cursor),
      dateStr: `${y}-${m}-${d}`,
      isCurrentMonth: cursor.getMonth() === baseDate.getMonth(),
      isToday:
        cursor.getDate() === today.getDate() &&
        cursor.getMonth() === today.getMonth() &&
        cursor.getFullYear() === today.getFullYear(),
    });
    cursor.setDate(cursor.getDate() + 1);
  }
  return days;
}

function statusDotClass(status: APIStatus | undefined): string {
  switch (status) {
    case "healthy": return "bg-green-500";
    case "degraded": return "bg-yellow-500";
    case "down": return "bg-red-500";
    default: return "bg-zinc-300 dark:bg-zinc-600";
  }
}

function statusDotLabel(status: APIStatus | undefined): string {
  switch (status) {
    case "healthy": return "Operational";
    case "degraded": return "Degraded";
    case "down": return "Outage";
    default: return "No data";
  }
}

// ---------------------------------------------------------------------------
// Shared UI helpers
// ---------------------------------------------------------------------------

function formatSecondsAgo(seconds: number): string {
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  return `${Math.floor(seconds / 3600)}h ago`;
}

function getServiceIcon(key: string) {
  const cls = "h-4 w-4";
  if (key.includes("supabase")) return <Database className={`${cls} text-emerald-500`} />;
  if (key.includes("redis")) return <HardDrive className={`${cls} text-purple-500`} />;
  if (key.includes("resend")) return <Mail className={`${cls} text-orange-500`} />;
  if (key.includes("africa") || key.includes("talking")) return <Smartphone className={`${cls} text-blue-500`} />;
  if (key.includes("dusupay")) return <Activity className={`${cls} text-pink-500`} />;
  if (key.includes("vercel")) return <Globe className={`${cls} text-zinc-500`} />;
  return <Server className={`${cls} text-zinc-400`} />;
}

function StatusIcon({ status, className = "h-5 w-5" }: { status: APIStatus; className?: string }) {
  switch (status) {
    case "healthy": return <CheckCircle2 className={`${className} text-green-500`} />;
    case "degraded": return <AlertCircle className={`${className} text-yellow-500`} />;
    case "down": return <XCircle className={`${className} text-red-500`} />;
    default: return <HelpCircle className={`${className} text-zinc-400`} />;
  }
}

function StatusBadge({ status, stale = false }: { status: APIStatus; stale?: boolean }) {
  if (stale || status === "unknown")
    return <Badge variant="outline" className="border-zinc-300 text-zinc-400 dark:border-zinc-700">Unknown</Badge>;
  switch (status) {
    case "healthy":
      return <Badge className="border-green-500/20 bg-green-500/10 text-green-600 hover:bg-green-500/20 dark:text-green-400">Operational</Badge>;
    case "degraded":
      return <Badge className="border-yellow-500/20 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400">Degraded</Badge>;
    case "down":
      return <Badge className="border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400">Down</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

function bannerConfig(status: APIStatus, stale: boolean) {
  if (stale || status === "unknown") return {
    border: "border-zinc-200 dark:border-zinc-700",
    bg: "bg-zinc-50/50 dark:bg-zinc-900/30",
    iconBg: "bg-zinc-100 dark:bg-zinc-800",
    headline: "Status Unknown",
    sub: "Health check data is stale. The scheduled check may have failed.",
  };
  switch (status) {
    case "healthy": return {
      border: "border-green-100 dark:border-green-900/20",
      bg: "bg-green-50/50 dark:bg-green-900/10",
      iconBg: "bg-green-100 dark:bg-green-900/30",
      headline: "All Systems Operational",
      sub: "EaziWage infrastructure is performing normally.",
    };
    case "degraded": return {
      border: "border-yellow-100 dark:border-yellow-900/20",
      bg: "bg-yellow-50/50 dark:bg-yellow-900/10",
      iconBg: "bg-yellow-100 dark:bg-yellow-900/30",
      headline: "Partial Degradation",
      sub: "Some services are experiencing issues. We are investigating.",
    };
    case "down": return {
      border: "border-red-100 dark:border-red-900/20",
      bg: "bg-red-50/50 dark:bg-red-900/10",
      iconBg: "bg-red-100 dark:bg-red-900/30",
      headline: "Service Disruption",
      sub: "One or more critical services are unavailable. Our team is responding.",
    };
    default: return {
      border: "border-zinc-200 dark:border-zinc-700",
      bg: "bg-zinc-50/50 dark:bg-zinc-900/30",
      iconBg: "bg-zinc-100 dark:bg-zinc-800",
      headline: "Status Unavailable",
      sub: "We are unable to determine the current system state.",
    };
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function StatusPage() {
  const [data, setData] = useState<StatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [secondsAgo, setSecondsAgo] = useState(0);
  const [calendarDate] = useState(new Date());
  const [hoveredDay, setHoveredDay] = useState<string | null>(null);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/status", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json: StatusData = await res.json();
      setData(json);
      setSecondsAgo(json.last_checked_ago_seconds);
      setFetchError(null);
    } catch (err) {
      setFetchError("Unable to reach the status API.");
      console.error("[StatusPage]", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
    const poll = setInterval(fetchStatus, 30_000);
    return () => clearInterval(poll);
  }, [fetchStatus]);

  useEffect(() => {
    if (!data) return;
    const tick = setInterval(() => setSecondsAgo((s) => s + 1), 1_000);
    return () => clearInterval(tick);
  }, [data]);

  if (loading && !data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="flex flex-col items-center gap-4">
          <RefreshCcw className="h-8 w-8 animate-spin text-emerald-600" />
          <p className="font-medium text-zinc-500">Probing EaziWage systems…</p>
        </div>
      </div>
    );
  }

  const banner = bannerConfig(data?.status ?? "unknown", data?.stale ?? false);
  const services = Object.entries(data?.services ?? {});
  const isStale = data?.stale || secondsAgo > STALE_WARNING_SECONDS;

  // Build incident lookup map: dateStr → IncidentDay
  const incidentMap = new Map<string, IncidentDay>(
    (data?.incident_history ?? []).map((d) => [d.date, d])
  );

  const calendarDays = buildCalendarDays(calendarDate);
  const calendarMonthLabel = calendarDate.toLocaleDateString("en-KE", {
    month: "long",
    year: "numeric",
  });

  // Today's incident entry (if exists)
  const todayStr = new Date().toISOString().split("T")[0];
  const todayIncident = incidentMap.get(todayStr);

  return (
    <main className="min-h-screen bg-zinc-50 pt-32 pb-12 dark:bg-zinc-950">
      <div className="container mx-auto max-w-4xl px-4">

        {/* ── Header ── */}
        <div className="mb-8 flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h1 className="font-playfair mb-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              System Status
            </h1>
            <p className="flex items-center gap-2 text-sm text-zinc-500">
              <Activity className="h-4 w-4 text-emerald-600" />
              Live infrastructure monitoring
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-xl border bg-white px-4 py-3 text-sm shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <Clock className="h-4 w-4 text-zinc-400" />
            <div className="flex flex-col">
              <span className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">Last check</span>
              <span className={`font-mono text-sm font-semibold ${isStale ? "text-amber-500" : "text-zinc-700 dark:text-zinc-300"}`}>
                {formatSecondsAgo(secondsAgo)}
              </span>
            </div>
            <button
              onClick={() => { setLoading(true); fetchStatus(); }}
              className="ml-2 rounded-full p-2 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
              title="Refresh"
              aria-label="Refresh status"
            >
              <RefreshCcw className={`h-4 w-4 text-zinc-500 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* ── Alerts ── */}
        <AnimatePresence>
          {fetchError && (
            <motion.div
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="mb-6 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-900/10 dark:text-red-400"
            >
              <AlertCircle className="h-4 w-4 shrink-0" /> {fetchError}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isStale && !fetchError && (
            <motion.div
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="mb-6 flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:border-amber-900/40 dark:bg-amber-900/10 dark:text-amber-400"
            >
              <AlertCircle className="h-4 w-4 shrink-0" />
              Status data is over 30 minutes old. The scheduled health check may have failed.
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Global banner ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className={`mb-8 flex flex-col items-center gap-6 rounded-2xl border-2 p-6 md:flex-row ${banner.border} ${banner.bg}`}
        >
          <div className={`rounded-full p-4 ${banner.iconBg}`}>
            <StatusIcon status={data?.status ?? "unknown"} className="h-6 w-6" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{banner.headline}</h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {banner.sub}{" "}
              {data && !data.stale && (
                <span>Avg response: <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100">{data.avg_latency_ms}ms</span></span>
              )}
            </p>
          </div>
          <StatusBadge status={data?.status ?? "unknown"} stale={data?.stale} />
        </motion.div>

        {/* ── Service grid ── */}
        <div className="mb-4 flex items-center gap-2 px-1">
          <Server className="h-5 w-5 text-zinc-400" />
          <h3 className="text-lg font-semibold text-zinc-700 dark:text-zinc-300">Services</h3>
          <span className="ml-auto text-xs text-zinc-400">
            {services.filter(([, s]) => s.status === "healthy").length} / {services.length} operational
          </span>
        </div>

        <div className="mb-10 grid gap-3 sm:grid-cols-2">
          {services.map(([key, service], index) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
            >
              <Card className={`transition-all duration-200 hover:shadow-md ${
                service.status === "down" ? "border-red-200 dark:border-red-900/30" :
                service.status === "degraded" ? "border-yellow-200 dark:border-yellow-900/30" : ""
              }`}>
                <CardHeader className="p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`rounded-lg p-2 ${
                        service.status === "down" ? "bg-red-50 dark:bg-red-900/20" :
                        service.status === "degraded" ? "bg-yellow-50 dark:bg-yellow-900/20" :
                        "bg-zinc-100 dark:bg-zinc-800"
                      }`}>
                        {getServiceIcon(key)}
                      </div>
                      <div>
                        <CardTitle className="text-sm font-bold">{service.name}</CardTitle>
                        <CardDescription className="text-xs">{service.message}</CardDescription>
                      </div>
                    </div>
                    <div className="shrink-0">
                      <StatusIcon status={service.stale ? "unknown" : service.status} />
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* ── Calendar tracker ── */}
        <motion.div
          initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }} className="mb-8"
        >
          <Card className="overflow-hidden border-zinc-200/80 bg-white/95 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/95">
            <CardHeader className="border-b border-zinc-100 bg-zinc-50/70 dark:border-zinc-800 dark:bg-zinc-950/40">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-bold tracking-[0.22em] text-emerald-600 uppercase dark:text-emerald-400">
                    <CalendarDays className="h-3.5 w-3.5" />
                    90-Day Uptime Tracker
                  </div>
                  <CardTitle className="text-xl font-bold">{calendarMonthLabel}</CardTitle>
                  <CardDescription className="mt-1 max-w-2xl">
                    Daily operational status based on automated health checks. Hover a day to see details.
                  </CardDescription>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
                    <p className="text-[10px] font-bold tracking-[0.2em] text-zinc-400 uppercase">Today</p>
                    <div className="mt-2 flex items-center gap-2">
                      <StatusIcon status={data?.status ?? "unknown"} className="h-4 w-4" />
                      <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                        {todayIncident ? statusDotLabel(todayIncident.status) : (data?.stale ? "Unknown" : statusDotLabel(data?.status))}
                      </span>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
                    <p className="text-[10px] font-bold tracking-[0.2em] text-zinc-400 uppercase">Last Check</p>
                    <p className={`mt-2 font-mono text-sm font-bold ${isStale ? "text-amber-500" : "text-zinc-900 dark:text-zinc-100"}`}>
                      {formatSecondsAgo(secondsAgo)}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
                    <p className="text-[10px] font-bold tracking-[0.2em] text-zinc-400 uppercase">Days Tracked</p>
                    <p className="mt-2 font-mono text-sm font-bold text-zinc-900 dark:text-zinc-100">
                      {incidentMap.size} / 90
                    </p>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-5 sm:p-6">
              {/* Legend */}
              <div className="mb-4 flex flex-wrap items-center gap-4 text-xs text-zinc-500">
                {(["healthy", "degraded", "down", undefined] as (APIStatus | undefined)[]).map((s) => (
                  <div key={s ?? "none"} className="inline-flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${statusDotClass(s)}`} />
                    <span>{s ? statusDotLabel(s) : "No data"}</span>
                  </div>
                ))}
              </div>

              {/* Weekday headers */}
              <div className="grid grid-cols-7 gap-1.5">
                {WEEKDAY_LABELS.map((day) => (
                  <div key={day} className="pb-2 text-center text-[10px] font-bold tracking-[0.22em] text-zinc-400 uppercase">
                    {day}
                  </div>
                ))}

                {calendarDays.map((day) => {
                  const incident = incidentMap.get(day.dateStr);
                  const dayStatus: APIStatus | undefined = day.isToday
                    ? (data?.stale ? undefined : data?.status)
                    : incident?.status;

                  const isHovered = hoveredDay === day.dateStr;

                  return (
                    <div
                      key={day.dateStr}
                      onMouseEnter={() => setHoveredDay(day.dateStr)}
                      onMouseLeave={() => setHoveredDay(null)}
                      className={`relative min-h-16 rounded-xl border p-2 transition-all duration-150 sm:min-h-20 ${
                        day.isCurrentMonth
                          ? "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
                          : "border-zinc-100 bg-zinc-50/80 text-zinc-300 dark:border-zinc-900 dark:bg-zinc-950/50 dark:text-zinc-700"
                      } ${day.isToday ? "ring-2 ring-emerald-500/40" : ""} ${isHovered && (incident || day.isToday) ? "shadow-md" : ""}`}
                    >
                      <div className="flex items-start justify-between">
                        <span className={`text-xs font-bold ${day.isToday ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-500 dark:text-zinc-400"}`}>
                          {day.date.getDate()}
                        </span>
                        <span className={`mt-0.5 h-2 w-2 rounded-full ${statusDotClass(dayStatus)}`} />
                      </div>

                      {/* Hover tooltip for incident detail */}
                      {isHovered && (incident || day.isToday) && (
                        <div className="absolute bottom-full left-1/2 z-10 mb-2 w-48 -translate-x-1/2 rounded-lg border border-zinc-200 bg-white p-3 text-xs shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
                          <p className="font-bold text-zinc-800 dark:text-zinc-100">
                            {day.date.toLocaleDateString("en-KE", { day: "numeric", month: "short" })}
                          </p>
                          <p className={`mt-1 font-semibold ${
                            dayStatus === "healthy" ? "text-green-600" :
                            dayStatus === "degraded" ? "text-yellow-600" :
                            dayStatus === "down" ? "text-red-600" : "text-zinc-400"
                          }`}>
                            {statusDotLabel(dayStatus)}
                          </p>
                          {incident?.affected_services && incident.affected_services.length > 0 && (
                            <p className="mt-1 text-zinc-500">
                              Affected: {incident.affected_services.join(", ")}
                            </p>
                          )}
                          {incident?.note && (
                            <p className="mt-1 text-zinc-400 italic">{incident.note}</p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ── Footer ── */}
        <p className="mt-4 text-center text-xs text-zinc-400">
          Checks run every 15 minutes via automated pipeline.{" "}
          {data?.last_checked_at && (
            <>Last updated {new Date(data.last_checked_at).toUTCString()}.</>
          )}
        </p>
      </div>
    </main>
  );
}