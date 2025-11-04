"use client"

import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const faqs = [
    {
        question: "What is earned wage access and how does EaziWage work?",
        answer: "Earned wage access allows employees to access part of their earned wages before payday. EaziWage integrates with payroll and mobile money to enable instant disbursements."
    },
    {
        question: "Who can use EaziWage?",
        answer: "Our solution targets Kenyan employees across sectors; eligibility is determined by payroll data and work history."
    },
    {
        question: "Fees and pricing",
        answer: "Transparent pricing: no interest, nominal transaction fees, up to 5% application fee depending on eligibility."
    },
    {
        question: "Security measures",
        answer: "Industry-standard encryption, PCI-DSS-aligned practices, and regular audits."
    },
    {
        question: "Are there any fees associated with using EaziWage?",
        answer: "EaziWage offers a transparent pricing model with no hidden fees. While there may be nominal transaction fees and application fees for instant access, there are no interest charges or subscription fees."
    },
    {
        question: "How to get started",
        answer: "For employers: integrate with your payroll. For employees: download the app or use the web portal to request funds."
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
                Our <span className="text-green-600">Frequently</span> Asked Questions
            </motion.h2>
            <div className="mt-6 divide-y divide-gray-200 border border-gray-200 rounded-2xl bg-white">
                {faqs.map((faqs,index) => (
                    <details key={index} className="group p-5">
                        <summary className="flex dark:text-black cursor-pointer items-center justify-between text-base sm:text-lg font-medium">
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