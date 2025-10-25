"use client"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import Startup from "@/public/Startup.json"
import Lottie from "lottie-react"

export default function CareersPage() {
    return(
        <section className="px-6 flex flex-col min-h-screen mx-auto text-center justify-center bg-green-300">
            <div className="w-64 h-64 mb-6 items-center mx-auto">
                <Lottie animationData={Startup} loop={true} />
            </div>
            <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl font-semibold font-serif mb-4"
            >
                Careers page coming soon.
            </motion.h1>
            <p className="text-xl mt-4">
                We are growing fast and we opt to create opportunities for young minds. Watch this space.
            </p>
            <p className="mt-4">
                For inquiries, reach us at{" "}
                <Link
                href="mailto:info@eaziwage.com"
                className="underline"
                >
                    info@eaziwage.com <ArrowUpRight size={12} className="ml-2 inline-block"/>
                </Link>
            </p>
        </section>
    )
}