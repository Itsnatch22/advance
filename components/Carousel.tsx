"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight } from "lucide-react";
import Image from "next/image";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";

export function AppleCardsCarouselDemo() {
  const [selectedCard, setSelectedCard] = useState<typeof data[0] | null>(null);
  const cards = data.map((card) => (
    <Card 
      key={card.src} 
      card={card} 
      onClick={() => setSelectedCard(card)}
    />
  ));

  return (
    <div className="h-full w-full py-20">
      <Carousel items={cards} />
      
      {/* Modal */}
      <AnimatePresence>
        {selectedCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedCard(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="relative mx-4 max-h-[90vh] max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setSelectedCard(null)}
                className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-lg transition-colors hover:bg-white"
              >
                <X size={20} />
              </button>

              {/* Content */}
              <div className="flex flex-col lg:flex-row">
                {/* Image */}
                <div className="relative h-64 lg:h-auto lg:w-1/2">
                  <Image
                    src={selectedCard.src}
                    alt={selectedCard.title}
                    fill
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <p className="text-sm font-medium opacity-90">{selectedCard.category}</p>
                    <h3 className="text-2xl font-bold">{selectedCard.title}</h3>
                  </div>
                </div>

                {/* Story Content */}
                <div className="flex-1 p-8 lg:p-12">
                  <div className="mb-6">
                    <h2 className="mb-4 font-serif text-3xl font-bold text-slate-900">
                      {selectedCard.category} Success Story
                    </h2>
                    <div className="h-1 w-20 bg-green-600" />
                  </div>

                  <div className="prose prose-lg max-w-none text-slate-600">
                    {selectedCard.story?.map((paragraph, index) => (
                      <p key={index} className="mb-4 leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  {selectedCard.stats && (
                    <div className="mt-8 grid grid-cols-2 gap-6">
                      {selectedCard.stats.map((stat, index) => (
                        <div key={index} className="rounded-2xl bg-slate-50 p-4">
                          <div className="text-2xl font-bold text-green-600">{stat.value}</div>
                          <div className="text-sm text-slate-600">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-8">
                    <button
                      onClick={() => setSelectedCard(null)}
                      className="inline-flex items-center gap-2 rounded-2xl bg-green-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-green-700"
                    >
                      Close Story
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Sources:
//   - DailyPay / ADP / PwC / Visa / Jem HR / Shortlister / Afridigest / Finmark Trust
//   Stats are industry benchmarks; projections are clearly framed as such.

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
      { value: "82%", label: "of employers say EWA positively impacts absenteeism (DailyPay, 2024)" },
      { value: "93%", label: "of employers offering EWA report improved retention (ADP Research)" },
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
      { value: "Up to 29%", label: "reduction in employee turnover with EWA (Shortlister / industry data)" },
      { value: "96%", label: "of employers say EWA helps attract talent (DailyPay, 2024)" },
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
      { value: "80%", label: "of employable Africans live paycheck to paycheck (Afridigest / industry data)" },
      { value: "75%", label: "of adults who borrowed last year did so just to cover essentials (Finmark Trust, 2024)" },
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
      { value: "47%", label: "of African workers can only cover bills with little left over (PwC Africa Workforce Survey, 2025)" },
      { value: "35%", label: "average reduction in turnover reported by EWA-adopting employers (Jem HR Research, 2025)" },
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
      { value: "2×", label: "more likely to job-hunt: financially stressed vs. financially stable employees (DailyPay / industry data)" },
      { value: "56%", label: "of workers globally say financial worries affect sleep and relationships (PwC Financial Wellness Survey)" },
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
      { value: "50%", label: "reduction in turnover projected for EWA-adopting logistics employers (Visa / industry research)" },
      { value: "74%", label: "decrease in absenteeism projected in companies offering EWA (Visa / industry research)" },
    ],
  },
];
