
export const runtime = "nodejs";
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { z } from "zod";
import { calc, type JsonConfig } from "@/lib/finance/calc";
import { supabaseAdmin } from "@/lib/supabase/supabase";
import { calcLimiter, checkRateLimit } from "@/lib/security/rate-limit";

const payloadSchema = z.object({
  salary: z.number().finite().nonnegative(),
  daysWorked: z.number().finite().nonnegative(),
  cycleDays: z.number().finite().positive(),
  allowances: z.record(z.string(), z.number().finite()).optional(),
});


const CONFIG_PATHS = {
  KE: path.join(process.cwd(), "data", "calcke.json"),
  UG: path.join(process.cwd(), "data", "calcug.json"),
  TZ: path.join(process.cwd(), "data", "calctz.json"),
  RW: path.join(process.cwd(), "data", "calcrw.json"),
} as const;


async function readCountryConfig(country: string): Promise<JsonConfig> {
  const rawCode = (country || "").toUpperCase();

  
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


const locationCache = new Map<
  string,
  { expires: number; value: { country: string | null; city: string | null } }
>();
const LOCATION_CACHE_TTL = 5 * 60 * 1000; 

async function getLocationFromIP(ip: string) {
  if (!ip || ip === "unknown" || ip.startsWith("127.")) {
    return { country: null, city: null };
  }

  const cached = locationCache.get(ip);
  if (cached && Date.now() < cached.expires) {
    return cached.value;
  }

  const controller = new AbortController();
  const timeoutMs = 5000;
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`https://ipapi.co/${ip}/json/`, {
      headers: { "User-Agent": "eaziwage-backend" },
      cache: "no-store",
      signal: controller.signal,
    });

    if (!res.ok) {
      return { country: null, city: null };
    }

    const data = await res.json();
    const value = {
      country: data.country_code ?? null,
      city: data.city ?? null,
    };

    locationCache.set(ip, {
      expires: Date.now() + LOCATION_CACHE_TTL,
      value,
    });

    return value;
  } catch {
    return { country: null, city: null };
  } finally {
    clearTimeout(timeout);
  }
}



export async function POST(req: Request) {
  try {

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      req.headers.get("x-real-ip") ??
      "unknown";

    const rl = await checkRateLimit(calcLimiter, ip);
    if (!rl.success) return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429, headers: rl.headers });

    const device = req.headers.get("user-agent") ?? "unknown";



    const cookieHeader = req.headers.get("cookie") || "";
    const hasConsent = cookieHeader.includes("cookie-consent=accepted");


    const location = hasConsent
      ? await getLocationFromIP(ip)
      : { country: null, city: null };


    const { searchParams } = new URL(req.url);
    const country = (searchParams.get("country") || "KE").toUpperCase();

    const rawBody = await req.json();
    const parsed = payloadSchema.safeParse(rawBody);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
    }
    const payload = { ...parsed.data, country };

    const cfg = await readCountryConfig(country);

    
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

    
    const { error: insertError } = await supabaseAdmin
      .from("wage_calculations")
      .insert({
        gross_pay: result.gross,
        net_pay: result.netPay,
        deductions: deductions,
        country: location.country,
        city: location.city,
        ip_address: hasConsent ? ip : "anonymous",
        device: hasConsent ? device : "anonymous",
        created_at: new Date().toISOString(),
      });

    if (insertError) {
      console.error("❌ Supabase insert error (wage_calculations):", {
        message: insertError.message,
        code: insertError.code,
        country,
        gross: result.gross,
        netPay: result.netPay,
      });
      // Analytics write failure — do not fail the request
    }
    

    
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
