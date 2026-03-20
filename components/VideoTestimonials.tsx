"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const TestimonialSection = () => {
  const vdRef = useRef<HTMLVideoElement[]>([]);

  useGSAP(() => {
    gsap.set(".testimonials-section", {
      marginTop: "-140vh",
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".testimonials-section",
        start: "top bottom",
        end: "200% top",
        scrub: true,
      },
    });

    tl.to(".testimonials-section .first-title", {
      xPercent: 70,
    })
      .to(
        ".testimonials-section .sec-title",
        {
          xPercent: 25,
        },
        "<"
      )
      .to(
        ".testimonials-section .third-title",
        {
          xPercent: -50,
        },
        "<"
      );

    const pinTl = gsap.timeline({
      scrollTrigger: {
        trigger: ".testimonials-section",
        start: "10% top",
        end: "200% top",
        scrub: 1.5,
        pin: true,
      },
    });

    pinTl.from(".vd-card", {
      yPercent: 150,
      stagger: 0.2,
      ease: "power1.inOut",
    });
  });

  const handlePlay = (index: number) => {
    const video = vdRef.current[index];
    if (video) {
      video.play();
    }
  };

  const handlePause = (index: number) => {
    const video = vdRef.current[index];
    if (video) {
      video.pause();
    }
  };

  return (
    <section className="testimonials-section">
      <div className="absolute flex size-full flex-col items-center pt-[5vw]">
        <h1 className="first-title text-black">What's</h1>
        <h1 className="text-light-brown sec-title">Everyone</h1>
        <h1 className="third-title text-black">Saying?</h1>
      </div>
      {/*
      <div className="pin-box">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`vd-card ${card.translation} ${card.rotation}`}
            onMouseEnter={() => handlePlay(index)}
            onMouseLeave={() => handlePause(index)}
          >
            <video
              ref={(el) => (vdRef.current[index] = el)}
              src={card.src}
              playsInline
              loop
              className="size-full object-cover"
            />
          </div>
        ))}
      </div>
      */}
    </section>
  );
};

export default TestimonialSection;
