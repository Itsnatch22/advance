"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Cookie, X } from "lucide-react";

const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleChoice = async (choice: "accepted" | "rejected") => {
    localStorage.setItem("cookie-consent", choice);
    setIsVisible(false);

    try {
      await fetch("/api/cookie-consent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ choice }),
      });
    } catch (error) {
      console.error("Failed to save cookie consent:", error);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed bottom-6 left-1/2 z-50 w-[95%] max-w-2xl -translate-x-1/2"
        >
          <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-black/80 p-6 backdrop-blur-xl md:p-8">
            <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-green-500/10 blur-3xl" />
            
            <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/20 text-green-500 shadow-[0_0_20px_rgba(34,197,94,0.2)]">
                <Cookie className="h-6 w-6" />
              </div>
              
              <div className="flex-1 space-y-2">
                <h3 className="text-lg font-bold text-white md:text-xl">
                  Cookie Preferences
                </h3>
                <p className="text-sm leading-relaxed text-zinc-400">
                  We use cookies to enhance your experience, analyze site traffic, and ensure the platform is secure. Trust is our priority. Choose how you'd like to proceed.
                </p>
              </div>

              <div className="flex w-full flex-col gap-3 sm:flex-row md:w-auto">
                <Button
                  variant="outline"
                  onClick={() => handleChoice("rejected")}
                  className="h-11 border-zinc-700 bg-transparent text-zinc-300 hover:bg-zinc-800 hover:text-white sm:w-28"
                >
                  Reject
                </Button>
                <Button
                  onClick={() => handleChoice("accepted")}
                  className="h-11 bg-green-600 font-semibold text-white hover:bg-green-500 sm:w-32 shadow-[0_0_15px_rgba(22,163,74,0.3)]"
                >
                  Accept All
                </Button>
              </div>
            </div>

            <button 
              onClick={() => setIsVisible(false)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieBanner;
