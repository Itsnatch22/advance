import { promises as fs } from "fs";
import path from "path";

const CALC_ENGINE_VERSION = "2.0.0";

export interface Payload {
  salary: number;
  daysWorked: number;
  cycleDays: number;
  country: string;

  allowances?: Record<string, number>;
  employerPensionCover?: number;
  employerMedicalCover?: number;
  allowableDeductions?: {
    mortgageInterest?: number;
    postRetirementMedicalFund?: number;
    providentFundContributions?: number;
    lifeAndHealthInsuranceContributions?: number;
  };
}

export interface JsonConfig {
  personalRelief?: number;
  nssf?: {
    tier1?: number;
    tier1Ceiling?: number;
    tier1Rate?: number;
    tier2Rate?: number;
    tier2Cap?: number;
    employeeRate?: number;
    employerRate?: number;
  };
  shif?: { flat?: number; rate?: number; minimum?: number };
  housing?: { rate?: number; employerRate?: number };
  paye?: { brackets?: { upTo: number; rate: number }[] };
  allowableDeductions?: {
    employerPensionMonthlyLimit?: number;
    mealAllowanceMonthlyLimit?: number;
    nightOutAllowanceDailyLimit?: number;
    mortgageInterestMonthlyLimit?: number;
    postRetirementMedicalMonthlyLimit?: number;
    providentFundMonthlyLimit?: number;
    providentFundSalaryPercent?: number;
    insuranceReliefRate?: number;
    insuranceReliefMonthlyLimit?: number;
  };
  meta?: {
    description?: string;
    lastUpdated?: string;
    source?: string;
    rulesVersion?: string;
    effectiveFrom?: string;
  };
  rssb?: {
    pension?: { employeeRate?: number; employerRate?: number };
    medical?: { employeeRate?: number; employerRate?: number };
    maternity?: { employeeRate?: number; employerRate?: number };
  };
  sdl?: { employerRate?: number };
  wcf?: { employerRate?: number };
  lst?: { bands?: { upTo: number; tax: number }[] };
  accessCapPercent?: number;
  platformFeePercent?: number;
  earnedWageCapPercent?: number;
  earnedWageDays?: number;
}

export interface CalcResult {
  success: boolean;
  country: string;
  gross: number;
  accruedGross: number;
  totalAllowances: number;
  pensionableEarnings?: number;
  employerPensionCover?: number;
  employerMedicalCover?: number;
  taxableIncome: number;
  nssfEmployee: number;
  nssfEmployer: number;
  nssf1: number;
  nssf2: number;
  totalNSSF: number;
  rssb: Record<string, number>;
  totalRSSB: number;
  shif: number;
  housingLevy: number;
  housingLevyEmployer?: number;
  employerContributions?: Record<string, number>;
  employeeDeductions?: Record<string, number>;
  allowableDeductionBreakdown?: Record<string, number>;
  cashShortfall: number;
  ruleVersion?: string;
  effectiveFrom?: string;
  engineVersion: string;
  sdl: number;
  wcf: number;
  payeBeforeRelief: number;
  personalRelief: number;
  insuranceRelief?: number;
  payeAfterRelief: number;
  lst: number;
  netPay: number;
  earnedWage: number;
  earnedWageDays?: number;
  accessCap: number;
  platformFee: number;
  youCanAccessNow: number;
  remittances: Record<string, number>;
}

/**
 * Core dynamic calculation engine
 */
export function calc(payload: Payload, cfg: JsonConfig): CalcResult {
  const { salary, daysWorked, cycleDays, allowances = {} } = payload;

  if (payload.country === "KE") {
    return calcKenyaPayroll(payload, cfg);
  }

  const totalAllowances = Object.values(allowances).reduce(
    (a, b) => a + (b || 0),
    0
  );

  const base = salary + totalAllowances;
  const gross = (base / cycleDays) * daysWorked;

  let nssfEmployee = 0;
  let nssfEmployer = 0;
  const nssf1 = 0;
  const nssf2 = 0;

  if (cfg.nssf?.employeeRate) {
    nssfEmployee = gross * (cfg.nssf.employeeRate ?? 0);
    nssfEmployer = gross * (cfg.nssf.employerRate ?? 0);
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
  const platformFee = accessCap * (cfg.platformFeePercent ?? 0.06);
  const youCanAccessNow = accessCap;

  return {
    success: true,
    country: payload.country,
    engineVersion: CALC_ENGINE_VERSION,
    gross,
    accruedGross: gross,
    totalAllowances,
    taxableIncome,
    cashShortfall: 0,
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

function calcPAYE(taxable: number, brackets: { upTo: number; rate: number }[]) {
  if (!brackets.length) return 0;
  taxable = Math.max(0, taxable);
  let tax = 0;
  let last = 0;
  for (const [index, b] of brackets.entries()) {
    if (taxable > b.upTo) {
      tax += (b.upTo - last) * b.rate;
      last = b.upTo;
      if (index === brackets.length - 1) {
        tax += (taxable - last) * b.rate;
      }
    } else {
      tax += (taxable - last) * b.rate;
      break;
    }
  }
  return Math.round(tax * 100) / 100;
}

function calcPAYECents(
  taxableCents: number,
  brackets: { upTo: number; rate: number }[]
) {
  let taxCents = 0;
  let previousLimitCents = 0;
  const incomeCents = Math.max(0, taxableCents);

  brackets.forEach((bracket, index) => {
    const limitCents = toCents(bracket.upTo);
    const upperLimitCents =
      index === brackets.length - 1
        ? Math.max(incomeCents, limitCents)
        : limitCents;
    const bandEndCents = Math.min(incomeCents, upperLimitCents);
    if (bandEndCents > previousLimitCents) {
      taxCents += calculatePercentCents(
        bandEndCents - previousLimitCents,
        bracket.rate
      );
    }
    previousLimitCents = limitCents;
  });

  return taxCents;
}

function calcKenyaPayroll(payload: Payload, cfg: JsonConfig): CalcResult {
  const nssfConfig = cfg.nssf;
  const housingConfig = cfg.housing;
  const shifConfig = cfg.shif;
  const limits = cfg.allowableDeductions;
  const brackets = cfg.paye?.brackets;
  const earnedWageDays = cfg.earnedWageDays;

  if (
    !nssfConfig?.tier1Ceiling ||
    nssfConfig.tier1Rate === undefined ||
    nssfConfig.tier2Rate === undefined ||
    !nssfConfig.tier2Cap ||
    shifConfig?.rate === undefined ||
    shifConfig.minimum === undefined ||
    housingConfig?.rate === undefined ||
    housingConfig.employerRate === undefined ||
    cfg.personalRelief === undefined ||
    !brackets?.length ||
    limits?.employerPensionMonthlyLimit === undefined ||
    limits.mealAllowanceMonthlyLimit === undefined ||
    limits.nightOutAllowanceDailyLimit === undefined ||
    limits.mortgageInterestMonthlyLimit === undefined ||
    limits.postRetirementMedicalMonthlyLimit === undefined ||
    limits.providentFundMonthlyLimit === undefined ||
    limits.providentFundSalaryPercent === undefined ||
    limits.insuranceReliefRate === undefined ||
    limits.insuranceReliefMonthlyLimit === undefined ||
    earnedWageDays === undefined
  ) {
    throw new Error("Kenya statutory payroll configuration is incomplete");
  }
  if (
    [
      nssfConfig.tier1Ceiling,
      nssfConfig.tier1Rate,
      nssfConfig.tier2Rate,
      nssfConfig.tier2Cap,
      shifConfig.rate,
      shifConfig.minimum,
      housingConfig.rate,
      housingConfig.employerRate,
      cfg.personalRelief,
      limits.employerPensionMonthlyLimit,
      limits.mealAllowanceMonthlyLimit,
      limits.nightOutAllowanceDailyLimit,
      limits.mortgageInterestMonthlyLimit,
      limits.postRetirementMedicalMonthlyLimit,
      limits.providentFundMonthlyLimit,
      limits.providentFundSalaryPercent,
      limits.insuranceReliefRate,
      limits.insuranceReliefMonthlyLimit,
    ].some((value) => !Number.isFinite(value) || value < 0) ||
    !Number.isFinite(earnedWageDays) ||
    earnedWageDays <= 0 ||
    brackets.some(
      (bracket) =>
        !Number.isFinite(bracket.upTo) ||
        !Number.isFinite(bracket.rate) ||
        bracket.upTo < 0 ||
        bracket.rate < 0
    )
  ) {
    throw new Error(
      "Kenya statutory payroll configuration contains invalid values"
    );
  }

  const {
    salary,
    daysWorked,
    cycleDays,
    allowances = {},
    employerPensionCover = 0,
    employerMedicalCover = 0,
  } = payload;
  if (
    !Number.isFinite(salary) ||
    salary < 0 ||
    !Number.isFinite(daysWorked) ||
    daysWorked < 0 ||
    !Number.isFinite(cycleDays) ||
    cycleDays <= 0 ||
    daysWorked > cycleDays
  ) {
    throw new Error("Invalid Kenya payroll inputs");
  }

  if (
    !Number.isFinite(employerPensionCover) ||
    employerPensionCover < 0 ||
    !Number.isFinite(employerMedicalCover) ||
    employerMedicalCover < 0
  ) {
    throw new Error("Employer cover must be finite, non-negative amounts");
  }

  const allowanceValues = Object.values(allowances);
  if (
    allowanceValues.some((amount) => !Number.isFinite(amount) || amount < 0)
  ) {
    throw new Error("Allowances must be finite, non-negative amounts");
  }

  const totalAllowances = allowanceValues.reduce(
    (sum, amount) => sum + amount,
    0
  );
  const cashGrossCents = toCents(salary + totalAllowances);
  const totalIncomeCents = toCents(
    salary + totalAllowances + employerPensionCover + employerMedicalCover
  );
  const gross = fromCents(totalIncomeCents);
  const tier1CeilingCents = toCents(nssfConfig.tier1Ceiling);
  const tier2CapCents = toCents(nssfConfig.tier2Cap);
  if (tier2CapCents < tier1CeilingCents) {
    throw new Error("Invalid NSSF tier limits");
  }

  const nssfTier1Cents = calculatePercentCents(
    Math.min(totalIncomeCents, tier1CeilingCents),
    nssfConfig.tier1Rate
  );
  const nssfTier2Cents = calculatePercentCents(
    Math.max(0, Math.min(totalIncomeCents, tier2CapCents) - tier1CeilingCents),
    nssfConfig.tier2Rate
  );
  const nssfEmployeeCents = nssfTier1Cents + nssfTier2Cents;
  const nssfEmployerCents = nssfEmployeeCents;
  const shifCents =
    totalIncomeCents === 0
      ? 0
      : Math.max(
          toCents(shifConfig.minimum),
          calculatePercentCents(totalIncomeCents, shifConfig.rate)
        );
  const housingCents = calculatePercentCents(
    totalIncomeCents,
    housingConfig.rate
  );
  const housingEmployerCents = calculatePercentCents(
    totalIncomeCents,
    housingConfig.employerRate
  );

  const requestedDeductions = payload.allowableDeductions ?? {};
  if (
    Object.values(requestedDeductions).some(
      (amount) => !Number.isFinite(amount) || amount < 0
    )
  ) {
    throw new Error(
      "Allowable deductions must be finite, non-negative amounts"
    );
  }
  const mortgageInterestCents = toCents(
    requestedDeductions.mortgageInterest ?? 0
  );
  const medicalFundCents = toCents(
    requestedDeductions.postRetirementMedicalFund ?? 0
  );
  const providentFundCents = toCents(
    requestedDeductions.providentFundContributions ?? 0
  );
  const insuranceContributionsCents = toCents(
    requestedDeductions.lifeAndHealthInsuranceContributions ?? 0
  );
  const mealAllowanceCents = toCents(allowances.mealAllowance ?? 0);
  const nightOutAllowanceCents = toCents(allowances.nightAllowance ?? 0);
  const employerPensionCoverCents = toCents(employerPensionCover);
  const employerMedicalCoverCents = toCents(employerMedicalCover);

  const mealAllowanceDeductionCents = Math.min(
    mealAllowanceCents,
    toCents(limits.mealAllowanceMonthlyLimit)
  );
  const nightOutAllowanceDeductionCents = Math.min(
    nightOutAllowanceCents,
    toCents(limits.nightOutAllowanceDailyLimit * earnedWageDays)
  );
  const employerPensionDeductionCents = Math.min(
    employerPensionCoverCents,
    toCents(limits.employerPensionMonthlyLimit)
  );
  const allowableMortgageCents = Math.min(
    mortgageInterestCents,
    toCents(limits.mortgageInterestMonthlyLimit)
  );
  const allowableMedicalFundCents = Math.min(
    medicalFundCents,
    toCents(limits.postRetirementMedicalMonthlyLimit)
  );
  const allowableProvidentFundCents = Math.min(
    providentFundCents,
    toCents(limits.providentFundMonthlyLimit),
    calculatePercentCents(toCents(salary), limits.providentFundSalaryPercent)
  );
  const insuranceReliefCents = Math.min(
    calculatePercentCents(
      insuranceContributionsCents,
      limits.insuranceReliefRate
    ),
    toCents(limits.insuranceReliefMonthlyLimit)
  );
  const allowableDeductionCents =
    mealAllowanceDeductionCents +
    nightOutAllowanceDeductionCents +
    employerPensionDeductionCents +
    employerMedicalCoverCents +
    allowableMortgageCents +
    allowableMedicalFundCents +
    allowableProvidentFundCents +
    shifCents +
    housingCents +
    nssfEmployeeCents;
  const taxableIncomeCents = Math.max(
    0,
    totalIncomeCents - allowableDeductionCents
  );
  const taxableIncome = fromCents(taxableIncomeCents);
  const payeBeforeRelief = fromCents(
    calcPAYECents(taxableIncomeCents, brackets)
  );
  const personalRelief = cfg.personalRelief;
  const payeAfterRelief = fromCents(
    Math.max(
      0,
      toCents(payeBeforeRelief) - toCents(personalRelief) - insuranceReliefCents
    )
  );

  const employeeDeductions = {
    nssf: fromCents(nssfEmployeeCents),
    shif: fromCents(shifCents),
    housingLevy: fromCents(housingCents),
    mortgageInterest: fromCents(mortgageInterestCents),
    postRetirementMedicalFund: fromCents(medicalFundCents),
    providentFundContributions: fromCents(providentFundCents),
    lifeAndHealthInsuranceContributions: fromCents(insuranceContributionsCents),
    paye: payeAfterRelief,
  };
  const totalEmployeeDeductionsCents = Object.values(employeeDeductions).reduce(
    (sum, amount) => sum + toCents(amount),
    0
  );
  const cashShortfallCents = Math.max(
    0,
    totalEmployeeDeductionsCents - cashGrossCents
  );
  const unroundedNetPayCents = Math.max(
    0,
    cashGrossCents - totalEmployeeDeductionsCents
  );
  const netPay = fromCents(Math.round(unroundedNetPayCents / 100) * 100);
  const accruedGross = fromCents(
    Math.round((cashGrossCents * daysWorked) / earnedWageDays)
  );
  const earnedWage = fromCents(toCents((netPay * daysWorked) / earnedWageDays));
  const accessCap = Math.round(
    calculatePercentCents(toCents(netPay), cfg.accessCapPercent ?? 0.6) / 100
  );
  const availableBeforeFee = Math.min(earnedWage, accessCap);
  const platformFee = fromCents(
    calculatePercentCents(
      toCents(availableBeforeFee),
      cfg.platformFeePercent ?? 0.06
    )
  );
  const youCanAccessNow = Math.max(0, availableBeforeFee - platformFee);

  return {
    success: true,
    country: payload.country,
    engineVersion: CALC_ENGINE_VERSION,
    gross,
    accruedGross,
    totalAllowances: fromCents(toCents(totalAllowances)),
    pensionableEarnings: gross,
    employerPensionCover: fromCents(employerPensionCoverCents),
    employerMedicalCover: fromCents(employerMedicalCoverCents),
    taxableIncome,
    cashShortfall: fromCents(cashShortfallCents),
    nssfEmployee: fromCents(nssfEmployeeCents),
    nssfEmployer: fromCents(nssfEmployerCents),
    nssf1: fromCents(nssfTier1Cents),
    nssf2: fromCents(nssfTier2Cents),
    totalNSSF: fromCents(nssfEmployeeCents + nssfEmployerCents),
    rssb: {
      pensionEmployee: 0,
      pensionEmployer: 0,
      medicalEmployee: 0,
      medicalEmployer: 0,
      maternityEmployee: 0,
      maternityEmployer: 0,
    },
    totalRSSB: 0,
    shif: fromCents(shifCents),
    housingLevy: fromCents(housingCents),
    housingLevyEmployer: fromCents(housingEmployerCents),
    employerContributions: {
      nssf: fromCents(nssfEmployerCents),
      housingLevy: fromCents(housingEmployerCents),
    },
    employeeDeductions,
    allowableDeductionBreakdown: {
      nssf: fromCents(nssfEmployeeCents),
      shif: fromCents(shifCents),
      housingLevy: fromCents(housingCents),
      mealAllowance: fromCents(mealAllowanceDeductionCents),
      nightOutAllowance: fromCents(nightOutAllowanceDeductionCents),
      employerPensionCover: fromCents(employerPensionDeductionCents),
      employerMedicalCover: fromCents(employerMedicalCoverCents),
      mortgageInterest: fromCents(allowableMortgageCents),
      postRetirementMedicalFund: fromCents(allowableMedicalFundCents),
      providentFundContributions: fromCents(allowableProvidentFundCents),
    },
    ruleVersion: cfg.meta?.rulesVersion,
    effectiveFrom: cfg.meta?.effectiveFrom,
    sdl: 0,
    wcf: 0,
    payeBeforeRelief,
    personalRelief: fromCents(toCents(personalRelief)),
    insuranceRelief: fromCents(insuranceReliefCents),
    payeAfterRelief,
    lst: 0,
    netPay,
    earnedWage,
    earnedWageDays,
    accessCap,
    platformFee,
    youCanAccessNow,
    remittances: {
      NSSF: fromCents(nssfEmployeeCents),
      SHIF: fromCents(shifCents),
      Housing: fromCents(housingCents),
      PAYE: payeAfterRelief,
      "Mortgage interest": fromCents(mortgageInterestCents),
      "Post-retirement medical fund": fromCents(medicalFundCents),
      "Provident fund": fromCents(providentFundCents),
      "Life and health insurance": fromCents(insuranceContributionsCents),
    },
  };
}

function toCents(amount: number) {
  return Math.round(amount * 100);
}

function fromCents(amount: number) {
  return amount / 100;
}

function calculatePercentCents(amountCents: number, rate: number) {
  return Math.round((amountCents * Math.round(rate * 10000)) / 10000);
}

function calcLST(gross: number, bands: { upTo: number; tax: number }[]) {
  for (const b of bands) {
    if (gross <= b.upTo) return b.tax;
  }
  return bands[bands.length - 1].tax;
}

export async function readCountryConfig(countryCode: string) {
  const fileMap: Record<string, string> = {
    KE: "calcke.json",
    UG: "calcug.json",
    TZ: "calctz.json",
    RW: "calcrw.json",
  };

  const code = (countryCode || "KE").toUpperCase();
  const fileName = fileMap[code] || fileMap["KE"];
  const filePath = path.join(process.cwd(), "data", fileName);

  try {
    await fs.access(filePath);
  } catch {
    throw new Error(`Config file not found: ${filePath}`);
  }

  const raw = await fs.readFile(filePath, "utf8");
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
    rulesVersion: parsed.meta?.rulesVersion,
    effectiveFrom: parsed.meta?.effectiveFrom,
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
