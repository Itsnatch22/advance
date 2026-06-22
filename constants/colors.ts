export const BRAND_COLORS = {
  primary: "#15803D",
  secondary: "#3b82f6",
  accent: "#10b981",
  neutral: "#64748b",
  background: "#f8fafc",
  white: "#ffffff",
} as const;

export type BrandColorKey = keyof typeof BRAND_COLORS;
