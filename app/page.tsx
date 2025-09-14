import Hero from "@/components/Homepage";
import Models from "@/components/Models";
import Works from "@/components/Works";
import Needs from "@/components/Needs";
import CTA from "@/components/CTA";

export default function App() {
  return(
  <div
  className="overflow-y-hidden"
  >
    <Hero/>
    <Works/>
    <Needs/>
    <CTA/>
    <Models/>
  </div>
  )
}