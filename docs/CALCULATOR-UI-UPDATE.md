# EaziWage Payroll Calculator UI Redesign
## Final Approach and Migration Plan

**Status:** Proposed implementation plan  
**Scope:** Existing payroll calculator across Kenya, Uganda, Tanzania and Rwanda  
**Design direction:** Modern dashboard, compact but approachable  
**Primary audiences:** Employees and employers

---

## 1. Objective

Redesign the existing EaziWage payroll calculator to accommodate its growing number of inputs, calculation rules, deductions and explanatory outputs without presenting users with a long, spreadsheet-like sequence of calculations.

The new interface should make the calculator easier to navigate, understand and use while preserving the existing calculation logic for all four supported markets.

This is a presentation and usability improvement, not a rewrite of the payroll calculation engine or an expansion of the calculator's feature scope.

### Desired outcomes

- Present the most important result immediately.
- Group related inputs into clear, manageable sections.
- Make detailed calculations accessible without overwhelming users.
- Support employee and employer perspectives.
- Accommodate country-specific differences in fields, calculations and results.
- Preserve existing calculation behaviour unless a separate, verified defect is identified.
- Improve responsiveness, accessibility and maintainability.

## 2. Core architectural principle

**One shared calculator experience, four country-specific calculation paths, and a consistent presentation layer.**

The interface should provide a coherent experience across all supported markets without assuming their payroll rules, deductions, tax structures or input requirements are interchangeable.

The redesign must distinguish between:

1. **Shared presentation:** Layout, reusable UI components, responsive behaviour, accessibility and common result presentation.
2. **Country-specific configuration:** Applicable inputs, validation, labels, currencies, statutory rules and calculation metadata.
3. **Calculation engine:** Existing country-specific formulas and calculation paths.
4. **Results presentation:** A consistent way to display available results while retaining country-specific details.

The UI must consume the outputs of the relevant calculation engine. It must not independently reimplement statutory calculations inside presentation components.

## 3. Proposed interface structure

### 3.1 Calculator header and context

The top of the calculator should establish the calculation context through the relevant controls and information, including:

- Selected country.
- Applicable currency.
- Pay frequency or calculation period, where supported.
- A short explanation of the calculator's purpose.

Changing the selected country must activate the corresponding country's existing calculation path and applicable input requirements.

The interface must not assume that all four markets use identical input fields or calculation options.

### 3.2 Headline results

Present the most important result prominently, with supporting figures directly beneath or alongside it.

The headline should prioritize estimated employee take-home pay where the applicable calculation produces it. Gross earnings and relevant employee deductions should remain easy to locate.

Employer-facing information should emphasize employer contributions and estimated total employment cost where supported by the relevant country implementation.

These are different perspectives on the same calculation, not separate calculation engines.

### 3.3 Grouped input sections

Replace the long, continuous form with logically grouped sections.

Potential shared section categories include:

- Earnings and salary inputs.
- Tax information and applicable reliefs.
- Additional deductions.
- Employer contributions and costs, where applicable.

These categories are proposed organizational patterns, not mandatory fields for every market.

Each country's existing implementation must determine which inputs are required, optional, supported or inapplicable.

Advanced or less frequently used inputs may be placed in expandable sections. Their values, validation state and eligibility selections must remain intact when sections are collapsed or reopened.

### 3.4 Detailed calculation breakdown

Provide an accessible breakdown that explains how the result was derived.

Depending on the selected country and available calculation outputs, this may include:

- Gross earnings.
- Applicable employee statutory contributions.
- Taxable-income adjustments.
- Tax calculations and applicable reliefs.
- Additional deductions.
- Employee take-home pay.
- Employer contributions and estimated employment costs.
- Shortfalls, warnings and relevant assumptions.

Country-specific calculations should retain their own terminology, rules and explanatory details.

Where the engine supports a detailed breakdown, the UI should present it directly rather than reconstructing the calculation from the final result.

### 3.5 Calculation metadata

Expose relevant calculation metadata in a compact, accessible section.

Where available, this should include:

- Rule-set version.
- Effective date.
- Calculation-engine version.
- Relevant assumptions or limitations.

The metadata should support transparency and troubleshooting without competing visually with the primary result.

## 4. Employee and employer perspectives

The calculator serves both employees estimating take-home pay and employers estimating payroll costs.

The recommended approach is to use a shared calculator with a lightweight perspective switch or equivalent presentation control, provided the existing product requirements support it.

### Employee perspective

Prioritize:

- Estimated take-home pay.
- Gross earnings.
- Employee deductions.
- An understandable explanation of the result.

### Employer perspective

Prioritize:

- Gross salary or earnings.
- Employer-side statutory contributions, where applicable.
- Estimated total employment cost.
- Employee deductions and take-home pay as distinct figures.

Both perspectives must use the same underlying calculation result for the same inputs.

The perspective switch must affect presentation only. It must not change formulas, statutory rules or calculation eligibility.

It must also not imply that a user has authenticated an employment relationship or gained access to restricted payroll data.

If the current calculator's intended interaction model does not justify a perspective switch, the same distinction can be achieved through clear result sections without introducing another control.

## 5. Four-market compatibility

The redesign must accommodate Kenya, Uganda, Tanzania and Rwanda from the beginning.

Each market retains its own calculation path and country-specific requirements.

The implementation must not:

- Apply Kenya-specific fields or assumptions universally.
- Assume all markets share identical statutory deductions or reliefs.
- Reuse one country's formulas as a fallback for another.
- Force every country to display identical breakdown items.
- Modify an existing country's calculation path simply to fit a shared UI component.

Instead, reusable components should render the information supplied by the applicable country implementation.

A shared presentation structure is desirable; identical country-specific calculations are not a requirement.

## 6. Migration strategy

### Phase 1: Audit the existing implementation

Inspect the current calculator before moving components.

Document:

- Country selection and routing between calculation paths.
- Inputs and validation rules for each market.
- Calculation functions and their dependencies.
- Output structures and displayed results.
- Existing state-management behaviour.
- Country-specific labels, currency handling and metadata.
- Known calculation defects or unresolved statutory questions.

This audit establishes the actual boundaries of the existing implementation. Component names, data contracts and architectural abstractions should be finalized only after the code has been inspected.

### Phase 2: Establish regression coverage

Record representative input-output cases for each of the four countries before changing the interface.

Include ordinary salary examples, relevant boundary conditions, optional inputs, relief eligibility, deduction limits, invalid inputs, rounding behaviour and other applicable edge cases.

For each test, capture the relevant detailed outputs as well as the final result.

Existing defects should be documented separately rather than silently preserved as intended behaviour or accidentally changed during the redesign.

### Phase 3: Define the shared presentation contract

Identify the information that can be presented consistently across the four markets.

Create a presentation contract that accommodates common information while allowing country-specific inputs, output details, warnings and metadata.

Do not force country-specific calculation functions into an unnecessarily identical data model. Normalize only what is genuinely shared and retain explicit country-specific structures where necessary.

### Phase 4: Extract reusable UI components

Build or refactor reusable presentation components based on the existing implementation.

Potential components include:

- Calculator header and country selector.
- Headline result summary.
- Earnings input section.
- Tax and reliefs section.
- Additional deductions section.
- Employer contributions section.
- Detailed calculation breakdown.
- Validation and warning messages.
- Calculation metadata.

These are proposed component boundaries. Existing components should be reused where practical, and the final structure should follow the codebase's conventions.

### Phase 5: Introduce the responsive dashboard layout

Implement the new visual hierarchy:

- A prominent result summary.
- Grouped, compact input sections.
- An accessible detailed calculation breakdown.
- A compact calculation metadata section.
- A clear distinction between employee deductions and employer costs.

On desktop, consider placing inputs in the main column and a summary in a secondary column.

On mobile, use a single-column layout with the headline result near the top and a sensible order for inputs and breakdowns.

No critical information should depend exclusively on hover interactions or an inaccessible visualization.

### Phase 6: Migrate incrementally

Migrate the existing calculator to the new presentation structure without replacing all four country implementations at once.

Use the same calculation engine for both the existing and redesigned interfaces during comparison.

Test and verify each market before proceeding to the next. The migration order should be based on implementation dependencies and test readiness, not on an assumption that Kenya is the universal baseline.

### Phase 7: Cross-market verification

Verify the complete experience across all four markets.

Tests must cover:

- Correct country-specific calculation paths.
- Correct fields and validation for each country.
- Correct currency and result formatting.
- Consistency of detailed outputs and final results.
- Country switching and input-state behaviour.
- Retention of values when input sections collapse or reopen.
- Responsive layouts and accessibility.
- Error, warning and shortfall states.
- Calculation metadata.
- No unintended changes to the underlying formulas.

Where values cannot safely be transferred between countries, the interface must reset, preserve them separately or explicitly map them according to a deliberate and tested rule. It must never silently reinterpret incompatible inputs.

## 7. Design principles

The redesign should follow these principles:

**Clear hierarchy:** Users should understand the primary result before encountering the detailed calculation.

**Progressive disclosure:** Secondary details remain accessible without making every field and calculation visible simultaneously.

**Country-aware behaviour:** The interface adapts to each market's existing implementation instead of forcing identical fields and calculations everywhere.

**Financial transparency:** Users can inspect the figures and applicable calculations behind the result.

**Separation of responsibilities:** UI components render and manage presentation; calculation functions remain responsible for the mathematics.

**Responsive by design:** The calculator should work comfortably on desktop and mobile devices.

**State preservation:** Collapsing sections or changing presentation preferences must not unexpectedly discard input values.

**Controlled scope:** The redesign must not become an unplanned rewrite of the calculation engine or an opportunity to add unrelated features.

## 8. Acceptance criteria

The redesign is ready for release review when:

- [ ] All four target markets are supported by the redesigned interface.
- [ ] Existing country-specific calculation paths are preserved.
- [ ] Regression tests demonstrate unchanged expected outputs, except for separately approved and verified defect fixes.
- [ ] Employee deductions and employer contributions are clearly distinguished.
- [ ] Relevant calculation details and metadata remain accessible.
- [ ] Country-specific inputs, validations and explanations remain correct.
- [ ] The employee and employer perspectives, if implemented as a switch, use the same underlying calculation result.
- [ ] Switching countries does not silently transfer incompatible input state.
- [ ] Mobile and desktop layouts are usable and accessible.
- [ ] Error states, deduction shortfalls and relevant warnings remain understandable.
- [ ] All applicable regression and cross-market tests pass.
- [ ] Any statutory-rule changes are reviewed and released separately from presentation-only changes.

## 9. Scope boundaries

This project covers the presentation and usability of the existing payroll calculator.

It does not automatically include:

- Rewriting statutory formulas.
- Introducing new payroll rules or deductions.
- Adding new country support.
- Building payroll administration workflows.
- Adding employee verification or authentication features.
- Integrating the calculator with earned-wage eligibility or withdrawal calculations.
- Revalidating every statutory rule solely as a consequence of the UI redesign.

Any calculation defect discovered during implementation should be documented, assessed and handled through a separate, deliberate change where appropriate.

Preserving existing behaviour during a UI migration is not the same as certifying that every existing statutory rule is legally current. Calculation accuracy and legal compliance remain separate review responsibilities.

## 10. Final implementation decision

EaziWage will adopt a shared, responsive calculator interface with a compact dashboard layout, grouped inputs, prominent results and an accessible calculation breakdown.

The interface will accommodate both employee and employer perspectives while retaining the distinct payroll logic of Kenya, Uganda, Tanzania and Rwanda.

Implementation will begin with an audit of the existing code and regression coverage, followed by reusable presentation components and an incremental migration across all four markets.

**The defining rule is simple: standardize the experience where it makes sense, preserve country-specific behaviour where it matters, and do not change the mathematics accidentally while improving the interface.**
