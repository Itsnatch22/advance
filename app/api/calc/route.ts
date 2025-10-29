// app/api/calc/route.ts — Null-proof JSON parse, '25-ready, sheet-loyal 😮‍💨
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import path from "path";
import fs from "fs";
import { existsSync } from "fs";

// Helper types (future-scaled)
type InputPayload = {
  salary: number; // gross monthly salary
  country?: string;
  cycleDays: number;
  daysWorked: number;
  allowances: Record<string, number>; // e.g., { meal: 2000 }
  feePercent?: number;
  flatFee?: number;
  insurancePremium?: number; // opt: for 15% relief (cap 5k)
  pensionDeduct?: number; // opt: cap 30k
};

type CalcResult = {
  success: boolean;
  accruedGross: number;
  netMonthly: number;
  accessCapPercent: number;
  accessCap: number;
  platformFee: number;
  accessibleNow: number;
  deductions: {
    NSSF: number;
    SHIF: number;
    Housing: number;
    PAYE: number;
  };
  error?: string;
};

const JSON_PATH = path.join(process.cwd(), "data", "calc.json");

// -- Utilities (null-safe parse for your JSON vibes)
function loadJson() {
  if (!existsSync(JSON_PATH)) throw new Error("calc.json not found at " + JSON_PATH);
  const raw = fs.readFileSync(JSON_PATH, "utf8");
  const data = JSON.parse(raw);
  return data;
}

function parseRatesSheet(data: any) {
  const ratesSheet = data.Rates || [];
  const rates: Record<string, any> = {};

  // Parse rates: "General " = key (str), "Amount/Threshold" = val (skip headers/nulls)
  for (const row of ratesSheet) {
    if (row && typeof row["General "] === "string" && row["Amount/Threshold"] !== undefined) {
      const key = row["General "].trim();
      if (key && !key.startsWith("Lower") && !key.startsWith("PAYE")) {
        rates[key] = Number(row["Amount/Threshold"]);
      }
    }
  }

  // Parse bands: numeric "General " (lower), "Description" (rate), optional "Amount/Threshold" (upper)
  const bands: Array<{ lower: number; upper: number | null; rate: number }> = [];
  for (const row of ratesSheet) {
    if (row && typeof row["General "] === "number" && typeof row["Description"] === "number") {
      const lower = Number(row["General "]);
      const upper = row["Amount/Threshold"] !== undefined && typeof row["Amount/Threshold"] === "number"
        ? Number(row["Amount/Threshold"])
        : null;
      const rate = Number(row["Description"]);
      bands.push({ lower, upper, rate });
    }
  }

  // Fallback bands if parse ghosts (sheet's chef's kiss, but safety net)
  if (bands.length === 0) {
    bands.push(
      { lower: 0, upper: 24000, rate: 0.1 },
      { lower: 24000, upper: 32333, rate: 0.25 },
      { lower: 32333, upper: 500000, rate: 0.3 },
      { lower: 500000, upper: 800000, rate: 0.325 },
      { lower: 800000, upper: null, rate: 0.35 }
    );
  }

  return { rates, bands };
}

// -- Calc (sheet mirror: deds → taxable → PAYE → net → 60% net cap)
function calculateFromPayload(
  input: InputPayload,
  ratesObj: Record<string, any>,
  bands: Array<{ lower: number; upper: number | null; rate: number }>
): CalcResult {
  const cycleDays = input.cycleDays || 30;
  const days = Math.max(0, Math.min(cycleDays, input.daysWorked || 0));
  let baseGross = Number(input.salary || 0);
  const allowancesValue = Object.values(input.allowances || {}).reduce((s, v) => s + Number(v || 0), 0);

  // Accrued: pro-rata salary + full allowances (sheet Total_Income)
  const accruedGross = Math.round((baseGross / cycleDays) * days + allowancesValue);

  // NSSF: 6% * min(gross, 72k) employee (simplified uniform rate, deductible)
  const NSSF_rate = Number(ratesObj["NSSF_Employee_Rate"] ?? 0.06);
  const NSSF_tier2 = Number(ratesObj["NSSF_Tier2_Ceiling"] ?? 72000);
  const nssf = Math.round(Math.min(accruedGross, NSSF_tier2) * NSSF_rate); // Sheet 2,100 for 35k

  // SHIF: 2.75% gross, min 300 (deductible)
  const shifRate = Number(ratesObj["SHIF_Flat_Rate"] ?? 0.0275);
  const shif = Math.round(Math.max(300, accruedGross * shifRate));

  // AHL/Housing: 1.5% gross (deductible)
  const ahlRate = Number(ratesObj["AHL_Employee_Rate"] ?? ratesObj["Housing_Levy_Rate"] ?? 0.015);
  const housing = Math.round(accruedGross * ahlRate);

  // Other deds (sheet caps)
  const pensionDed = Math.min(Number(input.pensionDeduct ?? 0), Number(ratesObj["Pension_Deductible_Cap"] ?? 30000));
  const insuranceRelief = Math.min(Number(input.insurancePremium ?? 0) * 0.15, Number(ratesObj["Life_And_Health_Insurance_Deductible_Limit"] ?? 5000));

  // Taxable: gross - statutory - other allowable (Output row26)
  const taxable = Math.max(0, accruedGross - nssf - shif - housing - pensionDed - insuranceRelief);

  // PAYE: progressive on taxable
  function calcPAYE(income: number) {
    if (bands.length === 0) return Math.round(income * 0.2); // Rough fallback
    let tax = 0;
    const sorted = bands.slice().sort((a, b) => a.lower - b.lower);
    for (const band of sorted) {
      const lower = band.lower;
      const upper = band.upper ?? Infinity;
      if (income <= lower) continue;
      const inBand = Math.max(0, Math.min(income, upper) - lower);
      tax += inBand * band.rate;
    }
    return Math.round(tax);
  }

  const payeBefore = calcPAYE(taxable);
  const personalRelief = Number(ratesObj["Personal_Relief"] ?? 2400);
  const paye = Math.max(0, payeBefore - personalRelief);

  // Platform fee (input > default 5%)
  const feePercent = Number(input.feePercent ?? ratesObj["platform_fee_percent"] ?? 5) / 100;
  const flatFee = Number(input.flatFee ?? 0);
  const platformFee = Math.round(accruedGross * feePercent + flatFee);

  // Net: gross - all - PAYE - platform (Output row31)
  const netMonthly = Math.max(0, Math.round(accruedGross - nssf - shif - housing - pensionDed - insuranceRelief - paye - platformFee));

  // Cap: 60% net (Output row33; legal ≤67%)
  const accessCapPercentRaw = Number(ratesObj["Earned_Wage_Cap"] ?? 0.6);
  const accessCap = Math.round(netMonthly * accessCapPercentRaw);

  // Accessible: cap - platform - NSSF (prorate; PAYE monthly=0)
  const accessibleNow = Math.max(0, Math.round(accessCap - platformFee - nssf));

  return {
    success: true,
    accruedGross,
    netMonthly,
    accessCapPercent: Math.round(accessCapPercentRaw * 100),
    accessCap,
    platformFee,
    accessibleNow,
    deductions: { NSSF: nssf, SHIF: shif, Housing: housing, PAYE: paye },
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const input: InputPayload = {
      salary: Number(body.salary ?? 0),
      country: body.country ?? "KE",
      cycleDays: Number(body.cycleDays ?? 30),
      daysWorked: Number(body.daysWorked ?? 0),
      allowances: body.allowances ?? {},
      feePercent: Number(body.feePercent ?? 5),
      flatFee: Number(body.flatFee ?? 0),
      insurancePremium: Number(body.insurancePremium ?? 0),
      pensionDeduct: Number(body.pensionDeduct ?? 0),
    };

    const data = loadJson();
    const { rates, bands } = parseRatesSheet(data);
    const result = calculateFromPayload(input, rates, bands);

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("calc route error", err);
    return NextResponse.json({ success: false, error: err?.message ?? "server error" }, { status: 500 });
  }
}