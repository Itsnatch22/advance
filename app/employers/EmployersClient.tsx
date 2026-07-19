"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Receipt,
  Cog,
  LineChart,
  Lock,
  BadgeCheck,
  Clipboard,
  CircuitBoard,
  BrainCircuit,
  Sparkles,
} from "lucide-react";
import { AppleCardsCarouselDemo } from "@/components/Carousel";
import { ComplianceStrip } from "@/components/shared/ComplianceStrip";
import UI from "./UI";
import ROI from "@/components/ROI";
import Integrations from "@/components/Integrations";
import { FloatingOrb } from "@/components/shared/FloatingOrb";
import { TiltCard } from "@/components/shared/TiltCard";
import { FAQCard } from "@/components/shared/FAQCard";

const reasons = [
  {
    icon: User,
    title: "Improve retention",
    desc: "Reduce churn by supporting financial wellbeing—especially in hourly & shift roles.",
  },
  {
    icon: Receipt,
    title: "Payroll-integrated",
    desc: "Auto-deduct on payday with configurable limits and employer policies.",
  },
  {
    icon: Cog,
    title: "Fast rollout",
    desc: "Simple HRIS/Payroll mapping and sandbox to validate flows before go-live.",
  },
  {
    icon: BadgeCheck,
    title: "Zero balance-sheet loans",
    desc: "It's not a loan product. No lending, no interest, no debt on your books.",
  },
  {
    icon: Lock,
    title: "Granular controls",
    desc: "Role-based access, approvals, per-group limits, and time-bound restrictions.",
  },
  {
    icon: LineChart,
    title: "Actionable analytics",
    desc: "Adoption, usage, and impact dashboards for HR, Finance, and Operations.",
  },
];

const rolloutPlans = [
  {
    icon: Clipboard,
    title: "Sandbox",
    desc: "Map payroll fields, test auto-deductions, validate fee visibility.",
  },
  {
    icon: CircuitBoard,
    title: "Integrate",
    desc: "Connect HRIS/Payroll or CSV; set groups, roles & permissions.",
  },
  {
    icon: BrainCircuit,
    title: "Control",
    desc: "Define limits (% of earned wages), cool-offs, approvals & hours.",
  },
  {
    icon: BadgeCheck,
    title: "Launch",
    desc: "Brief managers, share staff onboarding link, monitor adoption.",
  },
];

const faqs = [
  {
    question: "How does Eaziwage integrate with our existing payroll system?",
    answer:
      "Eaziwage seamlessly integrates with most major payroll systems through secure APIs. We also support CSV uploads for manual payroll systems. Our integration team will work closely with your HR and IT departments to ensure a smooth setup process.",
  },
  {
    question:
      "What are the costs associated with implementing Eaziwage for our employees?",
    answer:
      "Eaziwage operates on a transparent pricing model with no hidden fees. Employers typically pay a nominal setup fee and a small transaction fee per withdrawal made by employees. There are no subscription fees or interest charges involved.",
  },
  {
    question:
      "How does Eaziwage ensure the security and privacy of employee data?",
    answer:
      "Eaziwage prioritizes data security and privacy. We comply with all relevant data protection regulations, including ODPC guidelines. Employee data is encrypted both in transit and at rest, and we implement strict access controls to ensure that only authorized personnel can access sensitive information.",
  },
  {
    question:
      "Can we customize the Eaziwage platform to align with our company policies?",
    answer:
      "Yes, Eaziwage offers a range of customization options to align with your company policies. You can set withdrawal limits, approval workflows, and define which employee groups have access to the service. Our platform is designed to be flexible to meet the unique needs of your organization.",
  },
];

const complianceItems = [
  { text: "Regulated partners • Regulatory compliant" },
  { text: "Data protection assured" },
  { text: "Transparent pricing (Flat fee + 5%)" },
  { text: "Auto-settlement via payroll" },
];

export default function EmployersClient() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <main className="relative min-h-screen bg-white text-slate-900">
      <div className="pointer-events-none absolute inset-0">
        <FloatingOrb
          color="bg-green-100"
          delay={0}
          className="top-[-10%] left-[10%]"
        />
        <FloatingOrb
          color="bg-emerald-100"
          delay={2}
          className="top-[30%] right-[5%]"
        />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]" />
      </div>

      <section className="relative z-10 py-12 lg:py-20">
        <UI />

        <ComplianceStrip
          items={complianceItems}
          className="my-16 border-y border-slate-200/60 bg-white/40 py-8 backdrop-blur-md"
        />

        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <div className="mb-24 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-500/10 bg-green-500/5 px-4 py-1.5 text-xs font-black tracking-[0.2em] text-green-600 uppercase"
            >
              <Sparkles size={14} className="animate-pulse" />
              <span>For Employers</span>
            </motion.div>
            <h2 className="font-serif text-5xl leading-tight font-bold tracking-tight text-slate-900 sm:text-6xl">
              Why employers{" "}
              <span className="bg-linear-to-r from-emerald-700 via-green-600 to-emerald-600 bg-clip-text text-transparent">
                choose
              </span>{" "}
              EaziWage
            </h2>
            <p className="mx-auto mt-6 max-w-3xl text-xl text-slate-500">
              A practical well-being lever that pays for itself. Zero cost, zero
              risk, zero hassle.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {reasons.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="h-full"
              >
                <TiltCard className="group relative h-full overflow-hidden rounded-[2.5rem] border border-slate-200/60 bg-white/40 p-8 backdrop-blur-2xl transition-shadow duration-500 hover:shadow-2xl hover:shadow-green-500/10">
                  <div className="relative z-10">
                    <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 text-green-600 shadow-sm ring-1 ring-green-500/10 transition-transform duration-500 group-hover:scale-110">
                      <item.icon className="h-8 w-8" strokeWidth={1.5} />
                    </div>
                    <h3 className="mb-4 text-2xl font-bold tracking-tight text-slate-900 transition-colors group-hover:text-green-700">
                      {item.title}
                    </h3>
                    <p className="text-lg leading-relaxed text-slate-500">{item.desc}</p>
                  </div>
                  <div className="absolute bottom-0 left-0 h-1.5 w-0 bg-green-600 transition-all duration-700 group-hover:w-full" />
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>

        <ROI />

        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <div className="mb-24 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-500/10 bg-green-500/5 px-4 py-1.5 text-xs font-black tracking-[0.2em] text-green-600 uppercase"
            >
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500"></span>
              Implementation
            </motion.div>
            <h2 className="font-serif text-5xl leading-tight font-bold tracking-tight text-slate-900 sm:text-6xl">
              Employer{" "}
              <span className="bg-linear-to-r from-emerald-700 via-green-600 to-emerald-600 bg-clip-text text-transparent">
                rollout plan
              </span>
            </h2>
            <p className="mx-auto mt-6 max-w-3xl text-xl text-slate-500">
              From sandbox to go live in days, not months. We handle the heavy
              lifting.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {rolloutPlans.map((item, j) => (
              <motion.div
                key={j}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: j * 0.1 }}
                className="h-full"
              >
                <TiltCard className="group relative h-full overflow-hidden rounded-[2.5rem] border border-slate-200/60 bg-white/40 p-8 backdrop-blur-2xl transition-shadow duration-500 hover:shadow-2xl hover:shadow-green-500/10">
                  <div className="relative z-10">
                    <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 text-green-600 shadow-sm ring-1 ring-green-500/10 transition-transform duration-500 group-hover:scale-110">
                      <item.icon className="h-8 w-8" strokeWidth={1.5} />
                    </div>
                    <h3 className="mb-4 text-2xl font-bold tracking-tight text-slate-900 transition-colors group-hover:text-green-700">
                      {item.title}
                    </h3>
                    <p className="text-lg leading-relaxed text-slate-500">{item.desc}</p>
                  </div>
                  <div className="absolute bottom-0 left-0 h-1.5 w-0 bg-green-600 transition-all duration-700 group-hover:w-full" />
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>

        <Integrations />

        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <div className="mb-16 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-500/10 bg-green-500/5 px-4 py-1.5 text-xs font-black tracking-[0.2em] text-green-600 uppercase"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
              Versatile Solution
            </motion.div>
            <h2 className="font-serif text-5xl leading-tight font-bold tracking-tight text-slate-900 sm:text-6xl">
              Works across{" "}
              <span className="bg-linear-to-r from-emerald-700 via-green-600 to-emerald-600 bg-clip-text text-transparent">
                sectors & sizes
              </span>
            </h2>
            <p className="mt-6 text-xl text-slate-500">
              Retail • Hospitality • Manufacturing • Logistics • Banks • Schools
              • Healthcare
            </p>
          </div>
          <AppleCardsCarouselDemo />
        </div>

        <div className="mx-auto max-w-4xl px-6 py-40">
          <div className="mb-24 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-500/10 bg-green-500/5 px-4 py-1.5 text-xs font-black tracking-[0.2em] text-green-600 uppercase"
            >
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500"></span>
              Support
            </motion.div>
            <h2 className="font-serif text-5xl leading-tight font-bold tracking-tight text-slate-900 sm:text-6xl">
              Frequently Asked{" "}
              <span className="bg-linear-to-r from-emerald-700 via-green-600 to-emerald-600 bg-clip-text text-transparent">
                Questions
              </span>
            </h2>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <FAQCard
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openIndex === index}
                onToggle={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
