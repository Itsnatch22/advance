import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  index?: number;
  className?: string;
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  index = 0,
  className,
}: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={cn(
        "group relative rounded-3xl border border-gray-100 bg-white p-8 dark:border-white/10 dark:bg-white/5",
        "shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl",
        className
      )}
    >
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-green-50/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100 dark:from-green-900/10" />
      <div className="relative">
        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 transition-transform duration-300 group-hover:scale-110 dark:bg-green-900/30">
          <Icon className="h-6 w-6 text-green-700 dark:text-green-400" />
        </div>
        <h3 className="mb-3 text-xl font-bold text-gray-900 dark:text-white">
          {title}
        </h3>
        <p className="leading-relaxed text-gray-600 dark:text-gray-400">
          {description}
        </p>
      </div>
    </motion.div>
  );
}
