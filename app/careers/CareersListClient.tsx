"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Clock3,
  MapPin,
  Sparkles,
} from "lucide-react";
import {
  type Career,
  type CareerDepartment,
  type CareerEmploymentType,
  departments,
  employmentTypes,
  experienceLevels,
  formatEmploymentType,
  formatExperienceLevel,
  getApplyHref,
} from "./types";
import { useMemo, useState } from "react";

type CareersListClientProps = {
  careers: Career[];
};

type EmploymentFilter = "all" | CareerEmploymentType;

type ExperienceFilter = "all" | ("entry" | "mid" | "senior" | "lead");

export function CareersListClient({ careers }: CareersListClientProps) {
  const [selectedDepartment, setSelectedDepartment] =
    useState<CareerDepartment>("development");
  const [selectedType, setSelectedType] = useState<EmploymentFilter>("all");
  const [selectedExperience, setSelectedExperience] =
    useState<ExperienceFilter>("all");

  const totalOpenRoles = careers.length;
  const hasAnyRoles = totalOpenRoles > 0;

  const departmentCounts = useMemo(() => {
    return departments.reduce(
      (counts, department) => {
        counts[department.value] = careers.filter(
          (career) => career.department === department.value
        ).length;
        return counts;
      },
      {} as Record<CareerDepartment, number>
    );
  }, [careers]);

  const filteredCareers = careers.filter((career) => {
    const matchesDepartment = career.department === selectedDepartment;
    const matchesType =
      selectedType === "all" || career.employment_type === selectedType;
    const matchesExperience =
      selectedExperience === "all" || career.experience_level === selectedExperience;

    return matchesDepartment && matchesType && matchesExperience;
  });

  return (
    <section className="relative z-10 mx-auto max-w-7xl px-6 py-24 lg:px-8">
      <div className="mb-12 max-w-3xl">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-green-500/10 bg-green-500/5 px-4 py-1.5 text-xs font-black tracking-[0.2em] text-green-600 uppercase">
          <BriefcaseBusiness className="h-3.5 w-3.5" strokeWidth={1.8} />
          Open Roles
        </div>
        <h2 className="font-serif text-4xl leading-tight font-bold tracking-tight text-slate-900 sm:text-5xl">
          Find your place on the team
        </h2>
        <p className="mt-5 text-lg leading-relaxed text-slate-500">
          Filter by function and role type. Internships stay visible, so early
          career builders can spot the right opening quickly.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[18rem_1fr]">
        <aside className="h-fit rounded-4xl border border-slate-200/70 bg-white/75 p-3 shadow-xl shadow-slate-900/5">
          <div className="grid gap-2">
            {departments.map((department) => {
              const active = department.value === selectedDepartment;

              return (
                <button
                  key={department.value}
                  type="button"
                  onClick={() => setSelectedDepartment(department.value)}
                  className={`group rounded-[1.4rem] p-4 text-left transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.99] ${
                    active
                      ? "bg-slate-900 text-white shadow-lg shadow-slate-900/10"
                      : "bg-white text-slate-700 hover:bg-green-50"
                  }`}
                >
                  <span className="flex items-center justify-between gap-4">
                    <span className="font-bold">{department.label}</span>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                        active
                          ? "bg-white/15 text-white"
                          : "bg-slate-100 text-slate-500 group-hover:bg-white"
                      }`}
                    >
                      {departmentCounts[department.value]}
                    </span>
                  </span>
                  <span
                    className={`mt-2 block text-sm leading-relaxed ${
                      active ? "text-white/72" : "text-slate-500"
                    }`}
                  >
                    {department.summary}
                  </span>
                </button>
              );
            })}
          </div>
        </aside>

        <div>
          <div className="mb-6 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSelectedType("all")}
              className={`rounded-full px-4 py-2 text-sm font-bold transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.98] ${
                selectedType === "all"
                  ? "bg-green-600 text-white shadow-lg shadow-green-500/20"
                  : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-green-50 hover:text-green-700"
              }`}
            >
              All types
            </button>
            {employmentTypes.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => setSelectedType(type.value)}
                className={`rounded-full px-4 py-2 text-sm font-bold transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.98] ${
                  selectedType === type.value
                    ? "bg-green-600 text-white shadow-lg shadow-green-500/20"
                    : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-green-50 hover:text-green-700"
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>

          {/* Experience level filter row (same pattern as employment type). Null values are not shown as filter options. */}

          <div className="mb-6 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSelectedExperience("all")}
              className={`rounded-full px-4 py-2 text-sm font-bold transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.98] ${
                selectedExperience === "all"
                  ? "bg-green-600 text-white shadow-lg shadow-green-500/20"
                  : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-green-50 hover:text-green-700"
              }`}
            >
              All levels
            </button>
            {experienceLevels.map((level) => (
              <button
                key={level.value}
                type="button"
                onClick={() => setSelectedExperience(level.value)}
                className={`rounded-full px-4 py-2 text-sm font-bold transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.98] ${
                  selectedExperience === level.value
                    ? "bg-green-600 text-white shadow-lg shadow-green-500/20"
                    : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-green-50 hover:text-green-700"
                }`}
              >
                {level.label}
              </button>
            ))}
          </div>

          {!hasAnyRoles ? (
            <EmptyState title="No open roles right now" />
          ) : filteredCareers.length === 0 ? (
            <EmptyState title="No open roles right now" />
          ) : (
            <div className="grid gap-5">
              {filteredCareers.map((career) => (
                <CareerCard key={career.id} career={career} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function CareerCard({ career }: { career: Career }) {
  const applyHref = getApplyHref(career);
  const isExternalApply = Boolean(career.apply_link);
  const excerpt =
    career.description.length > 180
      ? `${career.description.slice(0, 177).trim()}...`
      : career.description;

  return (
    <article className="group overflow-hidden rounded-4xl border border-slate-200/70 bg-white/80 p-1.5 shadow-xl shadow-slate-900/5 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:shadow-2xl hover:shadow-green-500/10">
      <div className="rounded-[1.625rem] bg-white p-6 ring-1 ring-slate-900/5 sm:p-7">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0 flex-1">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {career.is_featured ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-black tracking-[0.16em] text-green-700 uppercase ring-1 ring-green-500/10">
                  <Sparkles className="h-3 w-3" strokeWidth={1.8} />
                  Featured
                </span>
              ) : null}

              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                {formatEmploymentType(career.employment_type)}
              </span>

              {/* Experience level chip (show 'Not specified' on individual cards when null) */}
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                {career.experience_level ? formatExperienceLevel(career.experience_level) : "Not specified"}
              </span>
            </div>

            <Link href={`/careers/${career.id}`} className="group/title">
              <h3 className="text-2xl font-black tracking-tight text-slate-900 transition-colors duration-300 group-hover/title:text-green-700 sm:text-3xl">
                {career.title}
              </h3>
            </Link>

            <div className="mt-4 flex flex-wrap gap-4 text-sm font-semibold text-slate-500">
              <span className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4 text-green-600" strokeWidth={1.8} />
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

            <p className="mt-5 max-w-3xl text-base leading-relaxed text-slate-500">
              {excerpt}
            </p>
          </div>

          <div className="flex shrink-0 flex-col gap-3 sm:flex-row xl:flex-col">
            <Link
              href={`/careers/${career.id}`}
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-800 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-green-200 hover:bg-green-50 hover:text-green-700 active:scale-[0.98]"
            >
              View role
            </Link>
            <a
              href={applyHref}
              target={isExternalApply ? "_blank" : undefined}
              rel={isExternalApply ? "noopener noreferrer" : undefined}
              className="group/apply inline-flex items-center justify-center gap-3 rounded-full bg-slate-900 py-2.5 pr-2.5 pl-5 text-sm font-bold text-white shadow-lg shadow-slate-900/10 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-green-600 active:scale-[0.98]"
            >
              Apply
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/12 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/apply:translate-x-1 group-hover/apply:-translate-y-0.5">
                <ArrowUpRight className="h-4 w-4" strokeWidth={1.8} />
              </span>
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}

function EmptyState({ title }: { title: string }) {
  return (
    <div className="rounded-4xl border border-dashed border-slate-300 bg-white/70 p-10 text-center shadow-xl shadow-slate-900/5">
      <h3 className="text-2xl font-black tracking-tight text-slate-900">
        {title}
      </h3>
      <p className="mx-auto mt-3 max-w-md text-base leading-relaxed text-slate-500">
        Check back soon. We update this page as new roles open.
      </p>
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
