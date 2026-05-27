import React from 'react';
import { cn } from '@/lib/utils/utils';
import { gridConfig } from './grid.config';

interface GridContainerProps {
  cols?: number;
  gap?: number;
  className?: string;
  children: React.ReactNode;
}

export default function GridContainer({
  cols = gridConfig.columns,
  gap = gridConfig.gap,
  className,
  children,
}: GridContainerProps) {
  const containerStyles: React.CSSProperties = {
    maxWidth: `${gridConfig.maxWidth}px`,
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingLeft: '1.5rem', // 24px
    paddingRight: '1.5rem', // 24px
  };

  const gridStyles: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: `repeat(${cols}, 1fr)`,
    gap: `${gap}px`,
  };

  return (
    <div style={containerStyles} className={cn('w-full', className)}>
      <div style={gridStyles}>
        {children}
      </div>
    </div>
  );
}
