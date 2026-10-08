import Link from "next/link";
import { notFound } from "next/navigation";
import { getHelpArticleBySlug, getRelatedArticles, helpArticles } from "@/lib/help/content";

export const dynamicParams = false;

export function generateStaticParams() {
  return helpArticles.map((article) => ({
    audience: article.audience,
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ audience: string; slug: string }> }) {
  const { audience, slug } = await params;
  const article = getHelpArticleBySlug(slug);

  if (!article || article.audience !== audience) {
    return { title: "Help article" };
  }

  return {
    title: article.title,
    description: article.description,
  };
}

export default async function HelpArticlePage({ params }: { params: Promise<{ audience: string; slug: string }> }) {
  const { audience, slug } = await params;
  const article = getHelpArticleBySlug(slug);

  if (!article || article.audience !== audience) {
    notFound();
  }

  const related = getRelatedArticles(slug);

  return (
    <main className="mx-auto max-w-5xl px-4 py-20 sm:px-6 md:py-24 lg:py-28">
      <nav className="mb-8 text-sm text-slate-500">
        <div className="flex items-center gap-3">
          <Link href="/help" className="hover:text-slate-900">Help</Link>
          <span>›</span>
          <Link href={`/help/${article.audience}`} className="hover:text-slate-900">
            {article.audience === "employees" ? "Employees" : "Employers"}
          </Link>
          <span>›</span>
          <span className="text-slate-700">{article.title}</span>
        </div>
      </nav>

      <article className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm md:p-10">
        <div className="mb-8 flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-bold tracking-[0.2em] text-emerald-700 uppercase">
            {article.category}
          </span>
          {article.urgent ? (
            <span className="rounded-full bg-red-50 px-3 py-1 text-[10px] font-bold tracking-[0.2em] text-red-700 uppercase">
              urgent
            </span>
          ) : null}
        </div>

        <h1 className="font-serif text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
          {article.title}
        </h1>
        <p className="mt-4 text-lg text-slate-600">{article.description}</p>
        <p className="mt-5 text-sm text-slate-500">
          Last verified: {article.lastVerified.toISOString().slice(0, 10)}
        </p>

        <div className="mt-8 space-y-8">
          {article.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="mb-3 text-2xl font-semibold text-slate-900">{section.heading}</h2>
              <p className="text-base leading-8 text-slate-700">{section.body}</p>
            </section>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
          <p className="text-sm font-semibold text-slate-800">Still stuck?</p>
          <p className="mt-2 text-sm text-slate-600">We can review the issue with your article and reported error code before you send a message.</p>
          <Link
            href={`/help/contact?article=${slug}&code=${article.errorCodes[0] ?? ""}&country=KE`}
            className="mt-4 inline-flex items-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Contact support
          </Link>
        </div>
      </article>

      {related.length > 0 ? (
        <aside className="mt-10">
          <h2 className="mb-4 text-2xl font-semibold text-slate-900">Related articles</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {related.map((item) => (
              <Link
                key={item.slug}
                href={`/help/${item.audience}/${item.slug}`}
                className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-emerald-300 hover:bg-emerald-50/30"
              >
                <p className="text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase">{item.category}</p>
                <h3 className="mt-2 text-lg font-semibold text-slate-900">{item.title}</h3>
              </Link>
            ))}
          </div>
        </aside>
      ) : null}
    </main>
  );
}
