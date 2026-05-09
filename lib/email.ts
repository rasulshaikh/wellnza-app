import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// thexeme.com is the verified Resend sending domain for this account
// Update to wellnzanutrition.com once verified in Resend dashboard
const FROM = "Wellnza Nutrition <hello@thexeme.com>";

export async function sendEmail({
  to,
  subject,
  react,
}: {
  to: string;
  subject: string;
  react: React.ReactNode;
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM,
      to,
      subject,
      react,
    });
    if (error) {
      console.error("[Resend] Send error:", error);
    }
    return { data, error };
  } catch (err) {
    console.error("[Resend] Unexpected error:", err);
    return { data: null, error: err };
  }
}
