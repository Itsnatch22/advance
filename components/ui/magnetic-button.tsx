"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { cn } from "@/lib/utils/utils";

type MagneticButtonProps = React.PropsWithChildren<{
  href?: string;
  target?: string;
  rel?: string;
  className?: string;
  as?: "a" | "button";
  onClick?: React.MouseEventHandler;
}>;

export function MagneticButton({
  href,
  target,
  rel,
  className,
  children,
  as = href ? "a" : "button",
  onClick,
}: MagneticButtonProps) {
  const ref = React.useRef<HTMLAnchorElement & HTMLButtonElement | null>(null);

  // Motion values for pointer offset
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);

  // spring for smoother motion
  const x = useSpring(useTransform(pointerX, (v) => v), { stiffness: 200, damping: 30 });
  const y = useSpring(useTransform(pointerY, (v) => v), { stiffness: 200, damping: 30 });

  React.useEffect(() => {
    return () => {
      // cleanup motion values
      pointerX.set(0);
      pointerY.set(0);
    };
  }, [pointerX, pointerY]);

  const onMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2); // -1..1
    const dy = (e.clientY - cy) / (rect.height / 2);

    // small translate towards cursor
    pointerX.set(dx * 6); // px
    pointerY.set(dy * 6);
  };

  const onLeave = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  const inner = (
    <motion.span
      ref={ref as any}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ x, y, display: "inline-block" }}
      className={cn("inline-flex items-center justify-center gap-3", className)}
    >
      {children}
    </motion.span>
  );

  if (href) {
    // Use next/link for client-side nav
    return (
      <Link href={href} target={target} rel={rel} onClick={onClick} className="inline-block">
        {inner}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className="inline-block">
      {inner}
    </button>
  );
}

export default MagneticButton;
