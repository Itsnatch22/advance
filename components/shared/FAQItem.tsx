import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

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
      className="group rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 overflow-hidden transition-all duration-300 hover:border-green-500/30"
    >
      <details className="p-6 cursor-pointer">
        <summary className="flex items-center justify-between gap-4 font-medium text-lg text-gray-900 dark:text-white list-none">
          <span>{question}</span>
          <div className="relative w-6 h-6 shrink-0">
            <div className="absolute inset-0 bg-green-100 dark:bg-green-900/30 rounded-full transition-transform group-open:rotate-90" />
            <ArrowRight className="absolute inset-0 m-auto w-4 h-4 text-green-600 dark:text-green-400 transition-transform duration-300 group-open:rotate-90" />
          </div>
        </summary>
        <p className="mt-4 text-gray-600 dark:text-gray-300 leading-relaxed text-base">
          {answer}
        </p>
      </details>
    </motion.div>
  );
}