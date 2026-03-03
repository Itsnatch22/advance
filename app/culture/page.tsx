"use client";

import React, { useEffect, useRef, MouseEvent } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Code2, Coffee, Rocket, Lightbulb } from "lucide-react";
import Link from "next/link";
import Typed from "typed.js";

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

const FloatingOrb = ({ color, delay }: { color: string; delay: number }) => (
  <motion.div
    animate={{
      y: [0, -40, 0],
      x: [0, 20, 0],
      scale: [1, 1.1, 1],
    }}
    transition={{
      duration: 10 + Math.random() * 5,
      repeat: Infinity,
      delay,
      ease: "easeInOut",
    }}
    className={`absolute h-96 w-96 rounded-full blur-[120px] opacity-20 ${color}`}
  />
);

export default function CulturePage() {
  const typedRef = useRef<HTMLSpanElement | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), { stiffness: 150, damping: 20 });

  useEffect(() => {
    const typed = new Typed(typedRef.current!, {
      strings: ["Culture", "Vibe", "Innovation", "Identity"],
      typeSpeed: 80,
      backSpeed: 50,
      loop: true,
      backDelay: 1800,
    });
    return () => typed.destroy();
  }, []);

  function handleMouseMove(event: MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - rect.left) / rect.width - 0.5);
    y.set((event.clientY - rect.top) / rect.height - 0.5);
    mouseX.set(event.clientX - rect.left);
    mouseY.set(event.clientY - rect.top);
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-white">
      {/* Immersive Background */}
      <div className="absolute inset-0 pointer-events-none">
        <FloatingOrb color="bg-green-300" delay={0} />
        <div className="absolute top-1/2 right-0">
          <FloatingOrb color="bg-emerald-200" delay={2} />
        </div>
        <div className="absolute bottom-0 left-1/4">
          <FloatingOrb color="bg-green-100" delay={4} />
        </div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02]" />
      </div>

      <section className="relative z-10 mx-auto grid min-h-screen max-w-7xl grid-cols-1 items-center gap-16 px-6 py-32 lg:grid-cols-2 lg:px-8">
        
        {/* LEFT – Content Section */}
        <div className="space-y-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 rounded-full border border-green-500/10 bg-green-500/5 px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em] text-green-600"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>
            Our Culture
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-serif text-5xl font-bold leading-[0.95] tracking-tight text-slate-900 sm:text-7xl xl:text-8xl"
          >
            The{" "}
            <span
              ref={typedRef}
              className="inline-block min-w-50 text-green-600 sm:min-w-62.5 lg:min-w-75"
            /> <br/>
            at EaziWage
          </motion.h1>

          <div className="max-w-xl space-y-8">
            <p className="text-xl leading-relaxed text-slate-500">
              <FadeInText text="Late-night commits." delay={0.2} />{" "}
              <Link href="https://nextjs.org" className="font-bold text-slate-900 hover:text-green-600 transition-colors" target="_blank">Next.js</Link>,{" "}
              <Link href="https://vercel.app" className="font-bold text-slate-900 hover:text-green-600 transition-colors" target="_blank">Vercel</Link>,{" "}
              <Link href="https://tailwindcss.com" className="font-bold text-slate-900 hover:text-green-600 transition-colors" target="_blank">Tailwind CSS</Link>,{" "}
              <Link href="https://github.com" className="font-bold text-slate-900 hover:text-green-600 transition-colors" target="_blank">GitHub</Link>.{" "}
              <FadeInText text="Big ideas. Small team." delay={0.4} /> <br/>
              <FadeInText text="We build tools that help people breathe financially." delay={0.6} /> <br/>
              <FadeInText text="No corporate theatre. Just sharp minds shipping." delay={0.8} />
            </p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 1 }}
              className="text-lg font-medium italic text-green-600/60 border-l-2 border-green-500/20 pl-6"
            >
              Re-writing what fintech means for Africa.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
            >
              <Link
                href="mailto:support@eaziwage.com"
                className="group inline-flex items-center gap-3 rounded-2xl bg-slate-900 px-8 py-4 font-bold text-white shadow-2xl transition-all duration-300 hover:bg-green-600 hover:shadow-green-500/25 hover:scale-105"
              >
                <span>support@eaziwage.com</span>
                <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>
        </div>

        {/* RIGHT – 3D Code Block */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="relative perspective-1000 hidden lg:block"
        >
          <motion.div
            onMouseMove={handleMouseMove}
            onMouseLeave={() => { x.set(0); y.set(0); }}
            style={{ rotateX, rotateY }}
            className="group relative overflow-hidden rounded-[2.5rem] border border-slate-200/60 bg-white/40 p-12 backdrop-blur-2xl shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] transition-shadow duration-500 hover:shadow-green-500/10"
          >
            {/* Spotlight Gradient */}
            <motion.div
              style={{
                background: useTransform(
                  [mouseX, mouseY],
                  ([mx, my]) => `radial-gradient(400px circle at ${mx}px ${my}px, rgba(34, 197, 94, 0.05), transparent 80%)`
                ),
              }}
              className="absolute inset-0 pointer-events-none"
            />

            <div className="relative z-10">
              <div className="mb-10 flex items-center justify-between border-b border-slate-100 pb-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
                    <Code2 className="h-5 w-5" />
                  </div>
                  <p className="font-mono text-sm font-bold text-slate-400">culture.ts</p>
                </div>
                <div className="flex gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-100" />
                  <div className="h-3 w-3 rounded-full bg-orange-300" />
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                </div>
              </div>

              <pre className="font-mono text-lg leading-relaxed text-slate-800">
                <code>
                  <span className="text-purple-500">const</span>{" "}
                  <span className="text-blue-500">team</span>{" "}
                  <span className="text-slate-400">=</span>{" "}
                  <span className="text-slate-400">[</span>
                  {"\n  "}
                  <span className="text-green-600">&quot;builders&quot;</span>
                  <span className="text-slate-400">,</span>
                  {"\n  "}
                  <span className="text-green-600">&quot;dreamers&quot;</span>
                  <span className="text-slate-400">,</span>
                  {"\n  "}
                  <span className="text-green-600">&quot;problem solvers&quot;</span>
                  {"\n"}
                  <span className="text-slate-400">]</span>
                  {"\n\n"}
                  <div className="flex items-center gap-3 text-blue-500">
                    <Rocket className="h-4 w-4" /> <span>ship</span><span className="text-slate-400">()</span>
                  </div>
                  <div className="flex items-center gap-3 text-blue-500">
                    <Lightbulb className="h-4 w-4" /> <span>learn</span><span className="text-slate-400">()</span>
                  </div>
                  <div className="flex items-center gap-3 text-blue-500">
                    <Coffee className="h-4 w-4" /> <span>coffee</span><span className="text-slate-400">()</span>
                  </div>
                  <div className="flex items-center gap-3 text-blue-500">
                    <span>repeat</span><span className="text-slate-400">()</span>
                  </div>
                </code>
              </pre>
            </div>
            
            <div className="absolute bottom-0 left-0 h-2 w-0 bg-green-600 transition-all duration-1000 group-hover:w-full" />
          </motion.div>
        </motion.div>
      </section>
    </main>
  );
}
