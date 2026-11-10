"use client";

import React, { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";
import * as Dialog from "@radix-ui/react-dialog";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";

export function AppleCardsCarouselDemo() {
  const [selectedCard, setSelectedCard] = useState<(typeof data)[0] | null>(
    null
  );
  const shouldReduceMotion = useReducedMotion() !== false;
  const cards = data.map((card) => (
    <Card key={card.src} card={card} onClick={() => setSelectedCard(card)} />
  ));

  return (
    <Dialog.Root
      open={selectedCard !== null}
      onOpenChange={(open) => {
        if (!open) setSelectedCard(null);
      }}
    >
      <div className="w-full">
        <Carousel items={cards} />
      </div>

      <Dialog.Portal forceMount>
        <AnimatePresence>
          {selectedCard && (
            <React.Fragment key={selectedCard.src}>
              <Dialog.Overlay asChild>
                <motion.div
                  initial={shouldReduceMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: shouldReduceMotion ? 0.01 : 0.2 }}
                  className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-3 backdrop-blur-sm sm:p-6"
                />
              </Dialog.Overlay>
              <Dialog.Content asChild>
                <motion.div
                  initial={
                    shouldReduceMotion
                      ? false
                      : { opacity: 0, y: 16, scale: 0.99 }
                  }
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 12, scale: 0.99 }}
                  transition={{
                    duration: shouldReduceMotion ? 0.01 : 0.24,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="relative grid h-[min(88dvh,52rem)] w-full max-w-5xl grid-cols-1 grid-rows-[minmax(12rem,0.38fr)_minmax(0,0.62fr)] overflow-hidden rounded-3xl border border-white/70 bg-white shadow-[0_32px_100px_rgba(15,23,42,0.28)] outline-none md:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] md:grid-rows-1"
                >
                  <div className="relative min-h-56 bg-emerald-950 md:min-h-0">
                    <Image
                      src={selectedCard.src}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 100vw, 42vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-slate-950/85 via-slate-950/15 to-transparent" />
                    <div className="absolute right-6 bottom-6 left-6 sm:right-8 sm:bottom-8 sm:left-8">
                      <p className="mb-2 text-xs font-bold tracking-[0.16em] text-emerald-200 uppercase">
                        {selectedCard.category}
                      </p>
                      <p className="max-w-md text-2xl leading-tight font-semibold tracking-tight text-white sm:text-3xl">
                        {selectedCard.title}
                      </p>
                    </div>
                  </div>

                  <div className="relative min-h-0 overflow-y-auto overscroll-contain px-6 pt-7 pb-6 sm:px-9 sm:pt-9 sm:pb-8">
                    <Dialog.Close asChild>
                      <button
                        type="button"
                        aria-label="Close story"
                        className="absolute top-4 right-4 flex size-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-colors hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 motion-reduce:transition-none"
                      >
                        <X aria-hidden="true" size={17} strokeWidth={2} />
                      </button>
                    </Dialog.Close>

                    <p className="pr-12 text-xs font-bold tracking-[0.16em] text-emerald-700 uppercase">
                      EaziWage in {selectedCard.category}
                    </p>
                    <Dialog.Title className="mt-3 max-w-lg text-2xl leading-tight font-semibold tracking-tight text-slate-950 sm:text-3xl">
                      Earned wage access for{" "}
                      {selectedCard.category.toLowerCase()}
                    </Dialog.Title>

                    <div className="mt-6 space-y-4 text-sm leading-7 text-slate-600 sm:text-[15px]">
                      {selectedCard.story?.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>

                    {selectedCard.stats && (
                      <div className="mt-7 grid gap-3 sm:grid-cols-2">
                        {selectedCard.stats.map((stat) => (
                          <div
                            key={`${stat.value}-${stat.label}`}
                            className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4"
                          >
                            <p className="text-2xl font-bold tracking-tight text-emerald-800">
                              {stat.value}
                            </p>
                            <p className="mt-2 text-xs leading-relaxed text-slate-600">
                              {stat.label}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="mt-8 border-t border-slate-100 pt-5">
                      <Dialog.Close asChild>
                        <button
                          type="button"
                          className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 motion-reduce:transition-none"
                        >
                          <X aria-hidden="true" size={15} strokeWidth={2} />
                          Close story
                        </button>
                      </Dialog.Close>
                    </div>
                  </div>
                </motion.div>
              </Dialog.Content>
            </React.Fragment>
          )}
        </AnimatePresence>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

const data = [
  {
    category: "School",
    title: "In schooling, every day is a new adventure.",
    src: "/eaziwage/school.png",
    story: [
      "Teaching and administrative staff in East African schools face a familiar pressure: a single monthly paycheck stretched across rent, school fees, and household emergencies. When an unexpected expense hits mid-month, many turn to high-interest loans — a cycle that chips away at focus and morale in the classroom.",
      "Industry research shows that financial stress is among the leading causes of absenteeism and reduced performance at work. EWA gives school staff access to wages they have already earned, reducing the need for costly borrowing before payday. Employers across similar sectors report meaningful improvements in staff satisfaction and attendance after introducing earned wage access as a benefit.",
    ],
    stats: [
      {
        value: "82%",
        label:
          "of employers say EWA positively impacts absenteeism (DailyPay, 2024)",
      },
      {
        value: "93%",
        label:
          "of employers offering EWA report improved retention (ADP Research)",
      },
    ],
  },
  {
    category: "Retailing",
    title: "In retail, every customer counts.",
    src: "/eaziwage/retail.png",
    story: [
      "Retail workers across East Africa deal with irregular schedules, variable hours, and the constant pressure of a fixed monthly payday. When wages don't align with when bills are due, many workers borrow — often at steep interest — just to stay afloat between pay cycles.",
      "Globally, employers in retail who offer EWA report significantly lower turnover and better customer service outcomes. In high-churn environments like retail, the cost of replacing a single employee often exceeds several months of their salary. Financial flexibility is proving to be a low-cost lever for retention.",
    ],
    stats: [
      {
        value: "Up to 29%",
        label:
          "reduction in employee turnover with EWA (Shortlister / industry data)",
      },
      {
        value: "96%",
        label: "of employers say EWA helps attract talent (DailyPay, 2024)",
      },
    ],
  },
  {
    category: "Banking",
    title: "In banking, trust is everything.",
    src: "/eaziwage/banking.png",
    story: [
      "Financial institutions understand better than most how damaging financial stress is to productivity and decision-making. Yet many bank employees across Africa face the same paycheck-to-paycheck pressures as the customers they serve — a tension that affects morale and professional performance.",
      "EWA positions progressive banks both as better employers and as innovators in the employee benefits space. Offering on-demand pay signals institutional commitment to staff financial wellness, and creates an opportunity to extend the same benefit to corporate clients as a value-added HR product.",
    ],
    stats: [
      {
        value: "80%",
        label:
          "of employable Africans live paycheck to paycheck (Afridigest / industry data)",
      },
      {
        value: "75%",
        label:
          "of adults who borrowed last year did so just to cover essentials (Finmark Trust, 2024)",
      },
    ],
  },
  {
    category: "Manufacturing",
    title: "Manufacturing the future, one product at a time.",
    src: "/eaziwage/factory.png",
    story: [
      "Factory and production workers often work in shifts, yet receive wages on a fixed monthly cycle that bears no relationship to the hours already worked. For workers managing transport costs, meals, and family obligations week to week, this gap creates real and recurring financial strain.",
      "In comparable markets, EWA adoption in manufacturing settings has been linked to measurable drops in absenteeism — particularly around end-of-month periods when financial pressure peaks. Workers who are not preoccupied with money problems show up more consistently and perform better on the floor.",
    ],
    stats: [
      {
        value: "47%",
        label:
          "of African workers can only cover bills with little left over (PwC Africa Workforce Survey, 2025)",
      },
      {
        value: "35%",
        label:
          "average reduction in turnover reported by EWA-adopting employers (Jem HR Research, 2025)",
      },
    ],
  },
  {
    category: "Hospitality",
    title: "Hospitality is the art of making strangers feel like friends.",
    src: "/eaziwage/hotel.png",
    story: [
      "Hospitality staff work some of the most demanding and irregular schedules in any industry — split shifts, weekend work, and tip-dependent income that fluctuates week to week. The mismatch between money earned and money available causes disproportionate stress for hotel and restaurant workers.",
      "When employees feel financially supported, the quality of guest experience follows. EWA gives hospitality workers real-time access to earnings they have already worked for, reducing dependence on informal lending and letting staff bring their full attention to the job.",
    ],
    stats: [
      {
        value: "2×",
        label:
          "more likely to job-hunt: financially stressed vs. financially stable employees (DailyPay / industry data)",
      },
      {
        value: "56%",
        label:
          "of workers globally say financial worries affect sleep and relationships (PwC Financial Wellness Survey)",
      },
    ],
  },
  {
    category: "Logistics",
    title: "Logistics: moving the world, one mile at a time.",
    src: "/eaziwage/warehouse.png",
    story: [
      "Delivery drivers and warehouse staff operate in a cash-flow-intensive environment — fuel, vehicle maintenance, and daily expenses don't wait for payday. Drivers who can't cover operational costs mid-month face real disruptions to their routes and reliability, affecting the entire supply chain.",
      "EWA is particularly well-suited to logistics, where the work is physical, continuous, and already measurable by the day or shift. Giving drivers and warehouse teams access to earned wages on demand has the potential to improve driver retention and operational consistency — outcomes that translate directly to better service delivery.",
    ],
    stats: [
      {
        value: "50%",
        label:
          "reduction in turnover projected for EWA-adopting logistics employers (Visa / industry research)",
      },
      {
        value: "74%",
        label:
          "decrease in absenteeism projected in companies offering EWA (Visa / industry research)",
      },
    ],
  },
];
