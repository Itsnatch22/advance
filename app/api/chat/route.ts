import {
  createUIMessageStream,
  createUIMessageStreamResponse,
  type UIMessage,
} from "ai";
import { NextRequest } from "next/server";
import { supabaseServer } from "@/lib/supabase/supabase-server";
import {
  extractLatestUserMessage,
  getChatReply,
  getOrCreateSession,
  getUuidString,
  saveMessages,
} from "@/lib/ai/wiza-chat";

export const maxDuration = 30;

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const body = await req.json();
    const safeMessages: UIMessage[] = Array.isArray(body.messages)
      ? body.messages
      : [];
    const visitorId = getUuidString(body.visitor_id) ?? crypto.randomUUID();
    const sessionId = getUuidString(body.session_id);
    const attachments = Array.isArray(body.attachments)
      ? (body.attachments as { mimeType?: string; base64?: string }[])
          .filter((a) => typeof a?.mimeType === "string" && typeof a?.base64 === "string")
          .map((a) => ({ mimeType: a.mimeType!, base64: a.base64! }))
      : [];

    const latestUserQuery = extractLatestUserMessage(safeMessages);
    const reply = await getChatReply(
      safeMessages,
      process.env.COHERE_API_KEY ?? "",
      attachments.length ? attachments : undefined
    );

    let resolvedSessionId: string | null = sessionId;
    try {
      resolvedSessionId = await getOrCreateSession(
        visitorId,
        sessionId,
        latestUserQuery
      );
      if (resolvedSessionId) {
        await saveMessages(resolvedSessionId, latestUserQuery, reply);
      }
    } catch (dbErr) {
      console.error("[wiza/chat] Supabase error", dbErr);
    }

    const stream = createUIMessageStream({
      execute: ({ writer }) => {
        const textId = "assistant-text";
        writer.write({ type: "start" });
        writer.write({ type: "text-start", id: textId });
        writer.write({ type: "text-delta", id: textId, delta: reply });
        writer.write({ type: "text-end", id: textId });
        writer.write({ type: "finish" });
      },
    });

    const response = createUIMessageStreamResponse({ stream });
    response.headers.set("X-Session-Id", resolvedSessionId ?? "");
    response.headers.set("X-Visitor-Id", visitorId);
    return response;
  } catch (err) {
    console.error("Wiza chat error", err);
    const stream = createUIMessageStream({
      execute: ({ writer }) => {
        const id = "err";
        writer.write({ type: "start" });
        writer.write({ type: "text-start", id });
        writer.write({
          type: "text-delta",
          id,
          delta:
            "Sorry, something went wrong. Please contact support@eaziwage.com",
        });
        writer.write({ type: "text-end", id });
        writer.write({ type: "finish" });
      },
    });
    return createUIMessageStreamResponse({ stream });
  }
}

export async function GET(req: NextRequest): Promise<Response> {
  const visitorId = getUuidString(req.nextUrl.searchParams.get("visitor_id"));
  if (!visitorId) return Response.json({ sessions: [] });

  const { data } = await supabaseServer
    .from("wiza_public_sessions")
    .select("id, title, message_count, created_at, updated_at")
    .eq("visitor_id", visitorId)
    .order("updated_at", { ascending: false })
    .limit(50);

  return Response.json({ sessions: data ?? [] });
}

export async function DELETE(req: NextRequest): Promise<Response> {
  const sessionId = getUuidString(req.nextUrl.searchParams.get("session_id"));
  const visitorId = getUuidString(req.nextUrl.searchParams.get("visitor_id"));
  if (!sessionId || !visitorId)
    return Response.json({ error: "Missing params" }, { status: 400 });

  const { error } = await supabaseServer
    .from("wiza_public_sessions")
    .delete()
    .eq("id", sessionId)
    .eq("visitor_id", visitorId);

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ deleted: true });
}
