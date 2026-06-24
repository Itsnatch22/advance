import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { tasks } from "@trigger.dev/sdk";
import { generateSummary } from "@/lib/ai/gemini";
import { checkRateLimit, rateLimiter } from "@/lib/security/rate-limit";
import type { summarizeWizaSession } from "@/trigger/wiza-summarize";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type DeliveryChannel = "chat" | "email" | "sms";

function buildTranscript(messages: { role: string; content: string }[]): string {
  return messages
    .map((m) => `${m.role === "user" ? "User" : "Wiza"}: ${m.content}`)
    .join("\n\n");
}

function formatSmsText(summary: string): string {
  const plain = summary
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/^[-•]\s*/gm, "• ");
  const cap = 440;
  return `Wiza Summary:\n${plain.slice(0, cap)}${plain.length > cap ? "…" : ""}`;
}

async function sendEmailDirect(to: string, summary: string): Promise<void> {
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Wiza <wiza@eaziwage.com>",
      to,
      subject: "Your Wiza Financial Coaching Summary",
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1e293b;">
          <h2 style="color:#0f172a;">Your Wiza conversation summary</h2>
          <p style="color:#475569;">Here's what Wiza advised in your recent session:</p>
          <div style="background:#f8fafc;border-left:3px solid #10b981;padding:16px 20px;
                      border-radius:4px;white-space:pre-line;line-height:1.7;">
${summary}
          </div>
          <p style="color:#94a3b8;font-size:13px;margin-top:24px;">
            Wiza — EaziWage financial wellness coach
          </p>
        </div>
      `,
    }),
  });
}

async function sendSmsDirect(to: string, summary: string): Promise<void> {
  if (!process.env.AT_USERNAME || !process.env.AT_API_KEY) {
    throw new Error("SMS provider not configured");
  }
  const params = new URLSearchParams({
    username: process.env.AT_USERNAME,
    to,
    message: formatSmsText(summary),
  });
  if (process.env.AT_SENDER_ID) params.set("from", process.env.AT_SENDER_ID);

  const res = await fetch("https://api.africastalking.com/messages/v1/send", {
    method: "POST",
    headers: {
      apiKey: process.env.AT_API_KEY!,
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: params,
  });
  if (!res.ok) throw new Error("SMS send failed");
}

export async function POST(req: NextRequest) {
  // ── Rate limit ────────────────────────────────────────────────────────────
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";
  const rl = await checkRateLimit(rateLimiter, `summarize:${ip}`);
  if (!rl.success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: rl.headers }
    );
  }

  const authHeader = req.headers.get("Authorization");

  // ── Guest path ────────────────────────────────────────────────────────────
  if (!authHeader?.startsWith("Bearer ")) {
    let body: {
      messages?: { role: string; content: string }[];
      channel?: DeliveryChannel;
      address?: string;
    };
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const msgs = (body.messages ?? []).slice(0, 50); // cap at 50 messages
    if (!msgs.length) {
      return NextResponse.json(
        { error: "messages[] required for guest summary" },
        { status: 400 }
      );
    }

    const channel: DeliveryChannel = body.channel ?? "chat";
    const address = body.address?.trim();

    const transcript = buildTranscript(msgs);
    const summary = await generateSummary(transcript);

    if (channel === "email") {
      if (!address || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address)) {
        return NextResponse.json(
          { error: "A valid email address is required." },
          { status: 400 }
        );
      }
      await sendEmailDirect(address, summary);
      return NextResponse.json({ message: "Summary sent to your email!" });
    }

    if (channel === "sms") {
      if (!address || !/^\+\d{7,15}$/.test(address.replace(/\s/g, ""))) {
        return NextResponse.json(
          { error: "A valid phone number is required (e.g. +254712345678)." },
          { status: 400 }
        );
      }
      try {
        await sendSmsDirect(address.replace(/\s/g, ""), summary);
        return NextResponse.json({ message: "Summary sent to your phone!" });
      } catch {
        return NextResponse.json(
          { error: "SMS service unavailable. Try email instead." },
          { status: 503 }
        );
      }
    }

    // channel === 'chat': return inline
    return NextResponse.json({ summary });
  }

  // ── Authenticated path ────────────────────────────────────────────────────
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

  let body: {
    session_id?: string;
    channel?: DeliveryChannel;
    address?: string;
  };
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
    .select("id, employee_id, summary_sent, summary")
    .eq("id", body.session_id)
    .eq("employee_id", user.id)
    .single();

  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  const channel: DeliveryChannel = body.channel ?? "chat";
  const address = body.address?.trim();

  const { data: profile } = await supabase
    .from("profiles")
    .select("email, phone")
    .eq("id", user.id)
    .single();

  // ── Chat: generate inline ─────────────────────────────────────────────────
  if (channel === "chat") {
    // Re-use cached summary if available
    if (session.summary) {
      return NextResponse.json({ summary: session.summary });
    }

    const { data: msgs } = await supabase
      .from("wiza_messages")
      .select("role, content")
      .eq("session_id", body.session_id)
      .order("created_at", { ascending: true });

    if (!msgs?.length) {
      return NextResponse.json({ error: "No messages found" }, { status: 404 });
    }

    const transcript = buildTranscript(msgs);
    const summary = await generateSummary(transcript);

    await supabase
      .from("wiza_sessions")
      .update({ summary, summary_sent: true })
      .eq("id", body.session_id);

    return NextResponse.json({ summary });
  }

  // ── Email / SMS: queue background job ────────────────────────────────────
  if (session.summary_sent && !address) {
    return NextResponse.json({ message: "Summary already sent" });
  }

  const sendToEmail =
    channel === "email" ? (address || profile?.email || null) : null;
  const sendToPhone =
    channel === "sms" ? (address || profile?.phone || null) : null;

  if (channel === "email" && !sendToEmail) {
    return NextResponse.json(
      { error: "No email address available. Please enter one." },
      { status: 400 }
    );
  }
  if (channel === "sms" && !sendToPhone) {
    return NextResponse.json(
      { error: "No phone number available. Please enter one." },
      { status: 400 }
    );
  }

  await tasks.trigger<typeof summarizeWizaSession>("summarize-wiza-session", {
    session_id: body.session_id,
    employee_id: user.id,
    send_to_email: sendToEmail,
    send_to_phone: sendToPhone,
  });

  return NextResponse.json({
    message:
      channel === "email"
        ? "Summary on its way to your email!"
        : "Summary on its way to your phone!",
  });
}
