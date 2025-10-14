"use client"
import Hero from "@/components/Homepage";
import Models from "@/components/Models";
import Works from "@/components/Works";
import Needs from "@/components/Needs";
import CTA from "@/components/CTA";
import gsap from "gsap";
import ProblemStatement from "@/components/ProblemStatement";
import StatsCounter from "@/components/StatsCounter";

gsap.registerPlugin(ScrollTrigger);

export default function App() {

  return(
  <div className="overflow-y-hidden">
      <Hero/>
      <ProblemStatement/>
      <Works/>
      <StatsCounter/>
      <Needs/>
      <Models/>
      <CTA/>
  </div>
  )
}