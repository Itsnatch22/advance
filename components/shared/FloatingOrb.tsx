"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils/utils";

interface FloatingOrbProps {
  color?: string;
  delay?: number;
  className?: string;
}

export const FloatingOrb = ({ 
  color = "bg-green-400", 
  delay = 0, 
  className 
}: FloatingOrbProps) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      animate={
        prefersReducedMotion
          ? undefined
          : {
              y: [0, -20, 0],
              scale: [1, 1.1, 1],
              rotate: [0, 5, 0],
            }
      }
      transition={
        prefersReducedMotion
          ? undefined
          : {
              duration: 7,
              repeat: Infinity,
              delay,
              ease: "easeInOut",
            }
      }
      className={cn(
        "absolute -z-10 h-64 w-64 rounded-full blur-[100px] opacity-40",
        color,
        className
      )}
    />
  );
};

export default FloatingOrb;
