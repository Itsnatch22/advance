// app/api/auth/logout/route.ts
import { destroySession } from "@/lib/server/session";
import { NextResponse } from "next/server";

export async function POST() {
  await destroySession();
  return NextResponse.json({ success: true, redirectTo: "/login" });
}