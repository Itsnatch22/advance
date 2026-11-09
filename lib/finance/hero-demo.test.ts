import { calculateHeroDemo, calculateHeroDemoRequest } from "./hero-demo";

describe("hero wage-access demonstration calculations", () => {
  test.each([
    ["KE", "KES", 0.6],
    ["UG", "UGX", 0.6],
    ["TZ", "TZS", 0.3],
    ["RW", "RWF", 0.45],
  ] as const)(
    "uses %s payroll rules and currency",
    (country, currencyCode, accessCapPercent) => {
      const calculation = calculateHeroDemo(country, 100_000, 15, 30);

      expect(calculation.currencyCode).toBe(currencyCode);
      expect(calculation.payroll.accessCap).toBeGreaterThan(0);
      expect(calculation.payroll.youCanAccessNow).toBeGreaterThan(0);
      expect(calculation.maxRequest).toBeLessThanOrEqual(
        Math.min(calculation.payroll.earnedWage, calculation.payroll.accessCap)
      );
      expect(calculation.payroll.accessCap).toBeGreaterThanOrEqual(
        calculation.payroll.earnedWage * accessCapPercent - 1
      );
    }
  );

  test("keeps the request fee, net payout, and salary deduction synchronized", () => {
    const calculation = calculateHeroDemo("KE", 100_000, 15, 30);
    const request = calculateHeroDemoRequest(calculation, 10_000);

    expect(request.platformFee).toBe(600);
    expect(request.netDisbursement).toBe(9_400);
    expect(request.salaryDeduction).toBe(
      request.requestedAmount + request.platformFee + request.transactionCost
    );
  });

  test.each(["KE", "UG", "TZ", "RW"] as const)(
    "applies a 6% fee to a %s request",
    (country) => {
      const calculation = calculateHeroDemo(country, 100_000, 15, 30);
      const request = calculateHeroDemoRequest(calculation, 10_000);

      expect(request.requestedAmount).toBe(10_000);
      expect(request.platformFee).toBe(600);
      expect(request.netDisbursement).toBe(9_400);
    }
  );

  test.each(["KE", "UG", "TZ", "RW"] as const)(
    "accrues %s net pay using its configured earning period",
    (country) => {
      const calculation = calculateHeroDemo(country, 100_000, 15, 30);

      expect(calculation.payroll.earnedWage).toBeCloseTo(
        calculation.payroll.netPay / 2,
        2
      );
    }
  );

  test("reduces the available amount by an outstanding advance balance", () => {
    const withoutOutstanding = calculateHeroDemo("KE", 100_000, 15, 30);
    const withOutstanding = calculateHeroDemo("KE", 100_000, 15, 30, 5_000);

    expect(withOutstanding.payroll.youCanAccessNow).toBeCloseTo(
      withoutOutstanding.payroll.youCanAccessNow - 4_700,
      2
    );
    expect(withOutstanding.maxRequest).toBe(
      withoutOutstanding.maxRequest - 5_000
    );
  });

  test("clamps requests to the eligible amount and returns zero charges at zero", () => {
    const calculation = calculateHeroDemo("UG", 100_000, 15, 30);
    const overLimit = calculateHeroDemoRequest(
      calculation,
      calculation.maxRequest + 1
    );
    const zero = calculateHeroDemoRequest(calculation, 0);

    expect(overLimit.requestedAmount).toBe(calculation.maxRequest);
    expect(zero).toEqual({
      requestedAmount: 0,
      platformFee: 0,
      netDisbursement: 0,
      transactionCost: 0,
      salaryDeduction: 0,
    });
  });

  test("rejects invalid payroll inputs", () => {
    expect(() => calculateHeroDemo("KE", 100_000, 31, 30)).toThrow(
      "Invalid wage-access demo inputs"
    );
    expect(() =>
      calculateHeroDemoRequest(
        calculateHeroDemo("KE", 100_000, 15, 30),
        Number.NaN
      )
    ).toThrow("Requested amount must be a finite number");
  });
});
