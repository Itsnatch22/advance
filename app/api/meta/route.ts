// /app/api/meta/route.ts
import { NextResponse } from "next/server";
import { readCountryConfig } from "@/lib/calc";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const country = (searchParams.get("country") || "KE").toUpperCase();
    const cfg = readCountryConfig(country);

    // return a compact meta package for frontend
    return NextResponse.json({
      success: true,
      country,
      meta: cfg.meta,
      deductions: cfg.deductions || [],
    });
  } catch (err: any) {
    console.error("meta route error:", err);
    return NextResponse.json({ success: false, error: String(err?.message || err) }, { status: 500 });
  }
}
