"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SENTENCE = "Your salary shouldn't make you wait — your work already happened.";

// Split into words, preserving the em dash as its own token
const words = SENTENCE.split(" ");

export default function WordReveal() {
  const containerRef = useRef<HTMLDivElement>(null);
  const wordsRef = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        wordsRef.current,
        { opacity: 0.12, y: 10 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.07,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
            end: "bottom 40%",
            scrub: 0.6,
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full py-28 px-6 flex items-center justify-center overflow-hidden"
      aria-label="Brand statement"
    >
      {/* Subtle radial glow behind text — matches EaziWage emerald palette */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        aria-hidden="true"
      >
        <div className="h-[340px] w-[640px] rounded-full bg-emerald-500/5 blur-3xl" />
      </div>

      <p className="relative max-w-4xl text-center font-serif text-4xl font-semibold leading-tight tracking-tight text-slate-900 dark:text-white sm:text-5xl md:text-6xl lg:text-7xl">
        {words.map((word, i) => (
          <span key={i} className="inline-block">
            <span
              ref={(el) => {
                if (el) wordsRef.current[i] = el;
              }}
              className="inline-block will-change-transform"
              style={{ opacity: 0.12 }}
            >
              {word}
            </span>
            {/* Space between words — not selectable */}
            {i < words.length - 1 && (
              <span aria-hidden="true">&nbsp;</span>
            )}
          </span>
        ))}
      </p>
    </section>
  );
}