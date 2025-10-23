// app/api/calc/route.ts
import { NextResponse } from "next/server";

type Body = {
  salary: number;          // gross monthly
  cycleDays: number;       // total days in cycle (e.g. 30)
  daysWorked: number;      // days worked (from slider)
  advanced: number;        // already advanced (KES)
  feePercent: number;      // platform percent
  flatFee: number;         // platform flat fee
  accessPercentOverride?: number; // (ignored) access cap forced to server-side 60%
  allowances: {
    otherRemuneration: number; // 0 if unchecked
    mealAllowance: number;
    nightAllowance: number;
    pensionCover: number;
    medicalCover: number;
  };
};

// Configurable server constants (edit to match your official rates)
const ACCESS_CAP_PERCENT = 60; // forced server-side cap
const NSSF_TIERS = [
  /* Example dynamic tiers - change to legal values
     each tier: { upTo: number | null, rate: number }
     upTo is gross amount boundary in KES (null means infinite)
  */
  { upTo: 6000, rate: 0.06 },   // tier 1 example
  { upTo: null, rate: 0.06 },   // tier 2 example (same rate here, can be adjusted)
];

const SHIF_RATE = 0.0275; // county health levy
const HOUSING_RATE = 0.015;

function calcNSSF(gross: number) {
  // Dynamic tiered NSSF summary (simple progressive application)
  // If you want a non-progressive cap, change this.
  let remaining = gross;
  let total = 0;
  for (const tier of NSSF_TIERS) {
    if (remaining <= 0) break;
    if (tier.upTo == null) {
      // unlimited remaining gets rate
      total += remaining * tier.rate;
      remaining = 0;
      break;
    }
    const portion = Math.min(remaining, tier.upTo);
    total += portion * tier.rate;
    remaining -= portion;
  }
  return Math.round(total);
}

export async function POST(req: Request) {
  try {
    const body: Body = await req.json();

    const gross = Number(body.salary || 0);
    const cycle = Number(body.cycleDays || 30);
    const days = Math.max(0, Math.min(Number(body.daysWorked || 0), cycle));
    const advanced = Number(body.advanced || 0);
    const feePercent = Number(body.feePercent || 0);
    const flatFee = Number(body.flatFee || 0);

    // allowances (only included if passed as amounts)
    const allowances = body.allowances || {
      otherRemuneration: 0,
      mealAllowance: 0,
      nightAllowance: 0,
      pensionCover: 0,
      medicalCover: 0,
    };
    const allowancesTotal =
      Number(allowances.otherRemuneration || 0) +
      Number(allowances.mealAllowance || 0) +
      Number(allowances.nightAllowance || 0) +
      Number(allowances.pensionCover || 0) +
      Number(allowances.medicalCover || 0);

    // Deductions
    const NSSF = calcNSSF(gross);
    const SHIF = Math.round(gross * SHIF_RATE);
    const Housing = Math.round(gross * HOUSING_RATE);
    const deductionsTotal = NSSF + SHIF + Housing;

    // Net monthly after deductions (simple)
    const netMonthly = Math.round(gross - deductionsTotal + allowancesTotal);

    // Accrued gross pro-rata for worked days
    const accruedGross = (gross / cycle) * days + allowancesTotal * (days / cycle);

    // Access cap (server side fixed)
    const accessCap = (accruedGross * ACCESS_CAP_PERCENT) / 100;

    // Available before fees (consider previously advanced)
    const availableBeforeFees = Math.max(0, accessCap - advanced);

    // Platform fee (percent + flat)
    const platformFee = Math.max(0, (availableBeforeFees * feePercent) / 100 + flatFee);

    // Accessible now to employee
    const accessibleNow = Math.max(0, availableBeforeFees - platformFee);

    const response = {
      success: true,
      accessCapPercent: ACCESS_CAP_PERCENT,
      accruedGross: Math.round(accruedGross),
      netMonthly: Math.round(netMonthly),
      accessCap: Math.round(accessCap),
      platformFee: Math.round(platformFee),
      accessibleNow: Math.round(accessibleNow),
      deductions: {
        NSSF,
        SHIF,
        Housing,
        Total: deductionsTotal,
      },
      allowances: {
        ...allowances,
        total: Math.round(allowancesTotal),
      },
      inputs: {
        gross,
        cycle,
        days,
        advanced,
        feePercent,
        flatFee,
      },
    };

    return NextResponse.json(response, { status: 200 });
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
