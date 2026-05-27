import React from 'react';
import { cn } from '@/lib/utils/utils';

interface GridItemProps {
  span?: number;
  smSpan?: number;
  mdSpan?: number;
  lgSpan?: number;
  xlSpan?: number;
  className?: string;
  children: React.ReactNode;
}

export default function GridItem({
  span = 1,
  smSpan,
  mdSpan,
  lgSpan,
  xlSpan,
  className,
  children,
}: GridItemProps) {
  const getResponsiveClasses = () => {
    const classes = [];
    
    // Base span (mobile first)
    classes.push(`col-span-${span}`);
    
    // Responsive spans
    if (smSpan !== undefined) {
      classes.push(`sm:col-span-${smSpan}`);
    }
    if (mdSpan !== undefined) {
      classes.push(`md:col-span-${mdSpan}`);
    }
    if (lgSpan !== undefined) {
      classes.push(`lg:col-span-${lgSpan}`);
    }
    if (xlSpan !== undefined) {
      classes.push(`xl:col-span-${xlSpan}`);
    }
    
    return classes.join(' ');
  };

  return (
    <div className={cn(getResponsiveClasses(), className)}>
      {children}
    </div>
  );
}
