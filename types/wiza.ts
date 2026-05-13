export interface WizaSession {
  id: string;
  employee_id: string;
  title: string | null;
  summary: string | null;
  summary_sent: boolean;
  created_at: string;
  updated_at: string;
}

export interface WizaMessage {
  id: string;
  session_id: string;
  role: 'user' | 'model';
  content: string;
  created_at: string;
}

export interface SendMessageInput {
  session_id: string | null;
  content: string;
}

export type StreamEvent =
  | { type: 'session_id'; session_id: string }
  | { type: 'chunk';      text: string }
  | { type: 'done' }
  | { type: 'error';      message: string };

export interface SummarizeJobPayload {
  session_id: string;
  employee_id: string;
  send_to_email: string | null;
  send_to_phone: string | null;
}