import {
  parseConsentValue,
  serializeConsentValue,
  getCookieFromHeader,
  DEFAULT_CONSENT,
} from "./consent";

describe("parseConsentValue", () => {
  test("returns null for missing/empty input", () => {
    expect(parseConsentValue(null)).toBeNull();
    expect(parseConsentValue(undefined)).toBeNull();
    expect(parseConsentValue("")).toBeNull();
  });

  test("migrates legacy plain 'accepted'/'rejected' strings", () => {
    expect(parseConsentValue("accepted")).toEqual({ necessary: true, analytics: true });
    expect(parseConsentValue("rejected")).toEqual({ necessary: true, analytics: false });
  });

  test("parses a raw (unencoded) JSON value", () => {
    expect(parseConsentValue('{"necessary":true,"analytics":true}')).toEqual({
      necessary: true,
      analytics: true,
    });
  });

  test("parses a URI-encoded JSON value", () => {
    const encoded = encodeURIComponent(JSON.stringify({ necessary: true, analytics: false }));
    expect(parseConsentValue(encoded)).toEqual({ necessary: true, analytics: false });
  });

  test("defaults analytics to false when the field is missing", () => {
    expect(parseConsentValue('{"necessary":true}')).toEqual({ necessary: true, analytics: false });
  });

  test("coerces the analytics field to a boolean", () => {
    expect(parseConsentValue('{"analytics":"yes"}')).toEqual({ necessary: true, analytics: true });
    expect(parseConsentValue('{"analytics":0}')).toEqual({ necessary: true, analytics: false });
  });

  test("returns null for garbage input", () => {
    expect(parseConsentValue("not-json-and-not-legacy")).toBeNull();
    expect(parseConsentValue("%zz-invalid-encoding")).toBeNull();
  });
});

describe("serializeConsentValue", () => {
  test("round-trips through parseConsentValue", () => {
    const original = { necessary: true as const, analytics: true };
    const serialized = serializeConsentValue(original);
    expect(parseConsentValue(serialized)).toEqual(original);
  });

  test("produces a URI-encoded string", () => {
    const serialized = serializeConsentValue(DEFAULT_CONSENT);
    expect(serialized).not.toContain("{");
    expect(decodeURIComponent(serialized)).toBe(JSON.stringify(DEFAULT_CONSENT));
  });
});

describe("getCookieFromHeader", () => {
  test("extracts a named cookie's value", () => {
    const header = "NEXT_LOCALE=en-ke; cookie-consent=accepted; other=1";
    expect(getCookieFromHeader(header, "cookie-consent")).toBe("accepted");
  });

  test("extracts the first cookie in the header", () => {
    expect(getCookieFromHeader("cookie-consent=rejected", "cookie-consent")).toBe("rejected");
  });

  test("returns null when the cookie is absent", () => {
    expect(getCookieFromHeader("NEXT_LOCALE=en-ke", "cookie-consent")).toBeNull();
  });

  test("does not match a similarly-named cookie", () => {
    expect(getCookieFromHeader("cookie-consent-old=accepted", "cookie-consent")).toBeNull();
  });
});
