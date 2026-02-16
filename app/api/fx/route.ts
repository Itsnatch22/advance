// app/api/fx/route.ts
import { NextResponse } from "next/server";

const SYMBOLS = ["KES", "UGX", "TZS", "RWF", "BIF", "SOS"].join(",");

export async function GET() {
  try {
    const res = await fetch(
      `https://api.exchangerate.host/latest?base=KES&symbols=${SYMBOLS}`,
      { next: { revalidate: 3600 } } // cache on server for 1 hour
    );

    if (!res.ok) {
      throw new Error("FX provider returned error");
    }

    const data = await res.json();

    return NextResponse.json(
      { rates: data.rates ?? null, fetchedAt: Date.now() },
      { status: 200 }
    );
  } catch (err: any) {
    // keep response simple; client will fallback to embedded rates
    return NextResponse.json({ error: "Failed to fetch FX rates" }, { status: 502 });
  }
}
