import fs from "fs";
import path from "path";

export interface Payload {
  salary: number;
  daysWorked: number;
  cycleDays: number;
  country: string;

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
  paye?: {
    brackets?: {
      upTo: number;
      rate: number;
      base?: number;
      minus?: number;
    }[];
  };
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

  const totalAllowances = Object.values(allowances).reduce(
    (a, b) => a + (b || 0),
    0
  );

  const base = salary + totalAllowances;
  const gross = (base / cycleDays) * daysWorked;

  let nssfEmployee = 0;
  let nssfEmployer = 0;
  let nssf1 = 0;
  let nssf2 = 0;

  if (cfg.nssf?.employeeRate) {
    nssfEmployee = gross * (cfg.nssf.employeeRate ?? 0);
    nssfEmployer = gross * (cfg.nssf.employerRate ?? 0);
  } else if (payload.country === "KE" && cfg.nssf) {
    const tier1Ceiling = 7000;
    const tier1Rate = 0.06;
    const tier2Ceiling = cfg.nssf.tier2Cap ?? 36000;
    const tier2Rate = cfg.nssf.tier2Rate ?? 0;

    nssf1 = Math.min(gross, tier1Ceiling) * tier1Rate;
    nssf2 =
      Math.max(0, Math.min(gross, tier2Ceiling) - tier1Ceiling) * tier2Rate;

    nssfEmployee = nssf1 + nssf2;
    nssfEmployer = nssfEmployee;
  }

  const totalNSSF = nssfEmployee + nssfEmployer;

  const shif = cfg.shif ? (cfg.shif.flat ?? gross * (cfg.shif.rate ?? 0)) : 0;

  const housingLevy = (cfg.housing?.rate ?? 0) * gross;

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

  const sdl = (cfg.sdl?.employerRate ?? 0) * gross;
  const wcf = (cfg.wcf?.employerRate ?? 0) * gross;

  const employeeDeductions =
    nssfEmployee +
    rssb.pensionEmployee +
    rssb.medicalEmployee +
    rssb.maternityEmployee;

  const keTaxDeductibles = payload.country === "KE" ? shif + housingLevy : 0;
  const taxableIncome = gross - employeeDeductions - keTaxDeductibles;

  const payeBeforeRelief = calcPAYE(taxableIncome, cfg.paye?.brackets ?? []);
  const personalRelief = cfg.personalRelief ?? 0;
  const payeAfterRelief = Math.max(payeBeforeRelief - personalRelief, 0);

  const lst =
    payload.country === "UG" && cfg.lst?.bands
      ? calcLST(gross, cfg.lst.bands)
      : 0;

  const netPay =
    gross - (employeeDeductions + shif + housingLevy + payeAfterRelief + lst);

  const earnedWage = (netPay / cycleDays) * daysWorked;
  const accessCap = earnedWage * (cfg.accessCapPercent ?? 0.6);
  const platformFee = accessCap * (cfg.platformFeePercent ?? 0.05);
  const youCanAccessNow = accessCap;

  return {
    success: true,
    country: payload.country,
    gross,
    totalAllowances,
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

function calcPAYE(
  taxable: number,
  brackets: {
    upTo: number;
    rate: number;
    base?: number;
    minus?: number;
  }[]
) {
  if (!brackets || !brackets.length) return 0;

  const isBracketSystem =
    brackets[0].base !== undefined && brackets[0].minus !== undefined;

  if (isBracketSystem) {
    let tax = 0;
    let bracketFound = false;
    for (const b of brackets) {
      if (taxable <= b.upTo) {
        tax = (b.base ?? 0) + (taxable - (b.minus ?? 0)) * b.rate;
        bracketFound = true;
        break;
      }
    }

    if (!bracketFound) {
      const lastBracket = brackets[brackets.length - 1];
      tax =
        (lastBracket.base ?? 0) +
        (taxable - (lastBracket.minus ?? 0)) * lastBracket.rate;
    }
    return Math.max(0, Math.round(tax * 100) / 100);
  } else {
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
}

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
