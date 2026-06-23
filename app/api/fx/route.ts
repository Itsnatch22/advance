import { NextResponse } from "next/server";


const SYMBOLS = ["KES", "UGX", "TZS", "RWF", "BIF", "SOS", "USD"].join(",");

export async function GET() {
  try {
    const res = await fetch(
      `https://api.exchangerate.host/latest?base=USD&symbols=${SYMBOLS}`,
      { next: { revalidate: 3600 } } 
    );

    if (!res.ok) {
      throw new Error("FX provider returned error");
    }

    const data = await res.json();

    return NextResponse.json(
      { rates: data.rates ?? null, fetchedAt: Date.now() },
      { status: 200 }
    );
  } catch {
    return NextResponse.json({ error: "Failed to fetch FX rates" }, { status: 502 });
  }
}