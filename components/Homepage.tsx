"use client";
import { BiChevronRight } from "react-icons/bi";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Typed from "typed.js";

export default function Hero() {
  const typedRef = useRef(null);

  useEffect(() => {
    const typed = new Typed(typedRef.current, {
      strings: ["Earned Wages", "Salary Advances", "Money You've Worked For"],
      typeSpeed: 100,
      backSpeed: 80,
      loop: true,
      smartBackspace: true,
      cursorChar: "|",
      backDelay: 2000,
    });

    return () => typed.destroy();
  }, []);

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[url('/homepage/background.jpg')] bg-cover bg-center px-4 py-32 text-white sm:px-6 lg:px-8 lg:py-0">
      <div className="absolute inset-0 bg-linear-to-r from-green-700/90 to-transparent"></div>
      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-24">
        <div className="space-y-4 pt-0 sm:space-y-6 lg:pt-20">
          <motion.h1
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="font-serif text-3xl leading-tight font-bold text-black dark:text-white sm:text-4xl lg:text-6xl"
          >
            Access Your <span ref={typedRef} className="text-white underline" />{" "}
            {""} Before PayDay
          </motion.h1>
          <motion.p
            className="max-w-lg text-base sm:text-lg"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            EaziWage helps employees access a portion of their salary
            they&apos;ve already earned, anytime! Reduce financial stress,
            improve productivity and retain top talent - just EaziWage it.
          </motion.p>

          <div className="flex flex-wrap gap-4">
            <Link href="/register" className="rounded-xl inline-flex items-center gap-2 bg-white px-6 py-3 font-semibold text-green-700">
              Get started
              <BiChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/demo" className="rounded-xl inline-flex items-center gap-2 border border-white px-6 py-3">
              See demo
              <BiChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
