"use client"

import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const faqs = [
    {
        question: "What is EaziWage?",
        answer: "EaziWage is an innovative payroll solution that allows employees to access their earned wages instantly, providing financial flexibility and reducing the stress associated with traditional pay cycles."
    },
    {
        question: "How does instant wage access work?",
        answer: "Instant wage access allows employees to withdraw a portion of their earned wages before the scheduled payday. This is typically done through a mobile app or online platform, where employees can request funds as needed."
    },
    {
        question: "Is EaziWage safe to use?",
        answer: "Yes, EaziWage employs robust security measures to protect user data and financial information. We comply with industry standards and regulations to ensure a safe and secure experience for all users."
    },
];

export default function FAQ() {
    return (
        <section className="max-w-7xl mx-auto py-16 px-4 sm:px-6">
            <motion.h2 
            initial={{opacity:0 , y:20}}
            whileInView={{opacity: 1, y: 0}}
            className="font-serif font-bold text-3xl text-center sm:text-4xl md:text-5xl lg:text-6xl"
            >
                Our Frequently Asked Questions
            </motion.h2>
            <div className="mt-6 divide-y divide-gray-200 border border-gray-200 rounded-2xl bg-white">
                {faqs.map((faqs,index) => (
                    <details key={index} className="group p-5">
                        <summary className="flex cursor-pointer items-center justify-between text-base sm:text-lg font-medium">
                            {faqs.question}
                            <ArrowRight className="ml-2 h-5 w-5 shrink-0 transition-transform duration-200 group-open:rotate-90" />
                        </summary>
                        <p className="mt-4 leading-7 text-gray-600 text-base sm:text-lg">{faqs.answer}</p>
                    </details>
                ))}
            </div>
        </section>
    )
}