// /app/api/calc/route.ts
export const runtime = "nodejs";
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { calc, type Payload, type JsonConfig } from "@/lib/calc";
import { supabaseAdmin } from "@/lib/supabase";

// Base data path where your JSON config files live
const dataDir = path.join(process.cwd(), "data");

// Dynamically read JSON config per country
async function readCountryConfig(country: string): Promise<JsonConfig> {
  const fileMap: Record<string, string> = {
    KE: "calcke.json",
    UG: "calcug.json",
    TZ: "calctz.json",
    RW: "calcrw.json",
  };

  const code = (country || "KE").toUpperCase();
  const fileName = fileMap[code] || fileMap["KE"];
  const filePath = path.join(dataDir, fileName);

  try {
    const raw = await fs.readFile(filePath, "utf8");
    const parsed = JSON.parse(raw) as JsonConfig;
    return parsed;
  } catch (err: unknown) {
    console.error(`❌ Failed reading config for ${country}:`, err);
    throw new Error(`Missing or unreadable config: ${fileName}`);
  }
}

// ✅ STEP 5 — get location from IP (backend-only, clean)
async function getLocationFromIP(ip: string) {
  if (!ip || ip === "unknown" || ip.startsWith("127.")) {
    return { country: null, city: null };
  }

  try {
    const res = await fetch(`https://ipapi.co/${ip}/json/`, {
      headers: { "User-Agent": "eaziwage-backend" },
      cache: "no-store",
    });

    if (!res.ok) {
      return { country: null, city: null };
    }

    const data = await res.json();

    return {
      country: data.country_code ?? null,
      city: data.city ?? null,
    };
  } catch {
    return { country: null, city: null };
  }
}
// ✅ END STEP 5

// Main POST handler
export async function POST(req: Request) {
  try {
    // ✅ STEP 4 — capture IP & device (server-side)
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0] ??
      req.headers.get("x-real-ip") ??
      "unknown";

    const device = req.headers.get("user-agent") ?? "unknown";
    // ✅ END STEP 4

    // ✅ STEP 5 — resolve location from IP
    const location = await getLocationFromIP(ip);
    // ✅ END STEP 5

    const { searchParams } = new URL(req.url);
    const country = (searchParams.get("country") || "KE").toUpperCase();

    const payload = (await req.json()) as Payload;
    payload.country = country;

    const cfg = await readCountryConfig(country);

    // ✅ Run main calc engine
    const result = calc(payload, cfg);

    const deductions =
      result.nssfEmployee +
      result.rssb.pensionEmployee +
      result.rssb.medicalEmployee +
      result.rssb.maternityEmployee +
      result.shif +
      result.housingLevy +
      result.payeAfterRelief +
      result.lst;

    // ✅ STEP 6 — save calculation to Supabase (TRIGGERED ON CALCULATE)
    const { error: insertError } = await supabaseAdmin
      .from("wage_calculations")
      .insert({
        gross_pay: result.gross,
        net_pay: result.netPay,
        deductions: deductions,
        country: location.country,
        city: location.city,
        ip_address: ip,
        device: device,
        created_at: new Date().toISOString(),
      });

    if (insertError) {
      console.error("❌ Supabase insert error:", insertError);
      // Optionally, you could return a specific error response here
    }
    // ✅ END STEP 6

    // Envelope for debugging + traceability
    const response = {
      ...result,
      _meta: {
        country,
        jsonFile: `${country.toLowerCase()}.json`,
        timestamp: new Date().toISOString(),
      },
    };

    return NextResponse.json(response);
  } catch (err: any) {
    console.error("❌ /api/calc failed:", err);

    return NextResponse.json(
      {
        success: false,
        error: err?.message || "Internal calculation error",
      },
      { status: 500 }
    );
  }
}
