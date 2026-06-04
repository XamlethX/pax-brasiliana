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
