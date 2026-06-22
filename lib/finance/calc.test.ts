import { calc } from "./calc";
import { readCountryConfig } from "./calc";

describe("Calculator Logic", () => {
  test("Rwanda: 80,000 salary for 30 days", async () => {
    const rwConfig = await readCountryConfig("RW");
    const result = calc(
      {
        salary: 80000,
        daysWorked: 30,
        cycleDays: 30,
        country: "RW",
      },
      rwConfig
    );

    console.log("Rwanda result:", result.youCanAccessNow);
    expect(result.youCanAccessNow).toBe(76068);
  });

  test("Uganda: 10,000,000 salary for 30 days", async () => {
    const ugConfig = await readCountryConfig("UG");
    const result = calc(
      {
        salary: 10000000,
        daysWorked: 30,
        cycleDays: 30,
        country: "UG",
      },
      ugConfig
    );

    console.log("Uganda result:", result.youCanAccessNow);
    expect(result.youCanAccessNow).toBe(3916800);
  });

  test("Kenya: 100,000 salary for 30 days", async () => {
    const keConfig = await readCountryConfig("KE");
    const result = calc(
      {
        salary: 100000,
        daysWorked: 30,
        cycleDays: 30,
        country: "KE",
      },
      keConfig
    );

    console.log("Kenya result:", result.youCanAccessNow);
    expect(result.success).toBe(true);
  });

  test("Tanzania: 500,000 salary for 30 days", async () => {
    const tzConfig = await readCountryConfig("TZ");
    const result = calc(
      {
        salary: 500000,
        daysWorked: 30,
        cycleDays: 30,
        country: "TZ",
      },
      tzConfig
    );

    console.log("Tanzania result:", result.youCanAccessNow);
    expect(result.success).toBe(true);
  });
});
