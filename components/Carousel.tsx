"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight } from "lucide-react";
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
                  <img
                    src={selectedCard.src}
                    alt={selectedCard.title}
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

const data = [
  {
    category: "School",
    title: "In schooling, every day is a new adventure.",
    src: "/eaziwage/school.png",
    story: [
      "St. Mary's Academy in Nairobi implemented EaziWage for their teaching and administrative staff. The results were remarkable - teachers could access their earned wages before payday for unexpected expenses, reducing financial stress and improving focus in the classroom.",
      "The school reported a 40% reduction in emergency loan requests from staff and a significant improvement in employee satisfaction scores. 'Our teachers can now focus on what matters most - educating our students,' says the school principal."
    ],
    stats: [
      { value: "40%", label: "Reduction in emergency loans" },
      { value: "85%", label: "Employee satisfaction" }
    ]
  },
  {
    category: "Retailing",
    title: "In retail, every customer counts.",
    src: "/eaziwage/retail.png",
    story: [
      "A leading supermarket chain in Kenya adopted EaziWage for their 500+ employees across multiple locations. Retail workers, who often face irregular schedules, could now access their earned wages based on hours worked.",
      "The implementation led to improved employee retention and reduced absenteeism. 'Our staff feel more financially secure, which translates directly to better customer service,' notes the HR Director."
    ],
    stats: [
      { value: "25%", label: "Reduced absenteeism" },
      { value: "30%", label: "Improved retention" }
    ]
  },
  {
    category: "Banking",
    title: "In banking, trust is everything.",
    src: "/eaziwage/banking.png",
    story: [
      "A regional bank partnered with EaziWage to offer earned wage access to their own employees and as a service to their corporate clients. The integration was seamless, leveraging existing payroll systems.",
      "Bank employees reported greater financial wellness, and the bank successfully positioned EaziWage as an innovative employee benefit for their business clients."
    ],
    stats: [
      { value: "60%", label: "Employee adoption rate" },
      { value: "15+", label: "Corporate clients onboarded" }
    ]
  },
  {
    category: "Manufacturing",
    title: "Manufacturing the future, one product at a time.",
    src: "/eaziwage/factory.png",
    story: [
      "A large manufacturing facility in Mombasa implemented EaziWage for their factory workers. The shift-based nature of manufacturing work made EaziWage particularly valuable for workers needing access to wages between pay periods.",
      "The company saw improved productivity and reduced turnover. Workers appreciated the flexibility to manage their finances according to their work schedules."
    ],
    stats: [
      { value: "35%", label: "Reduced turnover" },
      { value: "20%", label: "Productivity increase" }
    ]
  },
  {
    category: "Hospitality",
    title: "Hospitality is the art of making strangers feel like friends.",
    src: "/eaziwage/hotel.png",
    story: [
      "A luxury hotel chain in East Africa implemented EaziWage for their hospitality staff. The irregular hours and tip-based compensation in hospitality made earned wage access particularly valuable.",
      "The hotel experienced improved staff morale and reduced financial stress among employees. 'Happy staff create better guest experiences,' says the General Manager."
    ],
    stats: [
      { value: "50%", label: "Staff using EaziWage" },
      { value: "4.5★", label: "Guest satisfaction rating" }
    ]
  },
  {
    category: "Logistics",
    title: "Logistics: moving the world, one mile at a time.",
    src: "/eaziwage/warehouse.png",
    story: [
      "A major logistics company implemented EaziWage for their delivery drivers and warehouse staff. The on-the-go nature of logistics work made instant access to earned wages crucial for drivers needing fuel or emergency expenses.",
      "The company reported improved driver retention and better operational efficiency. Drivers appreciated the financial flexibility that matched their mobile work lifestyle."
    ],
    stats: [
      { value: "45%", label: "Driver retention improvement" },
      { value: "24/7", label: "Wage access availability" }
    ]
  },
];
