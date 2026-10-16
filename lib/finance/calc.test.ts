import { calc } from "./calc";
import { readCountryConfig, type JsonConfig, type Payload } from "./calc";

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

    expect(result.youCanAccessNow).toBe(30628.8);
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

    expect(result.youCanAccessNow).toBe(3988800);
  });

  test("Kenya: preserves existing calculator availability output", async () => {
    const keConfig = await readCountryConfig("KE");
    const result = calc(
      {
        salary: 100000,
        daysWorked: 31,
        cycleDays: 31,
        country: "KE",
      },
      keConfig
    );

    expect(result.success).toBe(true);
    expect(result.gross).toBe(100000);
    expect(result.ruleVersion).toBe("ke-2026-year4-v1");
    expect(result.effectiveFrom).toBe("2026-02");
    expect(result.engineVersion).toBe("2.0.0");
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

    expect(result.success).toBe(true);
  });

  describe("Kenya statutory payroll model", () => {
    let keConfig: JsonConfig;

    beforeAll(async () => {
      keConfig = await readCountryConfig("KE");
    });

    const calculateKenya = (
      salary: number,
      overrides: Partial<Payload> = {},
      config: JsonConfig = keConfig
    ) =>
      calc(
        {
          salary,
          daysWorked: 1,
          cycleDays: 1,
          country: "KE",
          ...overrides,
        },
        config
      );

    test("matches the KES 100,000 worked example with resident personal relief", () => {
      const result = calculateKenya(100000, { residentForTax: true });

      expect(result.pensionableEarnings).toBe(100000);
      expect(result.nssf1).toBe(540);
      expect(result.nssf2).toBe(5460);
      expect(result.nssfEmployee).toBe(6000);
      expect(result.shif).toBe(2750);
      expect(result.housingLevy).toBe(1500);
      expect(result.taxableIncome).toBe(89750);
      expect(result.payeBeforeRelief).toBe(21708.35);
      expect(result.personalRelief).toBe(2400);
      expect(result.payeAfterRelief).toBe(19308.35);
      expect(result.netPay).toBe(70441.65);
    });

    test("does not grant resident relief unless the user is eligible", () => {
      const ineligible = calculateKenya(100000);
      const eligible = calculateKenya(100000, { residentForTax: true });

      expect(ineligible.personalRelief).toBe(0);
      expect(ineligible.payeAfterRelief - eligible.payeAfterRelief).toBe(2400);
    });

    test.each([
      [0, 0],
      [8999, 539.94],
      [9000, 540],
      [9001, 540.06],
      [108000, 6480],
      [108001, 6480],
      [150000, 6480],
    ])(
      "calculates employee NSSF correctly at salary %s",
      (salary, expected) => {
        const result = calculateKenya(salary);
        expect(result.nssfEmployee).toBe(expected);
      }
    );

    test("calculates salaried SHIF at 2.75% with no minimum", () => {
      expect(calculateKenya(0).shif).toBe(0);
      expect(calculateKenya(100).shif).toBe(2.75);
      expect(calculateKenya(10000).shif).toBe(275);
      expect(calculateKenya(10910).shif).toBe(300.03);
      expect(calculateKenya(11000).shif).toBe(302.5);
    });

    test("does not report negative take-home pay when deductions exceed gross", () => {
      const result = calculateKenya(100, {
        allowableDeductions: { pensionContributions: 100 },
      });

      expect(result.shif).toBe(2.75);
      expect(result.netPay).toBe(0);
      expect(result.cashShortfall).toBe(10.25);
    });

    test.each([
      [24000, 2400],
      [24001, 2400.25],
      [32333, 4483.25],
      [32334, 4483.55],
      [500000, 144783.35],
      [500001, 144783.68],
      [800000, 242283.35],
      [800001, 242283.7],
      [1000000000, 349962283.35],
    ])(
      "calculates progressive PAYE at taxable income %s",
      (salary, expectedTax) => {
        const noContributionConfig = {
          ...keConfig,
          nssf: {
            tier1Ceiling: 9000,
            tier1Rate: 0,
            tier2Rate: 0,
            tier2Cap: 108000,
          },
          shif: { rate: 0 },
          housing: { rate: 0, employerRate: 0 },
          personalRelief: 0,
        };
        const result = calculateKenya(salary, {}, noContributionConfig);
        expect(result.payeBeforeRelief).toBe(expectedTax);
      }
    );

    test("applies eligible deduction limits while retaining actual cash deductions", () => {
      const result = calculateKenya(200000, {
        allowableDeductions: {
          pensionContributions: 40000,
          mortgageInterest: 40000,
          postRetirementMedicalFund: 20000,
        },
      });

      expect(result.taxableIncome).toBe(116500);
      expect(result.allowableDeductionBreakdown?.nssf).toBe(6480);
      expect(result.allowableDeductionBreakdown?.pensionContributions).toBe(
        23520
      );
      expect(result.allowableDeductionBreakdown?.mortgageInterest).toBe(30000);
      expect(
        result.allowableDeductionBreakdown?.postRetirementMedicalFund
      ).toBe(15000);
      expect(result.employeeDeductions?.pensionContributions).toBe(40000);
      expect(result.employeeDeductions?.mortgageInterest).toBe(40000);
      expect(result.netPay).toBe(55286.65);
    });

    test("uses pensionable earnings independently from gross earnings", () => {
      const result = calculateKenya(100000, { pensionableEarnings: 50000 });

      expect(result.gross).toBe(100000);
      expect(result.pensionableEarnings).toBe(50000);
      expect(result.nssfEmployee).toBe(3000);
    });

    test("keeps employer contributions out of net pay and reconciles cents", () => {
      const result = calculateKenya(10910, { residentForTax: true });
      const deductions = Object.values(result.employeeDeductions ?? {}).reduce(
        (sum, amount) => sum + amount,
        0
      );

      expect(result.employerContributions?.nssf).toBe(result.nssfEmployee);
      expect(result.employerContributions?.housingLevy).toBe(
        result.housingLevy
      );
      expect(result.netPay).toBeCloseTo(result.gross - deductions, 2);
    });

    test("rejects pensionable earnings above gross and invalid cycle inputs", () => {
      expect(() =>
        calculateKenya(10000, { pensionableEarnings: 10001 })
      ).toThrow("Invalid pensionable earnings");
      expect(() =>
        calc(
          { salary: 10000, daysWorked: 31, cycleDays: 30, country: "KE" },
          keConfig
        )
      ).toThrow("Invalid Kenya payroll inputs");
    });
  });
});
