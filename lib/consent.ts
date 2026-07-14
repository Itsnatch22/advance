export const COOKIE_CONSENT_NAME = "cookie-consent";
export const COOKIE_CONSENT_MAX_AGE = 31536000; // 1 year

export interface ConsentCategories {
  necessary: true;
  analytics: boolean;
}

export const DEFAULT_CONSENT: ConsentCategories = { necessary: true, analytics: false };

/**
 * Parses a cookie-consent value, supporting both the current JSON-encoded
 * shape and the legacy plain "accepted"/"rejected" strings so returning
 * visitors aren't re-prompted after this upgrade.
 */
export function parseConsentValue(raw: string | null | undefined): ConsentCategories | null {
  if (!raw) return null;

  if (raw === "accepted") return { necessary: true, analytics: true };
  if (raw === "rejected") return { necessary: true, analytics: false };

  for (const candidate of [raw, safeDecodeURIComponent(raw)]) {
    if (!candidate) continue;
    try {
      const parsed = JSON.parse(candidate);
      if (parsed && typeof parsed === "object") {
        return { necessary: true, analytics: Boolean(parsed.analytics) };
      }
    } catch {
      // try the next candidate
    }
  }

  return null;
}

export function serializeConsentValue(categories: ConsentCategories): string {
  return encodeURIComponent(JSON.stringify(categories));
}

function safeDecodeURIComponent(value: string): string | null {
  try {
    return decodeURIComponent(value);
  } catch {
    return null;
  }
}

/** Extracts a named cookie's raw value from a `Cookie` request header string. */
export function getCookieFromHeader(cookieHeader: string, name: string): string | null {
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? match[1] : null;
}
