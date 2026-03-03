"use client";
import React, { useRef, useState, MouseEvent } from "react";
import { Icons } from "@/constants";
import { testimonials } from "@/constants/data";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const TestimonialCard = ({ testimonial }: { testimonial: any }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), { stiffness: 150, damping: 20 });

  function onMouseMove(event: MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseXPos = event.clientX - rect.left;
    const mouseYPos = event.clientY - rect.top;

    x.set(mouseXPos / width - 0.5);
    y.set(mouseYPos / height - 0.5);

    mouseX.set(mouseXPos);
    mouseY.set(mouseYPos);
  }

  function onMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      style={{
        perspective: 1000,
      }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="h-full"
    >
      <motion.div
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        style={{
          rotateX,
          rotateY,
        }}
        className="group relative h-full w-full overflow-hidden rounded-3xl border border-slate-200/60 bg-white/40 p-8 backdrop-blur-xl transition-shadow duration-500 hover:shadow-2xl hover:shadow-green-500/10"
      >
        {/* spotlight effect */}
        <motion.div
          style={{
            background: useTransform(
              [mouseX, mouseY],
              ([mx, my]) => `radial-gradient(450px circle at ${mx}px ${my}px, rgba(34, 197, 94, 0.08), transparent 80%)`
            ),
          }}
          className="absolute inset-0 pointer-events-none"
        />

        <div className="relative z-10 flex h-full flex-col">
          {/* stars reveal */}
          <div className="mb-6 flex items-center gap-1.5">
            {[...Array(testimonial.rating)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ delay: 0.1 * i, type: "spring", stiffness: 200 }}
              >
                <Icons.Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              </motion.div>
            ))}
          </div>

          <p className="mb-8 font-serif text-lg leading-relaxed text-slate-700 italic">
            "{testimonial.quote}"
          </p>

          <div className="mt-auto flex items-center gap-4">
            <div className="relative h-14 w-14 overflow-hidden rounded-2xl bg-linear-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center font-bold text-green-700 text-xl border border-green-500/10 shadow-inner">
               <span className="relative z-10 group-hover:scale-110 transition-transform duration-500">{testimonial.avatar}</span>
               <div className="absolute inset-0 bg-white/40 blur-sm translate-y-full group-hover:translate-y-0 transition-transform duration-700" />
            </div>

            <div>
              <p className="font-bold tracking-tight text-slate-900 group-hover:text-green-700 transition-colors">
                {testimonial.author}
              </p>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                {testimonial.role} • {testimonial.location}
              </p>
            </div>
          </div>
        </div>
        
        {/* subtle glass border highlight */}
        <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/20 group-hover:ring-green-500/20 transition-all duration-500" />
      </motion.div>
    </motion.div>
  );
};

export default function Testimonials() {
  return (
    <section className="relative overflow-hidden bg-slate-50/50 py-32">
      {/* architectural background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-green-100/30 blur-[120px]" />
        <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-emerald-100/30 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mb-24 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mb-6 inline-block rounded-full border border-green-500/10 bg-green-500/5 px-4 py-1 text-xs font-bold uppercase tracking-[0.2em] text-green-600"
          >
            Social Proof
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="font-serif text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl"
          >
            Built on <span className="text-green-600">Trust</span>.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 text-lg text-slate-500 max-w-2xl mx-auto"
          >
            Discover why businesses and employees across the continent rely on EaziWage for financial flexibility.
          </motion.p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <TestimonialCard key={i} testimonial={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
