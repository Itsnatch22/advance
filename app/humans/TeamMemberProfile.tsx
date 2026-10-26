import Image from "next/image";
import Link from "next/link";
import type { TeamMember } from "./people";

export function TeamMemberProfile({ person }: { person: TeamMember }) {
  return (
    <main className="min-h-[70vh] bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-7xl px-6 pt-28 pb-24 sm:px-8 lg:pt-32 lg:pb-32">
        <div className="grid gap-12 md:grid-cols-[15rem_minmax(0,1fr)] md:gap-20 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-28">
          <aside className="h-fit md:sticky md:top-28">
            <Link
              href="/humans"
              className="inline-flex min-h-11 items-center text-sm font-medium text-slate-600 transition-colors hover:text-green-800 focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green-700 dark:text-slate-300 dark:hover:text-green-300 dark:focus-visible:outline-green-300"
            >
              <span aria-hidden="true" className="mr-2 text-lg">
                &larr;
              </span>
              All humans
            </Link>

            <div className="mt-8 flex items-start gap-5 md:mt-10 md:block">
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border border-slate-200 bg-[#edf4ef] dark:border-slate-700 dark:bg-slate-800">
                <Image
                  src={person.image}
                  alt={person.name}
                  fill
                  priority
                  sizes="96px"
                  className="object-cover object-top"
                />
              </div>
              <div className="min-w-0 md:mt-5">
                <h1 className="font-serif text-3xl leading-tight font-semibold tracking-tight sm:text-4xl">
                  {person.name}
                </h1>
                <p className="mt-2 text-sm font-medium leading-relaxed text-slate-600 dark:text-slate-300">
                  {person.role}
                </p>
              </div>
            </div>

            {person.links && person.links.length > 0 && (
              <nav
                aria-label={`${person.name}'s public links`}
                className="mt-7 border-t border-slate-200 pt-4 dark:border-slate-800"
              >
                <h2 className="mb-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Personal links
                </h2>
                <ul className="flex flex-wrap gap-x-5 gap-y-1 md:flex-col md:gap-1">
                  {person.links.map((link) => {
                    const Icon = link.icon;

                    return (
                      <li key={link.href}>
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex min-h-10 items-center gap-2 text-sm font-medium text-slate-600 underline decoration-slate-300 underline-offset-4 transition-colors hover:text-green-800 focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700 dark:text-slate-300 dark:decoration-slate-600 dark:hover:text-green-300 dark:focus-visible:outline-green-300"
                        >
                          <Icon aria-hidden="true" className="h-4 w-4 shrink-0" />
                          {link.label}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            )}
          </aside>

          <div className="max-w-3xl border-t border-slate-200 pt-8 dark:border-slate-800 md:pt-10">
            {person.contribution ? (
              <section>
                <h2 className="font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
                  At EaziWage
                </h2>
                <p className="mt-5 text-base leading-8 text-slate-600 sm:text-lg dark:text-slate-300">
                  {person.contribution}
                </p>
              </section>
            ) : (
              <section>
                <h2 className="font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
                  At EaziWage
                </h2>
                <p className="mt-5 text-base leading-8 text-slate-600 sm:text-lg dark:text-slate-300">
                  More about {person.name}&apos;s work will be added when their
                  profile details are confirmed.
                </p>
              </section>
            )}

            {person.personalDetail && (
              <section className="mt-12 border-t border-slate-200 pt-8 dark:border-slate-800 sm:mt-16 sm:pt-10">
                <h2 className="font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
                  Outside the role
                </h2>
                <p className="mt-5 text-base leading-8 text-slate-600 sm:text-lg dark:text-slate-300">
                  {person.personalDetail}
                </p>
              </section>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
