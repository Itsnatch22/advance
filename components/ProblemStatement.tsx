"use client"
import { motion } from "framer-motion"
import Image from "next/image"
import AutoType from "./AutoType"

export default function ProblemStatement() {
    return(
        <section className="relative bg-gray-50 dark:bg-neutral-950 py-16 sm:py-20 lg:py-24 overflow-hidden">
  {/* === Soft Background Glow === */}
  <div className="absolute inset-0 bg-gradient-to-b from-green-600/5 via-transparent to-emerald-500/5 dark:from-emerald-600/10 dark:via-transparent dark:to-green-500/10 blur-2xl"></div>

  <div className="max-w-6xl grid lg:grid-cols-2 grid-cols-1 gap-10 sm:gap-16 lg:gap-20 items-center px-4 sm:px-6 mx-auto relative z-10">
    {/* === Image Side === */}
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="flex items-center justify-center"
    >
      <div className="relative group">
        <Image
          src="/problem/problem.png"
          alt="Problem Statement Illustration"
          width={550}
          height={400}
          className="rounded-xl shadow-2xl object-cover border border-green-100 dark:border-neutral-800"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-green-600/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
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
      <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
        Financial Peace Fuels{" "}
        <span className="text-green-700 dark:text-emerald-400">
          Great Performance
        </span>
      </h2>

      <p className="leading-relaxed text-base sm:text-lg text-gray-700 dark:text-gray-300">
        <span className="text-green-700 dark:text-emerald-400 font-semibold">
          EaziWage
        </span>{" "}
        <AutoType text="was born out of a simple but urgent reality: most employees struggle to stretch their income until payday — often turning to expensive mobile loans or shylocks." />
      </p>

      <p className="leading-relaxed text-base sm:text-lg text-gray-700 dark:text-gray-300">
        <AutoType text="This cycle of financial stress doesn't just harm the employee - it quietly drains productivity, increases absenteeism, and lowers morale across workplaces." />
      </p>

      <p className="leading-relaxed text-base sm:text-lg text-gray-700 dark:text-gray-300">
        Introducing{" "}
        <span className="text-green-700 dark:text-emerald-400 font-semibold">
          EaziWage
        </span>{" "}
        <AutoType text="- a simple, secure, and transparent way for employees to access the wages they've already earned. Backed by trusted banks and mobile money systems, designed for Africa's workforce." />
      </p>
    </motion.div>
  </div>
</section>

    )
}