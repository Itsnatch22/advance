export type CareerDepartment =
  | "engineering"
  | "product_design"
  | "growth_marketing"
  | "operations"
  | "finance"
  | "people_culture";

export type CareerEmploymentType =
  "full-time" | "part-time" | "contract" | "internship";

export type CareerStatus = "open" | "closed" | "archived";

export type Career = {
  id: string;
  slug: string;
  title: string;
  department: CareerDepartment;
  employment_type: CareerEmploymentType;
  status: CareerStatus;
  // New location fields
  country_code: string | null;
  city: string | null;
  work_mode: "remote" | "onsite" | "hybrid";
  // Description & duties
  description: string;
  responsibilities: string[];
  requirements: string[];
  skills: string[];
  apply_link: string | null;
  apply_email: string;
  // Visibility/metadata
  is_open: boolean;
  is_featured: boolean;
  posted_date: string;
  closing_date: string | null;
};

export function isCareerOpen(
  career: Pick<Career, "status" | "is_open"> &
    Partial<Pick<Career, "closing_date">>
): boolean {
  if (career.status !== "open" || !career.is_open) return false;
  if (!career.closing_date) return true;

  // Closing dates are inclusive and interpreted in EaziWage's local timezone.
  // ISO date strings compare lexically, avoiding UTC-midnight boundary errors.
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Nairobi",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .formatToParts(new Date())
    .reduce<Record<string, string>>((parts, part) => {
      if (part.type !== "literal") parts[part.type] = part.value;
      return parts;
    }, {});
  const todayInNairobi = `${today.year}-${today.month}-${today.day}`;

  return (
    /^\d{4}-\d{2}-\d{2}$/.test(career.closing_date) &&
    career.closing_date >= todayInNairobi
  );
}

// Helper: format location/work mode for display
export function formatLocation(
  career: Pick<Career, "city" | "country_code" | "work_mode">
) {
  const { city, country_code, work_mode } = career;

  if (work_mode === "remote") {
    return "Remote";
  }

  const modeLabel = work_mode === "hybrid" ? "Hybrid" : "Onsite";
  const place = city ? `${city}, ${country_code ?? ""}` : (country_code ?? "");

  return place ? `${place} · ${modeLabel}` : modeLabel;
}

export const departments: Array<{
  value: CareerDepartment;
  label: string;
  summary: string;
}> = [
  {
    value: "engineering",
    label: "Engineering",
    summary:
      "Web (Frontend & Backend) & Mobile Build and Maintenance, Infrastructure, Security.",
  },
  {
    value: "product_design",
    label: "Product & Design",
    summary: "Product Manager, UI/UX, Research & Product Design.",
  },
  {
    value: "growth_marketing",
    label: "Growth & Marketing",
    summary: "Marketing, Growth, Partnerships, Content & Social Media.",
  },
  {
    value: "operations",
    label: "Operations",
    summary:
      "Customer Support, Compliance, Administration & Internal Operations.",
  },
  {
    value: "finance",
    label: "Finance",
    summary: "Accounting, Financial Operations, Budgeting & Reporting.",
  },
  {
    value: "people_culture",
    label: "People & Culture",
    summary: "Human Resource, Recruitment & Employee Experience.",
  },
];

export const employmentTypes: Array<{
  value: CareerEmploymentType;
  label: string;
}> = [
  { value: "full-time", label: "Full-time" },
  { value: "part-time", label: "Part-time" },
  { value: "contract", label: "Contract" },
  { value: "internship", label: "Internship" },
];

export function formatDepartment(department: CareerDepartment) {
  return (
    departments.find((item) => item.value === department)?.label ?? department
  );
}

export function formatEmploymentType(type: CareerEmploymentType) {
  return employmentTypes.find((item) => item.value === type)?.label ?? type;
}

export function getApplyHref(career: Pick<Career, "apply_link" | "slug">) {
  if (career.apply_link) {
    return career.apply_link;
  }
  return `/careers/${career.slug}/apply`;
}
