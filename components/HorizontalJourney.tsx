"use client";

import React, { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import WorksPanel from "@/components/journey/WorksPanel";
import StatsPanel from "@/components/journey/StatsPanel";
import NeedsPanel from "@/components/journey/NeedsPanel";
import PricingPanel from "@/components/journey/PricingPanel";
import PanelProgress from "@/components/journey/PanelProgress";

gsap.registerPlugin(ScrollTrigger);

const PANELS = [WorksPanel, StatsPanel, NeedsPanel, PricingPanel];

export default function HorizontalJourney() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [activePanel, setActivePanel] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const prefersReduced = useReducedMotion();

  // SSR guard
  useEffect(() => {
    setMounted(true);
    setIsMobile(window.innerWidth < 768);
  }, []);

  useEffect(() => {
    if (!mounted || isMobile || prefersReduced) return;

    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray<HTMLElement>(".journey-panel");
      const totalWidth = track.scrollWidth;

      const tl = gsap.to(panels, {
        xPercent: -100 * (panels.length - 1),
        ease: "none",
        scrollTrigger: {
          trigger: container,
          pin: true,
          scrub: 1,
          snap: 1 / (panels.length - 1),
          end: () => "+=" + totalWidth,
          onUpdate: (self) => {
            const idx = Math.round(self.progress * (panels.length - 1));
            setActivePanel(idx);
          },
        },
      });

      return tl;
    }, container);

    return () => ctx.revert();
  }, [mounted, isMobile, prefersReduced]);

  const scrollToPanel = (index: number) => {
    if (!containerRef.current) return;
    const triggers = ScrollTrigger.getAll();
    const journeyTrigger = triggers.find((t) =>
      t.trigger === containerRef.current
    );
    if (!journeyTrigger) return;

    const progress = index / (PANELS.length - 1);
    const scrollY =
      journeyTrigger.start +
      progress * (journeyTrigger.end - journeyTrigger.start);
    window.scrollTo({ top: scrollY, behavior: "smooth" });
  };

  // Mobile: render vertically, no GSAP
  if (mounted && isMobile) {
    return (
      <div>
        {PANELS.map((Panel, i) => (
          <div key={i} className="relative overflow-hidden">
            <Panel />
          </div>
        ))}
      </div>
    );
  }

  // Reduced motion: same vertical fallback
  if (mounted && prefersReduced) {
    return (
      <div>
        {PANELS.map((Panel, i) => (
          <div key={i} className="relative overflow-hidden py-32">
            <Panel />
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div
        ref={containerRef}
        className="journey-container relative h-screen overflow-hidden"
        aria-label="Interactive journey section"
      >
        <div
          ref={trackRef}
          className="flex h-full"
          style={{ width: `${PANELS.length * 100}vw` }}
        >
          {PANELS.map((Panel, i) => (
            <div key={i} className="relative h-full w-screen overflow-hidden">
              <Panel />
            </div>
          ))}
        </div>
      </div>

      {/* fixed dot nav — only shown while in the pinned section */}
      {mounted && (
        <PanelProgress activeIndex={activePanel} onDotClick={scrollToPanel} />
      )}
    </>
  );
}
