// lib/auth.ts
import { verifySession } from "./server/session";
import { headers } from "next/headers";

export type CurrentUser = {
  id: string;
  email: string;
  role: "employer" | "employee";
  companyId: string | null;
};

/**
 * Retrieves the current authenticated user from the session cookie.
 * Use this in Server Components and API Routes.
 * Returns null if not authenticated.
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const session = await verifySession();

  if (!session) {
    return null;
  }

  return {
    id: session.userId,
    email: session.email,
    role: session.role,
    companyId: session.companyId || null,
  };
}

/**
 * Retrieves the current user and enforces that they are part of the specific company.
 * Throws an error or returns null if not authorized.
 * Useful for API route protection.
 */
export async function requireCompanyAccess(
  companyId: string
): Promise<CurrentUser> {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Unauthorized: No session found");
  }

  if (user.role !== "employer" && user.role !== "admin") {
    // Employees might check their own company, but usually this is for Employer Dashboard APIs
    // If employees access this, we check their companyId matches
  }

  // Simple check: does the session companyId match the requested companyId?
  // For 'admin' role we might bypass, but for now strict check.
  if (user.companyId !== companyId) {
    throw new Error("Forbidden: You do not have access to this company");
  }

  return user;
}
