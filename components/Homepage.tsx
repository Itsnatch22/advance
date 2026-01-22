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
      <div className="absolute inset-0 bg-gradient-to-r from-green-700/90 to-transparent"></div>
      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-24">
        <div className="space-y-4 pt-0 sm:space-y-6 lg:pt-20">
          <motion.h1
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="font-serif text-3xl leading-tight font-bold text-white sm:text-4xl lg:text-6xl"
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
          <motion.div
            className="flex flex-col gap-3 sm:flex-row sm:gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link href="/register">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-base font-medium text-white transition hover:bg-green-700 sm:w-auto sm:text-lg dark:bg-black"
              >
                <motion.span
                  initial={{ translateX: 0 }}
                  whileHover={{ translateX: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <BiChevronRight className="h-5 w-5" />
                </motion.span>
              </motion.button>
            </Link>
            <Link href="/employers">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-green-500 bg-transparent px-6 py-3 text-base font-medium text-white transition-colors ease-in-out hover:bg-green-50 hover:text-green-700 sm:w-auto sm:text-lg"
              >
                <motion.span
                  initial={{ translateX: 0 }}
                  whileHover={{ translateX: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <BiChevronRight className="h-5 w-5" />
                </motion.span>
              </motion.button>
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-8 left-1/2 z-20 hidden -translate-x-1/2 transform lg:flex"
        >
          <div className="flex flex-col items-center">
            <span className="mb-2 text-sm text-white">Scroll Down</span>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                ease: "easeInOut",
              }}
              className="flex h-10 w-6 justify-center rounded-full border-2 border-white"
            >
              <div className="mt-2 h-2 w-1 rounded-full bg-white" />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
