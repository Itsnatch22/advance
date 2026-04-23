export const gridConfig = {
  baseUnit: 24, // 24px
  columns: 12,
  gap: 24, // 24px
  maxWidth: 1280, // 1280px
  breakpoints: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
  },
} as const;

export type Breakpoint = keyof typeof gridConfig.breakpoints;
export type GridVariant = 'dots' | 'lines' | 'cross';
