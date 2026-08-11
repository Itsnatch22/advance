import type { Metadata } from "next";
import { AlertCircle, ArrowUpRight, BriefcaseBusiness } from "lucide-react";
import Link from "next/link";
import { GridSystem } from "@/components/grid";
import { FloatingOrb } from "@/components/shared/FloatingOrb";
import { supabaseUser } from "@/lib/supabase/server";
import { CareersListClient } from "./CareersListClient";
import type { Career } from "./types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Join EaziWage and help build trusted earned wage access for African workplaces.",
  openGraph: {
    title: "Careers at EaziWage",
    description:
      "Explore open roles across engineering, design, creativity, and growth at EaziWage.",
    url: "https://eaziwage.com/careers",
  },
};

async function getOpenCareers() {
  const { data, error } = await supabaseUser
    .from("careers")
    .select(
      "id,title,department,employment_type,location,country,description,responsibilities,requirements,skills,apply_link,apply_email,is_open,is_featured,posted_date,closing_date,status,experience_level"
    )
    .eq("status", "open")
    .order("is_featured", { ascending: false })
    .order("posted_date", { ascending: false });

  if (error) {
    return { careers: [] as Career[], error: error.message };
  }

  return { careers: (data ?? []) as Career[], error: null };
}

export default async function CareersPage() {
  const { careers, error } = await getOpenCareers();
  const featuredCount = careers.filter((career) => career.is_featured).length;

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
          className="right-[6%] bottom-[12%]"
        />
      </div>

      <section className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-6 py-24 lg:grid-cols-[1.08fr_0.92fr] lg:px-8 lg:py-28">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-500/10 bg-green-500/5 px-4 py-1.5 text-xs font-black tracking-[0.2em] text-green-600 uppercase">
            <BriefcaseBusiness className="h-3.5 w-3.5" strokeWidth={1.8} />
            Careers
          </div>
          <h1 className="font-serif text-5xl leading-tight font-bold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
            Build workplace finance that earns trust
          </h1>
          <p className="mt-8 max-w-2xl text-xl leading-relaxed text-slate-500">
            Join a small team building safer earned wage access for employers
            and workers across Africa.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link
              href="#open-roles"
              className="group inline-flex items-center justify-center gap-3 rounded-full bg-slate-900 py-2.5 pr-2.5 pl-6 font-bold text-white shadow-xl shadow-slate-900/10 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-green-600 active:scale-[0.98]"
            >
              View open roles
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/12 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 group-hover:-translate-y-0.5">
                <ArrowUpRight className="h-4 w-4" strokeWidth={1.8} />
              </span>
            </Link>
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200/70 bg-white/65 p-1.5 shadow-2xl shadow-slate-900/5">
          <div className="rounded-[calc(2rem-0.375rem)] bg-white p-7 ring-1 ring-slate-900/5 sm:p-9">
            <div className="grid gap-5">
              <Metric label="Open roles" value={careers.length.toString()} />
              <Metric label="Featured roles" value={featuredCount.toString()} />
              <Metric label="Departments" value="4" />
            </div>
            <div className="mt-8 rounded-[1.5rem] bg-green-50 p-5 text-sm leading-relaxed text-green-900 ring-1 ring-green-500/10">
              We keep the team focused and practical. Every role here maps to
              work we need in production, market growth, or customer trust.
            </div>
          </div>
        </div>
      </section>

      {error ? <CareersError message={error} /> : null}

      <div id="open-roles">
        <CareersListClient careers={careers} />
      </div>
    </GridSystem>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-6 rounded-[1.4rem] bg-slate-50 px-5 py-4 ring-1 ring-slate-200/70">
      <span className="text-sm font-bold text-slate-500">{label}</span>
      <span className="font-serif text-4xl font-black text-slate-900">
        {value}
      </span>
    </div>
  );
}

function CareersError({ message }: { message: string }) {
  return (
    <section className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
      <div className="flex items-start gap-4 rounded-[2rem] border border-red-200 bg-red-50 p-6 text-red-950">
        <AlertCircle className="mt-1 h-5 w-5 shrink-0" strokeWidth={1.8} />
        <div>
          <h2 className="font-bold">Unable to load roles</h2>
          <p className="mt-1 text-sm leading-relaxed text-red-800">{message}</p>
        </div>
      </div>
    </section>
  );
}
