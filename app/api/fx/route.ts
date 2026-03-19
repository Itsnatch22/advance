import { NextResponse } from "next/server";

// USD added so the client can convert the flat $2 advance fee to KES
const SYMBOLS = ["KES", "UGX", "TZS", "RWF", "BIF", "SOS", "USD"].join(",");

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
  } catch (err: unknown) {
    return NextResponse.json({ error: "Failed to fetch FX rates" }, { status: 502 });
  }
}