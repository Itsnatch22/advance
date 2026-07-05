import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createUIMessageStream, createUIMessageStreamResponse } from "ai";
import { streamWizaReply, buildSystemPrompt, type AttachmentData } from "@/lib/ai/gemini";
import type { CountryCode } from "@/lib/currency/currency";
import { wizaStreamLimiter, checkRateLimit } from "@/lib/security/rate-limit";

const SUPPORTED_COUNTRIES: CountryCode[] = ["KE", "UG", "TZ", "RW"];

function detectCountry(req: NextRequest): CountryCode {
  const cf = req.headers.get("cf-ipcountry");
  if (cf && SUPPORTED_COUNTRIES.includes(cf as CountryCode)) return cf as CountryCode;

  const vercel = req.headers.get("x-vercel-ip-country");
  if (vercel && SUPPORTED_COUNTRIES.includes(vercel as CountryCode))
    return vercel as CountryCode;

  const lang = req.headers.get("accept-language") ?? "";
  if (lang.includes("-KE") || lang.includes("-ke")) return "KE";
  if (lang.includes("-UG") || lang.includes("-ug")) return "UG";
  if (lang.includes("-TZ") || lang.includes("-tz")) return "TZ";
  if (lang.includes("-RW") || lang.includes("-rw")) return "RW";

  return "KE";
}

function buildGuestHistoryFromMessages(
  rawMessages: unknown
): Array<{ role: string; parts: Array<{ text: string }> }> {
  if (!Array.isArray(rawMessages)) return [];
  return rawMessages
    .filter(
      (m: any) =>
        m?.id !== "welcome" && (m?.role === "user" || m?.role === "assistant")
    )
    .slice(0, -1) // exclude the current (latest) user message — it's the live turn
    .map((m: any) => {
      const text = Array.isArray(m.parts)
        ? m.parts
            .filter((p: any) => p?.type === "text" && typeof p.text === "string")
            .map((p: any) => p.text as string)
            .join("")
        : typeof m.content === "string"
          ? m.content
          : "";
      return {
        role: m.role === "user" ? "user" : "model",
        parts: [{ text }],
      };
    })
    .filter((m) => m.parts[0].text.length > 0);
}

const HISTORY_LIMIT = 20;

function extractLatestUserMessage(messages: unknown): string {
  if (!Array.isArray(messages)) return "";
  for (let i = messages.length - 1; i >= 0; i -= 1) {
    const message = messages[i] as {
      role?: string;
      parts?: Array<{ type?: string; text?: string }>;
    };
    if (message?.role !== "user") continue;
    if (!Array.isArray(message.parts)) continue;
    return message.parts
      .filter((part) => part?.type === "text" && typeof part.text === "string")
      .map((part) => part.text)
      .join(" ")
      .trim();
  }
  return "";
}

export async function POST(req: NextRequest) {
  // --- Env var guards (checked inside handler, not at module load time) ---
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    console.error("[wiza/stream] GOOGLE_GENERATIVE_AI_API_KEY is not configured");
    return new Response("AI service is not configured", { status: 503 });
  }
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error("[wiza/stream] Supabase env vars are not configured");
    return new Response("Service unavailable", { status: 503 });
  }
  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error("[wiza/stream] NEXT_PUBLIC_SUPABASE_ANON_KEY is not configured");
    return new Response("Service unavailable", { status: 503 });
  }

  // Build supabase client inside handler after env vars are confirmed present
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  // --- Rate limiting ---
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const rl = await checkRateLimit(wizaStreamLimiter, ip);
  if (!rl.success) return new Response("Rate limit exceeded", { status: 429, headers: rl.headers });

  const authHeader = req.headers.get("Authorization");
  let employeeAuthId: string | null = null;
  let employeeRecordId: string | null = null;
  let isAuthenticated = false;

  if (authHeader?.startsWith("Bearer ")) {
    const userClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      { global: { headers: { Authorization: authHeader } } }
    );
    const {
      data: { user },
    } = await userClient.auth.getUser();
    if (user) {
      employeeAuthId = user.id;
      isAuthenticated = true;
    }
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch (error) {
    console.error("[wiza/stream] JSON parse error:", error);
    return new Response(`Invalid JSON: ${error}`, { status: 400 });
  }

  // --- Unsafe body casting guards ---
  if (body.messages !== undefined && !Array.isArray(body.messages)) {
    return new Response("messages must be an array", { status: 400 });
  }
  if (body.rawContent !== undefined && typeof body.rawContent !== "string") {
    return new Response("rawContent must be a string", { status: 400 });
  }
  if (typeof body.rawContent === "string") {
    body.rawContent = body.rawContent.slice(0, 10000);
  }

  const incomingSessionId = body.session_id as string | null;
  const rawContent =
    typeof body.content === "string" && body.content.trim()
      ? body.content.trim()
      : extractLatestUserMessage(body.messages).trim();
  const isGif = rawContent.startsWith("__gif__");
  const content = isGif ? "[User shared a GIF]" : rawContent;

  // --- Attachment count/size limit ---
  const rawAttachments = Array.isArray(body.attachments) ? body.attachments : [];
  if (rawAttachments.length > 5) {
    return new Response("Too many attachments (max 5)", { status: 400 });
  }
  const MAX_TOTAL_ATTACHMENT_BYTES = 10 * 1024 * 1024; // 10 MB
  let totalAttachmentBytes = 0;
  for (const a of rawAttachments as { mimeType?: string; base64?: string }[]) {
    if (typeof a?.base64 === "string") {
      // base64 encodes ~4/3 bytes — approximate raw size
      totalAttachmentBytes += Math.ceil((a.base64.length * 3) / 4);
    }
  }
  if (totalAttachmentBytes > MAX_TOTAL_ATTACHMENT_BYTES) {
    return new Response("Attachments exceed 10 MB total", { status: 400 });
  }

  const attachments: AttachmentData[] = (rawAttachments as { mimeType?: string; base64?: string }[])
    .filter((a) => typeof a?.mimeType === "string" && typeof a?.base64 === "string")
    .map((a) => ({ mimeType: a.mimeType!, base64: a.base64! }));

  if (!rawContent) {
    return new Response("content is required", { status: 400 });
  }

  let systemPrompt: string;

  if (isAuthenticated && employeeAuthId) {
    const { data: employee, error: employeeErr } = await supabase
      .from("employees")
      .select(
        "id, full_name, monthly_salary, earned_wages, advance_limit, country, employer_id, kyc_status"
      )
      .eq("user_id", employeeAuthId)
      .single();

    if (employeeErr || !employee) {
      systemPrompt = buildSystemPrompt({
        employeeName: "there",
        earnedWages: 0,
        advanceLimit: 0,
        dailyRate: 0,
        daysElapsed: 0,
        paydayDate: null,
        upcomingAdvances: [],
        budgetCategories: null,
        financialScore: 0,
        countryCode: "KE",
        isGuest: true,
      });
    } else if (employee.kyc_status !== "approved") {
      employeeRecordId = employee.id;
      systemPrompt = buildSystemPrompt({
        employeeName: employee.full_name ?? "there",
        earnedWages: 0,
        advanceLimit: 0,
        dailyRate: 0,
        daysElapsed: 0,
        paydayDate: null,
        upcomingAdvances: [],
        budgetCategories: null,
        financialScore: 0,
        countryCode: (employee.country ?? "KE") as CountryCode,
        isGuest: true,
        pendingKyc: true,
      });
    } else {
      employeeRecordId = employee.id;
      const { data: snapshot } = await supabase
        .from("earnings_snapshots")
        .select(
          "earned_to_date, remaining_withdrawable, daily_rate, days_elapsed, payday_date, " +
            "withdrawable_amount, withdrawn_this_month, current_salary, pay_period_start, pay_period_end"
        )
        .eq("employee_id", employee.id)
        .eq("is_current", true)
        .single();

      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

      const { data: recentAdvances } = await supabase
        .from("advances")
        .select(
          "amount, net_amount, fee_amount, status, requested_at, currency"
        )
        .eq("employee_id", employee.id)
        .gte("requested_at", threeMonthsAgo.toISOString())
        .order("requested_at", { ascending: false })
        .limit(5);

      const { data: budget } = await supabase
        .from("user_budgets")
        .select("monthly_income, categories")
        .eq("user_id", employeeAuthId)
        .single();

      const earnedWages =
        (snapshot as { remaining_withdrawable?: number })
          ?.remaining_withdrawable ??
        employee.earned_wages ??
        0;

      const advanceLimit = employee.advance_limit ?? 0;
      const dailyRate = (snapshot as { daily_rate?: number })?.daily_rate ?? 0;
      const daysElapsed =
        (snapshot as { days_elapsed?: number })?.days_elapsed ?? 0;
      const paydayDate =
        (snapshot as { payday_date?: string })?.payday_date ?? null;

      systemPrompt = buildSystemPrompt({
        employeeName: employee.full_name,
        earnedWages,
        advanceLimit,
        dailyRate,
        daysElapsed,
        paydayDate,
        upcomingAdvances: recentAdvances ?? [],
        budgetCategories: budget?.categories ?? null,
        financialScore: 0,
        countryCode: (employee.country ?? "KE") as CountryCode,
        isGuest: false,
      });
    }
  } else {
    systemPrompt = buildSystemPrompt({
      employeeName: "there",
      earnedWages: 0,
      advanceLimit: 0,
      dailyRate: 0,
      daysElapsed: 0,
      paydayDate: null,
      upcomingAdvances: [],
      budgetCategories: null,
      financialScore: 0,
      countryCode: detectCountry(req),
      isGuest: true,
    });
  }

  let sessionId = incomingSessionId;

  if (isAuthenticated && employeeAuthId) {
    if (!sessionId) {
      const { data: newSession, error: sessionErr } = await supabase
        .from("wiza_sessions")
        .insert({
          employee_id: employeeAuthId,
          employee_live_id: employeeRecordId,
          title: content.slice(0, 80),
        })
        .select("id")
        .single();

      if (sessionErr || !newSession) {
        console.error("[wiza/stream] Failed to create session:", sessionErr);
        return new Response("Failed to create session", { status: 500 });
      }
      sessionId = newSession.id;
    } else {
      // --- Session ownership verification (guest-provided session_id) ---
      // Confirm the session belongs to the authenticated user before inserting messages.
      const { data: existingSession, error: sessionFetchErr } = await supabase
        .from("wiza_sessions")
        .select("employee_id")
        .eq("id", sessionId)
        .single();

      if (sessionFetchErr || !existingSession) {
        console.error("[wiza/stream] Session not found:", sessionId, sessionFetchErr);
        return new Response("Session not found", { status: 404 });
      }

      if (existingSession.employee_id !== employeeAuthId) {
        console.error("[wiza/stream] Session ownership mismatch for session:", sessionId);
        return new Response("Forbidden", { status: 403 });
      }
    }

    await supabase.from("wiza_messages").insert({
      session_id: sessionId,
      role: "user",
      content,
    });
  }

  let geminiHistory: Array<{ role: string; parts: Array<{ text: string }> }> =
    [];

  if (isAuthenticated && employeeAuthId && sessionId) {
    const { data: history } = await supabase
      .from("wiza_messages")
      .select("role, content")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: true })
      .limit(HISTORY_LIMIT);

    geminiHistory = (history ?? []).slice(0, -1).map((m) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }],
    }));
  } else if (!isAuthenticated) {
    // Guest: build history from the client-sent messages array so Wiza
    // remembers what was said earlier in the browser session.
    geminiHistory = buildGuestHistoryFromMessages(body.messages);
  }

  const stream = createUIMessageStream({
    execute: async ({ writer }) => {
      try {
        writer.write({ type: "start" });
        writer.write({ type: "text-start", id: "assistant-text" });

        let fullReply = "";
        for await (const chunk of streamWizaReply(
          systemPrompt,
          geminiHistory,
          content,
          attachments.length ? attachments : undefined
        )) {
          fullReply += chunk;
          writer.write({
            type: "text-delta",
            id: "assistant-text",
            delta: chunk,
          });
        }

        writer.write({ type: "text-end", id: "assistant-text" });
        writer.write({ type: "finish" });

        if (isAuthenticated && employeeAuthId && sessionId) {
          await supabase.from("wiza_messages").insert({
            session_id: sessionId,
            role: "model",
            content: fullReply,
          });

          await supabase
            .from("wiza_sessions")
            .update({ updated_at: new Date().toISOString() })
            .eq("id", sessionId);
        }
      } catch (err) {
        console.error("[wiza/stream] streaming error:", err);
        writer.write({ type: "text-start", id: "assistant-text" });
        writer.write({
          type: "text-delta",
          id: "assistant-text",
          delta: "Something went wrong. Please try again.",
        });
        writer.write({ type: "text-end", id: "assistant-text" });
        writer.write({ type: "finish" });
      }
    },
  });

  const response = createUIMessageStreamResponse({ stream });
  response.headers.set("Content-Type", "text/event-stream");
  response.headers.set("Cache-Control", "no-cache, no-transform");
  response.headers.set("Connection", "keep-alive");
  response.headers.set("X-Accel-Buffering", "no");

  if (sessionId && isAuthenticated) {
    response.headers.set("X-Session-Id", sessionId);
  }

  return response;
}
