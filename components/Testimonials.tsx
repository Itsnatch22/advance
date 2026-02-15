"use client";
import { Icons } from "@/constants";
import { testimonials } from "@/constants/data";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};


export default function Testimonials(){
    return(
        <section className="py-24 lg:py-32 bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-20">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 rounded-full text-sm font-semibold text-primary mb-6">
                        <Icons.Heart className="w-4 h-4"/>
                        Customer Stories
                    </div>
                    <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }} 
                    className="font-serif text-4xl sm:text-5xl font-bold text-slate-900 mb-5">
                        Voices from <span className="text-green-700">East Africa</span>
                    </motion.h2>
                    <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    viewport={{ once: true }} 
                    className="text-xl mx-auto max-w-2xl text-slate-600">
                        Real stories from workers and employers who've discovered financial freedom with EaziWage.
                    </motion.p>
                </div>
                <motion.div 
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }} 
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                        variants={item}
                        whileHover={{ scale: 1.05, translateY: -5 }}
                        transition={{ type: "spring", stiffness: 300 }} 
                        key={index} 
                        className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:border-green-400 hover:shadow-green-500/30">
                            <div className="flex items-center gap-2 mb-4">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Icons.Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                ))}
                            </div>
                            <p className="text-slate-600 mb-6 leading-relaxed">
                                "{testimonial.quote}"
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                    {testimonial.avatar}
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-900">{testimonial.author}</p>
                                    <p className="text-sm text-slate-500">{testimonial.role}</p>
                                    <p className="text-sm text-slate-400">{testimonial.location}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}