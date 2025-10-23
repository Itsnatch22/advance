"use client";
 
import React from "react";
import { Highlighter } from "./ui/highlighter";
import { InfiniteMovingCards } from "./ui/infinite-moving-cards";
import Image from "next/image";
import { motion } from "framer-motion";

const team = [
  {
    image: "/team/mark.jpg",
    name: "Mark Kamau",
  },
  {
    image: "/team/joel.jpg",
    name: "Joel Omolo",
  },
  {
    image: "/team/henry.jpg",
    name: "Henry Kimani",
  },
  {
    image: "/team/jason.jpg",
    name: "Jason Crawford",
  },
]
 
export function Team() {
  return (
    <div className="h-[40rem] rounded-md flex flex-col antialiased bg-white dark:bg-black dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">

        <h2 className="text-5xl font-bold font-serif mb-10">
          What The {" "}
          <span className="text-green-600 dark:text-400">
            Team{" "}
          </span> 
            <Highlighter action="underline" color="#008000">
            Had To Say
            </Highlighter>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          {team.map((member, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="relative w-30 h-30 rounded-full overflow-hidden shadow-md">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                {member.name}
              </h3>
            </motion.div>
          ))}
        </div>
      <InfiniteMovingCards
        items={testimonials}
        direction="right"
        speed="slow"
      />
    </div>
  );
}
 
const testimonials = [
   {
    quote:
      "Building this one was a process, but am glad we finally got to establish it. Eaziwage is here to change our perspectives on how payroll systems work. Trust is the new currency and advance payment is how it's earned.",
    name: "Mark M.",
    title: "Co-Founder & Lead Dev",
  },
  {
    quote:
      "We are building more than just a payment platform we are creating a bridge of trust. One that supports growth, accelerates timelines, reduces cancellations, and brings professionalism to every transaction.",
    name: "Joel O",
    title: "Co-Founder & Backend Dev",
  },
  {
    quote:
      "At EaziWage, we're not just streamlining payments we're empowering connections, fostering trust, and driving success by making every transaction seamless, engaging, and impactful.",
    name: "Henry K.",
    title: "Co-Founder & CMO",
  },
  {
    quote:
      "As a business owner, I witnessed the stress financial delays can bring to good people. We built EaziWage to create a bridge between effort and reward so that paydays reflect the rhythm of real life, not the limits of outdated systems.",
    name: "Jason C.",
    title: "Co-Founder & CEO",
  },
];