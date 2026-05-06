export function getWhatsAppUrl(message?: string): string {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/[^0-9]/g, '') ?? '';
  if (!number && process.env.NODE_ENV === 'development') {
    console.warn('[WhatsApp] NEXT_PUBLIC_WHATSAPP_NUMBER is not set');
  }
  const base = `https://wa.me/${number}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
