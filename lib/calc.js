// lib/calc.js
export function calculateSalary(input, excelData) {
  const salary = Number(input.salary || 0);

  const ratesRaw = excelData["Rates"];
  const rates = Array.isArray(ratesRaw) ? ratesRaw.filter(Boolean) : [];
  const outputTemplate = excelData["Output"];

  // Extract constants (guard against null rows)
  const findRate = (key) =>
    rates.find((r) => r && typeof r["General "] === "string" && r["General "].trim() === key)?.["Amount/Threshold"] ?? 0;

  const personalRelief = findRate("Personal_Relief");
  const shifRate = findRate("SHIF_Flat_Rate");
  const housingLevy = findRate("Housing_Levy_Rate");
  const nssfTier1Ceil = findRate("NSSF_Tier1_Ceiling");
  const nssfTier2Ceil = findRate("NSSF_Tier2_Ceiling");
  const nssfRate = findRate("NSSF_Employee_Rate");

  // --- TAX BANDS ---
  const bands = rates.filter((r) => r && typeof r["General "] === "number");
  let payeBeforeRelief = 0;
  let remaining = salary;

  for (const band of bands) {
    const lower = Number(band["General "]);
    const upper = Number(band["Amount/Threshold"]);
    const rate = Number(band["Description"]);

    if (remaining <= 0) break;

    const taxable = Math.min(remaining, upper - lower);
    payeBeforeRelief += taxable * rate;
    remaining -= taxable;
  }

  // --- Deductions ---
  const nssf1 = Math.min(salary, nssfTier1Ceil) * nssfRate;
  const nssf2 =
    Math.max(0, Math.min(salary, nssfTier2Ceil) - nssfTier1Ceil) * nssfRate;
  const shif = salary * shifRate;
  const ahl = salary * housingLevy;

  const payeAfterRelief = Math.max(0, payeBeforeRelief - personalRelief);

  // --- Net Pay ---
  const netPay =
    salary - (nssf1 + nssf2 + shif + ahl + payeAfterRelief);

  return {
    gross: salary,
    nssf1: -nssf1,
    nssf2: -nssf2,
    shif: -shif,
    ahl: -ahl,
    payeBeforeRelief,
    personalRelief,
    payeAfterRelief,
    net: netPay,
  };
}
