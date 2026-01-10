import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface FAQItemProps {
  question: string;
  answer: string;
  index: number;
}

export function FAQItem({ question, answer, index }: FAQItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-300 hover:border-green-500/30 dark:border-white/10 dark:bg-white/5"
    >
      <details className="cursor-pointer p-6">
        <summary className="flex list-none items-center justify-between gap-4 text-lg font-medium text-gray-900 dark:text-white">
          <span>{question}</span>
          <div className="relative h-6 w-6 shrink-0">
            <div className="absolute inset-0 rounded-full bg-green-100 transition-transform group-open:rotate-90 dark:bg-green-900/30" />
            <ArrowRight className="absolute inset-0 m-auto h-4 w-4 text-green-600 transition-transform duration-300 group-open:rotate-90 dark:text-green-400" />
          </div>
        </summary>
        <p className="mt-4 text-base leading-relaxed text-gray-600 dark:text-gray-300">
          {answer}
        </p>
      </details>
    </motion.div>
  );
}
