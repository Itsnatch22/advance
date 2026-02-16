// ProblemStatement.tsx - Enhanced
"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import AutoType from "./AutoType";
import { useRef } from "react";

export default function ProblemStatement() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-linear-to-b from-white via-slate-50/50 to-white py-20 sm:py-24 lg:py-32"
    >
      {/* Enhanced ambient glow */}
      <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-linear-to-br from-emerald-100/40 via-green-100/30 to-transparent blur-3xl"></div>
      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-emerald-50/40 blur-3xl"></div>

      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:gap-16 sm:px-6 lg:grid-cols-2 lg:gap-20 lg:px-8">
        {/* Image Side - Enhanced */}
        <motion.div
          style={{ y }}
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex items-center justify-center"
        >
          <div className="group relative">
            {/* Glow behind image */}
            <div className="absolute -inset-6 rounded-2xl bg-linear-to-br from-emerald-100/50 via-green-100/30 to-transparent blur-2xl"></div>
            
            <Image
              src="/problem/problem.png"
              alt="Problem Statement Illustration"
              width={550}
              height={400}
              className="relative rounded-2xl border border-slate-200/60 object-cover shadow-2xl shadow-slate-900/10 ring-1 ring-slate-900/5"
            />
            
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 rounded-2xl bg-linear-to-t from-emerald-600/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
          </div>
        </motion.div>

        {/* Text Side - Enhanced */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          {/* Section badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-700 ring-1 ring-emerald-500/10">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            The Challenge
          </div>

          {/* Heading */}
          <h2 className="font-serif text-3xl font-bold leading-[1.15] tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Financial Peace Fuels{" "}
            <span className="bg-linear-to-r from-emerald-700 via-green-600 to-emerald-600 bg-clip-text text-transparent">
              Great Performance
            </span>
          </h2>

          {/* Content paragraphs with improved spacing */}
          <p className="text-base leading-relaxed text-slate-700 sm:text-lg">
            <span className="font-semibold text-emerald-700">
              EaziWage
            </span>{" "}
            <AutoType text="was born out of a simple but urgent reality: most employees struggle to stretch their income until payday — often turning to expensive mobile loans or shylocks." />
          </p>

          <p className="text-base leading-relaxed text-slate-700 sm:text-lg">
            <AutoType text="This cycle of financial stress doesn't just harm the employee - it quietly drains productivity, increases absenteeism, and lowers morale across workplaces." />
          </p>

          <p className="text-base leading-relaxed text-slate-700 sm:text-lg">
            Introducing{" "}
            <span className="font-semibold text-emerald-700">
              EaziWage
            </span>{" "}
            <AutoType text="- a simple, secure, and transparent way for employees to access the wages they've already earned. Backed by trusted banks and mobile money systems, designed for Africa's workforce." />
          </p>
        </motion.div>
      </div>
    </section>
  );
}