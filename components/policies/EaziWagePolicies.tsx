import type { ReactNode } from "react";

export type PolicyContentBlock =
  | { type: "paragraphs"; paragraphs: string[] }
  | { type: "list"; items: string[] };

export type PolicySubsection = {
  heading: string;
  paragraphs?: string[];
  items?: string[];
  afterContent?: PolicyContentBlock[];
};

export type PolicySection = {
  id: string;
  title: string;
  paragraphs?: string[];
  items?: string[];
  afterContent?: PolicyContentBlock[];
  subsections?: PolicySubsection[];
};

type PolicyPageProps = {
  title: string;
  description: string;
  updated: string;
  sections: PolicySection[];
  notice?: ReactNode;
};

function Paragraphs({ paragraphs = [] }: { paragraphs?: string[] }) {
  return paragraphs.map((paragraph) => (
    <p
      key={paragraph}
      className="mt-3 text-[15px] leading-7 text-slate-600 dark:text-slate-300"
    >
      {paragraph}
    </p>
  ));
}

function ItemList({ items = [] }: { items?: string[] }) {
  if (!items.length) return null;

  return (
    <ul className="mt-3 list-disc space-y-2 pl-5 text-[15px] leading-7 text-slate-600 marker:text-emerald-600 dark:text-slate-300 dark:marker:text-emerald-400">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export default function PolicyPage({
  title,
  description,
  updated,
  sections,
  notice,
}: PolicyPageProps) {
  return (
    <main className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <header className="border-b border-slate-200 bg-linear-to-b from-emerald-50/70 to-white px-6 pt-32 pb-12 sm:pt-36 sm:pb-16 dark:border-slate-800 dark:from-emerald-950/30 dark:to-slate-950">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 text-xs font-semibold tracking-[0.18em] text-emerald-700 uppercase dark:text-emerald-400">
            EaziWage Policies & Rules
          </p>
          <h1 className="font-serif text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
            {title}
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg dark:text-slate-300">
            {description}
          </p>
          <p className="mt-5 text-sm text-slate-500 dark:text-slate-400">
            Last reviewed: {updated}
          </p>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-10 sm:py-14 lg:grid-cols-[230px_minmax(0,1fr)] lg:gap-16 lg:px-8">
        <details className="group rounded-xl border border-slate-200 bg-slate-50 p-4 lg:hidden dark:border-slate-800 dark:bg-slate-900">
          <summary className="cursor-pointer list-none text-sm font-semibold text-slate-800 marker:hidden dark:text-slate-100">
            On this page
            <span className="float-right text-emerald-700 group-open:rotate-180 dark:text-emerald-400">
              ↓
            </span>
          </summary>
          <nav aria-label="Page contents" className="mt-4 grid gap-2">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="text-sm leading-6 text-slate-600 hover:text-emerald-700 dark:text-slate-300 dark:hover:text-emerald-400"
              >
                {section.title}
              </a>
            ))}
          </nav>
        </details>

        <aside className="hidden lg:block">
          <nav
            aria-label="Page contents"
            className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto border-l border-slate-200 pl-4 dark:border-slate-800"
          >
            <p className="mb-3 text-xs font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">
              On this page
            </p>
            <div className="grid gap-2">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="text-sm leading-5 text-slate-600 transition-colors hover:text-emerald-700 dark:text-slate-300 dark:hover:text-emerald-400"
                >
                  {section.title}
                </a>
              ))}
            </div>
          </nav>
        </aside>

        <article className="min-w-0">
          {notice && (
            <div className="mb-9 rounded-xl border border-emerald-700/15 bg-emerald-50/70 p-5 text-sm leading-6 text-slate-700 dark:border-emerald-400/20 dark:bg-emerald-950/30 dark:text-slate-200">
              {notice}
            </div>
          )}

          <div className="space-y-10">
            {sections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-28 border-b border-slate-200 pb-9 last:border-b-0 dark:border-slate-800"
              >
                <h2 className="font-serif text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                  {section.title}
                </h2>
                <Paragraphs paragraphs={section.paragraphs} />
                <ItemList items={section.items} />
                {section.afterContent?.map((block, index) =>
                  block.type === "paragraphs" ? (
                    <Paragraphs
                      key={`paragraphs-${index}`}
                      paragraphs={block.paragraphs}
                    />
                  ) : (
                    <ItemList key={`list-${index}`} items={block.items} />
                  )
                )}
                {section.subsections?.map((subsection) => (
                  <div key={subsection.heading} className="mt-6">
                    <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">
                      {subsection.heading}
                    </h3>
                    <Paragraphs paragraphs={subsection.paragraphs} />
                    <ItemList items={subsection.items} />
                    {subsection.afterContent?.map((block, index) =>
                      block.type === "paragraphs" ? (
                        <Paragraphs
                          key={`paragraphs-${index}`}
                          paragraphs={block.paragraphs}
                        />
                      ) : (
                        <ItemList key={`list-${index}`} items={block.items} />
                      )
                    )}
                  </div>
                ))}
              </section>
            ))}
          </div>

          <p className="mt-4 text-sm leading-6 text-slate-500 dark:text-slate-400">
            Questions about these policies or how EaziWage handles information?
            Email{" "}
            <a
              href="mailto:support@eaziwage.com"
              className="font-medium text-emerald-700 underline-offset-4 hover:underline dark:text-emerald-400"
            >
              support@eaziwage.com
            </a>
            .
          </p>
        </article>
      </div>
    </main>
  );
}
