"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function Testimonials() {
  useGSAP(() => {
    const clipAnimation = gsap.timeline({
      scrollTrigger: {
        trigger: "#testimonial-clip",
        start: "center center",
        end: "+=800 center",
        scrub: 0.5,
        pin: true,
        pinSpacing: true,
      },
    });

    clipAnimation.to(".testimonial-mask", {
      width: "100vw",
      height: "100vh",
      borderRadius: 0,
    });
  });

  return (
    <section id="testimonials" className="w-screen bg-white dark:bg-slate-950">
      {/* Title */}
      <div className="flex flex-col items-center gap-4 pb-10 pt-24 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
          Trusted by thousands across East Africa
        </p>
        <h2 className="font-serif text-4xl font-black leading-tight text-slate-900 dark:text-white md:text-6xl">
          What&apos;s{" "}
          <span className="text-emerald-600 dark:text-emerald-400">
            Everyone
          </span>{" "}
          Saying?
        </h2>
        <p className="max-w-md text-base text-slate-500 dark:text-slate-400">
          Real people. Real wages. Real freedom.
        </p>
      </div>

      {/* Clip reveal */}
      <div className="relative h-dvh w-screen" id="testimonial-clip">
        <div className="testimonial-mask">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="size-full object-cover"
          >
            <source src="/videos/testimonial.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
    </section>
  );
}
