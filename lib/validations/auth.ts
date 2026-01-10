// lib/validations/auth.ts
import { z } from "zod";

export const registerSchema = z
  .object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
    role: z.enum(["employer", "employee"]),

    // Employer-specific fields
    companyName: z.string().optional(),
    companySize: z.number().int().positive().optional(),
    
    // Employee-specific fields
    inviteToken: z.string().optional(),
    companyId: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // Password confirmation validation
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }

    // Role-based validation
    if (data.role === "employer") {
      if (!data.companyName || data.companyName.length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Company name is required for employers",
          path: ["companyName"],
        });
      }

      if (!data.companySize || data.companySize < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Company size is required for employers",
          path: ["companySize"],
        });
      }
    }

    if (data.role === "employee") {
      // Ensure employee doesn't provide company data
      if (data.companyName) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Employees cannot provide company information",
          path: ["companyName"],
        });
      }

      if (data.companySize) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Employees cannot provide company size",
          path: ["companySize"],
        });
      }
    }
  });

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
