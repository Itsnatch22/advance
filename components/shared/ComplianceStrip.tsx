import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

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
        "w-full bg-gray-50 px-3 py-3 sm:px-6 sm:py-4 lg:px-10 dark:bg-black",
        className
      )}
    >
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 py-8 text-center text-[0.75rem] text-gray-700 sm:gap-x-6 sm:text-sm dark:text-white">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 shrink-0 text-green-500" />
            <span>{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
