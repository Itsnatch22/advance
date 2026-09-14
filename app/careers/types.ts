export type CareerDepartment =
  | "development"
  | "design"
  | "creativity"
  | "growth";

export type CareerEmploymentType =
  | "full-time"
  | "part-time"
  | "contract"
  | "internship";

export type Career = {
  id: string;
  slug: string;
  title: string;
  department: CareerDepartment;
  employment_type: CareerEmploymentType;
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
  // Salary fields
  salary_min: number | null;
  salary_max: number | null;
  currency_code: string | null;
  is_stipend: boolean;
};

// Helper: format location/work mode for display
export function formatLocation(career: Pick<Career, "city" | "country_code" | "work_mode">) {
  const { city, country_code, work_mode } = career;

  if (work_mode === "remote") {
    return "Remote";
  }

  const modeLabel = work_mode === "hybrid" ? "Hybrid" : "Onsite";
  const place = city ? `${city}, ${country_code ?? ""}` : country_code ?? "";

  return place ? `${place} · ${modeLabel}` : modeLabel;
}

// Helper: format salary range and stipend
export function formatSalary(career: Pick<Career, "salary_min" | "salary_max" | "currency_code" | "is_stipend">) {
  const { salary_min, salary_max, currency_code, is_stipend } = career;

  // If no numeric salary info and not stipend, return null to indicate nothing to render
  const hasSalary = salary_min != null || salary_max != null;

  const fmt = (value: number) => {
    if (!currency_code) return value.toLocaleString();
    try {
      return new Intl.NumberFormat("en", {
        style: "currency",
        currency: currency_code,
        maximumFractionDigits: 0,
      }).format(value);
    } catch (e) {
      // Fallback if currency_code is invalid
      return value.toLocaleString();
    }
  };

  let parts: string[] = [];

  if (hasSalary) {
    if (salary_min != null && salary_max != null) {
      parts.push(`${fmt(salary_min)} - ${fmt(salary_max)}`);
    } else if (salary_min != null) {
      parts.push(`From ${fmt(salary_min)}`);
    } else if (salary_max != null) {
      parts.push(`Up to ${fmt(salary_max)}`);
    }
  }

  if (!hasSalary && is_stipend) {
    // No numeric salary but marked as stipend
    parts.push("(stipend)");
  } else if (is_stipend) {
    // Append stipend marker
    parts = parts.map((p) => `${p} (stipend)`);
  }

  return parts.length > 0 ? parts.join(" ") : null;
}


export const departments: Array<{
  value: CareerDepartment;
  label: string;
  summary: string;
}> = [
  {
    value: "development",
    label: "Development",
    summary:
      "Engineers building reliable fintech rails for earned wage access.",
  },
  {
    value: "design",
    label: "Design",
    summary:
      "Product and brand thinkers shaping clear workplace finance tools.",
  },
  {
    value: "creativity",
    label: "Creativity",
    summary: "Storytellers helping workers and employers understand EaziWage.",
  },
  {
    value: "growth",
    label: "Growth",
    summary:
      "Operators opening new markets, partnerships, and acquisition loops.",
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

export function getApplyHref(
  career: Pick<Career, "apply_link" | "slug">
) {
  if (career.apply_link) {
    return career.apply_link;
  }
  return `/careers/${career.slug}/apply`;
}
