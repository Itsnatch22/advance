"use client";
import { BiChevronRight } from "react-icons/bi";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Typed from "typed.js";
import { useRouter } from "next/navigation";

export default function Hero() {
  const typedRef = useRef(null);
  const [email, setEmail] = useState("");
  const router = useRouter();

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

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    router.push(`https://eaziwageapp.vercel.app/register?email=${encodeURIComponent(email)}`);
  };

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[url('/homepage/background.jpg')] bg-cover bg-center px-4 py-32 sm:px-6 lg:px-8 lg:py-0">
      {/* Enhanced overlay with gradient */}
      <div className="absolute inset-0 bg-linear-to-r from-green-700/90 to-transparent"></div>

      
      {/* Ambient glow effects */}
      <div className="absolute left-0 top-1/4 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl"></div>
      <div className="absolute bottom-1/4 right-0 h-96 w-96 rounded-full bg-green-500/10 blur-3xl"></div>

      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div className="space-y-6 pt-0 sm:space-y-8 lg:pt-20">
          {/* Hero badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-300 ring-1 ring-white/20 backdrop-blur-sm"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
            Financial Freedom Starts Here
          </motion.div>

          {/* Enhanced heading */}
          <motion.h1
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="font-serif text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-7xl"
          >
            Access Your{" "}
            <span 
              ref={typedRef} 
              className="inline-block min-w-70 bg-linear-to-r from-emerald-400 via-green-300 to-emerald-400 bg-clip-text text-transparent sm:min-w-87.5 lg:min-w-125"
            />{" "}
            Before PayDay
          </motion.h1>

          {/* Enhanced description */}
          <motion.p
            className="max-w-2xl text-base leading-relaxed text-slate-200 sm:text-lg lg:text-xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            EaziWage helps employees access a portion of their salary
            they&apos;ve already earned, anytime! Reduce financial stress,
            improve productivity and retain top talent - just EaziWage it.
          </motion.p>

          {/* Enhanced email form */}
          <motion.form
            onSubmit={handleContinue}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-8 w-full max-w-xl"
          >
            <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-2 backdrop-blur-md transition-all duration-300 focus-within:border-emerald-400/50 focus-within:bg-white/10 focus-within:ring-2 focus-within:ring-emerald-400/20 sm:flex-row">
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 rounded-xl border-0 bg-white/90 px-5 py-3.5 text-base text-slate-900 placeholder:text-slate-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 sm:text-sm"
              />
              
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-emerald-600 to-green-600 px-8 py-3.5 font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/40"
              >
                <span>Continue</span>
                <BiChevronRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </motion.button>
            </div>

            {/* Trust indicators */}
            <div className="mt-6 flex flex-wrap items-center gap-6 text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">No hidden fees</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">0% interest</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Instant access</span>
              </div>
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  );
}