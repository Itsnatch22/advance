import { isCareerOpen } from "./types";

describe("isCareerOpen", () => {
  test("requires both status and the legacy open flag to be open", () => {
    expect(isCareerOpen({ status: "open", is_open: true })).toBe(true);
    expect(isCareerOpen({ status: "closed", is_open: true })).toBe(false);
    expect(isCareerOpen({ status: "archived", is_open: true })).toBe(false);
    expect(isCareerOpen({ status: "open", is_open: false })).toBe(false);
  });
});
