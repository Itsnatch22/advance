# This logic is supposed to help you refactor the Kenyan logic in the calculator and its related files.

# EaziWage Payroll Calculator
## Calculation Logic and Statutory Deduction Alignment Specification

**Document type:** Technical implementation and validation specification  
**Jurisdiction:** Kenya  
**Reference date:** 16 October 2026  
**Status:** Draft for engineering review and statutory verification  
**Primary objective:** Audit and align the existing EaziWage salary calculator with applicable Kenyan payroll rules.

---

## 1. Purpose and scope

EaziWage already has a salary calculator. This document specifies the calculation logic, statutory deduction formulas, validation rules and test cases needed to review its implementation.

The intended outcome is to ensure that the calculator:

- Calculates progressive PAYE correctly.
- Applies applicable employee statutory contributions.
- Distinguishes taxable employment income from gross salary and net pay.
- Applies eligible deductions and tax reliefs in the correct order.
- Handles rounding, boundary values and exceptional cases consistently.
- Uses configurable, effective-dated statutory parameters.
- Produces calculations that can be tested, explained and audited.

This document covers monthly salary estimates for employees under standard Kenyan payroll assumptions. It is not a complete payroll compliance specification for every employment arrangement.

**Important:** The formulas and examples below must be validated against the applicable legislation and official guidance before being treated as production payroll rules.

## 2. Definitions and notation

| Symbol | Definition |
|---|---|
| G | Gross monthly employment earnings |
| P | Pensionable earnings used for NSSF |
| N | Employee NSSF contribution |
| S | Employee SHIF contribution |
| H | Employee Affordable Housing Levy |
| D | Other allowable deductions for tax purposes |
| T | Taxable employment income |
| B(T) | PAYE before tax relief |
| R | Applicable tax relief |
| PAYE | Income tax payable after eligible reliefs |
| NP | Estimated net cash pay |

Gross earnings, pensionable earnings and taxable employment income must remain separate values. They are not necessarily equal because different statutory rules govern their calculation.

## 3. Calculation sequence

The calculator should follow this logical sequence:

1. Validate the salary input and applicable payroll assumptions.
2. Determine gross employment earnings and the relevant earnings bases.
3. Calculate employee statutory contributions.
4. Determine allowable deductions for taxable-income purposes.
5. Calculate taxable employment income.
6. Apply progressive PAYE tax bands.
7. Apply eligible tax reliefs.
8. Calculate estimated net cash pay.
9. Return the calculation breakdown and the rule version used.

The order matters. A contribution can reduce taxable income only where the applicable law permits it. A deduction from cash salary is not automatically an allowable deduction for PAYE purposes.

## 4. Statutory contribution logic

### 4.1 NSSF

**Official reference:** https://www.nssf.or.ke/notice-to-employers-year-4-2026-nssf-contribution-rates

The NSSF Year 4 notice published on 18 February 2026 is the relevant official reference for the 2026 contribution schedule.

For the standard Year 4 calculation, the applicable employee contribution is 6% of pensionable earnings, subject to the relevant lower and upper earnings limits.

The simplified formula, where the full applicable pensionable earnings base is represented by P, is:

`N = 0.06 × min(P, 108,000)`

This simplified expression assumes the applicable 2026 limits and that P is determined correctly. The implementation should preserve the official Tier I and Tier II calculation and contribution breakdown where required.

Example, assuming pensionable earnings of KES 100,000:

`N = 0.06 × 100,000 = KES 6,000`

Implementation requirements:

- Store the contribution rates and earnings limits as configurable parameters.
- Determine pensionable earnings separately from gross and taxable income.
- Preserve Tier I and Tier II amounts where required for reporting.
- Calculate employer contributions separately from employee deductions.
- Add tests immediately below, at and above each applicable earnings threshold.

### 4.2 Social Health Insurance Fund (SHIF)

**Legal reference:** Social Health Insurance Regulations, 2024, as amended.  
https://new.kenyalaw.org/akn/ke/act/ln/2024/49/eng%402025-02-28/source

The cited Regulation 17 text specifies a monthly contribution of 2.75% of gross salary or wages for salaried employment. The retrieved text does not state a KES 300 minimum for salaried employees, so the calculator should not apply that minimum unless a later applicable amendment or official directive is confirmed.

The formula for the cited salaried-employment rule is:

`S = 0.0275 × G`

Example, assuming applicable gross monthly salary of KES 100,000:

`S = 0.0275 × 100,000 = KES 2,750`

Implementation requirements:

- Do not add a minimum contribution for salaried employees unless an applicable amendment or official directive establishes it.
- Confirm the legally relevant gross salary or wage base for the employee category.
- Test zero, low and threshold-adjacent salary values.
- Do not treat SHIF as an employer-matched contribution under the ordinary salaried-employee calculation without an applicable legal basis.
- Recheck for later amendments or official guidance before production release.

### 4.3 Affordable Housing Levy

**Official reference:** https://www.kra.go.ke/individual/filing-paying/types-of-taxes/paye

KRA's PAYE guidance identifies the Affordable Housing Levy as an allowable deduction when determining taxable employment income.

The employee levy is calculated at 1.5% of the applicable gross monthly salary:

`H = 0.015 × G`

Example:

`H = 0.015 × 100,000 = KES 1,500`

The employer's corresponding contribution must be accounted for separately.

Implementation requirements:

- Maintain separate employee and employer contribution records.
- Do not subtract the employer contribution from employee net pay.
- Validate the applicable earnings base against current official guidance.

## 5. Taxable employment income

Taxable employment income must be determined using the statutory rules for employment income and allowable deductions.

For a simplified scenario with no additional earnings or deductions:

`T = G − N − S − H`

This is a simplified formula, not a universal definition of taxable income.

KRA identifies additional allowable deductions, including qualifying pension contributions, eligible mortgage interest, post-retirement medical fund contributions and SHIF contributions, subject to applicable conditions and limits.

Official reference:  
https://www.kra.go.ke/individual/filing-paying/types-of-taxes/paye

The implementation should represent each additional deduction separately, validate its eligibility and apply its statutory limit before including it in T.

For example, with gross salary of KES 100,000:

| Item | Amount |
|---|---:|
| Gross monthly salary | KES 100,000.00 |
| Employee NSSF | KES 6,000.00 |
| Employee SHIF | KES 2,750.00 |
| Employee Housing Levy | KES 1,500.00 |
| Simplified taxable income | KES 89,750.00 |

This example assumes all three contributions are calculated on the stated bases and are allowable deductions in the relevant case.

## 6. PAYE calculation

**Official reference:** https://www.kra.go.ke/individual/filing-paying/types-of-taxes/paye

KRA publishes the following monthly income tax bands and rates, effective from 1 July 2023:

| Monthly taxable income band | Marginal rate |
|---|---:|
| First KES 24,000 | 10% |
| Next KES 8,333 | 25% |
| Next KES 467,667 | 30% |
| Next KES 300,000 | 32.5% |
| Amount exceeding KES 800,000 | 35% |

Monthly personal relief for an eligible resident individual is KES 2,400.

These parameters must be revalidated against the applicable rules before each production release.

### 6.1 Progressive tax formula

Let the taxable income be T, with all amounts in KES.

Calculate the tax payable within each band:

`Tax1 = 0.10 × min(T, 24,000)`

`Tax2 = 0.25 × min(max(T − 24,000, 0), 8,333)`

`Tax3 = 0.30 × min(max(T − 32,333, 0), 467,667)`

`Tax4 = 0.325 × min(max(T − 500,000, 0), 300,000)`

`Tax5 = 0.35 × max(T − 800,000, 0)`

Then:

`B(T) = Tax1 + Tax2 + Tax3 + Tax4 + Tax5`

For an eligible resident individual, the simplified final calculation is:

`PAYE = max(0, B(T) − R)`

where R is the applicable personal relief of KES 2,400, plus any other legally applicable reliefs supported by the calculator.

The relief eligibility and any additional relief rules must be handled separately. The formula must not automatically grant resident personal relief to every employee.

### 6.2 Worked PAYE example

Assume taxable monthly employment income of KES 89,750 and eligibility for monthly personal relief of KES 2,400.

| Band | Calculation | Tax |
|---|---|---:|
| First KES 24,000 | 24,000 × 10% | KES 2,400.00 |
| Next KES 8,333 | 8,333 × 25% | KES 2,083.25 |
| Remaining KES 57,417 | 57,417 × 30% | KES 17,225.10 |
| PAYE before relief | Sum of band taxes | KES 21,708.35 |
| Personal relief | Eligible monthly relief | − KES 2,400.00 |
| **PAYE payable** | **After relief** | **KES 19,308.35** |

This example demonstrates progressive taxation. It does not establish the correct result for employees with additional taxable benefits, other allowable deductions or other relief entitlements.

## 7. Estimated net salary

For the simplified monthly cash-salary scenario:

`NP = G − N − S − H − PAYE`

Using the previous example:

| Item | Amount |
|---|---:|
| Gross salary | KES 100,000.00 |
| NSSF | − KES 6,000.00 |
| SHIF | − KES 2,750.00 |
| Housing Levy | − KES 1,500.00 |
| PAYE | − KES 19,308.35 |
| **Estimated net salary** | **KES 70,441.65** |

The calculator should return the individual deduction amounts alongside the final estimate.

Other employee-specific deductions may need to be included in the displayed take-home amount if they are within the calculator's declared scope. Such deductions must not be silently mixed with statutory taxes.

## 8. Rounding and numerical precision

The implementation should use decimal arithmetic or integer minor units rather than binary floating-point arithmetic for monetary calculations.

Requirements:

- Define and document the rounding policy.
- Keep intermediate values at sufficient precision.
- Round at the legally or operationally appropriate calculation stage.
- Ensure the final displayed values reconcile with the detailed breakdown.
- Avoid independently rounding intermediate figures in a way that causes unexplained differences in the final total.

Tests must include amounts producing fractional cents and values near statutory boundaries.

## 9. Edge cases and additional payroll rules

The basic formula set does not cover every possible employment arrangement. The existing calculator should explicitly define whether it supports:

- Non-resident employees and different relief eligibility.
- Bonuses, overtime, arrears and commissions.
- Taxable non-cash benefits.
- Qualifying pension contributions and their statutory limits.
- Mortgage interest and other eligible deductions.
- Insurance relief and other applicable tax reliefs.
- Partial employment periods and irregular pay.
- Employer contributions and total employment cost.
- Other employee-specific deductions.

Unsupported scenarios should be identified clearly rather than calculated using assumptions that are not disclosed to the user.

## 10. Test cases for calculator alignment

The following cases should be implemented as automated regression tests.

| Test | Expected validation |
|---|---|
| Zero salary | No negative contribution or tax values; statutory treatment of zero income is explicit. |
| Low salary | SHIF and PAYE follow the supported salaried-employment rules without negative results. |
| PAYE band boundaries | Results are correct immediately below, at and above each tax-band boundary. |
| NSSF lower limit | Applicable Tier I treatment is correct. |
| NSSF upper limit | Tier I and Tier II calculations respect the current earnings limits. |
| Housing Levy | Employee contribution is calculated on the applicable gross base. |
| Relief eligibility | Eligible and ineligible cases produce the appropriate PAYE result. |
| Additional deductions | Only qualifying deductions reduce taxable income, subject to applicable limits. |
| High salary | All progressive PAYE bands are applied correctly. |
| Rounding | Displayed deductions and net salary reconcile under the documented rounding policy. |
| Employer contributions | Employer costs are not subtracted from employee take-home pay. |
| Regression | Existing calculator outputs are compared against independently verified expected values. |

Each test should record the input values, expected results, actual results, applicable rule version and pass/fail status.

## 11. Configuration and auditability requirements

Statutory parameters should be stored in versioned configuration rather than scattered throughout calculation code.

Each payroll calculation should be reproducible from:

- Input earnings and relevant employee assumptions.
- Applicable contribution rates and earnings limits.
- PAYE band definitions and tax reliefs.
- Deduction eligibility and statutory limits.
- Effective date or payroll period.
- Calculation-engine version.
- Intermediate results and final amounts.

When statutory parameters change, the system should use the updated rules for the applicable periods without silently rewriting historical calculations.

## 12. Earned-wage access is a separate calculation

EaziWage must distinguish estimated net monthly salary from earned wages currently eligible for withdrawal.

A possible starting model is:

`Available earnings = max(0, verified eligible earnings accrued − required reserves − prior withdrawals)`

The applicable employer-approved access limit is then applied to determine the amount available to request.

This is a product-design recommendation, not a statutory payroll formula.

The earned-wage engine should use verified earnings data, track previous transactions, prevent duplicate withdrawal requests and apply the employer's approved eligibility rules. It should not simply assume that a prorated estimate of monthly net salary equals the amount already earned and available.

## 13. Reference sources

**Primary statutory and official references**

1. Kenya Revenue Authority, PAYE guidance  
   https://www.kra.go.ke/individual/filing-paying/types-of-taxes/paye

2. National Social Security Fund, Year 4 (2026) contribution notice  
   https://www.nssf.or.ke/notice-to-employers-year-4-2026-nssf-contribution-rates

3. Kenya Law, Social Health Insurance Regulations, 2024, as amended  
   https://new.kenyalaw.org/akn/ke/act/ln/2024/49/eng%402025-02-28/source

4. Social Health Authority  
   https://sha.go.ke/

5. PAYE.co.ke calculator, used as the initial comparison reference  
   https://paye.co.ke/paye-calculator

The calculator website is a secondary reference. Its displayed output should be compared against official rules and independently verified calculations rather than treated as the legal authority.

## 14. Acceptance criteria

The calculator-alignment task is complete when:

- The implemented rates, limits and tax bands have been verified against applicable official rules.
- Each supported deduction follows the correct statutory calculation base.
- Progressive PAYE and applicable reliefs are calculated correctly.
- Net salary reconciles with the displayed breakdown.
- The automated boundary and regression tests pass.
- The statutory configuration is versioned and effective-dated.
- Unsupported payroll scenarios are documented.
- Engineering review is complete and any required payroll or tax specialist review has been obtained.

**Final implementation principle:** Preserve the existing calculator and align its logic to verified statutory rules. Do not replace working components or introduce additional payroll functionality unless the audit identifies a concrete discrepancy or missing requirement.
