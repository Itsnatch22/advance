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
  title: string;
  department: CareerDepartment;
  employment_type: CareerEmploymentType;
  location: string;
  country: string | null;
  description: string;
  responsibilities: string[];
  requirements: string[];
  skills: string[];
  apply_link: string | null;
  apply_email: string;
  // Back-compat field (DB trigger keeps this in sync). New logic should use `status`.
  is_open: boolean;
  is_featured: boolean;
  posted_date: string;
  closing_date: string | null;
  // New fields from DB migration
  status: "open" | "closed" | "archived";
  experience_level: "entry" | "mid" | "senior" | "lead" | null;
};

export const experienceLevels: Array<{
  value: "entry" | "mid" | "senior" | "lead";
  label: string;
}> = [
  { value: "entry", label: "Entry" },
  { value: "mid", label: "Mid" },
  { value: "senior", label: "Senior" },
  { value: "lead", label: "Lead" },
];

export function formatExperienceLevel(level: Career["experience_level"]) {
  if (!level) return null;
  return experienceLevels.find((l) => l.value === level)?.label ?? level;
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
  career: Pick<Career, "apply_link" | "apply_email" | "title">
) {
  if (career.apply_link) {
    return career.apply_link;
  }

  const subject = encodeURIComponent(`Application for ${career.title}`);
  return `mailto:${career.apply_email}?subject=${subject}`;
}
