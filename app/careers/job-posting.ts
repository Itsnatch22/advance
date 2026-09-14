import { COMPANY_CONFIG } from "@/constants/config";
import type { Career } from "./types";

type JobPosting = Record<string, unknown>;

export function buildJobPostingJsonLd(career: Career): JobPosting | null {
  if (!career.is_open) return null;

  const jobPosting: JobPosting = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: career.title,
    description: career.description,
    employmentType: mapEmploymentType(career.employment_type),
    datePosted: career.posted_date,
    hiringOrganization: {
      "@type": "Organization",
      name: "EaziWage",
      sameAs: COMPANY_CONFIG.HOMEPAGE_URL,
    },
    directApply: !career.apply_link,
    applicantLocationRequirements:
      career.work_mode === "remote"
        ? {
            "@type": "Country",
            name: "Worldwide",
          }
        : undefined,
  };

  if (career.closing_date) {
    jobPosting.validThrough = career.closing_date;
  }

  if (career.work_mode === "remote") {
    jobPosting.jobLocationType = "TELECOMMUTE";
  } else {
    jobPosting.jobLocation = {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: career.city ?? undefined,
        addressCountry: career.country_code,
      },
    };
  }

  if (career.salary_min != null && career.salary_max != null && career.currency_code) {
    jobPosting.baseSalary = {
      "@type": "MonetaryAmount",
      currency: career.currency_code,
      value: {
        "@type": "QuantitativeValue",
        minValue: career.salary_min,
        maxValue: career.salary_max,
        unitText: "MONTH",
      },
    };
  }

  return stripUndefined(jobPosting);
}

function mapEmploymentType(type: Career["employment_type"]) {
  const map: Record<Career["employment_type"], string> = {
    contract: "CONTRACTOR",
    "full-time": "FULL_TIME",
    internship: "INTERN",
    "part-time": "PART_TIME",
  };

  return map[type];
}

function stripUndefined<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map(stripUndefined) as T;
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .filter(([, item]) => item !== undefined)
        .map(([key, item]) => [key, stripUndefined(item)])
    ) as T;
  }

  return value;
}
