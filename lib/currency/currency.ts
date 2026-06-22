export type Locale = "en-ke" | "en-tz" | "en-ug" | "en-rw";

export const CURRENCY_MAP: Record<
  Locale,
  { code: string; symbol: string; localeStr: string; rateFromKES: number }
> = {
  "en-ke": { code: "KES", symbol: "KSh", localeStr: "en-KE", rateFromKES: 1 },
  "en-tz": { code: "TZS", symbol: "TSh", localeStr: "en-TZ", rateFromKES: 24 },
  "en-ug": { code: "UGX", symbol: "USh", localeStr: "en-UG", rateFromKES: 36 },
  "en-rw": { code: "RWF", symbol: "FRw", localeStr: "rw-RW", rateFromKES: 8.2 },
};

export type CountryCode = "KE" | "UG" | "TZ" | "RW";

export const COUNTRY_CURRENCY_MAP: Record<
  CountryCode,
  { code: string; symbol: string; localeStr: string; rateFromKES: number }
> = {
  KE: { code: "KES", symbol: "KSh", localeStr: "en-KE", rateFromKES: 1 },
  TZ: { code: "TZS", symbol: "TSh", localeStr: "en-TZ", rateFromKES: 24 },
  UG: { code: "UGX", symbol: "USh", localeStr: "en-UG", rateFromKES: 36 },
  RW: { code: "RWF", symbol: "FRw", localeStr: "rw-RW", rateFromKES: 8.2 },
};

export function getCurrencyFromCountry(countryCode: CountryCode) {
  return COUNTRY_CURRENCY_MAP[countryCode] || COUNTRY_CURRENCY_MAP["KE"];
}

const STATIC_FX_RATES: Record<string, number> = {
  KES: 1,
  TZS: 24,
  UGX: 36,
  RWF: 8.2,
};

const formatterCache = new Map<string, Intl.NumberFormat>();

function getFormatter(locale: string, currency: string): Intl.NumberFormat {
  const key = `${locale}-${currency}`;
  if (!formatterCache.has(key)) {
    formatterCache.set(
      key,
      new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currency,
        maximumFractionDigits: 0,
      })
    );
  }
  return formatterCache.get(key)!;
}

type FxRateCache = {
  lastFetched: number;
  rates: Record<string, number>;
};

const FX_CACHE_TTL_MS = 60 * 60 * 1000;
let fxRateCache: FxRateCache | null = null;

export function getCurrencyFromLocale(localeStr: string) {
  return CURRENCY_MAP[localeStr as Locale] || CURRENCY_MAP["en-ke"];
}

export function getCachedFxRate(currencyCode: string) {
  if (
    fxRateCache &&
    Date.now() - fxRateCache.lastFetched < FX_CACHE_TTL_MS &&
    typeof fxRateCache.rates[currencyCode] === "number"
  ) {
    return fxRateCache.rates[currencyCode];
  }

  return STATIC_FX_RATES[currencyCode] ?? 1;
}

export async function refreshFxRates() {
  try {
    const symbols = Object.values(COUNTRY_CURRENCY_MAP)
      .map((entry) => entry.code)
      .join(",");

    const response = await fetch(
      `https://api.exchangerate.host/latest?base=KES&symbols=${symbols}`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      throw new Error("Failed to refresh FX rates");
    }

    const data = (await response.json()) as { rates?: Record<string, number> };
    if (!data.rates) {
      throw new Error("FX provider returned invalid data");
    }

    fxRateCache = {
      lastFetched: Date.now(),
      rates: data.rates,
    };

    return fxRateCache.rates;
  } catch {
    return null;
  }
}

export function formatCurrency(
  amountKES: number,
  localeStr: string = "en-ke"
): string {
  const info = getCurrencyFromLocale(localeStr);
  const rate = getCachedFxRate(info.code);
  const converted = Math.round(amountKES * rate);

  if (!fxRateCache || Date.now() - fxRateCache.lastFetched >= FX_CACHE_TTL_MS) {
    refreshFxRates().catch(() => {
      /* keep using fallback rates */
    });
  }

  try {
    return getFormatter(info.localeStr, info.code).format(converted);
  } catch {
    return `${info.code} ${converted.toLocaleString()}`;
  }
}
