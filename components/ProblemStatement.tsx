"use client"
import { motion } from "framer-motion"
import Image from "next/image"
import AutoType from "./AutoType"

export default function ProblemStatement() {
    return(
        <section className="bg-gray-50 py-20">
            <div className="max-w-6xl grid lg:grid-cols-2 grid-cols-1 gap-10 items-center px-6 mx-auto">
                
                <motion.div
                initial={{opacity: 0, x: -50}}
                animate={{opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                whileHover={{ scale: 1.02 }}
                className="flex-start item-center">
                    <Image
                    src="/problem/problem.jpg"
                    alt="Problem Statement Illustration"
                    width={550}
                    height={400}
                    className="rounded-xl shadow-lg object-cover"
                    />
                </motion.div>

                <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="space-y-6"
                >
                    <h2 className="font-serif text-4xl font-bold text-gray-900">The <span className="text-green-600">Problem</span> We&apos;re Solving</h2>
                    <p className="leading-relaxed text-lg text-gray-700">
                    <span className="text-green-700">EaziWage</span>{" "}
                    <AutoType text="was born out of a simple but urgent reality: most employees struggle to stretch their income until payday, often turning to expensive mobile loans or shylocks." />
                    </p>

                    <p className="leading-relaxed text-gray-600 text-lg">
                        <AutoType text="This cycle of stress impacts not only the employee but also the workplace — from absenteeism to reduced productivity." />
                    </p>

                    <p className="leading-relaxed text-gray-600 text-lg">
                        Introducing <span className="text-green-700">EaziWage</span>{" "}
                        <AutoType text="— your simple, secure, and transparent solution that empowers employees with early access to wages they've already earned, backed by trusted banks and mobile money infrastructure." />
                    </p>
                </motion.div>
            </div>
        </section>
    )
}