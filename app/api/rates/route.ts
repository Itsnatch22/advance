import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { existsSync } from "fs";

const JSON_PATH = path.join(process.cwd(), "data", "calc.json");

function loadJson() {
  if (!existsSync(JSON_PATH)) throw new Error("calc.json not found at " + JSON_PATH);
  const raw = fs.readFileSync(JSON_PATH, "utf8");
  return JSON.parse(raw);
}

function parseRatesSheet(data: any) {
  const ratesSheet = data.Rates || [];
  const rates: Record<string, any> = {};

  for (const row of ratesSheet) {
    if (row && typeof row["General "] === "string" && row["Amount/Threshold"] !== undefined) {
      const key = row["General "].trim();
      if (key && !key.startsWith("Lower") && !key.startsWith("PAYE")) {
        rates[key] = Number(row["Amount/Threshold"]);
      }
    }
  }

  return rates;
}

export async function GET() {
  try {
    const data = loadJson();
    const rates = parseRatesSheet(data);
    return NextResponse.json({ success: true, rates });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message ?? "server error" }, { status: 500 });
  }
}
