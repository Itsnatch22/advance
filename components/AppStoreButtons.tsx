"use client";
import React from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const AppStoreButtons = () => {
  const handleComingSoon = (platform: string) => {
    toast(`EaziWage for ${platform} is coming soon!`, {
      icon: "🚀",
      style: {
        borderRadius: "12px",
        background: "#1e293b",
        color: "#fff",
        border: "1px solid rgba(255,255,255,0.1)",
      },
    });
  };

  return (
    <div className="flex flex-wrap gap-4">
      {/* App Store Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => handleComingSoon("iOS")}
        className="flex items-center gap-3 rounded-xl bg-black border border-white/10 px-4 py-2 text-white transition-colors hover:bg-slate-900 shadow-lg"
      >
        <svg viewBox="0 0 384 512" className="h-6 w-6 fill-current">
          <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
        </svg>
        <div className="text-left">
          <p className="text-[10px] font-bold uppercase leading-none opacity-60">Download on the</p>
          <p className="text-sm font-bold leading-tight">App Store</p>
        </div>
      </motion.button>

      {/* Google Play Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => handleComingSoon("Android")}
        className="flex items-center gap-3 rounded-xl bg-black border border-white/10 px-4 py-2 text-white transition-colors hover:bg-slate-900 shadow-lg"
      >
        <svg viewBox="0 0 512 512" className="h-6 w-6 fill-current">
          <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm420.3 225.7l-67.4-38.6L340.7 246l59.2 59.1 67.4-38.6c23-13.1 23-34.5 0-47.8zm-153.5 127.1L104.6 499l220.7-126.7-11.9-19.5z" />
        </svg>
        <div className="text-left">
          <p className="text-[10px] font-bold uppercase leading-none opacity-60">Get it on</p>
          <p className="text-sm font-bold leading-tight">Google Play</p>
        </div>
      </motion.button>
    </div>
  );
};

export default AppStoreButtons;
