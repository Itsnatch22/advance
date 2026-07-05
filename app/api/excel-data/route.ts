import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { publicReadLimiter, checkRateLimit } from "@/lib/security/rate-limit";

// NOTE: This in-memory cache is per-process and is NOT shared across Vercel
// serverless instances. Each cold-start or instance will independently warm the
// cache from disk. This is acceptable for a small static file, but if you need a
// distributed cache in future, replace this with Redis or a Vercel KV store.
let cache: { ts: number; data: unknown } | null = null;
const CACHE_TTL = 1000 * 60 * 1;

export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const rl = await checkRateLimit(publicReadLimiter, ip);
  if (!rl.success) {
    return NextResponse.json({ error: "Rate limit exceeded. Please try again later." }, { status: 429, headers: rl.headers });
  }
  const file = path.join(process.cwd(), "data", "excel.json");
  if (cache && Date.now() - cache.ts < CACHE_TTL) {
    return NextResponse.json(cache.data);
  }

  try {
    await fs.access(file);
  } catch {
    return NextResponse.json({ error: "excel.json missing" }, { status: 500 });
  }

  const raw = await fs.readFile(file, "utf8");
  const data = JSON.parse(raw);
  cache = { ts: Date.now(), data };
  return NextResponse.json(data);
}
