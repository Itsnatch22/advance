"use client";

import { Highlighter } from "./ui/highlighter";
import { InfiniteMovingCards } from "./ui/infinite-moving-cards";
import Image from "next/image";
import { motion } from "framer-motion";

const team = [
  {
    image: "/team/mark.png",
    name: "Mark Kamau",
  },
  {
    image: "/team/joel.png",
    name: "Joel Omolo",
  },
  {
    image: "/team/henry.png",
    name: "Henry Kimani",
  },
  {
    image: "/team/jason.png",
    name: "Jason Crawford",
  },
];

export function Team() {
  return (
    <div className="dark:bg-grid-white/[0.05] relative flex min-h-128 w-full flex-col items-center justify-center overflow-hidden rounded-md bg-white px-4 antialiased sm:px-6 md:min-h-160">
      <h2 className="mb-6 text-center font-serif text-3xl font-bold sm:mb-10 sm:text-4xl md:text-5xl lg:text-6xl">
        What The <span className="dark:text-400 text-green-600">Team </span>
        <Highlighter action="underline" color="#008000">
          Had To Say
        </Highlighter>
      </h2>
      <div className="xs:grid-cols-2 grid w-full max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 md:grid-cols-4 md:gap-10">
        {team.map((member, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            viewport={{ once: true }}
            className="group"
          >
            <div className="relative mx-auto h-90 w-[800px] overflow-hidden rounded-2xl shadow-md sm:h-32 sm:w-32 md:h-36 md:w-36">
              <Image
                src={member.image}
                alt={member.name}
                fill
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />
            </div>
            <h3 className="mt-3 text-center text-base font-semibold text-gray-900 sm:mt-4 sm:text-lg">
              {member.name}
            </h3>
          </motion.div>
        ))}
      </div>
      <div className="mt-8 w-full max-w-6xl sm:mt-12">
        <InfiniteMovingCards
          items={testimonials}
          direction="right"
          speed="slow"
        />
      </div>
    </div>
  );
}

const testimonials = [
  {
    quote:
      "Building this one was a process, but am glad we finally got to establish it. Eaziwage is here to change our perspectives on how payroll systems work. Trust is the new currency and advance payment is how it's earned.",
    name: "Mark K.",
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
