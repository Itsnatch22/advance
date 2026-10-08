import Link from "next/link";
import { notFound } from "next/navigation";
import { getAudienceArticles } from "@/lib/help/content";
import type { HelpAudience } from "@/lib/help/schema";

export const dynamicParams = false;

export function generateStaticParams() {
  return [{ audience: "employees" }, { audience: "employers" }];
}

export async function generateMetadata({ params }: { params: Promise<{ audience: string }> }) {
  const { audience } = await params;
  const label = audience === "employees" ? "Employees" : "Employers";

  return {
    title: `${label} help`,
    description: `Browse ${label.toLowerCase()} help articles for EaziWage support topics.`,
  };
}

export default async function HelpAudiencePage({ params }: { params: Promise<{ audience: string }> }) {
  const { audience } = await params;

  if (audience !== "employees" && audience !== "employers") {
    notFound();
  }

  const articles = getAudienceArticles(audience as HelpAudience);

  return (
    <main className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-24 lg:py-28">
      <div className="mb-8 flex items-center justify-between gap-6">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-emerald-700 uppercase">
            {audience === "employees" ? "Employee help" : "Employer help"}
          </p>
          <h1 className="mt-2 font-serif text-4xl font-bold text-slate-900">
            {audience === "employees" ? "Employee support" : "Employer support"}
          </h1>
        </div>
        <Link href="/help" className="text-sm font-semibold text-emerald-700">Back to help hub</Link>
      </div>

      <div className="grid gap-5">
        {articles.map((article) => (
          <Link
            key={article.slug}
            href={`/help/${article.audience}/${article.slug}`}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50/30"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold tracking-[0.2em] text-slate-500 uppercase">{article.category}</p>
                <h2 className="mt-3 text-2xl font-semibold text-slate-900">{article.title}</h2>
                <p className="mt-3 max-w-3xl text-slate-600">{article.description}</p>
              </div>
              {article.urgent ? (
                <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold tracking-[0.15em] text-red-700 uppercase">
                  urgent
                </span>
              ) : null}
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
