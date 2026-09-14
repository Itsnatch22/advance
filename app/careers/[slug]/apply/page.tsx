import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { GridSystem } from "@/components/grid";
import { BorderBeam } from "@/components/ui/border-beam";
import { supabaseUser } from "@/lib/supabase/server";
import type { Career } from "../../types";
import { ApplicationForm } from "./ApplicationForm";

export const dynamic = "force-dynamic";

type ApplyPageProps = {
  params: Promise<{ slug: string }>;
};

async function getCareer(slug: string) {
  const { data, error } = await supabaseUser
    .from("careers")
    .select(
      "id,slug,title,description,is_open,status,apply_link"
    )
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data as Pick<Career, "id" | "slug" | "title" | "description" | "is_open" | "apply_link"> & {
    status: "open" | "closed" | "archived";
  } | null;
}

export async function generateMetadata({
  params,
}: ApplyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const career = await getCareer(slug);

  if (!career) {
    return {
      title: "Role Not Found",
    };
  }

  return {
    title: `Apply for ${career.title} | EaziWage Careers`,
    description: `Submit your application for the ${career.title} position at EaziWage.`,
    openGraph: {
      title: `Apply for ${career.title}`,
      description: `Submit your application for the ${career.title} position at EaziWage.`,
      url: `https://eaziwage.com/careers/${career.slug}/apply`,
    },
  };
}

export default async function ApplyPage({ params }: ApplyPageProps) {
  const { slug } = await params;
  const career = await getCareer(slug);

  if (!career) {
    notFound();
  }

  if (!career.is_open) {
    return (
      <GridSystem
        variant="dots"
        opacity={0.03}
        className="min-h-[100dvh] bg-white pt-16"
      >
        <main className="relative z-10 mx-auto max-w-3xl px-6 py-20 lg:px-8 lg:py-24">
          <Link
            href={`/careers/${career.slug}`}
            className="mb-10 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-700 ring-1 ring-slate-200 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-green-50 hover:text-green-700 active:scale-[0.98]"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={1.8} />
            Back to role
          </Link>

          <section className="rounded-[2rem] border border-slate-200/70 bg-white/75 p-1.5 shadow-2xl shadow-slate-900/5">
            <div className="rounded-[calc(2rem-0.375rem)] bg-white p-6 ring-1 ring-slate-900/5 sm:p-10 lg:p-12">
              <div className="mb-6 rounded-[1.5rem] border-l-4 border-l-amber-500 bg-amber-50 p-5 text-sm leading-relaxed text-amber-900 ring-1 ring-amber-500/10">
                <span className="font-bold">This role is no longer accepting applications.</span> We appreciate your interest. Please check back for other open opportunities.
              </div>
              <Link
                href="/careers"
                className="inline-flex items-center justify-center gap-3 rounded-full bg-slate-900 py-2.5 pr-2.5 pl-6 font-bold text-white shadow-xl shadow-slate-900/10 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-green-600 active:scale-[0.98]"
              >
                View other roles
              </Link>
            </div>
          </section>
        </main>
      </GridSystem>
    );
  }

  if (career.apply_link) {
    return (
      <GridSystem
        variant="dots"
        opacity={0.03}
        className="min-h-[100dvh] bg-white pt-16"
      >
        <main className="relative z-10 mx-auto max-w-3xl px-6 py-20 lg:px-8 lg:py-24">
          <Link
            href={`/careers/${career.slug}`}
            className="mb-10 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-700 ring-1 ring-slate-200 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-green-50 hover:text-green-700 active:scale-[0.98]"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={1.8} />
            Back to role
          </Link>

          <section className="rounded-[2rem] border border-slate-200/70 bg-white/75 p-1.5 shadow-2xl shadow-slate-900/5">
            <div className="rounded-[calc(2rem-0.375rem)] bg-white p-6 ring-1 ring-slate-900/5 sm:p-10 lg:p-12">
              <div className="mb-6 rounded-[1.5rem] border-l-4 border-l-green-600 bg-green-50 p-5 text-sm leading-relaxed text-green-900 ring-1 ring-green-500/10">
                <span className="font-bold">This role uses an external application form.</span> Continue through the official posting to apply.
              </div>
              <Link
                href={career.apply_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 rounded-full bg-slate-900 px-6 py-3 font-bold text-white shadow-xl shadow-slate-900/10 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-green-600 active:scale-[0.98]"
              >
                Continue to application
              </Link>
            </div>
          </section>
        </main>
      </GridSystem>
    );
  }

  return (
    <GridSystem
      variant="dots"
      opacity={0.03}
      className="min-h-[100dvh] bg-white pt-16"
    >
      <main className="relative z-10 mx-auto max-w-3xl px-6 py-20 lg:px-8 lg:py-24">
        <Link
          href={`/careers/${career.slug}`}
          className="mb-10 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-700 ring-1 ring-slate-200 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-green-50 hover:text-green-700 active:scale-[0.98]"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.8} />
          Back to role
        </Link>

        <section className="rounded-[2rem] border border-slate-200/70 bg-white/75 p-1.5 shadow-2xl shadow-slate-900/5">
          <div className="rounded-[calc(2rem-0.375rem)] bg-white p-6 ring-1 ring-slate-900/5 sm:p-10 lg:p-12">
            <div className="relative overflow-hidden mb-8 rounded-[1.25rem]">
              <BorderBeam colorFrom="#00B37E" colorTo="#006F42" size={150} duration={8} />
              <div className="relative z-10 mb-8">
                <h1 className="font-serif text-4xl leading-tight font-bold tracking-tight text-slate-900 sm:text-5xl">
                  Apply for {career.title}
                </h1>
                <p className="mt-4 text-lg leading-relaxed text-slate-600">
                  Tell us about yourself and why you'd be a great fit for this role.
                </p>
              </div>

              <div className="relative z-10">
                <ApplicationForm careerSlug={career.slug} careerTitle={career.title} />
              </div>
            </div>
          </div>
        </section>
      </main>
    </GridSystem>
  );
}
