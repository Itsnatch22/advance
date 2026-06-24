import Hero from "@/components/Hero";
import Works from "@/components/Works";
import Needs from "@/components/Needs";
import CTA from "@/components/CTA";
import ProblemStatement from "@/components/ProblemStatement";
import StatsCounter from "@/components/StatsCounter";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import Coverage from "@/components/Coverage";
import Marquee from "@/components/Marquee";
import ErrorBoundary from "@/components/ErrorBoundary";

export default function HomePage() {
  return (
    <ErrorBoundary>
      <div>
        <Hero />
        <Marquee />
        <ProblemStatement />
        <Works />
        <StatsCounter />
        <Needs />
        <Pricing />
        <Coverage />
        <FAQ />
        <CTA />
      </div>
    </ErrorBoundary>
  );
}
