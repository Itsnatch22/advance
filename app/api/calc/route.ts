import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// 🔹 Helper: read country JSON safely
function readCountryJson(code: string) {
  const names: Record<string, string> = {
    KE: "calcke.json",
    UG: "calcug.json",
    TZ: "calctz.json",
    RW: "calcrw.json",
  };

  const fname = names[code] ?? names["KE"];
  const tryPaths = [
    path.join(process.cwd(), "data", fname),
    path.join(process.cwd(), "app", "api", "calc", "data", fname),
    path.join(process.cwd(), fname),
    path.join("/mnt/data", fname),
  ];

  for (const p of tryPaths) {
    try {
      if (fs.existsSync(p)) {
        const raw = fs.readFileSync(p, "utf8");
        const parsed = JSON.parse(raw);
        return parsed;
      }
    } catch (e) {
      console.warn(`❌ Failed to read ${p}:`, e);
    }
  }

  throw new Error(`Country JSON not found for ${code}. Tried: ${tryPaths.join(", ")}`);
}

// 🔹 Helper: extract PAYE tax bands
function extractBands(ratesJson: any) {
  const rates = Array.isArray(ratesJson?.Rates)
    ? ratesJson.Rates.filter(Boolean)
    : ratesJson?.rates?.filter(Boolean) ?? [];

  const bands: { from: number; to?: number; rate: number }[] = [];

  for (const row of rates) {
    if (!row) continue;
    const lower = Number(row["General "] ?? row.General);
    const upper = Number(row["Amount/Threshold"] ?? row.to ?? row.Upper ?? NaN);
    const rate = Number(row["Description"] ?? row.Rate ?? row.rate ?? NaN);
    if (!isNaN(lower) && !isNaN(rate)) {
      bands.push({
        from: lower,
        to: isNaN(upper) ? undefined : upper,
        rate: rate > 1 ? rate / 100 : rate, // normalize if Excel uses 10 instead of 0.1
      });
    }
  }

  // default if missing
  if (bands.length === 0) bands.push({ from: 0, to: undefined, rate: 0 });

  // sort ascending
  bands.sort((a, b) => a.from - b.from);
  return bands;
}

// 🔹 Progressive PAYE calculator
function calcPaye(taxable: number, bands: any[], relief = 0) {
  let rem = taxable;
  let total = 0;
  const breakdown: any[] = [];

  for (const b of bands) {
    if (rem <= 0) break;
    const upper = b.to ?? Infinity;
    const bandSize = isFinite(upper) ? Math.max(0, upper - b.from) : rem;
    const taxableBand = Math.min(rem, bandSize);
    const tax = taxableBand * b.rate;
    breakdown.push({ ...b, taxableBand, tax });
    total += tax;
    rem -= taxableBand;
  }

  const afterRelief = Math.max(0, total - (relief ?? 0));
  return { total: afterRelief, breakdown };
}

// 🔹 Safe finder
function findRate(arr: any[], key: string) {
  if (!Array.isArray(arr)) return undefined;
  const safeArr = arr.filter(Boolean);
  const found = safeArr.find(
    (r: any) =>
      r?.["General "]?.toString()?.toUpperCase() === key.toUpperCase() ||
      r?.General?.toString()?.toUpperCase() === key.toUpperCase()
  );
  return found?.["Amount/Threshold"] ?? found?.Amount ?? undefined;
}

// 🔹 Lookup helper for NHIF / SHIF if structured table exists
function calcLookup(gross: number, table?: { upto: number; amount: number }[]) {
  if (!Array.isArray(table) || !table.length) return 0;
  for (const row of table) {
    if (gross <= row.upto) return row.amount;
  }
  return table[table.length - 1].amount;
}

// 🔹 Main API route
export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const country = (url.searchParams.get("country") || "KE").toUpperCase();
    const payload = await req.json().catch(() => ({}));

    const doc = readCountryJson(country);
    const ratesArr = Array.isArray(doc?.Rates)
      ? doc.Rates.filter(Boolean)
      : Array.isArray(doc?.rates)
      ? doc.rates.filter(Boolean)
      : [];

    const bands = extractBands(doc);

    // --- Safe rate fetching
    const personalRelief = Number(findRate(ratesArr, "Personal_Relief") ?? 0);
    const earnedWageCap = Number(findRate(ratesArr, "Earned_Wage_Cap") ?? 0.6);
    const nssfEmployeeRate = Number(findRate(ratesArr, "NSSF_Employee_Rate") ?? 0);
    const nssfEmployerRate = Number(findRate(ratesArr, "NSSF_Employer_Rate") ?? 0);
    const nhifRate =
      Number(findRate(ratesArr, "NHIF_Rate")) ||
      Number(findRate(ratesArr, "SHIF_Flat_Rate")) ||
      Number(findRate(ratesArr, "UHI_NHIF_Employee_Rate")) ||
      0;
    const housingRate =
      Number(findRate(ratesArr, "Housing_Levy_Rate")) ||
      Number(findRate(ratesArr, "AHL_Employee_Rate")) ||
      0;

    // --- Inputs
    const grossSalary = Number(payload.salary ?? payload.grossSalary ?? 0);
    const allowances = payload.allowances ?? {};
    const benefits =
      Number(allowances.otherRemuneration ?? 0) +
      Number(allowances.mealAllowance ?? 0) +
      Number(allowances.nightAllowance ?? 0) +
      Number(allowances.pensionCover ?? 0) +
      Number(allowances.medicalCover ?? 0);

    const gross = grossSalary + benefits;
    const pensionPercent = Number(payload.pensionPercent ?? 0);
    const pensionAmount = Number(payload.pensionAmount ?? grossSalary * pensionPercent);
    const nonTaxableAllowances = Number(payload.nonTaxableAllowances ?? 0);
    const taxableIncome = Math.max(0, gross - pensionAmount - nonTaxableAllowances);

    // --- Computations
    const paye = calcPaye(taxableIncome, bands, personalRelief);
    const nssfEmployee = grossSalary * nssfEmployeeRate;
    const nssfEmployer = grossSalary * nssfEmployerRate;
    const nhif = nhifRate < 1 ? grossSalary * nhifRate : nhifRate;
    const housing = grossSalary * housingRate;
    const totalDeductions =
      paye.total + nssfEmployee + nhif + housing + pensionAmount;

    const netPay = Math.max(0, gross - totalDeductions);
    const earnedCap = Number(earnedWageCap > 1 ? earnedWageCap / 100 : earnedWageCap);
    const accessibleNow = netPay * earnedCap;

    // --- Determine currency safely
    const currency =
      doc?.Currency ??
      (Array.isArray(doc?.Rates)
        ? doc.Rates.filter(Boolean).find(
            (r: any) =>
              r?.["General "] === "Currency" || r?.General === "Currency"
          )?.["Amount/Threshold"]
        : undefined) ??
      (country === "KE"
        ? "KES"
        : country === "UG"
        ? "UGX"
        : country === "TZ"
        ? "TZS"
        : "RWF");

    // --- Build response
    return NextResponse.json({
      success: true,
      country,
      currency,
      inputs: {
        grossSalary,
        benefits,
        taxableIncome,
        pensionAmount,
      },
      breakdown: {
        gross,
        bands,
        paye,
        nssfEmployee,
        nssfEmployer,
        nhif,
        housing,
        totalDeductions,
        netPay,
        earnedCap,
        accessibleNow,
      },
    });
  } catch (err: any) {
    console.error("calc route error:", err);
    return NextResponse.json(
      { success: false, error: String(err?.message ?? err) },
      { status: 500 }
    );
  }
}
