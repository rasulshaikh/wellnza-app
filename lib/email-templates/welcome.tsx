// AUDIT TODO P0: Line 23 hardcodes Indian WhatsApp number +91 8788396678
// FIX: Replace with getWhatsAppUrl() from @/lib/whatsapp to use NEXT_PUBLIC_WHATSAPP_NUMBER env var
// See: docs/audit/FULL-AUDIT-2026-05-06.md
import { Html, Head, Body, Container, Section, Text, Button, Link } from "@react-email/components";

export function WelcomeEmail({ name, email }: { name: string; email: string }) {
  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: "#FAFAFA", fontFamily: "sans-serif" }}>
        <Container style={{ maxWidth: "480px", margin: "0 auto", padding: "40px 20px" }}>
          <Section style={{ backgroundColor: "#fff", borderRadius: "8px", padding: "32px", border: "1px solid #E5E5E0" }}>
            <Text style={{ fontSize: "28px", fontWeight: "bold", color: "#0A0A0A", margin: "0 0 8px" }}>
              Welcome to Wellnza, {name || "Fitness Enthusiast"}!
            </Text>
            <Text style={{ color: "#6B6B6B", fontSize: "14px", margin: "0 0 24px" }}>
              Thanks for creating your account. Your journey to peak performance starts now.
            </Text>
            <Button
              href={`${process.env.NEXT_PUBLIC_APP_URL}/products`}
              style={{ backgroundColor: "#0055FF", color: "#fff", padding: "12px 24px", borderRadius: "6px", textDecoration: "none", fontWeight: "600" }}
            >
              Shop Now
            </Button>
            <Text style={{ color: "#6B6B6B", fontSize: "12px", marginTop: "24px" }}>
              Questions? Reply to this email or chat with us on WhatsApp: +91 8788396678
            </Text>
          </Section>
          <Text style={{ textAlign: "center", color: "#999", fontSize: "12px", marginTop: "24px" }}>
            © 2026 wellnzanutrition.com
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
