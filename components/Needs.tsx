// Needs.tsx - Enhanced
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

import { Icons } from "@/constants";

const steps = [
  {
    icon: ZapIcon,
    title: "Instant Disbursement",
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
    <section className="relative overflow-hidden bg-linear-to-b from-slate-50 via-white to-slate-50/30 py-20 sm:py-24 lg:py-32">
      {/* Ambient background effect */}
      <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-emerald-100/30 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-green-100/20 blur-3xl"></div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        {/* Section badge */}
        <div className="mb-6 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-700 ring-1 ring-emerald-500/10">
            <Icons.Award className="h-4 w-4" />
            <span>Why Choose EaziWage</span>
          </div>
        </div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mb-5 font-serif text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl"
        >
          Built for the{" "}
          <span className="bg-linear-to-r from-emerald-700 via-green-600 to-emerald-600 bg-clip-text text-transparent">
            African Workforce
          </span>
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          viewport={{ once: true }}
          className="mx-auto mt-4 max-w-3xl text-base leading-relaxed text-slate-600 sm:text-lg lg:text-xl"
        >
          Enterprise-grade fintech built for Africa - compliant, secure, and
          fully integrated with local banking and mobile money systems.
        </motion.p>
        <p className="mt-3 text-sm italic text-slate-500">
          Integrated with mobile money applications, payroll providers & leading
          banks.
        </p>

        {/* Feature cards grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3 lg:gap-8"
        >
          {steps.map((step, i) => (
            <motion.div
              key={i}
              variants={item}
              whileHover={{ y: -8 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="group relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white p-8 shadow-lg shadow-slate-900/5 transition-all duration-300 hover:border-emerald-200/80 hover:shadow-xl hover:shadow-emerald-500/10"
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-linear-to-br from-emerald-50/0 via-green-50/0 to-emerald-50/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

              {/* Icon */}
              <div className="relative z-10 mb-6 inline-flex">
                <div className="relative">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-linear-to-br from-emerald-50 to-green-50 ring-1 ring-emerald-500/10 transition-transform duration-300 group-hover:scale-110">
                    <step.icon className="h-7 w-7 text-emerald-600" strokeWidth={2} />
                  </div>
                  {/* Glow effect */}
                  <div className="absolute inset-0 -z-10 rounded-xl bg-emerald-400/30 opacity-0 blur-lg transition-opacity duration-300 group-hover:opacity-100"></div>
                </div>
              </div>

              {/* Content */}
              <h3 className="relative z-10 mb-3 text-xl font-bold text-slate-900">
                {step.title}
              </h3>
              <p className="relative z-10 text-sm leading-relaxed text-slate-600">
                {step.description}
              </p>

              {/* Bottom accent line */}
              <div className="absolute bottom-0 left-0 h-1 w-0 bg-linear-to-r from-emerald-500 to-green-500 transition-all duration-300 group-hover:w-full"></div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}