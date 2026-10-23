import { isCareerOpen } from "./types";

describe("isCareerOpen", () => {
  const todayInNairobi = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Nairobi",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .formatToParts(new Date())
    .reduce<Record<string, string>>((parts, part) => {
      if (part.type !== "literal") parts[part.type] = part.value;
      return parts;
    }, {});
  const today = `${todayInNairobi.year}-${todayInNairobi.month}-${todayInNairobi.day}`;

  test("requires both status and the legacy open flag to be open", () => {
    expect(isCareerOpen({ status: "open", is_open: true })).toBe(true);
    expect(isCareerOpen({ status: "closed", is_open: true })).toBe(false);
    expect(isCareerOpen({ status: "archived", is_open: true })).toBe(false);
    expect(isCareerOpen({ status: "open", is_open: false })).toBe(false);
  });

  test("keeps the closing date inclusive and closes expired roles", () => {
    expect(
      isCareerOpen({ status: "open", is_open: true, closing_date: today })
    ).toBe(true);
    expect(
      isCareerOpen({
        status: "open",
        is_open: true,
        closing_date: "2000-01-01",
      })
    ).toBe(false);
    expect(
      isCareerOpen({ status: "open", is_open: true, closing_date: null })
    ).toBe(true);
  });

  test("fails closed for malformed closing dates", () => {
    expect(
      isCareerOpen({
        status: "open",
        is_open: true,
        closing_date: "not-a-date",
      })
    ).toBe(false);
  });
});
