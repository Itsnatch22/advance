// /app/api/calc/route.ts
export const runtime = "nodejs";
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { calc, type Payload, type JsonConfig } from "@/lib/calc";
import { supabaseAdmin } from "@/lib/supabase";

// Hardcoded config file paths to prevent path traversal
const CONFIG_PATHS = {
  KE: path.join(process.cwd(), "data", "calcke.json"),
  UG: path.join(process.cwd(), "data", "calcug.json"),
  TZ: path.join(process.cwd(), "data", "calctz.json"),
  RW: path.join(process.cwd(), "data", "calcrw.json"),
} as const;

type AllowedCountry = keyof typeof CONFIG_PATHS;

// Read JSON config for a country using only hardcoded paths
async function readCountryConfig(country: string): Promise<JsonConfig> {
  const rawCode = (country || "").toUpperCase();

  // Select hardcoded path based on validated country code
  let filePath: string;
  switch (rawCode) {
    case "KE":
      filePath = CONFIG_PATHS.KE;
      break;
    case "UG":
      filePath = CONFIG_PATHS.UG;
      break;
    case "TZ":
      filePath = CONFIG_PATHS.TZ;
      break;
    case "RW":
      filePath = CONFIG_PATHS.RW;
      break;
    default:
      filePath = CONFIG_PATHS.KE;
      break;
  }

  try {
    const raw = await fs.readFile(filePath, "utf8");
    const parsed = JSON.parse(raw) as JsonConfig;
    return parsed;
  } catch (err: unknown) {
    console.error("Failed reading config file:", err);
    throw new Error("Missing or unreadable config file");
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
  } catch (err: { message?: string } | unknown) {
    console.error("❌ /api/calc failed:", err);

    const errorMessage = err instanceof Error ? err.message : "server error";
    return NextResponse.json(
      {
        success: false,
        error: errorMessage || "Internal calculation error",
      },
      { status: 500 }
    );
  }
}
