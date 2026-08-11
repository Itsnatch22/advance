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
import { FloatingOrb } from "@/components/shared/FloatingOrb";
import { supabaseUser } from "@/lib/supabase/server";
import {
  type Career,
  formatDepartment,
  formatEmploymentType,
  getApplyHref,
} from "../types";

export const dynamic = "force-dynamic";

type CareerDetailPageProps = {
  params: Promise<{ id: string }>;
};

async function getCareer(id: string) {
  const { data, error } = await supabaseUser
    .from("careers")
    .select(
      "id,title,department,employment_type,location,country,description,responsibilities,requirements,skills,apply_link,apply_email,is_open,is_featured,posted_date,closing_date"
    )
    .eq("id", id)
    .eq("is_open", true)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data as Career | null;
}

export async function generateMetadata({
  params,
}: CareerDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const career = await getCareer(id);

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
      url: `https://eaziwage.com/careers/${career.id}`,
    },
  };
}

export default async function CareerDetailPage({
  params,
}: CareerDetailPageProps) {
  const { id } = await params;
  const career = await getCareer(id);

  if (!career) {
    notFound();
  }

  const applyHref = getApplyHref(career);
  const isExternalApply = Boolean(career.apply_link);

  return (
    <GridSystem
      variant="dots"
      opacity={0.03}
      className="min-h-screen bg-white pt-16"
    >
      <div className="pointer-events-none absolute inset-0">
        <FloatingOrb
          color="bg-green-100"
          delay={0}
          className="top-[-8%] left-[8%]"
        />
        <FloatingOrb
          color="bg-emerald-100"
          delay={2}
          className="right-[6%] bottom-[20%]"
        />
      </div>

      <main className="relative z-10 mx-auto max-w-5xl px-6 py-20 lg:px-8 lg:py-24">
        <Link
          href="/careers"
          className="mb-10 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-700 ring-1 ring-slate-200 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-green-50 hover:text-green-700 active:scale-[0.98]"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.8} />
          Back to careers
        </Link>

        <section className="rounded-[2rem] border border-slate-200/70 bg-white/75 p-1.5 shadow-2xl shadow-slate-900/5">
          <div className="rounded-[calc(2rem-0.375rem)] bg-white p-6 ring-1 ring-slate-900/5 sm:p-10 lg:p-12">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-green-500/10 bg-green-500/5 px-4 py-1.5 text-xs font-black tracking-[0.2em] text-green-600 uppercase">
              <BriefcaseBusiness className="h-3.5 w-3.5" strokeWidth={1.8} />
              {formatDepartment(career.department)}
            </div>

            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-start">
              <div>
                <h1 className="font-serif text-4xl leading-tight font-bold tracking-tight text-slate-900 sm:text-6xl">
                  {career.title}
                </h1>
                <div className="mt-6 flex flex-wrap gap-4 text-sm font-semibold text-slate-500">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                    {formatEmploymentType(career.employment_type)}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <MapPin
                      className="h-4 w-4 text-green-600"
                      strokeWidth={1.8}
                    />
                    {career.country
                      ? `${career.location}, ${career.country}`
                      : career.location}
                  </span>
                  {career.closing_date ? (
                    <span className="inline-flex items-center gap-2">
                      <Clock3
                        className="h-4 w-4 text-green-600"
                        strokeWidth={1.8}
                      />
                      Closes {formatDate(career.closing_date)}
                    </span>
                  ) : null}
                </div>
              </div>

              <Link
                href={applyHref}
                target={isExternalApply ? "_blank" : undefined}
                rel={isExternalApply ? "noopener noreferrer" : undefined}
                className="group inline-flex items-center justify-center gap-3 rounded-full bg-slate-900 py-2.5 pr-2.5 pl-6 font-bold text-white shadow-xl shadow-slate-900/10 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-green-600 active:scale-[0.98]"
              >
                Apply now
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/12 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 group-hover:-translate-y-0.5">
                  <ArrowUpRight className="h-4 w-4" strokeWidth={1.8} />
                </span>
              </Link>
            </div>

            <p className="mt-10 max-w-3xl text-lg leading-relaxed text-slate-600">
              {career.description}
            </p>
          </div>
        </section>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_20rem]">
          <div className="grid gap-8">
            <DetailSection
              title="Responsibilities"
              items={career.responsibilities}
            />
            <DetailSection title="Requirements" items={career.requirements} />
          </div>

          <aside className="h-fit rounded-[2rem] border border-slate-200/70 bg-white/75 p-1.5 shadow-xl shadow-slate-900/5">
            <div className="rounded-[calc(2rem-0.375rem)] bg-white p-6 ring-1 ring-slate-900/5">
              <h2 className="text-xl font-black tracking-tight text-slate-900">
                Skills
              </h2>
              {career.skills.length > 0 ? (
                <div className="mt-5 flex flex-wrap gap-2">
                  {career.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-green-50 px-3 py-1.5 text-xs font-bold text-green-700 ring-1 ring-green-500/10"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-sm leading-relaxed text-slate-500">
                  Skills will be discussed during the hiring process.
                </p>
              )}
            </div>
          </aside>
        </div>
      </main>
    </GridSystem>
  );
}

function DetailSection({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="rounded-[2rem] border border-slate-200/70 bg-white/75 p-1.5 shadow-xl shadow-slate-900/5">
      <div className="rounded-[calc(2rem-0.375rem)] bg-white p-6 ring-1 ring-slate-900/5 sm:p-8">
        <h2 className="text-2xl font-black tracking-tight text-slate-900">
          {title}
        </h2>
        {items.length > 0 ? (
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {items.map((item) => (
              <div
                key={item}
                className="rounded-[1.25rem] bg-slate-50 p-4 text-sm leading-relaxed text-slate-600 ring-1 ring-slate-200/70"
              >
                {item}
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-base leading-relaxed text-slate-500">
            Details will be shared with shortlisted candidates.
          </p>
        )}
      </div>
    </section>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}
