export function getWhatsAppUrl(message?: string): string {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/[^0-9]/g, '') || '918788396678';
  const base = `https://api.whatsapp.com/send/?phone=${phone}&type=phone_number&app_absent=0`;
  return message ? `${base}&text=${encodeURIComponent(message)}` : base;
}
