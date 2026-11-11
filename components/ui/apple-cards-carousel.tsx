"use client";

import React, { createContext, useCallback, useEffect, useState } from "react";
import { IconArrowNarrowLeft, IconArrowNarrowRight } from "@tabler/icons-react";
import { cn } from "@/lib/utils/utils";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";

interface CarouselProps {
  items: React.ReactElement[];
  initialScroll?: number;
}

export type CarouselCard = {
  src: string;
  title: string;
  category: string;
  story?: string[];
  stats?: { value: string; label: string }[];
};

export const CarouselContext = createContext<{
  onCardClose: (index: number) => void;
  currentIndex: number;
}>({
  onCardClose: () => {},
  currentIndex: 0,
});

export const Carousel = ({ items, initialScroll = 0 }: CarouselProps) => {
  const carouselRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion() !== false;

  const checkScrollability = useCallback(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const maxScrollLeft = carousel.scrollWidth - carousel.clientWidth;
    setCanScrollLeft(carousel.scrollLeft > 1);
    setCanScrollRight(maxScrollLeft - carousel.scrollLeft > 1);
  }, []);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    carousel.scrollLeft = initialScroll;
    checkScrollability();

    const resizeObserver = new ResizeObserver(checkScrollability);
    resizeObserver.observe(carousel);
    if (carousel.firstElementChild) {
      resizeObserver.observe(carousel.firstElementChild);
    }

    return () => resizeObserver.disconnect();
  }, [checkScrollability, initialScroll]);

  const scrollByCards = (direction: -1 | 1) => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    carousel.scrollBy({
      left: direction * carousel.clientWidth * 0.8,
      behavior: shouldReduceMotion ? "instant" : "smooth",
    });
  };

  const handleCardClose = (index: number) => {
    const carousel = carouselRef.current;
    const card = carousel?.querySelector<HTMLElement>(
      `[data-card-index="${index}"]`
    );
    if (!carousel || !card) return;

    const cardOffset =
      carousel.scrollLeft +
      card.getBoundingClientRect().left -
      carousel.getBoundingClientRect().left;

    carousel.scrollTo({
      left: Math.max(0, cardOffset - 12),
      behavior: shouldReduceMotion ? "instant" : "smooth",
    });
    setCurrentIndex(index);
  };

  return (
    <CarouselContext.Provider
      value={{ onCardClose: handleCardClose, currentIndex }}
    >
      <div className="relative w-full">
        <div
          ref={carouselRef}
          role="region"
          aria-label="Stories by industry"
          tabIndex={0}
          className={cn(
            "flex w-full snap-x snap-mandatory scrollbar-none overflow-x-auto overscroll-x-contain py-3 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700 md:py-5",
            shouldReduceMotion ? "scroll-auto" : "scroll-smooth"
          )}
          onScroll={checkScrollability}
          onKeyDown={(event) => {
            if (event.target !== event.currentTarget) return;
            if (event.key === "ArrowLeft") scrollByCards(-1);
            if (event.key === "ArrowRight") scrollByCards(1);
          }}
        >
          <div className="mx-auto flex max-w-7xl min-w-max snap-x snap-mandatory flex-row gap-4 px-1 md:gap-5">
            {items.map((item, index) => (
              <motion.div
                key={"card" + index}
                data-card-index={index}
                className="snap-start"
                initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: shouldReduceMotion ? 0 : 0.35,
                  delay: shouldReduceMotion ? 0 : Math.min(index * 0.06, 0.3),
                  ease: "easeOut",
                }}
              >
                {item}
              </motion.div>
            ))}
            <div aria-hidden="true" className="w-5 shrink-0 md:w-10" />
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2 px-1">
          <button
            type="button"
            aria-label="Scroll to previous stories"
            className="flex size-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition-colors hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-40 motion-reduce:transition-none motion-reduce:active:scale-100"
            onClick={() => scrollByCards(-1)}
            disabled={!canScrollLeft}
          >
            <IconArrowNarrowLeft aria-hidden="true" className="size-5" />
          </button>
          <button
            type="button"
            aria-label="Scroll to next stories"
            className="flex size-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition-colors hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-40 motion-reduce:transition-none motion-reduce:active:scale-100"
            onClick={() => scrollByCards(1)}
            disabled={!canScrollRight}
          >
            <IconArrowNarrowRight aria-hidden="true" className="size-5" />
          </button>
        </div>
      </div>
    </CarouselContext.Provider>
  );
};

export const Card = ({
  card,
  layout = false,
  onClick,
}: {
  card: CarouselCard;
  layout?: boolean;
  onClick?: () => void;
}) => {
  const shouldReduceMotion = useReducedMotion() !== false;

  return (
    <motion.button
      type="button"
      layoutId={layout ? `card-${card.title}` : undefined}
      className="group relative flex w-[min(78vw,18.5rem)] flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white text-left shadow-[0_8px_24px_rgba(15,23,42,0.06)] transition-[border-color,box-shadow] duration-300 hover:border-emerald-200 hover:shadow-[0_18px_38px_rgba(15,23,42,0.12)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700 motion-reduce:transition-none md:w-84"
      onClick={onClick}
      whileHover={shouldReduceMotion ? undefined : { y: -4 }}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.99 }}
      aria-label={`Read the ${card.category} story: ${card.title}`}
    >
      <span className="relative block aspect-4/3 w-full overflow-hidden bg-emerald-50">
        <BlurImage
          src={card.src}
          alt=""
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-t from-slate-950/15 via-transparent to-transparent"
        />
      </span>
      <span className="flex min-h-32 flex-1 flex-col items-start p-5 md:min-h-36 md:p-6">
        <span className="text-[11px] font-bold tracking-[0.16em] text-emerald-700 uppercase">
          {card.category}
        </span>
        <span className="mt-2 text-lg leading-snug font-semibold tracking-tight text-slate-900 md:text-xl">
          {card.title}
        </span>
        <span className="mt-auto flex items-center gap-2 pt-4 text-sm font-semibold text-slate-500 transition-colors group-hover:text-emerald-700 motion-reduce:transition-none">
          Read the story
          <IconArrowNarrowRight
            aria-hidden="true"
            className="size-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
          />
        </span>
      </span>
    </motion.button>
  );
};

export const BlurImage = ({
  src,
  className,
  alt,
}: {
  src: string;
  className?: string;
  alt?: string;
} & React.ImgHTMLAttributes<HTMLImageElement>) => {
  return (
    <Image
      className={cn("h-full w-full", className)}
      src={src}
      loading="lazy"
      decoding="async"
      alt={alt ?? ""}
      fill
      sizes="(max-width: 768px) 78vw, 336px"
    />
  );
};
