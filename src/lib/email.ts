import { Resend } from "resend";

/**
 * Shared email/Resend helpers for all form + commerce API routes.
 * Centralizes the Resend client, address config, validation and — critically —
 * HTML escaping so user-supplied input can never inject markup into the
 * notification emails we send to ourselves.
 */

export const TO = process.env.CONTACT_EMAIL ?? "contato@paxbrasiliana.com";
export const FROM = process.env.FROM_EMAIL ?? "noreply@paxbrasiliana.com";
export const AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID ?? "";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://paxbrasiliana.com";

/** Single Resend client per request. Returns null when no API key is set. */
export function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value: unknown): value is string {
  return typeof value === "string" && EMAIL_RE.test(value.trim());
}

/**
 * Escape HTML-significant characters so user input is rendered as text, not
 * markup, inside our email templates. Coerces non-strings and trims.
 */
export function esc(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Trim a string field, returning "" for anything non-stringy. */
export function clean(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

/**
 * Add a contact to the Resend audience. Never throws: a missing audience,
 * an already-subscribed email, or any Resend error is swallowed and logged so
 * it cannot fail the user-facing form submission.
 */
export async function addToAudience(
  resend: Resend,
  opts: { email: string; firstName?: string; lastName?: string }
): Promise<void> {
  if (!AUDIENCE_ID) return;
  try {
    await resend.contacts.create({
      audienceId: AUDIENCE_ID,
      email: opts.email,
      firstName: opts.firstName || undefined,
      lastName: opts.lastName || undefined,
      unsubscribed: false,
    });
  } catch (err) {
    // Duplicate contact / transient errors must not break the submission.
    console.warn("[email] addToAudience failed (non-fatal)", err);
  }
}

/**
 * Branded button for transactional emails. Matches the site's flat,
 * zero-radius visual style (Coast Blue fill, mono uppercase label).
 */
export function emailButton(label: string, href: string): string {
  return `<a href="${href}" target="_blank" style="display:inline-block; background-color:#417CE5; color:#F8F6E8; text-decoration:none; padding:13px 26px; font-weight:600; font-size:12px; letter-spacing:0.08em; text-transform:uppercase; font-family:'Courier New', Courier, monospace;">${esc(label)}</a>`;
}

/**
 * Shared branded wrapper for outbound transactional emails (Resend).
 * Table-based layout for email-client compatibility. Pass pre-built HTML
 * (already escaped where needed) as `body`.
 */
export function emailLayout(opts: {
  preheader?: string;
  heroImage?: string;
  heroAlt?: string;
  body: string;
}): string {
  const { preheader = "", heroImage, heroAlt = "", body } = opts;

  return `<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Pax Brasiliana</title>
  </head>
  <body style="margin:0; padding:0; background-color:#463C2E;">
    <div style="display:none; max-height:0; overflow:hidden; opacity:0;">${esc(preheader)}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#463C2E;">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%; background-color:#F8F6E8;">
            <tr>
              <td style="padding:28px 32px 8px; font-family:'Courier New', Courier, monospace; font-weight:700; font-size:14px; letter-spacing:0.12em; color:#463C2E; text-transform:uppercase;">
                Pax Brasiliana
              </td>
            </tr>
            ${heroImage ? `<tr>
              <td style="padding:16px 0 0;">
                <img src="${heroImage}" alt="${esc(heroAlt)}" width="600" style="display:block; width:100%; max-width:600px; height:auto; border:0;" />
              </td>
            </tr>` : ""}
            <tr>
              <td style="padding:28px 32px 32px; font-family:Georgia, 'Times New Roman', serif; font-size:15px; line-height:1.65; color:#463C2E;">
                ${body}
              </td>
            </tr>
            <tr>
              <td style="background-color:#463C2E; padding:24px 32px; font-family:'Courier New', Courier, monospace; font-size:11px; letter-spacing:0.04em; line-height:1.7; color:rgba(248,246,232,0.55);">
                <p style="margin:0 0 6px; color:#F8F6E8;">Pax Brasiliana</p>
                <p style="margin:0 0 6px;">"Maybe Brazil can still build great things."</p>
                <p style="margin:0;"><a href="${SITE_URL}" style="color:#F8F6E8; text-decoration:underline;">paxbrasiliana.com</a></p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
