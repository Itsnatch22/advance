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
      className="relative overflow-hidden bg-gray-50 py-16 sm:py-20 lg:py-24 dark:bg-neutral-950"
    >
      {/* === Soft Background Glow === */}
      <div className="absolute inset-0 bg-linear-to-b from-green-600/5 via-transparent to-emerald-500/5 blur-2xl dark:from-emerald-600/10 dark:via-transparent dark:to-green-500/10"></div>

      <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-4 sm:gap-16 sm:px-6 lg:grid-cols-2 lg:gap-20">
        {/* === Image Side === */}
        <motion.div
          style={{ y }}
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex items-center justify-center"
        >
          <div className="group relative">
            <Image
              src="/problem/problem.png"
              alt="Problem Statement Illustration"
              width={550}
              height={400}
              className="rounded-xl border border-green-100 object-cover shadow-2xl dark:border-neutral-800"
            />
            <div className="absolute inset-0 rounded-xl bg-linear-to-t from-green-600/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
          </div>
        </motion.div>

        {/* === Text Side === */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <h2 className="font-serif text-3xl leading-tight font-bold text-gray-900 sm:text-4xl md:text-5xl dark:text-white">
            Financial Peace Fuels{" "}
            <span className="text-green-700 dark:text-emerald-400">
              Great Performance
            </span>
          </h2>

          <p className="text-base leading-relaxed text-gray-700 sm:text-lg dark:text-gray-300">
            <span className="font-semibold text-green-700 dark:text-emerald-400">
              EaziWage
            </span>{" "}
            <AutoType text="was born out of a simple but urgent reality: most employees struggle to stretch their income until payday — often turning to expensive mobile loans or shylocks." />
          </p>

          <p className="text-base leading-relaxed text-gray-700 sm:text-lg dark:text-gray-300">
            <AutoType text="This cycle of financial stress doesn't just harm the employee - it quietly drains productivity, increases absenteeism, and lowers morale across workplaces." />
          </p>

          <p className="text-base leading-relaxed text-gray-700 sm:text-lg dark:text-gray-300">
            Introducing{" "}
            <span className="font-semibold text-green-700 dark:text-emerald-400">
              EaziWage
            </span>{" "}
            <AutoType text="- a simple, secure, and transparent way for employees to access the wages they've already earned. Backed by trusted banks and mobile money systems, designed for Africa's workforce." />
          </p>
        </motion.div>
      </div>
    </section>
  );
}
