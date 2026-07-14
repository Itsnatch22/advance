"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type ChatTransport, type UIMessage } from "ai";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export type DeliveryChannel = "chat" | "email" | "sms";
export type ChatMode = "coach" | "widget";

export type AttachmentData = {
  mimeType: string;
  base64: string;
};

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  content: string;
  pending: boolean;
  createdAt: string;
}

export interface PublicSession {
  id: string;
  title: string;
  message_count: number;
  created_at: string;
  updated_at: string;
}

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function createWelcomeMessage(
  mode: ChatMode = "widget",
  createdAt?: string
): UIMessage {
  const text =
    mode === "coach"
      ? "Hi! I'm Wiza, your financial coach. Ask me about salary advances, budgeting, and cash flow, and I'll help you make sense of it."
      : "Hi! I'm Wiza, your EaziWage AI assistant. How can I help you today?";

  return {
    id: "welcome",
    role: "assistant",
    parts: [{ type: "text", text }],
    createdAt,
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

function getOrCreateVisitorId(): string {
  if (typeof window === "undefined") return "";
  const key = "wiza_visitor_id";
  let id = localStorage.getItem(key);
  if (!id || !UUID_PATTERN.test(id)) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
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

export interface UseWizaChatOptions {
  mode: ChatMode;
  apiEndpoint?: string;
}

export interface UseWizaChatReturn {
  messages: ChatMessage[];
  sessionId: string | null;
  visitorId?: string;
  streaming: boolean;
  error: string | null;
  sendMessage: (content: string, attachment?: AttachmentData | null) => Promise<void>;
  requestSummary?: (channel: DeliveryChannel, address?: string) => Promise<string>;
  newSession: () => void;
  regenerate?: () => Promise<void>;
  sessions?: PublicSession[];
  loadingHistory?: boolean;
  historyLoaded?: boolean;
  loadSession?: (sid: string) => Promise<void>;
  deleteSession?: (sid: string) => Promise<void>;
  refreshSessions?: () => Promise<void>;
  setMessages?: (messages: UIMessage[]) => void;
}

export function useWizaChat(options: UseWizaChatOptions): UseWizaChatReturn {
  const { mode = "widget", apiEndpoint = mode === "coach" ? "/api/wiza/stream" : "/api/chat" } = options;
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [visitorId, setVisitorId] = useState<string>("");
  const [sessions, setSessions] = useState<PublicSession[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const sessionContainer = useMemo(() => ({ id: null as string | null, visitorId: "" }), []);
  const pendingAttachmentRef = useRef<AttachmentData | null>(null);

  const fetchSessions = useCallback(
    async (vid?: string) => {
      if (mode !== "widget") return;
      const id = vid ?? visitorId;
      if (!id) return;
      try {
        const res = await fetch(`/api/chat?visitor_id=${id}`);
        const data = await res.json();
        setSessions(data.sessions ?? []);
      } catch {
        /* silent */
      }
    },
    [mode, visitorId]
  );

  const transport = useMemo(
    () =>
      // eslint-disable-next-line react-hooks/refs -- Transport callbacks read refs later during send/fetch, not during render.
      new DefaultChatTransport<UIMessage>({
        api: apiEndpoint,
        fetch: async (url, init) => {
          const authHeader = mode === "coach" ? await getAuthHeader() : {};
          const effectiveVisitorId =
            mode === "widget" ? sessionContainer.visitorId || getOrCreateVisitorId() : "";

          if (mode === "widget" && effectiveVisitorId !== sessionContainer.visitorId) {
            sessionContainer.visitorId = effectiveVisitorId;
            setVisitorId(effectiveVisitorId);
          }

          const response = await globalThis.fetch(url as string, {
            ...init,
            headers: {
              ...(init?.headers as Record<string, string>),
              ...authHeader,
            },
          });

          const sid = response.headers.get("X-Session-Id");
          const vid = response.headers.get("X-Visitor-Id");
          if (sid && sid !== sessionContainer.id) {
            sessionContainer.id = sid;
            setSessionId(sid);
            if (mode === "widget" && vid) fetchSessions(vid);
          }

          return response;
        },
        prepareSendMessagesRequest: ({ messages }) => {
          const att = pendingAttachmentRef.current;
          pendingAttachmentRef.current = null;

          if (mode === "coach") {
            return {
              body: {
                messages,
                session_id: sessionContainer.id,
                attachments: att ? [att] : [],
              },
            };
          }

          return {
            body: {
              messages,
              visitor_id: sessionContainer.visitorId || getOrCreateVisitorId(),
              session_id: sessionContainer.id,
              attachments: att ? [att] : [],
            },
          };
        },
      }),
    [mode, apiEndpoint, sessionContainer, fetchSessions]
  );

  const chat = useChat({
    transport: transport as ChatTransport<UIMessage>,
    messages: [createWelcomeMessage(mode) as unknown as UIMessage],
  });

  const messages = useMemo(() => {
    const visibleMessages = chat.messages.filter(
      (message) => message.role === "user" || message.role === "assistant"
    );

    return visibleMessages.map((message, index) => {
      const content = getMessageText(message);
      const role: ChatMessage["role"] =
        message.role === "user" ? "user" : "model";
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
    async (content: string, attachment?: AttachmentData | null) => {
      if (!content.trim() && !attachment) return;
      if (chat.status === "streaming") return;
      pendingAttachmentRef.current = attachment ?? null;
      const text = content.trim() || "[Attached file]";
      await chat.sendMessage({
        role: "user",
        parts: [{ type: "text", text }],
      } as any);
    },
    [chat]
  );

  const requestSummary = useCallback(
    async (channel: DeliveryChannel = "chat", address?: string): Promise<string> => {
      if (mode !== "coach") return "Not available in widget mode";
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
    [mode, chat, messages, sessionId]
  );

  const newSession = useCallback(() => {
    sessionContainer.id = null;
    setSessionId(null);
    setHistoryLoaded(false);
    chat.setMessages([createWelcomeMessage(mode) as unknown as UIMessage]);
  }, [chat, sessionContainer, mode]);

  const loadSession = useCallback(
    async (sid: string) => {
      if (mode !== "widget") return;
      setLoadingHistory(true);
      setHistoryLoaded(false);
      try {
        const res = await fetch(
          `/api/chat/history?session_id=${sid}&visitor_id=${visitorId}`
        );
        const data = await res.json();

        const loaded = [
          createWelcomeMessage(
            mode,
            data.messages?.[0]?.created_at ?? new Date().toISOString()
          ),
          ...(data.messages ?? []).map(
            (m: {
              id: string;
              role: string;
              content: string;
              created_at: string;
            }) => ({
              id: m.id,
              role: m.role as "assistant" | "system" | "user",
              parts: [{ type: "text" as const, text: m.content }],
              createdAt: m.created_at,
            })
          ),
        ];

        chat.setMessages(loaded);
        setSessionId(sid);
        setHistoryLoaded(true);
      } catch {
        /* silent */
      } finally {
        setLoadingHistory(false);
      }
    },
    [mode, visitorId, chat]
  );

  const deleteSession = useCallback(
    async (sid: string) => {
      if (mode !== "widget") return;
      await fetch(`/api/chat?session_id=${sid}&visitor_id=${visitorId}`, {
        method: "DELETE",
      });
      setSessions((prev) => prev.filter((s) => s.id !== sid));

      if (sid === sessionId) {
        newSession();
      }
    },
    [mode, sessionId, visitorId, newSession]
  );

  // Initialize widget mode
  useEffect(() => {
    if (mode === "widget") {
      const vid = getOrCreateVisitorId();
      sessionContainer.visitorId = vid;
      setVisitorId(vid);
      fetchSessions(vid);
    }
  }, [mode, sessionContainer, fetchSessions]);

  return {
    messages,
    sessionId,
    visitorId: mode === "widget" ? visitorId : undefined,
    streaming: chat.status === "streaming",
    error:
      typeof chat.error === "string"
        ? chat.error
        : (chat.error?.message ?? null),
    sendMessage,
    requestSummary: mode === "coach" ? requestSummary : undefined,
    newSession,
    regenerate: chat.regenerate,
    sessions: mode === "widget" ? sessions : undefined,
    loadingHistory: mode === "widget" ? loadingHistory : undefined,
    historyLoaded: mode === "widget" ? historyLoaded : undefined,
    loadSession: mode === "widget" ? loadSession : undefined,
    deleteSession: mode === "widget" ? deleteSession : undefined,
    refreshSessions:
      mode === "widget" ? () => fetchSessions() : undefined,
    setMessages: chat.setMessages,
  };
}
