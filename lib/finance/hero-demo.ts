import kenyaConfig from "@/data/calcke.json";
import ugandaConfig from "@/data/calcug.json";
import tanzaniaConfig from "@/data/calctz.json";
import rwandaConfig from "@/data/calcrw.json";
import { TRANSACTION_COST_KES } from "@/components/phone/transaction";
import {
  getCurrencyFromCountry,
  type CountryCode,
} from "@/lib/currency/currency";
import {
  calc,
  type CalcResult,
  type JsonConfig,
} from "@/lib/finance/calc-engine";

const countryConfigs: Record<CountryCode, JsonConfig> = {
  KE: kenyaConfig,
  UG: ugandaConfig,
  TZ: tanzaniaConfig,
  RW: rwandaConfig,
};

const PLATFORM_FEE_RATE = 0.06;

export interface HeroDemoCalculation {
  country: CountryCode;
  currencyCode: string;
  salary: number;
  cycleDays: number;
  daysWorked: number;
  outstandingAdvance: number;
  maxOutstandingAdvance: number;
  payroll: CalcResult;
  maxRequest: number;
  transactionCost: number;
}

export interface HeroDemoRequest {
  requestedAmount: number;
  platformFee: number;
  netDisbursement: number;
  transactionCost: number;
  salaryDeduction: number;
}

export function calculateHeroDemo(
  country: CountryCode,
  salaryKES: number,
  daysWorked: number,
  cycleDays: number,
  outstandingAdvance = 0
): HeroDemoCalculation {
  if (
    !Number.isFinite(salaryKES) ||
    salaryKES < 0 ||
    !Number.isFinite(outstandingAdvance) ||
    outstandingAdvance < 0 ||
    !Number.isInteger(daysWorked) ||
    daysWorked < 0 ||
    !Number.isInteger(cycleDays) ||
    cycleDays <= 0 ||
    daysWorked > cycleDays
  ) {
    throw new Error("Invalid wage-access demo inputs");
  }

  const config = countryConfigs[country];
  if (
    config.accessCapPercent === undefined ||
    !Number.isFinite(config.accessCapPercent) ||
    config.accessCapPercent < 0 ||
    config.accessCapPercent > 1
  ) {
    throw new Error(`Invalid access cap configuration for ${country}`);
  }
  if (config.platformFeePercent !== PLATFORM_FEE_RATE) {
    throw new Error(`Expected a 6% platform fee configuration for ${country}`);
  }

  const currency = getCurrencyFromCountry(country);
  const salary = Math.round(salaryKES * currency.rateFromKES);
  if (!Number.isSafeInteger(salary)) {
    throw new Error("Sample salary is outside the supported range");
  }
  const payrollResult = calc(
    {
      salary,
      daysWorked: country === "KE" ? daysWorked : cycleDays,
      cycleDays,
      country,
    },
    config
  );
  const earnedWageDays = config.earnedWageDays ?? cycleDays;
  const earnedWage = fromSubunits(
    Math.round((toSubunits(payrollResult.netPay) * daysWorked) / earnedWageDays)
  );
  const accessCap =
    country === "KE"
      ? payrollResult.accessCap
      : fromSubunits(
          calculatePercentSubunits(
            toSubunits(earnedWage),
            config.accessCapPercent
          )
        );
  const maximumEligibleAmount = Math.min(earnedWage, accessCap);
  const availableBeforeFee = Math.max(
    0,
    maximumEligibleAmount - outstandingAdvance
  );
  const platformFee = fromSubunits(
    calculatePercentSubunits(
      toSubunits(availableBeforeFee),
      config.platformFeePercent
    )
  );
  const payroll: CalcResult = {
    ...payrollResult,
    earnedWage,
    earnedWageDays,
    accessCap,
    platformFee,
    youCanAccessNow: Math.max(0, availableBeforeFee - platformFee),
  };
  const transactionCost = Math.round(
    TRANSACTION_COST_KES * currency.rateFromKES
  );

  return {
    country,
    currencyCode: currency.code,
    salary,
    cycleDays,
    daysWorked,
    outstandingAdvance,
    maxOutstandingAdvance: Math.max(0, Math.floor(maximumEligibleAmount)),
    payroll,
    maxRequest: Math.floor(availableBeforeFee),
    transactionCost,
  };
}

export function calculateHeroDemoRequest(
  calculation: HeroDemoCalculation,
  requestedAmount: number
): HeroDemoRequest {
  if (!Number.isFinite(requestedAmount)) {
    throw new Error("Requested amount must be a finite number");
  }

  const amount = Math.min(
    calculation.maxRequest,
    Math.max(0, Math.floor(requestedAmount))
  );
  const currency = getCurrencyFromCountry(calculation.country);
  const subunitsPerUnit =
    currency.code === "KES" || currency.code === "TZS" ? 100 : 1;
  const requestedSubunits = Math.round(amount * subunitsPerUnit);
  const feeRateBasisPoints = Math.round(PLATFORM_FEE_RATE * 10_000);
  const feeSubunits = Math.round(
    (requestedSubunits * feeRateBasisPoints) / 10_000
  );
  const platformFee = feeSubunits / subunitsPerUnit;
  const transactionCost = amount === 0 ? 0 : calculation.transactionCost;

  return {
    requestedAmount: amount,
    platformFee,
    netDisbursement: amount - platformFee,
    transactionCost,
    salaryDeduction: amount + platformFee + transactionCost,
  };
}

function toSubunits(amount: number) {
  return Math.round(amount * 100);
}

function fromSubunits(amount: number) {
  return amount / 100;
}

function calculatePercentSubunits(amountSubunits: number, rate: number) {
  return Math.round((amountSubunits * Math.round(rate * 10_000)) / 10_000);
}
