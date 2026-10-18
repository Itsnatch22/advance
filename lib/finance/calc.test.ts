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

  test("Kenya: loads the workbook-aligned payroll rules", async () => {
    const keConfig = await readCountryConfig("KE");
    const result = calc(
      {
        salary: 100000,
        daysWorked: 30,
        cycleDays: 31,
        country: "KE",
      },
      keConfig
    );

    expect(result.success).toBe(true);
    expect(result.gross).toBe(100000);
    expect(result.ruleVersion).toBe("ke-2026-year4-v2");
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
          daysWorked: 30,
          cycleDays: 30,
          country: "KE",
          ...overrides,
        },
        config
      );

    test("matches the KES 100,000 workbook example with progressive PAYE", () => {
      const result = calculateKenya(100000);

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
      expect(result.netPay).toBe(70442);
      expect(result.earnedWage).toBe(70442);
      expect(result.accessCap).toBe(42265);
      expect(result.platformFee).toBe(2535.9);
      expect(result.youCanAccessNow).toBe(39729.1);
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

    test("applies the workbook SHIF minimum except when income is zero", () => {
      expect(calculateKenya(0).shif).toBe(0);
      expect(calculateKenya(100).shif).toBe(300);
      expect(calculateKenya(10000).shif).toBe(300);
      expect(calculateKenya(10910).shif).toBe(300.03);
      expect(calculateKenya(11000).shif).toBe(302.5);
    });

    test("does not report negative take-home pay when statutory deductions exceed gross", () => {
      const result = calculateKenya(100);

      expect(result.shif).toBe(300);
      expect(result.netPay).toBe(0);
      expect(result.cashShortfall).toBe(207.5);
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
          shif: { rate: 0, minimum: 0 },
          housing: { rate: 0, employerRate: 0 },
          personalRelief: 0,
        };
        const result = calculateKenya(salary, {}, noContributionConfig);
        expect(result.payeBeforeRelief).toBe(expectedTax);
      }
    );

    test("applies workbook deduction caps and subtracts employee contributions from cash pay", () => {
      const result = calculateKenya(200000, {
        allowableDeductions: {
          mortgageInterest: 40000,
          postRetirementMedicalFund: 20000,
          providentFundContributions: 40000,
          lifeAndHealthInsuranceContributions: 20000,
        },
      });

      expect(result.taxableIncome).toBe(125020);
      expect(result.allowableDeductionBreakdown?.nssf).toBe(6480);
      expect(result.allowableDeductionBreakdown?.mortgageInterest).toBe(25000);
      expect(
        result.allowableDeductionBreakdown?.postRetirementMedicalFund
      ).toBe(5000);
      expect(
        result.allowableDeductionBreakdown?.providentFundContributions
      ).toBe(30000);
      expect(result.insuranceRelief).toBe(3000);
      expect(result.employeeDeductions?.mortgageInterest).toBe(40000);
      expect(result.employeeDeductions?.postRetirementMedicalFund).toBe(20000);
      expect(result.employeeDeductions?.providentFundContributions).toBe(40000);
      expect(
        result.employeeDeductions?.lifeAndHealthInsuranceContributions
      ).toBe(20000);
      expect(result.netPay).toBe(38131);
    });

    test("treats employer cover as non-cash and applies the workbook tax limits", () => {
      const result = calculateKenya(100000, {
        employerPensionCover: 40000,
        employerMedicalCover: 5000,
      });

      expect(result.gross).toBe(145000);
      expect(result.accruedGross).toBe(100000);
      expect(result.allowableDeductionBreakdown?.employerPensionCover).toBe(
        30000
      );
      expect(result.allowableDeductionBreakdown?.employerMedicalCover).toBe(
        5000
      );
      expect(result.netPay).toBe(65767);
    });

    test("exempts meal and night-out allowances up to workbook limits", () => {
      const result = calculateKenya(100000, {
        allowances: {
          mealAllowance: 350000,
          nightAllowance: 400000,
        },
      });

      expect(result.gross).toBe(850000);
      expect(result.allowableDeductionBreakdown?.mealAllowance).toBe(300000);
      expect(result.allowableDeductionBreakdown?.nightOutAllowance).toBe(
        300000
      );
    });

    test("uses a fixed 30-day accrual and limits access to the lower earned amount", () => {
      const result = calculateKenya(100000, {
        daysWorked: 15,
        cycleDays: 31,
      });

      expect(result.gross).toBe(100000);
      expect(result.accruedGross).toBe(50000);
      expect(result.netPay).toBe(70442);
      expect(result.earnedWage).toBe(35221);
      expect(result.accessCap).toBe(42265);
      expect(result.platformFee).toBe(2113.26);
      expect(result.youCanAccessNow).toBe(33107.74);
    });

    test("rejects invalid employer cover and cycle inputs", () => {
      expect(() => calculateKenya(10000, { employerPensionCover: -1 })).toThrow(
        "Employer cover must be finite, non-negative amounts"
      );
      expect(() =>
        calc(
          { salary: 10000, daysWorked: 31, cycleDays: 30, country: "KE" },
          keConfig
        )
      ).toThrow("Invalid Kenya payroll inputs");
    });
  });
});
