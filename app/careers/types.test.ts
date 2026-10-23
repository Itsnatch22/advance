import {
  formatCareerDate,
  getDaysRemaining,
  isVacancyAcceptingApplications,
} from "@/lib/careers/deadline";

describe("vacancy deadlines", () => {
  const now = new Date("2026-10-23T23:30:00.000Z");

  test("uses inclusive UTC dates for vacancy availability", () => {
    expect(
      isVacancyAcceptingApplications(
        { status: "open", closing_date: "2026-10-23" },
        now
      )
    ).toBe(true);
    expect(
      isVacancyAcceptingApplications(
        { status: "open", closing_date: "2026-10-22" },
        now
      )
    ).toBe(false);
    expect(
      isVacancyAcceptingApplications(
        { status: "closed", closing_date: null },
        now
      )
    ).toBe(false);
    expect(
      isVacancyAcceptingApplications(
        { status: "open", closing_date: null },
        now
      )
    ).toBe(true);
  });

  test("calculates days remaining using UTC calendar dates", () => {
    expect(getDaysRemaining("2026-10-23", now)).toBe(0);
    expect(getDaysRemaining("2026-10-24", now)).toBe(1);
    expect(getDaysRemaining("2026-10-22", now)).toBe(-1);
    expect(getDaysRemaining(null, now)).toBeNull();
  });

  test("formats plain dates in UTC without shifting the calendar day", () => {
    expect(formatCareerDate("2026-10-23")).toBe("Oct 23, 2026");
    expect(formatCareerDate("invalid-date")).toBe("invalid-date");
  });
});
