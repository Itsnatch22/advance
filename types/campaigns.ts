export type CampaignStatus = "draft" | "scheduled" | "sending" | "completed" | "failed";

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
}

export interface CampaignStats {
  total_recipients: number;
  sent_count: number;
  failed_count: number;
  queued_count: number;
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
