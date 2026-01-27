"use client";
import { motion } from "framer-motion";
import {
  ZapIcon,
  ShieldCheck,
  Workflow,
  ScrollText,
  LineChart,
  Smartphone,
} from "lucide-react";

const steps = [
  {
    icon: ZapIcon,
    title: "Instant Disbursment",
    description:
      "Funds available within minutes through mobile money or bank transfer. No waiting periods or complex approval processes.",
  },
  {
    icon: ShieldCheck,
    title: "Bank-Grade Security",
    description:
      "Military-grade encryption to ensure your financial data and transactions are completely secure.",
  },
  {
    icon: Workflow,
    title: "HR Integration",
    description:
      "Seamless integration with existing payroll systems. Automatic deductions and comprehensive employee management.",
  },
  {
    icon: ScrollText,
    title: "Regulatory Compliance",
    description:
      "Fully compliant with local financial and data regulations. Regular audits and updates to ensure adherence to local laws.",
  },
  {
    icon: LineChart,
    title: "Real-Time Analytics",
    description:
      "Detailed insights into employee earned wage usage patterns and financial health through an intuitive dashboard.",
  },
  {
    icon: Smartphone,
    title: "Mobile Accessibility",
    description:
      "Access and manage earned wages directly from your mobile device. User-friendly app designed for on-the-go financial management.",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
};

export default function Needs() {
  return (
    <section className="relative bg-linear-to-b from-gray-50 via-green-50/10 to-gray-50 py-16 sm:py-20 dark:from-black dark:to-gray-900">
      <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="font-serif text-3xl font-bold text-gray-900 sm:text-4xl md:text-5xl lg:text-6xl dark:text-white"
        >
          Built for the{" "}
          <span className="text-green-600">African Workforce</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          viewport={{ once: true }}
          className="mx-auto mt-4 max-w-2xl px-4 text-base text-gray-600 sm:text-lg dark:text-white"
        >
          Enterprise-grade fintech built for Africa - compliant, secure, and
          fully integrated with local banking and mobile money systems.
        </motion.p>
        <p className="mt-2 text-sm text-gray-400 italic dark:text-gray-500">
          Integrated with mobile money applications, payroll providers & leading
          banks.
        </p>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-12 grid grid-cols-1 gap-6 sm:mt-16 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3"
        >
          {steps.map((step, i) => (
            <motion.div
              key={i}
              variants={item}
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="rounded-2xl border border-green-100 bg-white p-6 shadow transition-colors hover:border-green-400 hover:shadow-green-500/30 dark:border-green-900/30 dark:bg-gray-800"
            >
              <div className="flex flex-col items-center gap-4">
                <div className="group relative">
                  <step.icon className="relative z-10 h-12 w-12 text-black dark:text-white" />
                  <div className="absolute inset-0 rounded-full bg-green-400 opacity-0 blur-md transition group-hover:opacity-30"></div>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  {step.title}
                </h3>
                <p className="text-center text-sm text-gray-600 dark:text-gray-300">
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
