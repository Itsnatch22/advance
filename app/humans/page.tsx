import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Users } from "lucide-react";
import { GridSystem } from "@/components/grid";
import { FloatingOrb } from "@/components/shared/FloatingOrb";
import { people } from "./people";

export const metadata: Metadata = {
  title: "Humans",
  description:
    "Meet the people building EaziWage and making earned wages more accessible.",
  openGraph: {
    title: "Humans behind EaziWage",
    description:
      "Meet the people building EaziWage and making earned wages more accessible.",
    url: "https://eaziwage.com/humans",
  },
};

export default function HumansPage() {
  return (
    <GridSystem
      variant="dots"
      opacity={0.03}
      className="relative min-h-[100dvh] overflow-hidden bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100"
    >
      <div className="pointer-events-none absolute inset-0">
        <FloatingOrb
          color="bg-green-100"
          delay={0}
          className="top-[-8%] right-[8%]"
        />
        <FloatingOrb
          color="bg-emerald-100"
          delay={2}
          className="bottom-[8%] left-[5%]"
        />
      </div>

      <section className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 px-6 pt-28 pb-16 sm:px-8 sm:pt-32 sm:pb-20 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:pt-36">
        <div className="max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-500/10 bg-green-500/5 px-4 py-1.5 text-xs font-black tracking-[0.2em] text-green-700 uppercase dark:text-green-300">
            <Users
              className="h-3.5 w-3.5"
              strokeWidth={1.8}
              aria-hidden="true"
            />
            Our people
          </div>

          <h1 className="font-serif text-5xl leading-tight font-bold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl dark:text-slate-100">
            <span className="text-green-600">Humans</span> behind EaziWage
          </h1>
          <p className="mt-6 max-w-xl text-xl leading-relaxed text-slate-600 sm:text-2xl dark:text-slate-300">
            We build tools that help people access the wages they have already
            earned.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-semibold">
            <Link
              href="/culture"
              className="inline-flex min-h-11 items-center text-slate-700 underline decoration-slate-300 underline-offset-4 transition-colors hover:text-green-800 focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green-700 dark:text-slate-200 dark:decoration-slate-600 dark:hover:text-green-300 dark:focus-visible:outline-green-300"
            >
              Our culture
            </Link>
            <Link
              href="/careers"
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-slate-900 px-6 font-bold text-white transition-colors hover:bg-green-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green-700 active:scale-[0.98] dark:bg-green-700 dark:hover:bg-green-600 dark:focus-visible:outline-green-300"
            >
              Open roles
            </Link>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="team-heading"
        className="relative z-10 mx-auto max-w-7xl px-6 pt-8 pb-24 sm:px-8 sm:pt-10 sm:pb-32"
      >
        <div className="mb-8 max-w-2xl sm:mb-10">
          <h2
            id="team-heading"
            className="font-serif text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-slate-100"
          >
            Meet the co-founders
          </h2>
          <p className="mt-3 leading-relaxed text-slate-600 dark:text-slate-300">
            Get to know the people and the work behind EaziWage.
          </p>
        </div>

        <ul className="grid grid-cols-2 items-start gap-x-4 gap-y-10 sm:gap-x-8 lg:grid-cols-4 lg:gap-x-6">
          {people.map((person) => (
            <li key={person.slug} className="min-w-0">
              <Link
                href={`/humans/${person.slug}`}
                className="group block rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green-700 dark:focus-visible:outline-green-300"
                aria-label={`View ${person.name}'s profile`}
              >
                <div className="relative aspect-square overflow-hidden rounded-full bg-[#edf4ef] dark:bg-slate-800">
                  <Image
                    src={person.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 50vw"
                    className="object-contain object-bottom transition-transform duration-300 motion-reduce:transition-none sm:group-hover:scale-[1.03]"
                  />
                </div>
                <div className="pt-4 sm:pt-5">
                  <h2 className="text-base font-bold tracking-tight text-slate-900 transition-colors group-hover:text-green-800 sm:text-lg dark:text-slate-100 dark:group-hover:text-green-300">
                    {person.name}
                  </h2>
                  <p className="mt-1 text-xs leading-relaxed text-slate-600 sm:text-sm dark:text-slate-300">
                    {person.role}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </GridSystem>
  );
}
