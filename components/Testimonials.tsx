"use client";
import { Icons } from "@/constants";
import { testimonials } from "@/constants/data";
import { motion, easeOut } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeOut },
  },
};

export default function Testimonials() {
  return (
    <section className="relative py-24 lg:py-32 bg-white overflow-hidden">
      {/* ambient background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/3 w-125 h-125 bg-green-100/40 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-1/3 w-125 h-125 bg-primary/10 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* staged intro */}
        <div className="text-center mb-20">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-700 ring-1 ring-emerald-500/10"
          >
            <Icons.Heart className="w-4 h-4" />
            Customer Stories
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            viewport={{ once: true }}
            className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-5"
          >
            Voices from <span className="text-green-700">East Africa</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl mx-auto max-w-2xl text-slate-600"
          >
            Real stories from workers and employers who've discovered financial freedom with EaziWage.
          </motion.p>
        </div>

        {/* staggered grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={item}
              whileHover="hover"
              className="group relative bg-white rounded-2xl p-8 border border-slate-100 shadow-sm transition-all duration-500"
            >
              {/* glow layer */}
              <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-green-500/0 via-green-500/0 to-green-500/10 opacity-0 group-hover:opacity-100 transition duration-500" />

              {/* content */}
              <div className="relative z-10">

                {/* stars */}
                <div className="flex items-center gap-2 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Icons.Star
                      key={i}
                      className="w-5 h-5 fill-yellow-400 text-yellow-400 transition-transform duration-300 group-hover:scale-110"
                    />
                  ))}
                </div>

                <p className="text-slate-600 mb-6 leading-relaxed">
                  "{testimonial.quote}"
                </p>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold transition-transform duration-300 group-hover:scale-110">
                    {testimonial.avatar}
                  </div>

                  <div>
                    <p className="font-semibold text-slate-900">
                      {testimonial.author}
                    </p>
                    <p className="text-sm text-slate-500">
                      {testimonial.role}
                    </p>
                    <p className="text-sm text-slate-400">
                      {testimonial.location}
                    </p>
                  </div>
                </div>
              </div>

              {/* bottom sweep line */}
              <div className="absolute bottom-0 left-0 h-1 w-0 bg-linear-to-r from-emerald-500 to-green-500 transition-all duration-300 group-hover:w-full"></div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
