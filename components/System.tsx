"use client";

import { motion } from "framer-motion";
import { useState } from "react";

type SystemTab = {
  id: "admins" | "employers" | "employees";
  label: string;
  video: string;
  description: string;
};

const systemTabs: SystemTab[] = [
  {
    id: "admins",
    label: "Admins",
    video: "/systems/admins.mp4",
    description:
      "Demo: manage users, permissions, payroll settings, and reporting from one secure command center.",
  },
  {
    id: "employers",
    label: "Employers",
    video: "/systems/employers.mp4",
    description:
      "Demo: set policies, connect payroll, and track adoption while giving your team more financial flexibility.",
  },
  {
    id: "employees",
    label: "Employees",
    video: "/systems/employees.mp4",
    description:
      "Demo: view your available balance, request an advance, and choose where your money goes in a few taps.",
  },
];

export default function System() {
  const [activeTab, setActiveTab] = useState<SystemTab["id"]>("admins");
  const activeSystem =
    systemTabs.find((tab) => tab.id === activeTab) ?? systemTabs[0];

  return (
    <section
      id="system"
      aria-labelledby="system-title"
      className="relative overflow-hidden bg-slate-50/50 py-40"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-green-50/50 blur-[120px]" />
        <div className="absolute top-0 right-0 h-px w-full bg-linear-to-r from-transparent via-slate-200 to-transparent" />
        <div className="absolute right-0 bottom-0 h-px w-full bg-linear-to-r from-transparent via-slate-200 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-500/10 bg-green-500/5 px-4 py-1.5 text-xs font-black tracking-[0.2em] text-green-600 uppercase"
        >
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
          See How Our System Works
        </motion.div>

        <motion.h2
          id="system-title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="font-serif text-5xl leading-tight font-bold tracking-tight text-slate-900 sm:text-6xl"
        >
          One platform,{" "}
          <span className="text-green-600">built for everyone.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mx-auto mt-8 max-w-3xl text-xl leading-relaxed text-slate-500"
        >
          Explore the experience from the perspective of the people who keep
          earned wage access moving.
        </motion.p>

        <div
          aria-label="Choose a system experience"
          className="mx-auto mt-20 flex max-w-2xl flex-wrap justify-center gap-3"
          role="tablist"
        >
          {systemTabs.map((tab) => {
            const isActive = tab.id === activeTab;

            return (
              <button
                key={tab.id}
                id={`${tab.id}-tab`}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={`${tab.id}-panel`}
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-full border px-6 py-3 text-sm font-black tracking-wide transition-all ${
                  isActive
                    ? "border-green-600 bg-green-600 text-white shadow-lg shadow-green-600/20"
                    : "border-slate-200 bg-white text-slate-500 hover:border-green-500/40 hover:text-green-600"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <motion.div
          key={activeSystem.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          id={`${activeSystem.id}-panel`}
          role="tabpanel"
          aria-labelledby={`${activeSystem.id}-tab`}
          className="mx-auto mt-16 max-w-7xl"
        >
          <div className="group relative overflow-hidden rounded-[2.5rem] border border-slate-200 bg-slate-950 shadow-2xl">
            <video
              key={activeSystem.id}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label={activeSystem.description}
              className="aspect-video w-full object-contain transition-transform duration-700 group-hover:scale-[1.02]"
            >
              <source src={activeSystem.video} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
