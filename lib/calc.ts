// /lib/calc.ts
import fs from "fs";
import path from "path";

export interface Payload {
  salary: number;
  daysWorked: number;
  cycleDays: number;
  country: string;

  // 🔥 NEW: allowances with + / - values
  allowances?: Record<string, number>;
}

export interface JsonConfig {
  personalRelief?: number;
  nssf?: {
    tier1?: number;
    tier2Rate?: number;
    tier2Cap?: number;
    employeeRate?: number;
    employerRate?: number;
  };
  shif?: { flat?: number; rate?: number };
  housing?: { rate?: number };
  rssb?: {
    pension?: { employeeRate?: number; employerRate?: number };
    medical?: { employeeRate?: number; employerRate?: number };
    maternity?: { employeeRate?: number; employerRate?: number };
  };
  sdl?: { employerRate?: number };
  wcf?: { employerRate?: number };
  paye?: { brackets?: { upTo: number; rate: number }[] };
  lst?: { bands?: { upTo: number; tax: number }[] };
  accessCapPercent?: number;
  platformFeePercent?: number;
  earnedWageCapPercent?: number;
}

/**
 * Core dynamic calculation engine
 */
export function calc(payload: Payload, cfg: JsonConfig) {
  const { salary, daysWorked, cycleDays, allowances = {} } = payload;

  // 🔥🔥🔥 NEW: Sum ALL allowances (+ or -)
  const totalAllowances = Object.values(allowances).reduce(
    (a, b) => a + (b || 0),
    0
  );

  // 🔥 Gross pay (salary + allowances, scaled)
  const base = salary + totalAllowances;
  const gross = (base / cycleDays) * daysWorked;

  // NSSF (Kenya / Uganda / TZ)
  let nssfEmployee = 0;
  let nssfEmployer = 0;
  let nssf1 = 0;
  let nssf2 = 0;

  if (cfg.nssf?.employeeRate) {
    // % based (Uganda / Tanzania)
    nssfEmployee = gross * (cfg.nssf.employeeRate ?? 0);
    nssfEmployer = gross * (cfg.nssf.employerRate ?? 0);
  } else if (payload.country === "KE" && cfg.nssf) {
    // Tier-based (Kenya)
    const tier1Ceiling = 7000; // KRA/NSSF guidelines, should be in config
    const tier1Rate = 0.06; // Standard NSSF rate, should be in config
    const tier2Ceiling = cfg.nssf.tier2Cap ?? 36000; // Fallback to old cap
    const tier2Rate = cfg.nssf.tier2Rate ?? 0;

    nssf1 = Math.min(gross, tier1Ceiling) * tier1Rate;
    nssf2 =
      Math.max(0, Math.min(gross, tier2Ceiling) - tier1Ceiling) * tier2Rate;

    nssfEmployee = nssf1 + nssf2;
    nssfEmployer = nssfEmployee; // Employer matches in Kenya
  }

  const totalNSSF = nssfEmployee + nssfEmployer;

  // SHIF / NHIF (flat or percent)
  const shif = cfg.shif ? (cfg.shif.flat ?? gross * (cfg.shif.rate ?? 0)) : 0;

  // Housing Levy
  const housingLevy = (cfg.housing?.rate ?? 0) * gross;

  // RSSB (Rwanda)
  const rssb = cfg.rssb
    ? {
        pensionEmployee: gross * (cfg.rssb.pension?.employeeRate ?? 0),
        pensionEmployer: gross * (cfg.rssb.pension?.employerRate ?? 0),
        medicalEmployee: gross * (cfg.rssb.medical?.employeeRate ?? 0),
        medicalEmployer: gross * (cfg.rssb.medical?.employerRate ?? 0),
        maternityEmployee: gross * (cfg.rssb.maternity?.employeeRate ?? 0),
        maternityEmployer: gross * (cfg.rssb.maternity?.employerRate ?? 0),
      }
    : {
        pensionEmployee: 0,
        pensionEmployer: 0,
        medicalEmployee: 0,
        medicalEmployer: 0,
        maternityEmployee: 0,
        maternityEmployer: 0,
      };

  const totalRSSB =
    rssb.pensionEmployee +
    rssb.pensionEmployer +
    rssb.medicalEmployee +
    rssb.medicalEmployer +
    rssb.maternityEmployee +
    rssb.maternityEmployer;

  // Employer-only levies (Tanzania)
  const sdl = (cfg.sdl?.employerRate ?? 0) * gross;
  const wcf = (cfg.wcf?.employerRate ?? 0) * gross;

  // Taxable income = gross - employee social security
  const employeeDeductions =
    nssfEmployee +
    rssb.pensionEmployee +
    rssb.medicalEmployee +
    rssb.maternityEmployee;

  // Per spreadsheet logic, KE taxable income also deducts SHIF and Housing
  const keTaxDeductibles =
    payload.country === "KE" ? shif + housingLevy : 0;
  const taxableIncome = gross - employeeDeductions - keTaxDeductibles;

  // PAYE
  const payeBeforeRelief = calcPAYE(taxableIncome, cfg.paye?.brackets ?? []);
  const personalRelief = cfg.personalRelief ?? 0;
  const payeAfterRelief = Math.max(payeBeforeRelief - personalRelief, 0);

  // Local Service Tax (Uganda LST)
  const lst =
    payload.country === "UG" && cfg.lst?.bands
      ? calcLST(gross, cfg.lst.bands)
      : 0;

  // Net Pay (employee)
  const netPay =
    gross - (employeeDeductions + shif + housingLevy + payeAfterRelief + lst);

  // Earned wage and access
  const earnedWage = (netPay / cycleDays) * daysWorked;
  const accessCap = earnedWage * (cfg.accessCapPercent ?? 0.6);
  const platformFee = accessCap * (cfg.platformFeePercent ?? 0.05);
  const youCanAccessNow = accessCap;

  return {
    success: true,
    country: payload.country,
    gross,
    totalAllowances, // 🔥 NEW
    taxableIncome,
    nssfEmployee,
    nssfEmployer,
    nssf1,
    nssf2,
    totalNSSF,
    rssb,
    totalRSSB,
    shif,
    housingLevy,
    sdl,
    wcf,
    payeBeforeRelief,
    personalRelief,
    payeAfterRelief,
    lst,
    netPay,
    earnedWage,
    accessCap,
    platformFee,
    youCanAccessNow,
    remittances: {
      NSSF: nssfEmployee,
      RSSB: rssb.pensionEmployee,
      SHIF: shif,
      Housing: housingLevy,
      LST: lst,
      PAYE: payeAfterRelief,
    },
  };
}

// PAYE helper
function calcPAYE(taxable: number, brackets: { upTo: number; rate: number }[]) {
  if (!brackets.length) return 0;
  let tax = 0;
  let last = 0;
  for (const b of brackets) {
    if (taxable > b.upTo) {
      tax += (b.upTo - last) * b.rate;
      last = b.upTo;
    } else {
      tax += (taxable - last) * b.rate;
      break;
    }
  }
  return Math.round(tax * 100) / 100;
}

// LST helper (Uganda)
function calcLST(gross: number, bands: { upTo: number; tax: number }[]) {
  for (const b of bands) {
    if (gross <= b.upTo) return b.tax;
  }
  return bands[bands.length - 1].tax;
}

export function readCountryConfig(countryCode: string) {
  const fileMap: Record<string, string> = {
    KE: "calcke.json",
    UG: "calcug.json",
    TZ: "calctz.json",
    RW: "calcrw.json",
  };

  const code = (countryCode || "KE").toUpperCase();
  const fileName = fileMap[code] || fileMap["KE"];
  const filePath = path.join(process.cwd(), "data", fileName);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Config file not found: ${filePath}`);
  }

  const raw = fs.readFileSync(filePath, "utf8");
  const parsed = JSON.parse(raw);

  const meta = {
    code,
    name:
      code === "KE"
        ? "Kenya"
        : code === "UG"
          ? "Uganda"
          : code === "TZ"
            ? "Tanzania"
            : "Rwanda",
    flag:
      code === "KE" ? "🇰🇪" : code === "UG" ? "🇺🇬" : code === "TZ" ? "🇹🇿" : "🇷🇼",
    currency:
      code === "KE"
        ? "KES"
        : code === "UG"
          ? "UGX"
          : code === "TZ"
            ? "TZS"
            : "RWF",
    lastUpdated:
      parsed.meta?.lastUpdated || new Date().toISOString().split("T")[0],
    description: parsed.meta?.description || "",
  };

  const deductions = [];
  if (parsed.nssf) deductions.push("NSSF");
  if (parsed.shif) deductions.push("SHIF/NHIF");
  if (parsed.housing) deductions.push("Housing Levy");
  if (parsed.rssb) deductions.push("RSSB");
  if (parsed.paye) deductions.push("PAYE");
  if (parsed.sdl) deductions.push("SDL");
  if (parsed.wcf) deductions.push("WCF");
  if (parsed.lst) deductions.push("LST");

  return { ...parsed, meta, deductions };
}
