import { z } from "zod";

export const contactSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(100, { message: "Name must be less than 100 characters" }),

  email: z.string().email({ message: "Please enter a valid email address" }),

  subject: z
    .string()
    .min(5, { message: "Subject must be at least 5 characters" })
    .max(200, { message: "Subject must be less than 200 characters" }),

  message: z
    .string()
    .min(10, { message: "Message must be at least 10 characters" })
    .max(2000, { message: "Message must be less than 2000 characters" }),

  honeypot: z.string().optional(),
});

export type ContactFormData = z.infer<typeof contactSchema>;
