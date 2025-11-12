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
]
 
export function Team() {
  return (
    <div className="min-h-[32rem] md:min-h-[40rem] w-full rounded-md flex flex-col antialiased bg-white dark:bg-black dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden px-4 sm:px-6">

        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-serif mb-6 sm:mb-10 text-center">
          What The {" "}
          <span className="text-green-600 dark:text-400">
            Team{" "}
          </span> 
            <Highlighter action="underline" color="#008000">
            Had To Say
            </Highlighter>
          </h2>
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 md:gap-10 w-full max-w-6xl">
          {team.map((member, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="relative mx-auto w-[800px] h-90 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-2xl overflow-hidden shadow-md">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
              </div>
              <h3 className="mt-3 sm:mt-4 text-base sm:text-lg font-semibold text-gray-900 dark:text-white text-center">
                {member.name}
              </h3>
            </motion.div>
          ))}
        </div>
      <div className="mt-8 sm:mt-12 w-full max-w-6xl">
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