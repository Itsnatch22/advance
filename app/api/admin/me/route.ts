import { NextRequest } from "next/server";
import { sendSuccess, sendError } from "@/lib/utils/response";
import { getAuthenticatedAdmin } from "@/lib/admin/campaigns";

export async function GET(request: NextRequest) {
  const auth = await getAuthenticatedAdmin(request);

  if ("error" in auth) {
    return sendError(auth.error, auth.status);
  }

  return sendSuccess({ isAdmin: true, email: auth.user.email ?? null, role: auth.role });
}
