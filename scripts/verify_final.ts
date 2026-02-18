import { calc, readCountryConfig } from "../lib/calc.js";

async function verifyFinal() {
  const cases = [
    { country: "KE", salary: 50000, daysWorked: 18, cycleDays: 28 },
    { country: "UG", salary: 50000, daysWorked: 18, cycleDays: 28 },
    { country: "TZ", salary: 50000, daysWorked: 18, cycleDays: 28 },
    { country: "RW", salary: 50000, daysWorked: 18, cycleDays: 28 }
  ];

  for (const c of cases) {
    console.log(`\n--- Verification for ${c.country} ---`);
    const cfg = readCountryConfig(c.country);
    const result = calc(c, cfg);
    console.log(`Cap: ${cfg.accessCapPercent * 100}%`);
    console.log(`Earned So Far: ${result.accruedGross}`);
    console.log(`Accessible Now: ${result.accessCap}`);
    console.log(`Application Fee: ${result.platformFee}`);
    console.log(`Processing Fee: ${result.processingFee}`);
    console.log(`You Receive: ${result.youReceive}`);
  }
}

verifyFinal().catch(console.error);
