import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  BriefcaseBusiness,
  Clock3,
  MapPin,
} from "lucide-react";
import { GridSystem } from "@/components/grid";
import { supabaseUser } from "@/lib/supabase/server";
import {
  type Career,
  formatDepartment,
  formatEmploymentType,
  getApplyHref,
  formatLocation,
  isCareerOpen,
} from "../types";
import { buildJobPostingJsonLd } from "../job-posting";
import MagneticButton from "@/components/ui/magnetic-button";

export const dynamic = "force-dynamic";

type CareerDetailPageProps = {
  params: Promise<{ slug: string }>;
};

async function getCareer(slug: string) {
  const { data, error } = await supabaseUser
    .from("careers")
    .select(
      "id,slug,title,department,employment_type,status,city,country_code,work_mode,salary_min,salary_max,currency_code,is_stipend,description,responsibilities,requirements,skills,apply_link,apply_email,is_open,is_featured,posted_date,closing_date"
    )
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data as Career | null;
}

export async function generateMetadata({
  params,
}: CareerDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const career = await getCareer(slug);

  if (!career) {
    return {
      title: "Role Not Found",
    };
  }

  return {
    title: `${career.title} | Careers`,
    description: career.description,
    openGraph: {
      title: `${career.title} at EaziWage`,
      description: career.description,
      url: `https://eaziwage.com/careers/${career.slug}`,
    },
  };
}

export default async function CareerDetailPage({
  params,
}: CareerDetailPageProps) {
  const { slug } = await params;
  const career = await getCareer(slug);

  if (!career) {
    notFound();
  }

  const applyHref = getApplyHref(career);
  const isExternalApply = Boolean(career.apply_link);
  const isOpen = isCareerOpen(career);
  const jobPostingJsonLd = buildJobPostingJsonLd(career);

  return (
    <GridSystem
      variant="dots"
      opacity={0.03}
      className="min-h-[100dvh] bg-white pt-16"
    >
      {jobPostingJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingJsonLd) }}
        />
      ) : null}

      <main className="relative z-10 mx-auto max-w-6xl px-6 py-16 lg:px-8 lg:py-20">
        <Link
          href="/careers"
          className="mb-10 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition-colors hover:text-green-700"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.8} />
          Back to careers
        </Link>

        <section className="border-b border-slate-200 pb-10 sm:pb-12">
          <div className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-green-700">
            <BriefcaseBusiness className="h-4 w-4" strokeWidth={1.8} />
            {formatDepartment(career.department)}
          </div>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div>
              <h1 className="max-w-4xl font-serif text-4xl leading-tight font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                {career.title}
              </h1>
              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm font-semibold text-slate-600">
                <span>{formatEmploymentType(career.employment_type)}</span>
                <span className="inline-flex items-center gap-2">
                  <MapPin
                    className="h-4 w-4 text-green-700"
                    strokeWidth={1.8}
                  />
                  {formatLocation(career)}
                </span>
                {career.closing_date ? (
                  <span className="inline-flex items-center gap-2">
                    <Clock3
                      className="h-4 w-4 text-green-700"
                      strokeWidth={1.8}
                    />
                    Applications close {formatDate(career.closing_date)}
                  </span>
                ) : null}
              </div>
            </div>

            {isOpen ? (
              <MagneticButton
                href={applyHref}
                target={isExternalApply ? "_blank" : undefined}
                rel={isExternalApply ? "noopener noreferrer" : undefined}
                className="group inline-flex w-fit items-center justify-center gap-3 rounded-full bg-slate-900 py-2.5 pr-2.5 pl-6 font-bold text-white shadow-lg shadow-slate-900/10 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-green-700 active:scale-[0.98]"
              >
                Apply for this role
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/12 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1">
                  <ArrowUpRight className="h-4 w-4" strokeWidth={1.8} />
                </span>
              </MagneticButton>
            ) : (
              <p className="w-fit rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600">
                This role is no longer accepting applications
              </p>
            )}
          </div>
        </section>

        <div className="grid gap-12 py-10 sm:py-12 lg:grid-cols-[minmax(0,1fr)_19rem] lg:gap-16">
          <div className="min-w-0">
            <section aria-labelledby="opportunity-heading" className="pb-10">
              <h2
                id="opportunity-heading"
                className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl"
              >
                The Opportunity
              </h2>
              <p className="mt-5 max-w-3xl text-base leading-8 whitespace-pre-line text-slate-600 sm:text-lg">
                {career.description}
              </p>
            </section>

            {career.responsibilities.length > 0 ? (
              <DetailSection
                title="What You'll Do"
                items={career.responsibilities}
              />
            ) : null}

            {career.requirements.length > 0 || career.skills.length > 0 ? (
              <section
                aria-labelledby="looking-for-heading"
                className="border-t border-slate-200 py-10"
              >
                <h2
                  id="looking-for-heading"
                  className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl"
                >
                  What We&apos;re Looking For
                </h2>
                {career.requirements.length > 0 ? (
                  <DetailList
                    title="Requirements"
                    items={career.requirements}
                  />
                ) : null}
                {career.skills.length > 0 ? (
                  <DetailList title="Relevant skills" items={career.skills} />
                ) : null}
              </section>
            ) : null}
          </div>

          <aside className="h-fit border-t border-slate-200 pt-8 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8">
            <section aria-labelledby="application-process-heading">
              <h2
                id="application-process-heading"
                className="text-xl font-bold tracking-tight text-slate-900"
              >
                Application Process
              </h2>
              {isExternalApply ? (
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  Use the application link above to continue with this
                  role&apos;s application process.
                </p>
              ) : (
                <ol className="mt-5 space-y-5 text-sm leading-7 text-slate-600">
                  <li>
                    <span className="block font-semibold text-slate-900">
                      Submit your application
                    </span>
                    Apply using the form and include the requested information
                    and your resume.
                  </li>
                  <li>
                    <span className="block font-semibold text-slate-900">
                      Check your email
                    </span>
                    We&apos;ll email you to confirm that your application was
                    received.
                  </li>
                  <li>
                    <span className="block font-semibold text-slate-900">
                      Hear about next steps
                    </span>
                    The hiring team will review your application and follow up
                    by email.
                  </li>
                </ol>
              )}
            </section>

            <div className="mt-9 border-t border-slate-200 pt-7">
              <Link
                href="/about"
                className="text-sm font-semibold text-green-700 underline decoration-green-700/30 underline-offset-4 transition-colors hover:text-green-800"
              >
                About EaziWage
              </Link>
            </div>
          </aside>
        </div>
      </main>
    </GridSystem>
  );
}

function DetailSection({ title, items }: { title: string; items: string[] }) {
  return (
    <section
      aria-labelledby="responsibilities-heading"
      className="border-t border-slate-200 py-10"
    >
      <h2
        id="responsibilities-heading"
        className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl"
      >
        {title}
      </h2>
      <DetailList items={items} />
    </section>
  );
}

function DetailList({ title, items }: { title?: string; items: string[] }) {
  return (
    <div className={title ? "mt-7" : "mt-6"}>
      {title ? (
        <h3 className="mb-4 text-base font-semibold text-slate-800">{title}</h3>
      ) : null}
      <ul className="grid gap-x-10 gap-y-4 sm:grid-cols-2">
        {items.map((item) => (
          <li
            key={item}
            className="border-l-2 border-green-600/70 pl-4 text-sm leading-7 text-slate-600"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}
