import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { redis } from "@/lib/rate-limit";
import os from "os";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const start = Date.now();
  
  // Perform health checks in parallel
  const [supabaseRes, redisRes] = await Promise.allSettled([
    // Check Supabase connectivity by querying a small amount of data
    supabase.from("companies").select("id", { count: "exact", head: true }).limit(1),
    // Check Redis connectivity
    redis.ping(),
  ]);

  const supabaseStatus = supabaseRes.status === "fulfilled" && !supabaseRes.value.error ? "healthy" : "unhealthy";
  const redisStatus = redisRes.status === "fulfilled" && redisRes.value === "PONG" ? "healthy" : "unhealthy";
  
  const end = Date.now();
  const latency = end - start;

  const isOperational = supabaseStatus === "healthy" && redisStatus === "healthy";

  return NextResponse.json({
    status: isOperational ? "operational" : "degraded",
    timestamp: new Date().toISOString(),
    latency: `${latency}ms`,
    services: {
      database: {
        name: "Supabase (PostgreSQL)",
        status: supabaseStatus,
        message: supabaseRes.status === "rejected" ? "Connection failed" : (supabaseRes.value.error ? supabaseRes.value.error.message : "Connected"),
      },
      cache: {
        name: "Upstash Redis",
        status: redisStatus,
        message: redisRes.status === "fulfilled" ? "Connected" : "Ping failed",
      },
      email: {
        name: "Resend",
        status: process.env.RESEND_API_KEY ? "healthy" : "not-configured",
        message: process.env.RESEND_API_KEY ? "API Key present" : "Missing API Key",
      },
      ai: {
        name: "OpenAI",
        status: process.env.OPENAI_API_KEY ? "healthy" : "not-configured",
        message: process.env.OPENAI_API_KEY ? "API Key present" : "Missing API Key",
      }
    },
    system: {
      memory: {
        free: Math.round(os.freemem() / 1024 / 1024) + "MB",
        total: Math.round(os.totalmem() / 1024 / 1024) + "MB",
        usage: `${Math.round((1 - os.freemem() / os.totalmem()) * 100)}%`,
      },
      uptime: `${Math.floor(os.uptime() / 3600)}h ${Math.floor((os.uptime() % 3600) / 60)}m`,
      platform: os.platform(),
      cpus: os.cpus().length,
    }
  });
}
