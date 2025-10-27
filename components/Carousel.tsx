"use client";

import { Carousel, Card } from "@/components/ui/apple-cards-carousel";

export function AppleCardsCarouselDemo() {
  const cards = data.map((card, index) => (
    <Card key={card.src} card={card} index={index} />
  ));

  return (
    <div className="w-full h-full py-20">
      <Carousel items={cards} />
    </div>
  );
}

const data = [
  {
    category: "School",
    title: "In schooling, every day is a new adventure.",
    src: "/eaziwage/school.png",
  },
  {
    category: "Retailing",
    title: "In retail, every customer counts.",
    src: "/eaziwage/retail.png",
  },
  {
    category: "Banking",
    title: "In banking, trust is everything.",
    src: "/eaziwage/banking.png",
  },

  {
    category: "Manufacturing",
    title: "Manufacturing the future, one product at a time.",
    src: "/eaziwage/factory.png",
  },
  {
    category: "Hospitality",
    title: "Hospitality is the art of making strangers feel like friends.",
    src: "/eaziwage/hotel.png",
  },
  {
    category: "Logistics",
    title: "Logistics: moving the world, one mile at a time.",
    src: "/eaziwage/warehouse.png",
  },
];
