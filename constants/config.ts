/**
 * Centralized configuration for EaziWage
 * All hardcoded constants, rates, and settings managed here for easy updates
 */

// Email Configuration
export const EMAIL_CONFIG = {
  SENDER_ADDRESS: process.env.RESEND_FROM_EMAIL || "noreply@eaziwage.com",
  NEWSLETTER_SENDER: process.env.RESEND_NEWSLETTER_FROM_EMAIL || "newsletter@eaziwage.com",
  MEETINGS_SENDER: process.env.RESEND_MEETINGS_FROM_EMAIL || "meetings@eaziwage.com",
  SALES_SENDER: process.env.RESEND_SALES_FROM_EMAIL || "sales@eaziwage.com",
  PARTNERSHIPS_SENDER:
    process.env.RESEND_PARTNERSHIPS_FROM_EMAIL || "partnerships@eaziwage.com",
  WIZA_SENDER: process.env.RESEND_WIZA_FROM_EMAIL || "wiza@eaziwage.com",
  SUPPORT_EMAIL: process.env.SUPPORT_EMAIL || "support@eaziwage.com",
  SALES_EMAIL: process.env.SALES_EMAIL || "sales@eaziwage.com",
  CONTACT_EMAIL: process.env.CONTACT_EMAIL || "contact@eaziwage.com",
  BOUNCED_EMAIL_RETENTION_DAYS: 90,
  MAX_BOUNCE_ATTEMPTS: 3,
};

// Application Fee Configuration (displayed as percentage and label)
export const PRICING_CONFIG = {
  APPLICATION_FEE_MIN_PERCENT: 3.5,
  APPLICATION_FEE_MAX_PERCENT: 6.5,
  APPLICATION_FEE_PLATFORM_PERCENT: 5.0,
  FLAT_USD_FEE: 2,
  DESCRIPTION:
    "Earned Wage Access with transparent, no hidden fees; includes up to 5% application fees and no interest, with options for advance salary access.",
};

// NSSF (National Social Security Fund) Configuration - Kenya
export const NSSF_CONFIG = {
  ENABLED: true,
  TIER_1_CEILING: 6000,
  TIER_1_RATE: 0.06, // 6%
  TIER_2_CEILING: 36000,
  TIER_2_RATE: 0.06, // 6%
  EMPLOYEE_RATE: undefined as number | undefined, // Use tier calculation if undefined
  EMPLOYER_RATE: undefined as number | undefined, // Use tier calculation if undefined
};

// Tax Configuration
export const TAX_CONFIG = {
  PAYE_ENABLED: true,
  PAYE_THRESHOLD_KES: 24000,
};

// Platform Fee Configuration
export const PLATFORM_CONFIG = {
  FEE_PERCENT: 0.05, // 5% of access cap
};

// Advance Configuration
export const ADVANCE_CONFIG = {
  MAX_ADVANCE_PERCENT: 0.6, // 60% of earned wages
  MAX_ADVANCE_USD: 1000,
  MIN_ADVANCE: 100,
};

// Company Configuration
export const COMPANY_CONFIG = {
  NAME: "EaziWage",
  HOMEPAGE_URL: process.env.NEXT_PUBLIC_APP_URL || "https://eaziwage.com",
  DASHBOARD_URL: process.env.NEXT_PUBLIC_DASHBOARD_APP_URL || "https://app.eaziwage.com",
  SUPPORT_URL: "https://eaziwage.com/support",
  PRIVACY_URL: "https://eaziwage.com/data.pdf",
  TERMS_URL: "https://eaziwage.com/terms.pdf",
};

// Chat Configuration
export const CHAT_CONFIG = {
  COACH_API_ENDPOINT: "/api/wiza/stream",
  WIDGET_API_ENDPOINT: "/api/chat",
  MAX_SESSION_MESSAGES: 100,
};

export const CAMPAIGN_TEMPLATES = [
  {
    key: "newsletter",
    name: "Newsletter Update",
    subject: "Your EaziWage update",
    html: "<h1>Hello {{full_name}}</h1><p>Here is what is new from EaziWage this month.</p>",
  },
  {
    key: "product",
    name: "Product Announcement",
    subject: "New from EaziWage",
    html: "<h1>Hello {{full_name}}</h1><p>We have a new EaziWage feature to share with you.</p>",
  },
  {
    key: "partner",
    name: "Partner Update",
    subject: "Partner news from EaziWage",
    html: "<h1>Hello {{full_name}}</h1><p>Here is the latest partner update from EaziWage.</p>",
  },
] as const;

export const COVERAGE_COUNTRIES = [
  {
    code: "KE",
    name: "Kenya",
    currency: "KES",
    accessCapPercent: 60,
    status: "live",
    partners: ["M-PESA", "Airtel Money", "KCB", "Equity"],
  },
  {
    code: "UG",
    name: "Uganda",
    currency: "UGX",
    accessCapPercent: 60,
    status: "live",
    partners: ["MTN MoMo", "Airtel Money"],
  },
  {
    code: "TZ",
    name: "Tanzania",
    currency: "TZS",
    accessCapPercent: 30,
    status: "live",
    partners: ["M-PESA", "Tigo Pesa", "Airtel Money"],
  },
  {
    code: "RW",
    name: "Rwanda",
    currency: "RWF",
    accessCapPercent: 45,
    status: "live",
    partners: ["MTN MoMo", "Airtel Money"],
  },
] as const;

// Rate Limiting Configuration
export const RATE_LIMIT_CONFIG = {
  PUBLIC_READ: {
    REQUESTS_PER_MINUTE: 60,
    WINDOW_MS: 60 * 1000,
  },
  REGISTER: {
    REQUESTS_PER_HOUR: 5,
    WINDOW_MS: 60 * 60 * 1000,
  },
  RESEND: {
    REQUESTS_PER_HOUR: 3,
    WINDOW_MS: 60 * 60 * 1000,
  },
  CONTACT: {
    REQUESTS_PER_HOUR: 3,
    WINDOW_MS: 60 * 60 * 1000,
  },
};

// Feature Flags
export const FEATURES = {
  EMAIL_DELIVERY_TRACKING_ENABLED: true,
  BOUNCE_HANDLING_ENABLED: true,
  FILE_ATTACHMENTS_ENABLED: true,
  COVERAGE_MAP_ENABLED: true,
};

/**
 * Get NSSF configuration for a given country
 */
export function getNSSFConfig(country: string) {
  if (country !== "KE") return { employeeRate: 0, employerRate: 0 };
  return {
    tier1Ceiling: NSSF_CONFIG.TIER_1_CEILING,
    tier1Rate: NSSF_CONFIG.TIER_1_RATE,
    tier2Cap: NSSF_CONFIG.TIER_2_CEILING,
    tier2Rate: NSSF_CONFIG.TIER_2_RATE,
    employeeRate: NSSF_CONFIG.EMPLOYEE_RATE,
    employerRate: NSSF_CONFIG.EMPLOYER_RATE,
  };
}

/**
 * Validate an email address
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Format currency with cached Intl.NumberFormat instances to avoid
 * recreating formatters on every call (small but measurable perf win).
 */
const _formatterCache: Record<string, Intl.NumberFormat> = {};

export function formatCurrency(amount: number, currency: "USD" | "KES" = "USD"): string {
  const key = currency;
  if (!_formatterCache[key]) {
    const opts: Intl.NumberFormatOptions = {
      style: "currency",
      currency: currency === "USD" ? "USD" : "KES",
      maximumFractionDigits: 0,
      currencyDisplay: "symbol",
    };
    _formatterCache[key] = new Intl.NumberFormat(undefined, opts);
  }
  try {
    return _formatterCache[key].format(amount);
  } catch {
    // Fallback: simple localized number with currency prefix
    const symbol = currency === "USD" ? "$" : "KES ";
    return `${symbol}${amount.toLocaleString()}`;
  }
}
