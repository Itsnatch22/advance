export type Locale = 'en-ke' | 'en-tz' | 'en-ug' | 'en-rw';

export const CURRENCY_MAP: Record<Locale, { code: string; symbol: string; localeStr: string; rateFromKES: number }> = {
  'en-ke': { code: 'KES', symbol: 'KSh', localeStr: 'en-KE', rateFromKES: 1 },
  'en-tz': { code: 'TZS', symbol: 'TSh', localeStr: 'en-TZ', rateFromKES: 24 },
  'en-ug': { code: 'UGX', symbol: 'USh', localeStr: 'en-UG', rateFromKES: 36 },
  'en-rw': { code: 'RWF', symbol: 'FRw', localeStr: 'rw-RW', rateFromKES: 8.2 },
};

export function getCurrencyFromLocale(localeStr: string) {
  return CURRENCY_MAP[localeStr as Locale] || CURRENCY_MAP['en-ke'];
}

export function formatCurrency(amountKES: number, localeStr: string = 'en-ke'): string {
  const info = getCurrencyFromLocale(localeStr);
  const converted = Math.round(amountKES * info.rateFromKES);
  try {
    return new Intl.NumberFormat(info.localeStr, {
      style: 'currency',
      currency: info.code,
      maximumFractionDigits: 0,
    }).format(converted);
  } catch {
    return `${info.code} ${converted.toLocaleString()}`;
  }
}
