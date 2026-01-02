import { ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ComplianceItem {
  text: string;
}

interface ComplianceStripProps {
  items: ComplianceItem[];
  className?: string;
}

export function ComplianceStrip({ items, className }: ComplianceStripProps) {
  return (
    <div
      className={cn(
        'w-full bg-gray-50 dark:bg-black py-3 sm:py-4 px-3 sm:px-6 lg:px-10',
        className
      )}
    >
      <div className="flex py-8 flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:gap-x-6 text-[0.75rem] sm:text-sm text-gray-700 dark:text-white text-center">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-green-500 shrink-0" />
            <span>{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}