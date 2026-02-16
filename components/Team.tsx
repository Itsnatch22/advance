"use client";

import { Highlighter } from "./ui/highlighter";
import { InfiniteMovingCards } from "./ui/infinite-moving-cards";
import Image from "next/image";
import { motion } from "framer-motion";

const team = [
  { image: "/team/mark.png", name: "Mark Kamau" },
  { image: "/team/joel.png", name: "Joel Omolo" },
  { image: "/team/henry.png", name: "Henry Kimani" },
  { image: "/team/jason.png", name: "Jason Crawford" },
];

export function Team() {
  return (
    <section className="relative flex flex-col items-center justify-center overflow-hidden bg-white px-4 py-12 antialiased dark:bg-grid-white/[0.05] sm:px-6 lg:py-20">
      
      {/* Heading Section */}
      <div className="relative z-10 mb-10 max-w-4xl text-center">
        <h2 className="font-serif text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl md:text-5xl lg:text-6xl dark:text-white">
          What The <span className="text-green-600 dark:text-green-400">Team </span>
          <br className="block sm:hidden" /> {/* Break line on tiny screens for better flow */}
          <Highlighter action="underline" color="#008000">
            Had To Say
          </Highlighter>
        </h2>
      </div>

      {/* Team Grid */}
      <div className="grid w-full max-w-6xl grid-cols-2 gap-6 sm:gap-8 md:grid-cols-4 md:gap-10">
        {team.map((member, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            viewport={{ once: true }}
            className="group flex flex-col items-center"
          >
            {/* Responsive Image Container */}
            <div className="relative aspect-square w-full max-w-37.5 overflow-hidden rounded-2xl shadow-md transition-all duration-300 group-hover:shadow-xl sm:rounded-full md:max-w-[180px]">
              <Image
                src={member.image}
                alt={member.name}
                fill
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
              />
            </div>
            
            <h3 className="mt-4 text-center text-sm font-semibold text-gray-900 sm:text-base md:text-lg dark:text-gray-100">
              {member.name}
            </h3>
          </motion.div>
        ))}
      </div>

      {/* Testimonials Slider */}
      <div className="mt-12 w-full max-w-7xl sm:mt-16 lg:mt-24">
        <InfiniteMovingCards
          items={testimonials}
          direction="right"
          speed="slow"
        />
      </div>
    </section>
  );
}

const testimonials = [
  {
    quote: "Building this one was a process, but am glad we finally got to establish it. Eaziwage is here to change our perspectives on how payroll systems work. Trust is the new currency and advance payment is how it's earned.",
    name: "Mark K.",
    title: "Co-Founder & Lead Dev",
  },
  {
    quote: "We are building more than just a payment platform we are creating a bridge of trust. One that supports growth, accelerates timelines, reduces cancellations, and brings professionalism to every transaction.",
    name: "Joel O",
    title: "Co-Founder & Backend Dev",
  },
  {
    quote: "At EaziWage, we're not just streamlining payments we're empowering connections, fostering trust, and driving success by making every transaction seamless, engaging, and impactful.",
    name: "Henry K.",
    title: "Co-Founder & CMO",
  },
  {
    quote: "As a business owner, I witnessed the stress financial delays can bring to good people. We built EaziWage to create a bridge between effort and reward so that paydays reflect the rhythm of real life, not the limits of outdated systems.",
    name: "Jason C.",
    title: "Co-Founder & CEO",
  },
];