// app/api/calc/route.ts
import { NextResponse } from "next/server";

type Band = { from: number; to?: number | null; rate: number };
type CountryRules = {
  name: string;
  currency: string;
  personalRelief?: number;
  bands: Band[];
  nssf?: { employeeRate?: number; employerRate?: number; tiered?: boolean; tiers?: { upto: number; rate: number }[] };
  nhif?: { type: "lookup" | "percent" | "flat"; table?: { upto: number; amount: number }[]; percent?: number };
  otherDeductions?: { name: string; type: "percentage" | "fixed"; value: number }[];
  earnedWageCapPercent?: number;
  earnedWageDays?: number;
};

// --- rules (from your Excel drops)
const KENYA: CountryRules = {
  name: "Kenya", currency: "KES", personalRelief: 2400,
  bands: [
    { from: 0, to: 24000, rate: 0.10 },
    { from: 24001, to: 32333, rate: 0.25 },
    { from: 32334, to: Infinity, rate: 0.30 },
  ],
  nssf: { tiered: true, tiers: [{ upto: 7000, rate: 0.06 }, { upto: 36000, rate: 0.06 }] },
  nhif: { type: "lookup", table: [
    { upto: 5999, amount: 150 }, { upto: 7999, amount: 300 }, { upto: 11999, amount: 400 }, { upto: 14999, amount: 500 },
    { upto: 19999, amount: 600 }, { upto: 24999, amount: 750 }, { upto: 29999, amount: 850 }, { upto: 34999, amount: 900 },
    { upto: 39999, amount: 950 }, { upto: 44999, amount: 1000 }, { upto: 49999, amount: 1100 }, { upto: 59999, amount: 1200 },
    { upto: 69999, amount: 1300 }, { upto: 79999, amount: 1400 }, { upto: 89999, amount: 1500 }, { upto: 99999, amount: 1600 },
    { upto: 109999, amount: 1700 }, { upto: 119999, amount: 1800 }, { upto: 129999, amount: 1900 }, { upto: 139999, amount: 2000 },
    { upto: 149999, amount: 2100 }, { upto: Infinity, amount: 2200 },
  ]},
  otherDeductions: [{ name: "Housing Levy", type: "percentage", value: 1.5 }],
  earnedWageCapPercent: 0.6, earnedWageDays: 30,
};

const UGANDA: CountryRules = {
  name: "Uganda", currency: "UGX", personalRelief: 0,
  bands: [
    { from: 0, to: 235000, rate: 0.0 },
    { from: 235001, to: 335000, rate: 0.10 },
    { from: 335001, to: 410000, rate: 0.20 },
    { from: 410001, to: 1000000, rate: 0.30 },
    { from: 1000001, to: Infinity, rate: 0.40 },
  ],
  nssf: { employeeRate: 0.05, employerRate: 0.10 },
  // sheet had no NHIF/lookup; leave undefined
  otherDeductions: [],
  earnedWageCapPercent: 0.6, earnedWageDays: 30,
};

const TANZANIA: CountryRules = {
  name: "Tanzania", currency: "TZS", personalRelief: 0,
  bands: [
    { from: 0, to: 270000, rate: 0.0 },
    { from: 270001, to: 520000, rate: 0.08 },
    { from: 520001, to: 760000, rate: 0.20 },
    { from: 760001, to: 1000000, rate: 0.25 },
    { from: 1000001, to: Infinity, rate: 0.30 },
  ],
  nssf: { employeeRate: 0.10, employerRate: 0.10 },
  nhif: { type: "percent", percent: 0.03 },
  otherDeductions: [],
  earnedWageCapPercent: 0.45, earnedWageDays: 30,
};

const RWANDA: CountryRules = {
  name: "Rwanda", currency: "RWF", personalRelief: 0,
  bands: [
    { from: 0, to: 60000, rate: 0.0 },
    { from: 60001, to: 100000, rate: 0.10 },
    { from: 100001, to: 200000, rate: 0.20 },
    { from: 200001, to: Infinity, rate: 0.30 },
  ],
  nssf: { employeeRate: 0.06, employerRate: 0.06 },
  otherDeductions: [],
  earnedWageCapPercent: 0.45, earnedWageDays: 30,
};

const RULES: Record<string, CountryRules> = { KE: KENYA, UG: UGANDA, TZ: TANZANIA, RW: RWANDA };

function clamp(n: number) { return isFinite(n) ? n : 0; }

function calcPAYE(taxable: number, bands: Band[], personalRelief = 0) {
  let rem = clamp(taxable);
  let total = 0;
  const breakdown: any[] = [];
  const sorted = [...bands].sort((a,b)=>a.from-b.from);
  for (const b of sorted) {
    if (rem <= 0) break;
    const low = b.from ?? 0;
    const high = b.to ?? Infinity;
    const bandSize = isFinite(high) ? Math.max(0, high - low) : rem;
    const taxableInBand = Math.max(0, Math.min(rem, bandSize));
    const tax = taxableInBand * (b.rate ?? 0);
    if (taxableInBand > 0) {
      breakdown.push({ from: low, to: high, taxableInBand, rate: b.rate, tax });
      total += tax;
      rem -= taxableInBand;
    }
  }
  const afterRelief = Math.max(0, total - (personalRelief ?? 0));
  return { total: Number(afterRelief), rawTotal: Number(total), personalReliefApplied: Number(personalRelief ?? 0), breakdown };
}

function calcLookup(gross: number, table?: { upto:number; amount:number }[]) {
  if (!table || !table.length) return 0;
  for (const r of table) if (gross <= r.upto) return r.amount;
  return table[table.length-1].amount || 0;
}

function calcNSSF(gross: number, nssf?: CountryRules["nssf"]) {
  if (!nssf) return { employee: 0, employer: 0 };
  if (nssf.tiered && nssf.tiers) {
    // compute employee contribution on tiers (approx)
    let rem = gross;
    let emp = 0;
    for (const t of nssf.tiers) {
      if (rem <= 0) break;
      const base = Math.min(rem, t.upto);
      emp += base * (t.rate ?? 0);
      rem -= base;
    }
    return { employee: Number(emp), employer: 0 };
  } else {
    const empRate = nssf.employeeRate ?? 0;
    const erRate = nssf.employerRate ?? 0;
    return { employee: Number(gross * empRate), employer: Number(gross * erRate) };
  }
}

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const country = (url.searchParams.get("country") || "KE").toUpperCase();
    const rules = RULES[country];
    if (!rules) return NextResponse.json({ success:false, error:`No rules for ${country}` }, { status:400 });

    const payload = await req.json().catch(()=>({}));
    // incoming shape from your Calc.tsx
    const salary = Number(payload.salary ?? payload.grossSalary ?? 0);
    const allowances = payload.allowances ?? {};
    const daysWorked = Number(payload.daysWorked ?? 0);
    const cycleDays = Number(payload.cycleDays ?? 30);

    // allowances handling: treat most as added to gross except pensionCover (deduction)
    const allowanceSum = Number(allowances.otherRemuneration ?? 0) + Number(allowances.mealAllowance ?? 0) + Number(allowances.nightAllowance ?? 0) + Number(allowances.medicalCover ?? 0);
    const pensionCover = Number(allowances.pensionCover ?? 0);

    // pro-rata accrued gross based on days worked
    const prorataFactor = (cycleDays > 0) ? clamp(daysWorked / cycleDays) : 1;
    const grossMonthly = salary + allowanceSum; // full month gross
    const accruedGross = Number((grossMonthly * prorataFactor));

    // apply pension deduction (employee-paid pensionCover)
    const pensionDeduction = pensionCover; // frontend sends explicit amount (per your UX)
    // taxable = accruedGross - pension - any non-tax allowances (we assume meal/night/medical are taxable unless your sheets mark them otherwise)
    const taxableIncome = Math.max(0, accruedGross - pensionDeduction);

    // PAYE
    const paye = calcPAYE(taxableIncome, rules.bands, rules.personalRelief ?? 0);

    // NSSF / RSSB
    const nssfCalc = calcNSSF(accruedGross, rules.nssf);

    // NHIF / SHIF / UHI
    let shif = 0;
    if (rules.nhif?.type === "lookup") shif = calcLookup(accruedGross, rules.nhif.table);
    else if (rules.nhif?.type === "percent" && rules.nhif.percent) shif = accruedGross * rules.nhif.percent;
    else shif = 0;

    // housing levy (ahl)
    const ahlRule = rules.otherDeductions?.find(d=>d.name.toLowerCase().includes("housing") || d.name.toLowerCase().includes("ahl"));
    const ahl = ahlRule ? (ahlRule.type === "percentage" ? accruedGross * (ahlRule.value/100) : ahlRule.value) : 0;

    // other deductions
    const otherDeductions = (rules.otherDeductions ?? []).map(d=>({ name:d.name, amount: d.type==="fixed" ? d.value : accruedGross * (d.value/100) }));

    // totals
    const totalDeductions = clamp(paye.total) + clamp(nssfCalc.employee) + clamp(shif) + clamp(pensionDeduction) + otherDeductions.reduce((s, o)=>s+o.amount, 0) + clamp(ahl);
    const net = Math.max(0, accruedGross - totalDeductions);

    // earned wage accessible now per rules
    const capPercent = Number(rules.earnedWageCapPercent ?? 0.6);
    const earnedWage = Number(net * capPercent);

    // the frontend expects top-level fields: gross, net, earnedWage, nssf1/nssf2, shif, ahl, accessCapPercent
    const response = {
      success: true,
      country: rules.name,
      currency: rules.currency,
      // fields your Calc.tsx maps to:
      gross: Number(accruedGross),     // used by frontend mapping
      net: Number(net),
      earnedWage: Number(earnedWage),
      accessCapPercent: Math.round(capPercent * 100),
      // NSSF fields expected by frontend mapping:
      nssf1: Number(nssfCalc.employee), // employee
      nssf2: Number(nssfCalc.employer), // employer
      shif: Number(shif), // health contribution or 0 if none
      ahl: Number(ahl), // housing levy
      // debug-friendly full breakdown for cross-check with Excel
      debug: {
        salary, allowanceSum, pensionDeduction, prorataFactor, grossMonthly, accruedGross,
        taxableIncome, paye, nssfCalc, shif, ahl, otherDeductions, totalDeductions: Number(totalDeductions), net,
      }
    };

    return NextResponse.json(response);
  } catch (err:any) {
    console.error("Calc route error:", err);
    return NextResponse.json({ success:false, error: err?.message ?? String(err) }, { status:500 });
  }
}
