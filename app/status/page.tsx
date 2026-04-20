"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  Activity, 
  Cpu, 
  Database, 
  HardDrive, 
  Mail, 
  RefreshCcw,
  Clock,
  Server,
  CalendarDays
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface StatusData {
  status: string;
  timestamp: string;
  latency: string;
  services: {
    [key: string]: {
      name: string;
      status: string;
      message: string;
    };
  };
  system: {
    memory: {
      free: string;
      total: string;
      usage: string;
    };
    uptime: string;
    platform: string;
    cpus: number;
  };
}

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
}

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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
    days.push({
      date: new Date(cursor),
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

export default function StatusPage() {
  const [data, setData] = useState<StatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = async () => {
    try {
      const res = await fetch("/api/status");
      if (!res.ok) throw new Error("Failed to fetch status");
      const json = await res.json();
      setData(json);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError("Unable to connect to status API. Please check your internet connection.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
      case "operational":
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case "degraded":
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case "unhealthy":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Activity className="w-5 h-5 text-blue-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "healthy":
      case "operational":
        return <Badge className="bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20">Operational</Badge>;
      case "degraded":
        return <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Degraded</Badge>;
      case "unhealthy":
        return <Badge variant="destructive" className="bg-red-500/10 text-red-500 border-red-500/20">Down</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const trackerDate = lastUpdated;
  const trackerDays = buildCalendarDays(trackerDate);
  const trackerMonthLabel = trackerDate.toLocaleDateString("en-KE", {
    month: "long",
    year: "numeric",
  });
  const nextCheckAt = new Date(lastUpdated.getTime() + 30_000);

  if (loading && !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="flex flex-col items-center gap-4">
          <RefreshCcw className="w-8 h-8 text-green-600 animate-spin" />
          <p className="text-zinc-500 font-medium">Probing EaziWage systems...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen pt-32 pb-12 bg-zinc-50 dark:bg-zinc-950">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2 font-playfair">System Status</h1>
            <p className="text-zinc-500 flex items-center gap-2">
              <Activity className="w-4 h-4 text-green-600" />
              Real-time monitoring of infrastructure & services
            </p>
          </div>
          <div className="flex items-center gap-4 text-sm bg-white dark:bg-zinc-900 p-3 rounded-xl border shadow-sm">
            <div className="flex flex-col items-end">
              <span className="text-zinc-400 text-[10px] uppercase font-bold tracking-widest">Last Check</span>
              <span className="font-mono text-zinc-700 dark:text-zinc-300">
                {lastUpdated.toLocaleTimeString()}
              </span>
            </div>
            <button 
              onClick={() => { setLoading(true); fetchStatus(); }}
              className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
              title="Refresh status"
            >
              <RefreshCcw className={`w-4 h-4 text-zinc-500 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-8 flex items-center gap-3">
            <AlertCircle className="w-5 h-5" />
            <p>{error}</p>
          </div>
        )}

        {/* Global Status Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-8 p-6 rounded-2xl border-2 flex flex-col md:flex-row items-center gap-6 ${
            data?.status === 'operational' 
              ? 'bg-green-50/50 border-green-100 dark:bg-green-900/10 dark:border-green-900/20' 
              : 'bg-yellow-50/50 border-yellow-100 dark:bg-yellow-900/10 dark:border-yellow-900/20'
          }`}
        >
          <div className={`p-4 rounded-full ${
            data?.status === 'operational' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-yellow-100 dark:bg-yellow-900/30'
          }`}>
            {data && getStatusIcon(data.status)}
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              {data?.status === 'operational' ? 'All Systems Operational' : 'Systems Degraded'}
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              EaziWage infrastructure is {data?.status === 'operational' ? 'performing normally' : 'experiencing some issues'}. 
              API response time: <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100">{data?.latency}</span>.
            </p>
          </div>
          {data && getStatusBadge(data.status)}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="mb-8"
        >
          <Card className="overflow-hidden border-zinc-200/80 bg-white/95 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/95">
            <CardHeader className="border-b border-zinc-100 bg-zinc-50/70 dark:border-zinc-800 dark:bg-zinc-950/40">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-emerald-600 dark:text-emerald-400">
                    <CalendarDays className="h-3.5 w-3.5" />
                    Calendar Tracker
                  </div>
                  <CardTitle className="text-xl font-bold">{trackerMonthLabel}</CardTitle>
                  <CardDescription className="mt-1 max-w-2xl">
                    A month-at-a-glance tracker for live monitoring windows. Today reflects the current system state, while the calendar gives teams a clear operating view without hiding the most recent check cadence.
                  </CardDescription>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Today</p>
                    <div className="mt-2 flex items-center gap-2">
                      {data && getStatusIcon(data.status)}
                      <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                        {data?.status === "operational" ? "Operational" : "Attention needed"}
                      </span>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Last Check</p>
                    <p className="mt-2 font-mono text-sm font-bold text-zinc-900 dark:text-zinc-100">
                      {lastUpdated.toLocaleTimeString("en-KE", {
                        hour: "numeric",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Next Auto Check</p>
                    <p className="mt-2 font-mono text-sm font-bold text-zinc-900 dark:text-zinc-100">
                      {nextCheckAt.toLocaleTimeString("en-KE", {
                        hour: "numeric",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-5 sm:p-6">
              <div className="mb-4 flex flex-wrap items-center gap-3 text-xs text-zinc-500">
                <div className="inline-flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                  <span>Live operational day</span>
                </div>
                <div className="inline-flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
                  <span>Live degraded day</span>
                </div>
                <div className="inline-flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-zinc-300 dark:bg-zinc-600" />
                  <span>Monitoring window</span>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-2">
                {WEEKDAY_LABELS.map((day) => (
                  <div
                    key={day}
                    className="px-2 pb-2 text-center text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-400"
                  >
                    {day}
                  </div>
                ))}

                {trackerDays.map((day) => {
                  const isOperationalToday = day.isToday && data?.status === "operational";
                  const isDegradedToday = day.isToday && data?.status !== "operational";

                  return (
                    <div
                      key={day.date.toISOString()}
                      className={`min-h-24 rounded-2xl border p-3 transition-colors sm:min-h-28 ${
                        day.isCurrentMonth
                          ? "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
                          : "border-zinc-100 bg-zinc-50/80 text-zinc-300 dark:border-zinc-900 dark:bg-zinc-950/50 dark:text-zinc-700"
                      } ${day.isToday ? "ring-2 ring-emerald-500/30" : ""}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span
                          className={`text-sm font-bold ${
                            day.isToday
                              ? "text-zinc-900 dark:text-zinc-100"
                              : "text-zinc-500 dark:text-zinc-400"
                          }`}
                        >
                          {day.date.getDate()}
                        </span>
                        <span
                          className={`mt-1 h-2.5 w-2.5 rounded-full ${
                            isOperationalToday
                              ? "bg-green-500"
                              : isDegradedToday
                                ? "bg-yellow-500"
                                : "bg-zinc-300 dark:bg-zinc-600"
                          }`}
                        />
                      </div>

                      <div className="mt-6 space-y-1">
                        {day.isToday ? (
                          <>
                            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400">
                              Live Now
                            </p>
                            <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                              {data?.status === "operational" ? "Systems healthy" : "Watching degraded services"}
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400">
                              Monitoring
                            </p>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">
                              Scheduled checks
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Service Grid */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold flex items-center gap-2 px-2 text-zinc-700 dark:text-zinc-300">
              <Server className="w-5 h-5 text-zinc-400" />
              Service Status
            </h3>
            <div className="grid gap-4">
              {data && Object.entries(data.services).map(([key, service], index) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-md transition-all duration-300 group">
                    <CardHeader className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg transition-colors ${
                            service.status === 'healthy' || service.status === 'configured' 
                              ? 'bg-zinc-100 dark:bg-zinc-800' 
                              : 'bg-red-50 dark:bg-red-900/20'
                          }`}>
                            {key === 'database' && <Database className="w-4 h-4 text-blue-500" />}
                            {key === 'cache' && <HardDrive className="w-4 h-4 text-purple-500" />}
                            {key === 'email' && <Mail className="w-4 h-4 text-orange-500" />}
                            {key === 'ai' && <Activity className="w-4 h-4 text-pink-500" />}
                          </div>
                          <div>
                            <CardTitle className="text-sm font-bold">{service.name}</CardTitle>
                            <CardDescription className="text-xs font-mono">{service.message}</CardDescription>
                          </div>
                        </div>
                        {getStatusIcon(service.status)}
                      </div>
                    </CardHeader>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* System Performance */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold flex items-center gap-2 px-2 text-zinc-700 dark:text-zinc-300">
              <Cpu className="w-5 h-5 text-zinc-400" />
              Infrastructure
            </h3>
            <Card className="h-fit">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-bold">Instance Resources</CardTitle>
                  <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-tighter">
                    {data?.system.platform}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-zinc-500 font-medium uppercase tracking-wider">Memory Utilization</span>
                    <span className="text-zinc-900 dark:text-zinc-100 font-mono font-bold">{data?.system.memory.usage}</span>
                  </div>
                  <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: data?.system.memory.usage }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={`h-full ${parseInt(data?.system.memory.usage || '0') > 80 ? 'bg-red-500' : 'bg-green-500'}`} 
                    />
                  </div>
                  <p className="text-[10px] text-zinc-400 text-right">
                    {data?.system.memory.free} available of {data?.system.memory.total}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800">
                    <span className="text-[10px] text-zinc-400 uppercase font-bold block mb-1 tracking-widest">Uptime</span>
                    <span className="text-lg font-mono font-bold text-zinc-700 dark:text-zinc-300">{data?.system.uptime}</span>
                  </div>
                  <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800">
                    <span className="text-[10px] text-zinc-400 uppercase font-bold block mb-1 tracking-widest">CPU Cores</span>
                    <span className="text-lg font-mono font-bold text-zinc-700 dark:text-zinc-300">{data?.system.cpus}</span>
                  </div>
                </div>

                <div className="pt-4 flex items-center gap-2 text-[10px] text-zinc-400 uppercase font-bold tracking-widest border-t border-zinc-100 dark:border-zinc-800">
                  <Clock className="w-3 h-3 text-green-600" />
                  Region: EU-Central (Edge Runtime)
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
