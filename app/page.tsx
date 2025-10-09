"use client"
import Hero from "@/components/Homepage";
import Models from "@/components/Models";
import Works from "@/components/Works";
import Needs from "@/components/Needs";
import CTA from "@/components/CTA";
import gsap from "gsap";
import ProblemStatement from "@/components/ProblemStatement";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect } from "react";

gsap.registerPlugin(ScrollTrigger);

export default function App() {

  useLayoutEffect(() => {
    if(window.innerWidth < 768) return; // Disable on small screens
    const sections = gsap.utils.toArray<HTMLElement>(".panel");

    sections.forEach((panel) => {
      ScrollTrigger.create({
        trigger: panel,
        start: "top top",
        pin: true,
        pinSpacing: false,
        scrub: true,
      });
    });
  }, []);

  return(
  <div
  className="overflow-y-hidden"
  >
    <Hero/>
    <section className="panel">
      <ProblemStatement/>
    </section>
    <section className="panel">
      <Works/>
    </section>
    <section className="panel">
      <Needs/>
    </section>
    <section className="panel">
      <Models/>
    </section>
    <section className="panel">
      <CTA/>
    </section>  
  </div>
  )
}