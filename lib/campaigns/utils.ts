// Reuses the same sanitization patterns as app/api/admin/route.ts
const DANGEROUS_TAGS =
  /(<(script|iframe|object|embed|base|form)[^>]*>[\s\S]*?<\/\2>|<(script|iframe|object|embed|base|form)[^>]*\/?>)/gi;
const EVENT_ATTRS = /\s+on\w+\s*=\s*("([^"]*)"|'([^']*)'|[^\s>]+)/gi;
const JS_URLS = /(href|src|action)\s*=\s*["']?\s*javascript:[^"'\s>]*/gi;
const DATA_URIS = /(href|src)\s*=\s*["']data:[^"']*["']/gi;

export function sanitizeCampaignHtml(html: string): string {
  return html
    .replace(DANGEROUS_TAGS, "")
    .replace(EVENT_ATTRS, "")
    .replace(JS_URLS, "")
    .replace(DATA_URIS, "");
}

/** Replace {{full_name}} with the subscriber's first name, falling back to "there". */
export function interpolate(html: string, fullName: string | null | undefined): string {
  const firstName = fullName?.trim().split(/\s+/)[0] || "there";
  return html.replace(/\{\{full_name\}\}/g, firstName);
}

function escapeAttr(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Wraps sanitized + personalized campaign HTML in a full email shell:
 * EaziWage header → content → branded footer with one-click unsubscribe link.
 */
export function buildCampaignEmailHtml(
  contentHtml: string,
  subject: string,
  unsubscribeUrl: string,
  appUrl: string
): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="x-apple-disable-message-reformatting" />
  <title>${escapeAttr(subject)}</title>
</head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
          <tr>
            <td style="background:linear-gradient(135deg,#059669,#10b981);padding:24px 32px;text-align:center;">
              <img src="${appUrl}/eaziwage/EW-LOGO-DARK.png" alt="EaziWage" height="32"
                   style="height:32px;display:block;margin:0 auto;" />
            </td>
          </tr>
          <tr>
            <td style="padding:32px 32px 24px;">
              ${contentHtml}
            </td>
          </tr>
          <tr>
            <td style="background:#f9fafb;padding:20px 32px;text-align:center;border-top:1px solid #e5e7eb;">
              <p style="margin:0 0 6px;color:#9ca3af;font-size:11px;">
                You're receiving this because you subscribed to EaziWage updates.
              </p>
              <p style="margin:0;font-size:11px;">
                <a href="${unsubscribeUrl}" style="color:#059669;text-decoration:underline;">Unsubscribe</a>
                &nbsp;&middot;&nbsp;
                <a href="${appUrl}" style="color:#9ca3af;text-decoration:none;">eaziwage.com</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
