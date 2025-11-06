// /app/api/calc/route.ts
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { calc, type Payload, type JsonConfig } from "@/lib/calc";

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
  } catch (err) {
    console.error(`❌ Failed reading config for ${country}:`, err);
    throw new Error(`Missing or unreadable config: ${fileName}`);
  }
}

// Main POST handler
export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const country = (searchParams.get("country") || "KE").toUpperCase();

    const payload = (await req.json()) as Payload;
    payload.country = country;

    const cfg = await readCountryConfig(country);

    // ✅ Run main calc engine
    const result = calc(payload, cfg);

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
