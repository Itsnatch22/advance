"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

const FadeInText = ({ text }: { text: string }) => {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1 }}
      viewport={{ once: true }}
    >
      {text}
    </motion.span>
  );
};

export default function ProblemStatement() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [0.8, 1]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-white py-32"
    >
      {/* Background architectural elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-0 h-125 w-125 -translate-y-1/2 rounded-full bg-green-50/50 blur-[120px]" />
        <div className="absolute top-0 right-0 h-px w-full bg-linear-to-r from-transparent via-slate-200 to-transparent" />
        <div className="absolute bottom-0 right-0 h-px w-full bg-linear-to-r from-transparent via-slate-200 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-20 lg:grid-cols-2 lg:gap-32">
          
          {/* Image Side with reveal effect */}
          <motion.div
            style={{ y, opacity, scale }}
            className="relative order-2 lg:order-1"
          >
            <div className="group relative aspect-4/3 overflow-hidden rounded-[2.5rem] border border-slate-200 shadow-2xl">
              <Image
                src="/problem/problem.png"
                alt="Problem Statement Illustration"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </div>
            
            {/* Floating decorative card */}
            <motion.div 
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-10 -right-10 hidden rounded-3xl border border-white/20 bg-white/40 p-6 backdrop-blur-2xl shadow-xl lg:block"
            >
              <div className="flex items-center gap-4">
                <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse" />
                <p className="text-sm font-bold text-slate-900 tracking-tight">The Productivity Gap</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Text Side */}
          <div className="order-1 space-y-8 lg:order-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 rounded-full border border-green-500/10 bg-green-500/5 px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em] text-green-600"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
              The Challenge
            </motion.div>

            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="font-serif text-4xl font-bold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl"
            >
              Financial Peace Fuels <br/>
              <span className="text-green-600">Great Performance</span>
            </motion.h2>

            <div className="space-y-6">
              <p className="text-lg leading-relaxed text-slate-500">
                <span className="font-bold text-slate-900">EaziWage</span>{" "}
                <FadeInText text="was born out of a simple but urgent reality: most employees struggle to stretch their income until payday — often turning to expensive mobile loans or shylocks." />
              </p>

              <p className="text-lg leading-relaxed text-slate-500 border-l-2 border-green-500/20 pl-6">
                <FadeInText text="This cycle of financial stress doesn't just harm the employee - it quietly drains productivity, increases absenteeism, and lowers morale across workplaces." />
              </p>

              <p className="text-lg leading-relaxed text-slate-500">
                Introducing{" "}
                <span className="font-bold text-slate-900">EaziWage</span>{" "}
                <FadeInText text="- a simple, secure, and transparent way for employees to access the wages they've already earned. Backed by trusted banks and mobile money systems, designed for Africa's workforce." />
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
