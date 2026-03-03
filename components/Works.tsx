"use client";
import React, { MouseEvent } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  Calculator,
  PhoneCall,
  RefreshCcw,
  BriefcaseBusiness,
  Sparkles,
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

const WorkStepCard = ({ step }: { step: any }) => {
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
      className="relative"
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

        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="relative mb-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-green-50 to-emerald-50 ring-1 ring-green-500/10 transition-transform duration-500 group-hover:scale-110 shadow-sm">
              <step.icon className="h-8 w-8 text-green-600" strokeWidth={1.5} />
            </div>
            <div className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-green-600 font-serif font-black text-white shadow-lg ring-4 ring-white">
              {step.step}
            </div>
            <div className="absolute inset-0 -z-10 rounded-2xl bg-green-400/20 blur-xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </div>

          <h3 className="mb-4 text-xl font-bold text-slate-900 group-hover:text-green-700 transition-colors">
            {step.title}
          </h3>
          <p className="text-sm leading-relaxed text-slate-500">
            {step.description}
          </p>
        </div>

        <div className="absolute bottom-0 left-0 h-1.5 w-0 bg-linear-to-r from-green-500 to-emerald-500 transition-all duration-700 group-hover:w-full" />
      </motion.div>
    </motion.div>
  );
};

export default function Works() {
  return (
    <section className="relative overflow-hidden bg-slate-50/50 py-32">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 h-96 w-96 rounded-full bg-green-100/20 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-emerald-100/20 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-500/10 bg-green-500/5 px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em] text-green-600"
        >
          <Sparkles className="h-4 w-4" />
          <span>Simple Process</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="font-serif text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl"
        >
          How EaziWage <span className="text-green-600">Works</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-xl text-slate-500 max-w-3xl mx-auto"
        >
          Access your earnings effortlessly - transparent, secure, and built for
          your financial freedom.
        </motion.p>

        <div className="mt-24 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <WorkStepCard key={i} step={step} />
          ))}
        </div>
      </div>
    </section>
  );
}
