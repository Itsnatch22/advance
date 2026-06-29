import Hero from "@/components/Hero";
import HorizontalJourney from "@/components/HorizontalJourney";
import CTA from "@/components/CTA";
import ProblemStatement from "@/components/ProblemStatement";
import FAQ from "@/components/FAQ";
import Coverage from "@/components/Coverage";
import Marquee from "@/components/Marquee";
import ErrorBoundary from "@/components/ErrorBoundary";
import WordReveal from "@/components/WordReveal";

export default function HomePage() {
  return (
    <ErrorBoundary>
      <div className="overflow-hidden">
        <Hero />
        <Marquee />
        <WordReveal />
        <ProblemStatement />
        <HorizontalJourney />
        <Coverage />
        <FAQ />
        <CTA />
      </div>
    </ErrorBoundary>
  );
}
