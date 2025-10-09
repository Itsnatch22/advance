"use client"
import { motion } from "framer-motion"
import Image from "next/image"

export default function ProblemStatement() {
    return(
        <section className="bg-gray-50 py-20">
            <div className="max-w-6xl grid lg:grid-cols-2 grid-cols-1 gap-12 items-center px-6 mx-auto">
                <motion.div
                initial={{opacity: 0, x: -50}}
                animate={{opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="flex item-center">
                    <Image
                    src="/problem/problem.jpg"
                    alt="Problem Statement Illustration"
                    width={550}
                    height={400}
                    className="rounded-xl shadow-lg object-cover"
                    />
                </motion.div>
            </div>
        </section>
    )
}