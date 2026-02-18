import { calc, readCountryConfig } from "../lib/calc.js";

async function verifyAll() {
  const countries = [
    { code: "KE", salary: 50000, daysWorked: 18, cycleDays: 28 },
    { code: "UG", salary: 1000000, daysWorked: 20, cycleDays: 30 },
    { code: "TZ", salary: 500000, daysWorked: 15, cycleDays: 30 },
    { code: "RW", salary: 80000, daysWorked: 25, cycleDays: 30 }
  ];

  for (const c of countries) {
    console.log(`\n--- ${c.code} Verification ---`);
    const cfg = readCountryConfig(c.code);
    const result = calc(c, cfg);
    console.log(`Cap%: ${cfg.accessCapPercent * 100}%`);
    console.log(`AppFee%: ${cfg.platformFeePercent * 100}%`);
    console.log(`Earned So Far: ${result.accruedGross}`);
    console.log(`Accessible Now: ${result.accessCap}`);
    console.log(`Application Fee: ${result.platformFee}`);
    console.log(`Processing Fee: ${result.processingFee}`);
    console.log(`You Receive: ${result.youReceive}`);
  }
}

verifyAll().catch(console.error);
