"use client";

import React, { useEffect, useRef } from "react";
import {
  motion,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import Typed from "typed.js";
import { EMAIL_CONFIG } from '@/constants/config';
import { GridSystem } from "@/components/grid";
import { FloatingOrb } from "@/components/shared/FloatingOrb";
import { useParallax } from "@/hooks/use-parallax";
import { Terminal, TypingAnimation, AnimatedSpan } from "@/components/ui/terminal";

const FadeInText = ({ text, delay = 0 }: { text: string; delay?: number }) => (
  <motion.span
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay, ease: [0.21, 0.45, 0.32, 0.9] }}
    viewport={{ once: true }}
    className="inline-block"
  >
    {text}
  </motion.span>
);

export default function CulturePage() {
  const typedRef = useRef<HTMLSpanElement | null>(null);
  const {
    rotateX,
    rotateY,
    spotlightBackground,
    handleMouseMove,
    handleMouseLeave,
  } = useParallax();

  useEffect(() => {
    const el = typedRef.current;
    if (!el) return;
    // Guard against React Strict Mode's dev-only double-invoke of effects:
    // if a previous instance's destroy() hasn't fully flushed before this
    // one initializes, its cursor element can end up stripped from the DOM.
    // Clearing the node first guarantees a clean slate either way.
    el.innerHTML = "";
    const typed = new Typed(el, {
      strings: ["Culture", "Vibe", "Innovation", "Identity"],
      typeSpeed: 80,
      backSpeed: 50,
      loop: true,
      backDelay: 1800,
    });
    return () => typed.destroy();
  }, []);

  return (
    <GridSystem variant="dots" opacity={0.02} className="min-h-screen bg-slate-50 bg-white">
      {/* Immersive Background */}
      <div className="pointer-events-none absolute inset-0">
        <FloatingOrb color="bg-green-300" delay={0} />
        <div className="absolute top-1/2 right-0">
          <FloatingOrb color="bg-emerald-200" delay={2} />
        </div>
        <div className="absolute bottom-0 left-1/4">
          <FloatingOrb color="bg-green-100" delay={4} />
        </div>
        </div>

      <section className="relative z-10 mx-auto grid min-h-screen max-w-7xl grid-cols-1 items-center gap-16 px-6 py-40 lg:grid-cols-2 lg:px-8">
        {/* LEFT – Content Section */}
        <div className="space-y-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 rounded-full border border-green-500/10 bg-green-500/5 px-4 py-1.5 text-xs font-black tracking-[0.2em] text-green-600 uppercase"
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500"></span>
            Our Culture
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-serif text-5xl leading-tight font-bold tracking-tight text-slate-900 sm:text-7xl xl:text-8xl"
          >
            The{" "}
            <span
              ref={typedRef}
              className="inline-block min-w-50 text-green-600 sm:min-w-62.5 lg:min-w-75"
            />{" "}
            <br />
            at EaziWage
          </motion.h1>

          <div className="max-w-xl space-y-8">
            <p className="text-xl leading-relaxed text-slate-500">
              <FadeInText text="Late-night commits." delay={0.2} />{" "}
              <FadeInText text="Big ideas. Small team." delay={0.4} /> <br />
              <FadeInText
                text="We build tools that help people breathe financially."
                delay={0.6}
              />{" "}
              <br />
              <FadeInText
                text="No corporate theatre. Just sharp minds shipping."
                delay={0.8}
              />
            </p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 1 }}
              className="border-l-2 border-green-500/20 pl-6 text-lg font-medium text-green-600/60 italic"
            >
              Re-writing what fintech means for Africa.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
            >
              <Link
                href={`mailto:${EMAIL_CONFIG.SUPPORT_EMAIL}`}
                className="group inline-flex items-center gap-3 rounded-2xl bg-slate-900 px-8 py-4 font-bold text-white shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-green-600 hover:shadow-green-500/25"
              >
                <span>{EMAIL_CONFIG.SUPPORT_EMAIL}</span>
                <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Link>
            </motion.div>
          </div>
        </div>

        {/* RIGHT – 3D Code Block */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="perspective-1000 relative hidden lg:block"
        >
          <motion.div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ rotateX, rotateY }}
            className="group relative overflow-hidden rounded-[2.5rem] border border-slate-200/60 bg-white/40 p-12 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] backdrop-blur-2xl transition-shadow duration-500 hover:shadow-green-500/10"
          >
            {/* Spotlight Gradient */}
            <motion.div
              style={{
                background: spotlightBackground,
              }}
              className="pointer-events-none absolute inset-0"
            />

            <div className="relative z-10">
              <Terminal className="h-auto max-h-none w-full max-w-none border-0 bg-transparent p-0 font-mono">
                <TypingAnimation className="text-slate-800">
                  &gt; whoarewe
                </TypingAnimation>

                <AnimatedSpan className="text-green-600">
                  <span>✔ a small team building EaziWage</span>
                </AnimatedSpan>

                <TypingAnimation className="mt-4 text-slate-800">
                  &gt; cat team.json
                </TypingAnimation>

                <AnimatedSpan className="text-blue-500">
                  <span>&quot;builders&quot;,</span>
                </AnimatedSpan>
                <AnimatedSpan className="text-blue-500">
                  <span>&quot;dreamers&quot;,</span>
                </AnimatedSpan>
                <AnimatedSpan className="text-blue-500">
                  <span>&quot;problem solvers&quot;</span>
                </AnimatedSpan>

                <TypingAnimation className="mt-4 text-slate-800">
                  &gt; ./ship.sh
                </TypingAnimation>

                <AnimatedSpan className="text-green-600">
                  <span>✔ ship()</span>
                </AnimatedSpan>
                <AnimatedSpan className="text-green-600">
                  <span>✔ learn()</span>
                </AnimatedSpan>
                <AnimatedSpan className="text-green-600">
                  <span>✔ coffee()</span>
                </AnimatedSpan>
                <AnimatedSpan className="text-slate-400">
                  <span>↻ repeat()</span>
                </AnimatedSpan>
              </Terminal>
            </div>

            <div className="absolute bottom-0 left-0 h-2 w-0 bg-green-600 transition-all duration-1000 group-hover:w-full" />
          </motion.div>
        </motion.div>
      </section>
    </GridSystem>
  );
}
