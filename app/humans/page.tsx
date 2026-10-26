import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
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
    <main className="overflow-hidden bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <section className="mx-auto max-w-7xl px-6 pt-28 pb-16 sm:px-8 sm:pb-20 lg:pt-32">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="font-serif text-6xl leading-[0.98] font-semibold tracking-tight sm:text-7xl lg:text-8xl">
            Humans
            <br />
            <span className="text-green-700 dark:text-green-400">
              behind EaziWage
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-600 sm:mt-8 sm:text-lg dark:text-slate-300">
            We build tools that help people access the wages they have already
            earned.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-semibold">
            <Link
              href="/culture"
              className="text-slate-700 underline decoration-slate-300 underline-offset-4 transition-colors hover:text-green-800 focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green-700 dark:text-slate-200 dark:decoration-slate-600 dark:hover:text-green-300 dark:focus-visible:outline-green-300"
            >
              Our culture
            </Link>
            <Link
              href="/careers"
              className="text-green-800 underline decoration-green-700/40 underline-offset-4 transition-colors hover:text-green-600 focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green-700 dark:text-green-300 dark:decoration-green-300/50 dark:hover:text-green-200 dark:focus-visible:outline-green-300"
            >
              Open roles
            </Link>
          </div>
        </div>
      </section>

      <section
        aria-label="EaziWage co-founders"
        className="mx-auto max-w-7xl px-6 pb-24 sm:px-8 sm:pb-32"
      >
        <ul className="grid grid-cols-2 items-start gap-x-4 gap-y-10 sm:gap-x-8 sm:[&>li:nth-child(even)]:translate-y-10 lg:grid-cols-4 lg:gap-x-6">
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
                    className="object-contain object-bottom transition-transform duration-500 motion-reduce:transition-none sm:group-hover:scale-[1.03]"
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
    </main>
  );
}
