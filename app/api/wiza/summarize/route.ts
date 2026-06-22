import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { tasks } from "@trigger.dev/sdk";
import { generateSummary } from "@/lib/ai/gemini";
import type { summarizeWizaSession } from "@/trigger/wiza-summarize";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("Authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    let body: { messages?: { role: string; content: string }[] };
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    if (!body.messages?.length) {
      return NextResponse.json(
        { error: "messages[] required for guest summary" },
        { status: 400 }
      );
    }

    const transcript = body.messages
      .map((m) => `${m.role === "user" ? "User" : "Wiza"}: ${m.content}`)
      .join("\n\n");

    const summary = await generateSummary(transcript);
    return NextResponse.json({ summary });
  }

  const userClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: authHeader } } }
  );
  const {
    data: { user },
  } = await userClient.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { session_id?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.session_id) {
    return NextResponse.json({ error: "session_id required" }, { status: 400 });
  }

  const { data: session } = await supabase
    .from("wiza_sessions")
    .select("id, employee_id, summary_sent")
    .eq("id", body.session_id)
    .eq("employee_id", user.id)
    .single();

  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  if (session.summary_sent) {
    return NextResponse.json({ message: "Summary already sent" });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("email, phone, notification_preferences")
    .eq("id", user.id)
    .single();

  if (!profile) {
    console.warn(
      `[wiza/summarize] No profile found for user ${user.id} — queuing without notifications`
    );
  }

  const notifPrefs = (profile?.notification_preferences ?? {}) as Record<
    string,
    boolean
  >;
  const sendToEmail = notifPrefs.summary_email
    ? (profile?.email ?? null)
    : null;
  const sendToPhone = notifPrefs.summary_sms ? (profile?.phone ?? null) : null;

  await tasks.trigger<typeof summarizeWizaSession>("summarize-wiza-session", {
    session_id: body.session_id,
    employee_id: user.id,
    send_to_email: sendToEmail,
    send_to_phone: sendToPhone,
  });

  return NextResponse.json({ message: "Summary job queued" });
}
