import Hero from "@/components/Homepage";
import Works from "@/components/Works";
import Needs from "@/components/Needs";
import CTA from "@/components/CTA";
import ProblemStatement from "@/components/ProblemStatement";
import StatsCounter from "@/components/StatsCounter";
import {Team} from "@/components/Team";

export default function App() {

  return(
  <div className="overflow-hidden">
      <Hero/>
      <ProblemStatement/>
      <Works/>
      <StatsCounter/>
      <Needs/>
      <Team/>
      <CTA/>
  </div>
  )
}