"use server";

import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.email("Enter a valid email"),
  audience: z.enum(["employees", "employers"]),
  country: z.string().min(2).max(4).optional(),
  article: z.string().optional(),
  code: z.string().optional(),
  message: z.string().min(10, "Please share a bit more detail"),
});

export type ContactActionState = {
  success: boolean;
  errors?: Record<string, string>;
  message?: string;
};

export async function submitHelpContact(
  _prevState: ContactActionState,
  formData: FormData,
): Promise<ContactActionState> {
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    audience: formData.get("audience"),
    country: formData.get("country") || undefined,
    article: formData.get("article") || undefined,
    code: formData.get("code") || undefined,
    message: formData.get("message"),
  });

  if (!parsed.success) {
    const fieldErrors = Object.fromEntries(
      Object.entries(parsed.error.flatten().fieldErrors).map(([key, values]) => [
        key,
        Array.isArray(values) ? values[0] ?? "" : String(values ?? ""),
      ]),
    );

    return {
      success: false,
      errors: fieldErrors,
      message: "Please correct the highlighted fields and try again.",
    };
  }

  return {
    success: true,
    message: "Thanks — your request has been prepared for review.",
  };
}
