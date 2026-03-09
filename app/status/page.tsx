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
  Server
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
