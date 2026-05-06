// lib/email-templates/order-cancelled.tsx
// AUDIT TODO P0: Line 18 hardcodes Indian WhatsApp number +91 8788396678
// FIX: Replace with getWhatsAppUrl() from @/lib/whatsapp to use NEXT_PUBLIC_WHATSAPP_NUMBER env var
// See: docs/audit/FULL-AUDIT-2026-05-06.md
import { Html, Head, Body, Container, Section, Text, Link } from "@react-email/components";

export function OrderCancelledEmail({ name, orderNumber, reason }: { name: string; orderNumber: string; reason?: string }) {
  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: "#FAFAFA", fontFamily: "sans-serif" }}>
        <Container style={{ maxWidth: "480px", margin: "0 auto", padding: "40px 20px" }}>
          <Section style={{ backgroundColor: "#fff", borderRadius: "8px", padding: "32px", border: "1px solid #E5E5E0" }}>
            <Text style={{ fontSize: "24px", fontWeight: "bold", color: "#0A0A0A", margin: "0 0 8px" }}>
              Order Cancelled
            </Text>
            <Text style={{ color: "#6B6B6B", fontSize: "14px", margin: "0 0 16px" }}>
              Hi {name || "there"}, order <strong>#{orderNumber}</strong> has been cancelled{reason ? `: ${reason}` : ""}.
            </Text>
            <Text style={{ color: "#6B6B6B", fontSize: "14px" }}>
              If you have any questions, reply to this email or WhatsApp us at +91 8788396678.
            </Text>
            <Link
              href={`${process.env.NEXT_PUBLIC_APP_URL}/products`}
              style={{ display: "inline-block", marginTop: "20px", color: "#0055FF", fontSize: "14px" }}
            >
              Continue Shopping →
            </Link>
          </Section>
          <Text style={{ textAlign: "center", color: "#999", fontSize: "12px", marginTop: "24px" }}>© 2026 wellnzanutrition.com</Text>
        </Container>
      </Body>
    </Html>
  );
}
