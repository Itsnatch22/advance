"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { cn } from "@/lib/utils/utils";
import { useParallax } from "@/hooks/use-parallax";
import PhoneShell from "@/components/phone/PhoneShell";
import Screen1 from "@/components/phone/Screen1";
import Screen2 from "@/components/phone/Screen2";
import Screen3 from "@/components/phone/Screen3";
import FloatingNotification from "@/components/phone/FloatingNotification";

interface HeroPhoneProps {
  className?: string;
  autoPlay?: boolean;
  cycleInterval?: number;
}

const SCREENS = [Screen1, Screen2, Screen3];

const screenVariants = {
  enter: { y: 20, opacity: 0 },
  center: { y: 0, opacity: 1 },
  exit: { y: -20, opacity: 0 },
};

export default function HeroPhone({
  className,
  autoPlay = true,
  cycleInterval = 3000,
}: HeroPhoneProps) {
  const [screenIndex, setScreenIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();
  const { rotateX, rotateY, handleMouseMove, handleMouseLeave } = useParallax();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const yPhone = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const rotatePhone = useTransform(scrollYProgress, [0, 1], [0, -5]);
  const opacityPhone = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    if (!autoPlay || prefersReduced) return;
    const id = setInterval(
      () => setScreenIndex((i) => (i + 1) % SCREENS.length),
      cycleInterval
    );
    return () => clearInterval(id);
  }, [autoPlay, cycleInterval, prefersReduced]);

  const ActiveScreen = SCREENS[screenIndex];

  return (
    <div
      ref={containerRef}
      className={cn("relative hidden lg:block", className)}
    >
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          y: prefersReduced ? 0 : yPhone,
          rotate: prefersReduced ? 0 : rotatePhone,
          opacity: prefersReduced ? 1 : opacityPhone,
        }}
        className="perspective-1000"
      >
        <motion.div
          style={{
            rotateX: prefersReduced ? 0 : rotateX,
            rotateY: prefersReduced ? 0 : rotateY,
          }}
        >
          <PhoneShell>
            <AnimatePresence mode="wait">
              <motion.div
                key={screenIndex}
                variants={screenVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                className="h-full"
              >
                <ActiveScreen />
              </motion.div>
            </AnimatePresence>
          </PhoneShell>
        </motion.div>
      </motion.div>

      <FloatingNotification />

      {/* Ambient glow */}
      <div className="absolute -bottom-10 -left-10 -z-10 h-64 w-64 rounded-full bg-green-500/10 blur-3xl" />
    </div>
  );
}
