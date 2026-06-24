"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type ChatTransport, type UIMessage } from "ai";

export interface PublicSession {
  id: string;
  title: string;
  message_count: number;
  created_at: string;
  updated_at: string;
}

type PublicChatPart = {
  type: "text";
  text: string;
};

type PublicChatMessage = {
  id: string;
  role: "assistant" | "system" | "user";
  parts: PublicChatPart[];
  createdAt?: string;
  created_at?: string;
};

export type AttachmentData = {
  mimeType: string;
  base64: string;
};

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function createWelcomeMessage(
  createdAt = new Date().toISOString()
): PublicChatMessage {
  return {
    id: "welcome",
    role: "assistant",
    parts: [
      {
        type: "text",
        text: "Hi! I'm Wiza, your EaziWage AI assistant. How can I help you today?",
      },
    ],
    createdAt,
  };
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

export function useWizaWidgetChat() {
  const [visitorId, setVisitorId] = useState<string>("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const pendingAttachmentRef = useRef<AttachmentData | null>(null);
  const [sessions, setSessions] = useState<PublicSession[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);

  const fetchSessions = useCallback(
    async (vid?: string) => {
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
    [visitorId]
  );

  const stateContainer = useMemo(
    () => ({
      visitorId: "",
      sessionId: null as string | null,
      fetchSessions: (_vid?: string) => {
        return Promise.resolve();
      },
    }),
    []
  );

  useEffect(() => {
    stateContainer.visitorId = visitorId;
    stateContainer.sessionId = sessionId;
    stateContainer.fetchSessions = fetchSessions;
  }, [visitorId, sessionId, fetchSessions, stateContainer]);

  const transport = useMemo(
    () =>
      new DefaultChatTransport<UIMessage>({
        api: "/api/chat",

        fetch: async (url, init) => {
          const effectiveVisitorId =
            stateContainer.visitorId || getOrCreateVisitorId();
          if (effectiveVisitorId !== stateContainer.visitorId) {
            stateContainer.visitorId = effectiveVisitorId;
            setVisitorId(effectiveVisitorId);
          }

          const response = await globalThis.fetch(url as string, init);

          const sid = response.headers.get("X-Session-Id");
          const vid = response.headers.get("X-Visitor-Id");
          if (sid && sid !== stateContainer.sessionId) {
            setSessionId(sid);
            stateContainer.sessionId = sid;
            if (vid) stateContainer.fetchSessions(vid);
          }

          return response;
        },

        prepareSendMessagesRequest: ({ messages }) => {
          const att = pendingAttachmentRef.current;
          pendingAttachmentRef.current = null;
          return {
            body: {
              messages,
              visitor_id: stateContainer.visitorId || getOrCreateVisitorId(),
              session_id: stateContainer.sessionId,
              attachments: att ? [att] : [],
            },
          };
        },
      }),
    [stateContainer]
  );

  const chat = useChat({
    transport: transport as ChatTransport<UIMessage>,
    messages: [createWelcomeMessage() as unknown as UIMessage],
  });

  const startNewSession = useCallback(() => {
    setSessionId(null);
    stateContainer.sessionId = null;
    setHistoryLoaded(false);
    chat.setMessages([createWelcomeMessage() as unknown as UIMessage]);
  }, [chat, stateContainer]);

  useEffect(() => {
    const vid = getOrCreateVisitorId();
    stateContainer.visitorId = vid;
    setVisitorId(vid);
    fetchSessions(vid);
  }, []);

  const loadSession = useCallback(
    async (sid: string) => {
      setLoadingHistory(true);
      setHistoryLoaded(false);
      try {
        const res = await fetch(
          `/api/chat/history?session_id=${sid}&visitor_id=${visitorId}`
        );
        const data = await res.json();

        const loaded = [
          createWelcomeMessage(
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
    [visitorId, chat]
  );

  const deleteSession = useCallback(
    async (sid: string) => {
      await fetch(`/api/chat?session_id=${sid}&visitor_id=${visitorId}`, {
        method: "DELETE",
      });
      setSessions((prev) => prev.filter((s) => s.id !== sid));

      if (sid === sessionId) {
        startNewSession();
      }
    },
    [sessionId, visitorId, startNewSession]
  );

  const sendMessage = useCallback(
    async ({ text, attachment }: { text: string; attachment?: AttachmentData | null }) => {
      if (!text.trim() && !attachment) return;
      pendingAttachmentRef.current = attachment ?? null;
      const displayText = text.trim() || "[Attached file]";
      await (chat.sendMessage as (msg: { role: string; parts: { type: string; text: string }[] }) => Promise<void>)({
        role: "user",
        parts: [{ type: "text", text: displayText }],
      });
    },
    [chat]
  );

  const isLoading = chat.status === "submitted" || chat.status === "streaming";

  return {
    messages: chat.messages,
    sendMessage,
    regenerate: chat.regenerate,
    setMessages: chat.setMessages,
    status: chat.status,
    error: chat.error,
    isLoading,

    sessionId,
    sessions,
    visitorId,
    loadingHistory,
    historyLoaded,

    loadSession,
    deleteSession,
    startNewSession,
    refreshSessions: () => fetchSessions(),
  };
}
