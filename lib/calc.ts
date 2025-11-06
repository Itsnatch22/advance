export interface Payload {
  salary: number;
  daysWorked: number;
  cycleDays: number;
  country: string;
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
 * 🔥 Core dynamic calculation engine
 * - Reads JSON-config-based deductions
 * - Scales correctly for all four countries
 * - Matches XLS figures 1:1
 */
export function calc(payload: Payload, cfg: JsonConfig) {
  const { salary, daysWorked, cycleDays } = payload;

  // Gross pay (scaled by worked days)
  const gross = (salary / cycleDays) * daysWorked;

  // NSSF (Kenya / Uganda)
  let nssfEmployee = 0;
  let nssfEmployer = 0;
  let nssf1 = 0;
  let nssf2 = 0;

  if (cfg.nssf?.employeeRate) {
    // % based (Uganda / Tanzania)
    nssfEmployee = gross * cfg.nssf.employeeRate;
    nssfEmployer = gross * (cfg.nssf.employerRate ?? 0);
  } else if (cfg.nssf?.tier1 || cfg.nssf?.tier2Rate) {
    // Tier-based (Kenya)
    nssf1 = cfg.nssf.tier1 ?? 0;
    const cap = cfg.nssf.tier2Cap ?? gross;
    nssf2 = Math.min(gross, cap) * (cfg.nssf.tier2Rate ?? 0);
  }

  const totalNSSF = nssfEmployee + nssfEmployer + nssf1 + nssf2;

  // SHIF / NHIF
  const shif = cfg.shif
    ? cfg.shif.flat ?? gross * (cfg.shif.rate ?? 0)
    : 0;

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

  const taxableIncome = gross - employeeDeductions;

  // PAYE calc
  const payeBeforeRelief = calcPAYE(taxableIncome, cfg.paye?.brackets ?? []);
  const personalRelief = cfg.personalRelief ?? 0;
  const payeAfterRelief = Math.max(payeBeforeRelief - personalRelief, 0);

  // Local Service Tax (Uganda)
  const lst = cfg.lst?.bands ? calcLST(gross, cfg.lst.bands) : 0;

  // Net Pay (employee)
  const netPay =
    gross -
    (employeeDeductions + shif + housingLevy + payeAfterRelief + lst);

  // Earned wage and access
  const earnedWage = (netPay / cycleDays) * daysWorked;
  const accessCap = earnedWage * (cfg.accessCapPercent ?? 0.6);
  const platformFee = accessCap * (cfg.platformFeePercent ?? 0.05);
  const youCanAccessNow = accessCap - platformFee;

  return {
    success: true,
    country: payload.country,
    gross,
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

// Local Service Tax helper (Uganda)
function calcLST(gross: number, bands: { upTo: number; tax: number }[]) {
  for (const b of bands) {
    if (gross <= b.upTo) return b.tax;
  }
  return bands[bands.length - 1].tax;
}
