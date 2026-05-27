"use client";

import { MouseEvent } from "react";
import { useMotionValue, useSpring, useTransform } from "framer-motion";

export function useParallax() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), {
    stiffness: 150,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), {
    stiffness: 150,
    damping: 20,
  });

  const spotlightBackground = useTransform(
    [mouseX, mouseY],
    ([mx, my]) =>
      `radial-gradient(400px circle at ${mx}px ${my}px, rgba(34, 197, 94, 0.06), transparent 80%)`
  );

  function handleMouseMove(event: MouseEvent<HTMLElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - rect.left) / rect.width - 0.5);
    y.set((event.clientY - rect.top) / rect.height - 0.5);
    mouseX.set(event.clientX - rect.left);
    mouseY.set(event.clientY - rect.top);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return {
    rotateX,
    rotateY,
    spotlightBackground,
    handleMouseMove,
    handleMouseLeave,
    x,
    y,
    mouseX,
    mouseY,
  };
}

export default useParallax;
