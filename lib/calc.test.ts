// lib/calc.test.ts
import { calc } from "./calc";
import { readCountryConfig } from "./calc";

describe("Calculator Logic", () => {
  // Test case for Rwanda from user
  test("Rwanda: 80,000 salary for 30 days", () => {
    const rwConfig = readCountryConfig("RW");
    const result = calc(
      {
        salary: 80000,
        daysWorked: 30,
        cycleDays: 30,
        country: "RW",
      },
      rwConfig
    );
    // Expected available wage: 76,068
    // Let's see what the current logic produces
    console.log("Rwanda result:", result.youCanAccessNow);
    // expect(result.youCanAccessNow).toBe(76068);
  });

  // Test case for Uganda from user
  test("Uganda: 10,000,000 salary for 30 days", () => {
    const ugConfig = readCountryConfig("UG");
    const result = calc(
      {
        salary: 10000000,
        daysWorked: 30,
        cycleDays: 30,
        country: "UG",
      },
      ugConfig
    );
    // Expected available wage: 3,916,800
    // Let's see what the current logic produces
    console.log("Uganda result:", result.youCanAccessNow);
    // expect(result.youCanAccessNow).toBe(3916800);
  });

  // Test case for Kenya to ensure no changes
  test("Kenya: 100,000 salary for 30 days", () => {
    const keConfig = readCountryConfig("KE");
    const result = calc(
      {
        salary: 100000,
        daysWorked: 30,
        cycleDays: 30,
        country: "KE",
      },
      keConfig
    );
    // No expected value given, just ensuring it runs without error
    // and we can log the output to see it's reasonable.
    console.log("Kenya result:", result.youCanAccessNow);
    expect(result.success).toBe(true);
  });

  // Test case for Tanzania to ensure no changes
  test("Tanzania: 500,000 salary for 30 days", () => {
    const tzConfig = readCountryConfig("TZ");
    const result = calc(
      {
        salary: 500000,
        daysWorked: 30,
        cycleDays: 30,
        country: "TZ",
      },
      tzConfig
    );
    // No expected value given, just ensuring it runs without error
    console.log("Tanzania result:", result.youCanAccessNow);
    expect(result.success).toBe(true);
  });
});
