import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";
import { Html, Head, Body, Container, Section, Text } from "@react-email/components";

function NewsletterEmail() {
  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: "Arial, sans-serif", maxWidth: "600px", margin: "0 auto", padding: "40px 20px" }}>
        <Container>
          <Section>
            <Text style={{ color: "#166534", fontSize: "24px" }}>You're in!</Text>
            <Text style={{ color: "#333", fontSize: "16px", lineHeight: "1.5" }}>
              Thanks for subscribing to Wellnza Nutrition updates. We'll keep you posted on new products, exclusive offers, and health tips.
            </Text>
            <Text style={{ color: "#666", fontSize: "14px", marginTop: "30px" }}>
              — The Wellnza Team
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    await sendEmail({
      to: email,
      subject: "You're on the list!",
      react: NewsletterEmail(),
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
