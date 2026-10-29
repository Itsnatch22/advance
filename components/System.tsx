"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useRef, useState, type KeyboardEvent } from "react";

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
    description: "Governance, access control, payroll settings, and oversight.",
  },
  {
    id: "employers",
    label: "Employers",
    video: "/systems/employers.mp4",
    description: "Payroll connectivity, policies, and employee adoption.",
  },
  {
    id: "employees",
    label: "Employees",
    video: "/systems/employees.mp4",
    description: "Available earnings, advance requests, and payout choices.",
  },
];

export default function System() {
  const [activeTab, setActiveTab] = useState<SystemTab["id"]>("admins");
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const reduceMotion = useReducedMotion();
  const selectedTabIndex = systemTabs.findIndex((tab) => tab.id === activeTab);
  const selectedTab = systemTabs[selectedTabIndex];

  function handleTabKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    let nextIndex: number;

    switch (event.key) {
      case "ArrowRight":
        nextIndex = (selectedTabIndex + 1) % systemTabs.length;
        break;
      case "ArrowLeft":
        nextIndex =
          (selectedTabIndex - 1 + systemTabs.length) % systemTabs.length;
        break;
      case "Home":
        nextIndex = 0;
        break;
      case "End":
        nextIndex = systemTabs.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    setActiveTab(systemTabs[nextIndex].id);
    tabRefs.current[nextIndex]?.focus();
  }

  return (
    <section
      id="system"
      aria-labelledby="system-title"
      className="relative overflow-hidden bg-slate-50/50 py-24 md:py-32"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-green-50/50 blur-[120px]" />
        <div className="absolute top-0 right-0 h-px w-full bg-linear-to-r from-transparent via-slate-200 to-transparent" />
        <div className="absolute right-0 bottom-0 h-px w-full bg-linear-to-r from-transparent via-slate-200 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 text-center">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, scale: 0.9 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
          transition={{ duration: reduceMotion ? 0 : 0.6 }}
          viewport={{ once: true }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-500/10 bg-green-500/5 px-4 py-1.5 text-xs font-black tracking-[0.2em] text-green-600 uppercase"
        >
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500 motion-reduce:animate-none" />
          See how EaziWage works
        </motion.div>

        <motion.h2
          id="system-title"
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.8 }}
          viewport={{ once: true }}
          className="font-serif text-5xl leading-tight font-bold tracking-tight text-slate-900 sm:text-6xl"
        >
          One platform.{" "}
          <span className="text-green-600">Three perspectives.</span>
        </motion.h2>

        <motion.p
          initial={reduceMotion ? false : { opacity: 0 }}
          whileInView={reduceMotion ? undefined : { opacity: 1 }}
          transition={{
            duration: reduceMotion ? 0 : 0.6,
            delay: reduceMotion ? 0 : 0.3,
          }}
          viewport={{ once: true }}
          className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-slate-500"
        >
          Explore how admins, employers, and employees use EaziWage to make
          earned wage access work.
        </motion.p>

        <div
          aria-label="Choose a system experience"
          className="mx-auto mt-10 flex max-w-2xl flex-wrap justify-center gap-3"
          role="tablist"
        >
          {systemTabs.map((tab, index) => {
            const isActive = tab.id === activeTab;

            return (
              <button
                key={tab.id}
                id={`${tab.id}-tab`}
                ref={(element) => {
                  tabRefs.current[index] = element;
                }}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls="system-panel"
                tabIndex={isActive ? 0 : -1}
                onClick={() => setActiveTab(tab.id)}
                onKeyDown={handleTabKeyDown}
                className={`rounded-full border px-6 py-3 text-sm font-black tracking-wide transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 motion-reduce:transition-none ${
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
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.8 }}
          viewport={{ once: true }}
          className="mx-auto mt-8 max-w-7xl"
        >
          <div
            id="system-panel"
            role="tabpanel"
            aria-labelledby={`${selectedTab.id}-tab`}
            tabIndex={0}
          >
            <p className="mb-6 text-base leading-relaxed text-slate-600 sm:text-lg">
              {selectedTab.description}
            </p>
            <div className="group relative aspect-video w-full overflow-hidden rounded-[2.5rem] border border-slate-200 bg-slate-950 shadow-2xl">
              <video
                key={activeTab}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                aria-label={`${selectedTab.label} demonstration`}
                className="h-full w-full object-contain transition-transform duration-700 group-hover:scale-[1.02] motion-reduce:transform-none motion-reduce:transition-none"
              >
                <source src={selectedTab.video} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
