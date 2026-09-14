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

    clipAnimation
      .to(".testimonial-mask", {
        width: "100vw",
        height: "100vh",
        borderRadius: 0,
      })
      .from(
        "video",
        {
          scale: 1.2,
        },
        "<"
      );
  });

  return (
    <section
      id="testimonials"
      className="relative w-screen overflow-hidden bg-white py-40"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/2 left-0 h-125 w-125 -translate-y-1/2 rounded-full bg-green-50/50 blur-[120px]" />
        <div className="absolute top-0 right-0 h-px w-full bg-linear-to-r from-transparent via-slate-200 to-transparent" />
        <div className="absolute right-0 bottom-0 h-px w-full bg-linear-to-r from-transparent via-slate-200 to-transparent" />
      </div>

      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-500/10 bg-green-500/5 px-4 py-1.5 text-xs font-black tracking-[0.2em] text-green-600 uppercase">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
          Trusted by thousands across East Africa
        </div>
        <h2 className="font-serif text-5xl leading-tight font-bold tracking-tight text-slate-900 sm:text-6xl">
          What&apos;s <span className="text-green-600">Everyone</span> Saying?
        </h2>
        <p className="mx-auto mt-8 max-w-3xl text-xl leading-relaxed text-slate-500">
          Real people. Real wages. Real freedom.
        </p>
      </div>

      {/* Clip reveal */}
      <div className="relative mt-16 h-dvh w-screen" id="testimonial-clip">
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
