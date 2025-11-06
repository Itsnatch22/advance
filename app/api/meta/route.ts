// /app/api/meta/route.ts
import { NextResponse } from "next/server";
import { readCountryConfig } from "@/lib/calc";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const country = searchParams.get("country")?.toUpperCase() || "KE";
    const data = readCountryConfig(country);
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Metadata load failed" },
      { status: 500 }
    );
  }
}
