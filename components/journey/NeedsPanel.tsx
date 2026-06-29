"use client";

import React from "react";
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

const features = [
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

const fadeUp = (i: number) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, delay: i * 0.08, ease: "easeOut" as const },
});

export default function NeedsPanel() {
  return (
    <div className="journey-panel flex h-full w-screen shrink-0 items-center bg-white">
      <div className="mx-auto w-full max-w-7xl px-8 lg:px-16">
        {/* header */}
        <motion.div {...fadeUp(0)} className="mb-4 flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-green-500/10 bg-green-500/5 px-4 py-1.5 text-xs font-black tracking-[0.2em] text-green-600 uppercase">
            <Icons.Award className="h-3.5 w-3.5" />
            Why Choose EaziWage
          </span>
        </motion.div>

        <motion.h2
          {...fadeUp(1)}
          className="mb-3 text-center font-serif text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl"
        >
          Built for the{" "}
          <span className="text-green-600">African Workforce</span>
        </motion.h2>

        <motion.p
          {...fadeUp(2)}
          className="mx-auto mb-2 max-w-2xl text-center text-lg leading-relaxed text-slate-500"
        >
          Enterprise-grade fintech built for Africa — compliant, secure, and
          fully integrated with local banking and mobile money systems.
        </motion.p>

        <motion.p
          {...fadeUp(3)}
          className="mb-10 text-center text-xs font-bold tracking-widest text-slate-400 uppercase italic"
        >
          Integrated with mobile money applications, payroll providers &amp;
          leading banks.
        </motion.p>

        {/* feature grid */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div key={i} {...fadeUp(i + 4)}>
              <div className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200/60 bg-white/80 p-6 backdrop-blur-xl transition-shadow duration-500 hover:shadow-xl hover:shadow-green-500/10">
                <div className="mb-5 flex">
                  <div className="relative">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-green-50 to-emerald-50 shadow-sm ring-1 ring-green-500/10 transition-transform duration-500 group-hover:scale-110">
                      <f.icon className="h-6 w-6 text-green-600" strokeWidth={1.5} />
                    </div>
                    <div className="absolute inset-0 -z-10 rounded-2xl bg-green-400/20 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />
                  </div>
                </div>
                <h3 className="mb-2 text-base font-bold text-slate-900 transition-colors group-hover:text-green-700">
                  {f.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-500">
                  {f.description}
                </p>
                <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-linear-to-r from-green-500 to-emerald-500 transition-all duration-700 group-hover:w-full" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
