"use client";
import React, { MouseEvent } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
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

const FeatureCard = ({ feature }: { feature: any }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), { stiffness: 150, damping: 20 });

  function onMouseMove(event: MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - rect.left) / rect.width - 0.5);
    y.set((event.clientY - rect.top) / rect.height - 0.5);
    mouseX.set(event.clientX - rect.left);
    mouseY.set(event.clientY - rect.top);
  }

  function onMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      style={{ perspective: 1000 }}
      className="h-full"
    >
      <motion.div
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        style={{ rotateX, rotateY }}
        className="group relative h-full overflow-hidden rounded-3xl border border-slate-200/60 bg-white/50 p-8 backdrop-blur-xl transition-shadow duration-500 hover:shadow-2xl hover:shadow-green-500/10"
      >
        <motion.div
          style={{
            background: useTransform(
              [mouseX, mouseY],
              ([mx, my]) => `radial-gradient(350px circle at ${mx}px ${my}px, rgba(34, 197, 94, 0.06), transparent 80%)`
            ),
          }}
          className="absolute inset-0 pointer-events-none"
        />

        <div className="relative z-10">
          <div className="mb-6 flex">
            <div className="relative">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-green-50 to-emerald-50 ring-1 ring-green-500/10 transition-transform duration-500 group-hover:scale-110 shadow-sm">
                <feature.icon className="h-7 w-7 text-green-600" strokeWidth={1.5} />
              </div>
              <div className="absolute inset-0 -z-10 rounded-2xl bg-green-400/20 blur-xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </div>
          </div>

          <h3 className="mb-3 text-xl font-bold text-slate-900 group-hover:text-green-700 transition-colors">
            {feature.title}
          </h3>
          <p className="text-sm leading-relaxed text-slate-500">
            {feature.description}
          </p>
        </div>

        <div className="absolute bottom-0 left-0 h-1 w-0 bg-linear-to-r from-green-500 to-emerald-500 transition-all duration-700 group-hover:w-full" />
      </motion.div>
    </motion.div>
  );
};

export default function Needs() {
  return (
    <section className="relative overflow-hidden bg-slate-50/50 py-32">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-green-100/30 blur-[120px]" />
        <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-emerald-100/30 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-500/10 bg-green-500/5 px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em] text-green-600"
        >
          <Icons.Award className="h-4 w-4" />
          <span>Why Choose EaziWage</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="font-serif text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl"
        >
          Built for the{" "}
          <span className="text-green-600">African Workforce</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-xl text-slate-500 max-w-3xl mx-auto"
        >
          Enterprise-grade fintech built for Africa - compliant, secure, and
          fully integrated with local banking and mobile money systems.
        </motion.p>
        <p className="mt-4 text-xs font-bold uppercase tracking-widest text-slate-400 italic">
          Integrated with mobile money applications, payroll providers & leading
          banks.
        </p>

        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((feature, i) => (
            <FeatureCard key={i} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
