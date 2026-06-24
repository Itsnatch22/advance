"use client";

import { useCallback, useMemo, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type ChatTransport, type UIMessage } from "ai";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export type DeliveryChannel = "chat" | "email" | "sms";

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  content: string;
  pending: boolean;
  createdAt: string;
}

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function createWelcomeMessage(): UIMessage {
  return {
    id: "welcome",
    role: "assistant",
    parts: [
      {
        type: "text",
        text: "Hi! I'm Wiza, your financial coach. Ask me about salary advances, budgeting, and cash flow, and I'll help you make sense of it.",
      },
    ],
  } as unknown as UIMessage;
}

function getMessageText(message: UIMessage): string {
  if (!Array.isArray(message.parts)) return "";
  return message.parts
    .filter((part) => part && typeof part === "object" && "text" in part)
    .map((part) => (part as { text?: string }).text ?? "")
    .join("")
    .trim();
}

function normalizeMessageId(id: unknown): string {
  if (typeof id === "string" && UUID_PATTERN.test(id)) return id;
  return crypto.randomUUID();
}

async function getAuthHeader(): Promise<Record<string, string>> {
  try {
    const { data: { session } } = await getSupabaseBrowserClient().auth.getSession();
    if (session?.access_token) {
      return { Authorization: `Bearer ${session.access_token}` };
    }
  } catch {
    // no session — proceed as guest
  }
  return {};
}

export function useWizaCoachChat() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const sessionContainer = useMemo(() => ({ id: null as string | null }), []);

  const transport = useMemo(
    () =>
      new DefaultChatTransport<UIMessage>({
        api: "/api/wiza/stream",
        fetch: async (url, init) => {
          const authHeader = await getAuthHeader();
          const response = await globalThis.fetch(url as string, {
            ...init,
            headers: {
              ...(init?.headers as Record<string, string>),
              ...authHeader,
            },
          });
          const sid = response.headers.get("X-Session-Id");
          if (sid && sid !== sessionContainer.id) {
            sessionContainer.id = sid;
            setSessionId(sid);
          }
          return response;
        },
        prepareSendMessagesRequest: ({ messages }) => ({
          body: {
            messages,
            session_id: sessionContainer.id,
          },
        }),
      }),
    [sessionContainer]
  );

  const chat = useChat({
    transport: transport as ChatTransport<UIMessage>,
    messages: [createWelcomeMessage() as unknown as UIMessage],
  });

  const messages = useMemo(() => {
    const visibleMessages = chat.messages.filter(
      (message) => message.role === "user" || message.role === "assistant"
    );

    return visibleMessages.map((message, index) => {
      const content = getMessageText(message);
      const role = message.role === "user" ? "user" : "model";
      const pending =
        chat.status === "streaming" &&
        index === visibleMessages.length - 1 &&
        message.role === "assistant";
      const createdAt =
        typeof (message as any).createdAt === "string"
          ? (message as any).createdAt
          : new Date().toISOString();

      return {
        id: normalizeMessageId(message.id),
        role,
        content,
        pending,
        createdAt,
      };
    });
  }, [chat.messages, chat.status]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || chat.status === "streaming") return;
      await chat.sendMessage({
        role: "user",
        parts: [{ type: "text", text: content }],
      } as any);
    },
    [chat]
  );

  const requestSummary = useCallback(
    async (channel: DeliveryChannel = "chat", address?: string): Promise<string> => {
      const completedMessages = messages.filter((message) => !message.pending);
      if (!completedMessages.length) return "Nothing to summarise yet.";

      try {
        const authHeader = await getAuthHeader();
        const res = await fetch("/api/wiza/summarize", {
          method: "POST",
          headers: { "Content-Type": "application/json", ...authHeader },
          body: JSON.stringify({
            session_id: sessionId,
            channel,
            address: address?.trim() || undefined,
            messages: completedMessages.map((message) => ({
              role: message.role === "user" ? "user" : "assistant",
              content: message.content,
            })),
          }),
        });

        const json = await res.json();

        if (json.summary) {
          chat.setMessages((current) => [
            ...current,
            {
              id: crypto.randomUUID(),
              role: "assistant",
              parts: [
                {
                  type: "text",
                  text: `📋 **Session Summary**\n\n${json.summary}`,
                },
              ],
            } as unknown as UIMessage,
          ]);
          return "Summary ready!";
        }

        return json.message ?? json.error ?? "Could not generate summary.";
      } catch {
        return "Failed to generate summary. Please try again.";
      }
    },
    [chat, messages, sessionId]
  );

  const newSession = useCallback(() => {
    sessionContainer.id = null;
    setSessionId(null);
    chat.setMessages([createWelcomeMessage() as unknown as UIMessage]);
  }, [chat, sessionContainer]);

  return {
    messages,
    sessionId,
    streaming: chat.status === "streaming",
    error:
      typeof chat.error === "string"
        ? chat.error
        : (chat.error?.message ?? null),
    sendMessage,
    requestSummary,
    newSession,
    regenerate: chat.regenerate,
  };
}
