import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils/utils';
import { gridConfig, GridVariant } from './grid.config';

interface GridSystemProps {
  variant?: GridVariant;
  opacity?: number;
  className?: string;
  children: React.ReactNode;
}

const GridSystem = forwardRef<HTMLElement, GridSystemProps>(({
  variant = 'dots',
  opacity = 0.03,
  className,
  children,
}, ref) => {
  const gridStyles: React.CSSProperties = {
    '--grid-opacity': opacity,
  } as React.CSSProperties;

  const backgroundPattern = () => {
    const baseUnit = gridConfig.baseUnit;
    
    switch (variant) {
      case 'dots':
        return (
          <svg
            className="absolute inset-0 h-full w-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id={`dots-${variant}`}
                x={0}
                y={0}
                width={baseUnit}
                height={baseUnit}
                patternUnits="userSpaceOnUse"
              >
                <circle
                  cx={baseUnit / 2}
                  cy={baseUnit / 2}
                  r={1}
                  fill="var(--grid-color, currentColor)"
                  opacity="var(--grid-opacity)"
                />
              </pattern>
            </defs>
            <rect
              width="100%"
              height="100%"
              fill={`url(#dots-${variant})`}
            />
          </svg>
        );
      
      case 'lines':
        return (
          <svg
            className="absolute inset-0 h-full w-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id={`lines-${variant}`}
                x={0}
                y={0}
                width={baseUnit}
                height={baseUnit}
                patternUnits="userSpaceOnUse"
              >
                <line
                  x1={0}
                  y1={0}
                  x2={0}
                  y2={baseUnit}
                  stroke="var(--grid-color, currentColor)"
                  strokeWidth="0.5"
                  opacity="var(--grid-opacity)"
                />
                <line
                  x1={0}
                  y1={0}
                  x2={baseUnit}
                  y2={0}
                  stroke="var(--grid-color, currentColor)"
                  strokeWidth="0.5"
                  opacity="var(--grid-opacity)"
                />
              </pattern>
            </defs>
            <rect
              width="100%"
              height="100%"
              fill={`url(#lines-${variant})`}
            />
          </svg>
        );
      
      case 'cross':
        return (
          <svg
            className="absolute inset-0 h-full w-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id={`cross-${variant}`}
                x={0}
                y={0}
                width={baseUnit}
                height={baseUnit}
                patternUnits="userSpaceOnUse"
              >
                <circle
                  cx={baseUnit / 2}
                  cy={baseUnit / 2}
                  r={1.5}
                  fill="none"
                  stroke="var(--grid-color, currentColor)"
                  strokeWidth="0.5"
                  opacity="var(--grid-opacity)"
                />
                <line
                  x1={baseUnit / 2 - 3}
                  y1={baseUnit / 2}
                  x2={baseUnit / 2 + 3}
                  y2={baseUnit / 2}
                  stroke="var(--grid-color, currentColor)"
                  strokeWidth="0.5"
                  opacity="var(--grid-opacity)"
                />
                <line
                  x1={baseUnit / 2}
                  y1={baseUnit / 2 - 3}
                  x2={baseUnit / 2}
                  y2={baseUnit / 2 + 3}
                  stroke="var(--grid-color, currentColor)"
                  strokeWidth="0.5"
                  opacity="var(--grid-opacity)"
                />
              </pattern>
            </defs>
            <rect
              width="100%"
              height="100%"
              fill={`url(#cross-${variant})`}
            />
          </svg>
        );
      
      default:
        return null;
    }
  };

  return (
    <section ref={ref} className={cn('relative overflow-hidden', className)}>
      {/* Grid Background */}
      <div 
        className="pointer-events-none absolute inset-0"
        style={gridStyles}
      >
        {backgroundPattern()}
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </section>
  );
});

GridSystem.displayName = 'GridSystem';

export default GridSystem;
