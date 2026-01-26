"use client";
import { motion } from "framer-motion";
import {
  Calculator,
  PhoneCall,
  RefreshCcw,
  BriefcaseBusiness,
} from "lucide-react";

const steps = [
  {
    icon: BriefcaseBusiness,
    step: 1,
    title: "Work Your Days",
    description:
      "Continue working as normal. Our system tracks the days you've worked and calculates your earned wages based on your earnings potential.",
  },
  {
    icon: Calculator,
    step: 2,
    title: "Calculate Advance",
    description:
      "Access upto 60% of your net earnings. Our platform automatically calculates what you're eligible for.",
  },
  {
    icon: PhoneCall,
    step: 3,
    title: "Request Your Advance",
    description:
      "Submit your request through our platform. Funds are disbursed instantly to your mobile or bank account.",
  },
  {
    icon: RefreshCcw,
    step: 4,
    title: "Automatic Repayments",
    description:
      "The advance is automatically deducted when your salary is processed. No manual repayments required.",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
};

export default function Works() {
  return (
    <section className="bg-gray-50 py-16 transition-colors duration-500 sm:py-20 lg:py-24 dark:bg-neutral-950">
      <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
        {/* === Title === */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="font-serif text-3xl font-bold text-gray-900 sm:text-4xl md:text-5xl lg:text-6xl dark:text-white"
        >
          How EaziWage{" "}
          <span className="text-green-700 dark:text-emerald-400">Works</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          viewport={{ once: true }}
          className="mx-auto mt-4 max-w-2xl px-4 text-base leading-relaxed text-gray-600 sm:mt-5 sm:text-lg dark:text-gray-300"
        >
          Access your earnings effortlessly - transparent, secure, and built for
          your financial freedom.
        </motion.p>

        {/* === Steps Grid === */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-12 grid grid-cols-1 gap-6 sm:mt-16 sm:grid-cols-2 sm:gap-8 lg:mt-20 lg:grid-cols-4 lg:gap-10"
        >
          {steps.map((step, i) => (
            <motion.div
              key={i}
              variants={item}
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="rounded-2xl border border-green-100 bg-white p-6 shadow transition-colors hover:border-green-400 hover:shadow-green-500/30 dark:border-green-900/30 dark:bg-gray-800"
            >
              <div className="flex flex-col items-center gap-5">
                {/* Icon */}
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-linear-to-br from-green-600/20 to-emerald-500/20 blur-xl"></div>
                  <step.icon className="relative z-10 h-12 w-12 text-black dark:text-white" />
                </div>

                {/* Step Label */}
                <span className="text-sm font-bold tracking-wide text-green-600 uppercase dark:text-emerald-400">
                  {step.step}
                </span>

                {/* Title + Description */}
                <h3 className="font-serif text-xl font-semibold text-gray-900 dark:text-white">
                  {step.title}
                </h3>
                <p className="text-center text-base leading-relaxed text-gray-600 dark:text-gray-300">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
