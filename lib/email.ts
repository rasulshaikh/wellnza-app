import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = "Wellnza Nutrition <hello@wellnzanutrition.com>";

export async function sendEmail({
  to,
  subject,
  react,
}: {
  to: string;
  subject: string;
  react: React.ReactNode;
}) {
  const { data, error } = await resend.emails.send({
    from: FROM,
    to,
    subject,
    react,
  });

  if (error) {
    console.error("[sendEmail] Resend error:", error);
    throw error;
  }

  return data;
}
