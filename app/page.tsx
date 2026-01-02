import Hero from "@/components/Homepage";
import Works from "@/components/Works";
import Needs from "@/components/Needs";
import CTA from "@/components/CTA";
import ProblemStatement from "@/components/ProblemStatement";
import StatsCounter from "@/components/StatsCounter";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      <Hero />
      <ProblemStatement />
      <Works />
      <StatsCounter />
      <Needs />
      <Pricing />
      <FAQ />
      <CTA />
    </div>
  );
}