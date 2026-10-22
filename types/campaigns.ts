export type CampaignStatus =
  "draft" | "scheduled" | "sending" | "completed" | "failed";

export interface EmailCampaign {
  id: string;
  subject: string;
  title: string;
  html_content: string;
  plain_text_content: string | null;
  status: CampaignStatus;
  created_by: string;
  created_at: string;
  updated_at: string;
  scheduled_at: string | null;
  sent_at: string | null;
  total_recipients: number | null;
  sent_count: number;
  failed_count: number;
  template_key: string | null;
  audience_filter: {
    segment?: "all" | "active" | "recent" | "manual";
    emails?: string[];
  } | null;
  ab_test_subject_b: string | null;
  ab_test_percent: number;
}

export interface CampaignStats {
  total_recipients: number;
  sent_count: number;
  failed_count: number;
  queued_count: number;
  bounced_count: number;
  delivery_rate: number;
}

export interface EmailCampaignLog {
  id: string;
  campaign_id: string;
  recipient_email: string;
  delivery_status: string;
  sent_at: string | null;
  error_message: string | null;
  created_at: string;
}

export interface EmailCampaignAuditLog {
  id: string;
  campaign_id: string;
  actor_id: string | null;
  action: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface CampaignTemplate {
  id: string;
  name: string;
  html_content: string;
  plain_text_content: string | null;
}

export interface CampaignRecipientList {
  id: string;
  name: string;
}

export interface CampaignRecipientListMember {
  email: string;
  subscriber_id: string | null;
}
