// hooks/useWizaPublicChat.ts
// Manages visitor identity, session list, history loading, and delete.
// No auth required — visitor_id is a UUID stored in localStorage.

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useChat } from '@ai-sdk/react';

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

function createWelcomeMessage(createdAt = new Date().toISOString()): PublicChatMessage {
  return {
    id: 'welcome',
    role: 'assistant',
    parts: [{ type: 'text', text: "Hi! I'm Wiza, your EaziWage AI assistant. How can I help you today?" }],
    createdAt,
  };
}

// ── Visitor ID — create once, persist forever ─────────────────────────────
function getOrCreateVisitorId(): string {
  if (typeof window === 'undefined') return '';
  const key = 'wiza_visitor_id';
  let id = localStorage.getItem(key);
  if (!id) {
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

  // Track current session so we can send it with each message
  const sessionIdRef = useRef<string | null>(null);
  sessionIdRef.current = sessionId;

  // ── Custom transport to handle response headers ───────────────────────
  class CustomChatTransport {
    async sendMessages({
      messages,
      options,
    }: {
      messages: any[];
      options?: any;
    }) {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages,
          visitor_id: visitorId,
          session_id: sessionIdRef.current,
          ...options,
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

      return response.json();
    }

    async reconnectToStream(): Promise<ReadableStream<any> | null> {
      // Not implemented for this simple HTTP transport
      // This method is required by the ChatTransport interface
      return null;
    }
  }

  // ── AI SDK useChat — keep all existing transport logic intact ─────────
  const chat = useChat({
    transport: new CustomChatTransport() as any,
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

  // ── Init visitor ID on mount ─────────────────────────────────────────
  useEffect(() => {
    const vid = getOrCreateVisitorId();
    setVisitorId(vid);
    fetchSessions(vid);
  }, []);

  // ── Fetch session list ───────────────────────────────────────────────
  const fetchSessions = useCallback(async (vid?: string) => {
    const id = vid ?? visitorId;
    if (!id) return;
    try {
      const res  = await fetch(`/api/chat?visitor_id=${id}`);
      const data = await res.json();
      setSessions(data.sessions ?? []);
    } catch { /* silent */ }
  }, [visitorId]);

  // ── Load a past session's messages ──────────────────────────────────
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

  // ── Delete a session ─────────────────────────────────────────────────
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
