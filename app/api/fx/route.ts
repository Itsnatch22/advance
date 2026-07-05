import { NextRequest, NextResponse } from "next/server";
import { publicReadLimiter, checkRateLimit } from "@/lib/security/rate-limit";


const SYMBOLS = ["KES", "UGX", "TZS", "RWF", "BIF", "SOS", "USD"].join(",");

export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const rl = await checkRateLimit(publicReadLimiter, ip);
  if (!rl.success) {
    return NextResponse.json({ error: "Rate limit exceeded. Please try again later." }, { status: 429, headers: rl.headers });
  }

  try {
    const res = await fetch(
      `https://api.exchangerate.host/latest?base=USD&symbols=${SYMBOLS}`,
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) {
      throw new Error("FX provider returned error");
    }

    const data = await res.json();

    if (!data || typeof data !== "object" || !("rates" in data)) {
      return NextResponse.json({ error: "Invalid response from FX provider" }, { status: 502 });
    }

    return NextResponse.json(
      { rates: data.rates ?? null, fetchedAt: Date.now() },
      { status: 200 }
    );
  } catch {
    return NextResponse.json({ error: "Failed to fetch FX rates" }, { status: 502 });
  }
}