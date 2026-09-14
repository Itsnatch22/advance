import { z } from "zod";

export const CAREER_APPLICATION_ALLOWED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
] as const;

export const CAREER_APPLICATION_ALLOWED_EXTENSIONS = [".pdf", ".doc", ".docx"] as const;
export const CAREER_APPLICATION_MAX_FILE_SIZE = 5 * 1024 * 1024;

export const careerApplicationForbiddenClientFields = [
  "career_id",
  "career_title_snapshot",
  "career_slug_snapshot",
] as const;

const optionalUrl = z
  .string()
  .trim()
  .max(300)
  .optional()
  .or(z.literal(""))
  .refine((value) => !value || /^https?:\/\/.+/i.test(value), {
    message: "Enter a valid URL starting with http:// or https://",
  });

export const careerApplicationSchema = z
  .object({
    full_name: z
      .string()
      .trim()
      .min(2, "Full name must be at least 2 characters")
      .max(120, "Full name must be 120 characters or fewer"),
    email: z
      .string()
      .trim()
      .email("Enter a valid email address")
      .max(254, "Email must be 254 characters or fewer"),
    phone: z.string().trim().max(40, "Phone must be 40 characters or fewer").optional().or(z.literal("")),
    cover_letter: z
      .string()
      .trim()
      .max(4000, "Cover letter must be 4000 characters or fewer")
      .optional()
      .or(z.literal("")),
    linkedin_url: optionalUrl,
    portfolio_url: optionalUrl,
    consent: z.literal(true, {
      error: "You must consent before submitting your application",
    }),
  })
  .strict();

export type CareerApplicationPayload = z.infer<typeof careerApplicationSchema>;

export function validateCareerApplicationFile(file: File | null | undefined) {
  if (!file || file.size === 0) {
    return "Resume is required";
  }

  if (!CAREER_APPLICATION_ALLOWED_FILE_TYPES.includes(file.type as (typeof CAREER_APPLICATION_ALLOWED_FILE_TYPES)[number])) {
    return "Resume must be a PDF or Word document";
  }

  if (file.size > CAREER_APPLICATION_MAX_FILE_SIZE) {
    return "Resume must be smaller than 5MB";
  }

  return null;
}

export function getCareerApplicationFileExtension(fileName: string) {
  const extension = fileName.match(/\.[a-z0-9]+$/i)?.[0]?.toLowerCase();
  return CAREER_APPLICATION_ALLOWED_EXTENSIONS.includes(
    extension as (typeof CAREER_APPLICATION_ALLOWED_EXTENSIONS)[number]
  )
    ? extension
    : ".pdf";
}
