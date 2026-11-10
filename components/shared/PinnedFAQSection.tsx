"use client";

import { useRef, useState, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "framer-motion";
import { FAQCard } from "@/components/shared/FAQCard";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export interface FAQItem {
  question: string;
  answer: string;
}

interface PinnedFAQSectionProps {
  eyebrow: string;
  title: ReactNode;
  intro: string;
  faqs: FAQItem[];
  footer?: ReactNode;
  initialOpenIndex?: number | null;
}

export function PinnedFAQSection({
  eyebrow,
  title,
  intro,
  faqs,
  footer,
  initialOpenIndex = 0,
}: PinnedFAQSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [openIndex, setOpenIndex] = useState<number | null>(initialOpenIndex);

  useGSAP(
    () => {
      if (reduceMotion !== false) return;

      const media = gsap.matchMedia();
      media.add("(min-width: 1024px)", () => {
        const section = sectionRef.current;
        const introPanel = introRef.current;
        const questionList = listRef.current;
        if (!section || !introPanel || !questionList) return;

        const trigger = ScrollTrigger.create({
          trigger: section,
          pin: introPanel,
          start: "top top+=96",
          endTrigger: questionList,
          end: "bottom bottom",
          pinSpacing: false,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        });

        let refreshCall: gsap.core.Tween | undefined;
        const resizeObserver = new ResizeObserver(() => {
          refreshCall?.kill();
          refreshCall = gsap.delayedCall(0.35, () => ScrollTrigger.refresh());
        });
        resizeObserver.observe(questionList);

        return () => {
          resizeObserver.disconnect();
          refreshCall?.kill();
          trigger.kill();
        };
      });

      return () => media.revert();
    },
    { dependencies: [reduceMotion], scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative overflow-x-clip bg-slate-50/50 py-20 sm:py-28 lg:py-32"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 right-0 h-150 w-150 rounded-full bg-green-50/50 blur-[120px]" />
        <div className="absolute bottom-0 left-0 h-150 w-150 rounded-full bg-emerald-50/50 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
        <div ref={introRef} className="h-fit self-start">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-green-500/10 bg-green-500/5 px-4 py-1.5 text-xs font-black tracking-[0.2em] text-green-600 uppercase">
            {eyebrow}
          </div>
          <h2 className="font-serif text-4xl leading-tight font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            {title}
          </h2>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-slate-500 sm:text-lg">
            {intro}
          </p>
          {footer && <div className="mt-8">{footer}</div>}
        </div>

        <div ref={listRef} className="space-y-4 sm:space-y-5">
          {faqs.map((faq, index) => (
            <FAQCard
              key={faq.question}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onToggle={() =>
                setOpenIndex((current) => (current === index ? null : index))
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default PinnedFAQSection;
