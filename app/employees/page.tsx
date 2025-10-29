
"use client"
import { motion } from "framer-motion";
export default function Employees() {
    return(
        <section className="mx-auto bg-green-400 items-center flex justify-center dark:bg-green-500 h-screen">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
              className="py-10 mt-4 max-w-3xl mx-auto text-3xl font-bold text-center text-black drop-shadow-[0_0_10px_rgba(16,185,129,0.6)]"
            >
              Please hold while the dev gods craft this page. Have some tea while you are at it. 🍵
            </motion.h1>
        </section>
    )
}
