"use client";

import { useEffect, useRef } from "react";
import Typed from "typed.js";

export default function AutoType({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const el = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const typed = new Typed(el.current, {
      strings: [text],
      typeSpeed: 30,
      backSpeed: 0,
      showCursor: false,
      startDelay: 200,
    });

    return () => typed.destroy();
  }, [text]);

  return <span ref={el} className={className}></span>;
}
