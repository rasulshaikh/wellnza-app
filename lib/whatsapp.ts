/**
 * Centralized WhatsApp helper — single source of truth for WhatsApp links.
 * Set NEXT_PUBLIC_WHATSAPP_NUMBER in .env.local (digits only, no + prefix).
 * e.g. NEXT_PUBLIC_WHATSAPP_NUMBER=6421123456
 */

export function getWhatsAppUrl(message?: string): string {
  const raw = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";
  const number = raw.replace(/[^0-9]/g, "");

  if (!number && process.env.NODE_ENV === "development") {
    console.warn(
      "[WhatsApp] NEXT_PUBLIC_WHATSAPP_NUMBER is not set. WhatsApp links will be broken."
    );
  }

  const base = `https://wa.me/${number}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/**
 * Normalize a phone number for Twilio WhatsApp sending.
 * Handles NZ mobile format (021XXXXXX → 6421XXXXXX) and international formats.
 */
export function normalizePhoneForWhatsApp(phone: string): string {
  const digits = phone.replace(/[^0-9]/g, "");

  // NZ mobile: starts with 0, 9 digits → convert 021XXXXXXXX → 6421XXXXXXXX
  if (digits.startsWith("0") && digits.length === 9) {
    return "64" + digits.slice(1);
  }

  // Already international (no leading zeros)
  return digits.startsWith("+") ? digits.slice(1) : digits;
}
