export const gridConfig = {
  baseUnit: 24,
  columns: 12,
  gap: 24,
  maxWidth: 1280,
  breakpoints: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
  },
} as const;

export type Breakpoint = keyof typeof gridConfig.breakpoints;
export type GridVariant = "dots" | "lines" | "cross";
