'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useChat } from '@ai-sdk/react';
import type { ChatTransport, UIMessage } from 'ai';

export interface PublicSession {
  id:            string;
  title:         string;
  message_count: number;
  created_at:    string;
  updated_at:    string;
}

type PublicChatPart = {
  type: 'text';
  text: string;
};

type PublicChatMessage = {
  id: string;
  role: 'assistant' | 'system' | 'user';
  parts: PublicChatPart[];
  createdAt?: string;
  created_at?: string;
};

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function createWelcomeMessage(createdAt = new Date().toISOString()): PublicChatMessage {
  return {
    id: 'welcome',
    role: 'assistant',
    parts: [{ type: 'text', text: "Hi! I'm Wiza, your EaziWage AI assistant. How can I help you today?" }],
    createdAt,
  };
}

function getOrCreateVisitorId(): string {
  if (typeof window === 'undefined') return '';
  const key = 'wiza_visitor_id';
  let id = localStorage.getItem(key);
  if (!id || !UUID_PATTERN.test(id)) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
}

export function useWizaPublicChat() {
  const [visitorId,      setVisitorId]      = useState<string>('');
  const [sessionId,      setSessionId]      = useState<string | null>(null);
  const [sessions,       setSessions]       = useState<PublicSession[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [historyLoaded,  setHistoryLoaded]  = useState(false);
  const messageTimestampsRef = useRef<Record<string, string>>({});
  const visitorIdRef = useRef<string>('');

  const sessionIdRef = useRef<string | null>(null);
  visitorIdRef.current = visitorId;
  sessionIdRef.current = sessionId;

  class CustomChatTransport {
    async sendMessages({
      messages,
      options,
    }: {
      messages: unknown[];
      options?: Record<string, unknown>;
    }) {
      const effectiveVisitorId = visitorIdRef.current || getOrCreateVisitorId();
      if (effectiveVisitorId !== visitorIdRef.current) {
        visitorIdRef.current = effectiveVisitorId;
        setVisitorId(effectiveVisitorId);
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...options,
          messages,
          visitor_id: effectiveVisitorId,
          session_id: sessionIdRef.current,
        }),
      });

      // Read session_id back from response headers
      const sid = response.headers.get('X-Session-Id');
      const vid = response.headers.get('X-Visitor-Id');
      if (sid && sid !== sessionIdRef.current) {
        setSessionId(sid);
        sessionIdRef.current = sid;
        // Refresh session list so new session appears in sidebar
        if (vid) fetchSessions(vid);
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.body as ReadableStream<unknown>;
    }

    async reconnectToStream(): Promise<ReadableStream<unknown> | null> {
      // Not implemented for this simple HTTP transport
      // This method is required by the ChatTransport interface
      return null;
    }
  }

  const chat = useChat({
    transport: new CustomChatTransport() as unknown as ChatTransport<UIMessage>,
    messages: [
      createWelcomeMessage(),
    ],
  });

  useEffect(() => {
    const nextMessages = (chat.messages as PublicChatMessage[]).map((message, index) => {
      const existingTimestamp = message.createdAt ?? message.created_at;
      if (existingTimestamp) {
        messageTimestampsRef.current[message.id] = existingTimestamp;
        return message;
      }

      const fallbackTimestamp =
        messageTimestampsRef.current[message.id] ??
        new Date(Date.now() + index).toISOString();

      messageTimestampsRef.current[message.id] = fallbackTimestamp;
      return { ...message, createdAt: fallbackTimestamp };
    });

    const changed = nextMessages.some((message, index) => message !== chat.messages[index]);
    if (changed) {
      chat.setMessages(nextMessages);
    }
  }, [chat.messages, chat.setMessages]);

  useEffect(() => {
    const vid = getOrCreateVisitorId();
    visitorIdRef.current = vid;
    setVisitorId(vid);
    fetchSessions(vid);
  }, []);

  const fetchSessions = useCallback(async (vid?: string) => {
    const id = vid ?? visitorId;
    if (!id) return;
    try {
      const res  = await fetch(`/api/chat?visitor_id=${id}`);
      const data = await res.json();
      setSessions(data.sessions ?? []);
    } catch { /* silent */ }
  }, [visitorId]);

  const loadSession = useCallback(async (sid: string) => {
    setLoadingHistory(true);
    setHistoryLoaded(false);
    try {
      const res  = await fetch(`/api/chat/history?session_id=${sid}&visitor_id=${visitorId}`);
      const data = await res.json();

      const loaded = [
        createWelcomeMessage(data.messages?.[0]?.created_at ?? new Date().toISOString()),
        ...(data.messages ?? []).map((m: { id: string; role: string; content: string; created_at: string }) => ({
          id:    m.id,
          role:  m.role as 'assistant' | 'system' | 'user',
          parts: [{ type: 'text', text: m.content }],
          createdAt: m.created_at,
        })),
      ];

      chat.setMessages(loaded);
      setSessionId(sid);
      setHistoryLoaded(true);
    } catch { /* silent */ } finally {
      setLoadingHistory(false);
    }
  }, [visitorId, chat]);

  const deleteSession = useCallback(async (sid: string) => {
    await fetch(`/api/chat?session_id=${sid}&visitor_id=${visitorId}`, { method: 'DELETE' });
    setSessions(prev => prev.filter(s => s.id !== sid));

    // If deleting the active session, start fresh
    if (sid === sessionId) {
      startNewSession();
    }
  }, [sessionId, visitorId]);

  // ── Start a brand-new conversation ──────────────────────────────────
  const startNewSession = useCallback(() => {
    setSessionId(null);
    sessionIdRef.current = null;
    setHistoryLoaded(false);
    chat.setMessages([createWelcomeMessage()]);
  }, [chat]);

  const isLoading = chat.status === 'submitted' || chat.status === 'streaming';

  return {
    // Chat
    messages:      chat.messages,
    sendMessage:   chat.sendMessage,
    regenerate:    chat.regenerate,
    setMessages:   chat.setMessages,
    status:        chat.status,
    error:         chat.error,
    isLoading,
    // Session
    sessionId,
    sessions,
    visitorId,
    loadingHistory,
    historyLoaded,
    // Actions
    loadSession,
    deleteSession,
    startNewSession,
    refreshSessions: () => fetchSessions(),
  };
}
