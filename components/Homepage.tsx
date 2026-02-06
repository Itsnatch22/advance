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
    // redirect to register page with email as query param
    router.push(`https://eaziwageapp.vercel.app/register?email=${encodeURIComponent(email)}`);
  };

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
            className="font-serif text-3xl leading-tight font-bold text-black sm:text-4xl lg:text-6xl"
          >
            Access Your <span ref={typedRef} className="text-white underline" />{" "}
            Before PayDay
          </motion.h1>
          <motion.p
            className="max-w-lg text-base sm:text-lg text-white"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            EaziWage helps employees access a portion of their salary
            they&apos;ve already earned, anytime! Reduce financial stress,
            improve productivity and retain top talent - just EaziWage it.
          </motion.p>

          {/* === Email Input Form === */}
          <form
            onSubmit={handleContinue}
            className="mt-6 flex max-w-md flex-wrap gap-2"
          >
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-3 text-black focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-xl bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700 flex items-center gap-2"
            >
              Continue
              <BiChevronRight className="ml-1 h-5 w-5" />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
