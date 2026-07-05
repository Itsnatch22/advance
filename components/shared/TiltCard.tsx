"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils/utils";
import { useParallax } from "@/hooks/use-parallax";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
}

export const TiltCard = ({ children, className }: TiltCardProps) => {
  const {
    rotateX,
    rotateY,
    spotlightBackground,
    handleMouseMove,
    handleMouseLeave,
  } = useParallax();

  return (
    <motion.div style={{ perspective: 1000 }}>
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY }}
        className={cn(
          "group relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl transition-shadow duration-500 hover:shadow-2xl",
          className
        )}
      >
        {/* Spotlight that follows the cursor */}
        <motion.div
          style={{ background: spotlightBackground }}
          className="pointer-events-none absolute inset-0"
        />
        {children}
        {/* Thin emerald accent bar that slides in on hover */}
        <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-emerald-500 transition-all duration-700 group-hover:w-full" />
      </motion.div>
    </motion.div>
  );
};

export default TiltCard;
