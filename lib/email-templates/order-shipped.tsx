// lib/email-templates/order-shipped.tsx
import { Html, Head, Body, Container, Section, Text, Link } from "@react-email/components";

export function OrderShippedEmail({ name, orderNumber, trackingNumber, trackingCarrier }: {
  name: string; orderNumber: string; trackingNumber?: string; trackingCarrier?: string;
}) {
  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: "#FAFAFA", fontFamily: "sans-serif" }}>
        <Container style={{ maxWidth: "480px", margin: "0 auto", padding: "40px 20px" }}>
          <Section style={{ backgroundColor: "#fff", borderRadius: "8px", padding: "32px", border: "1px solid #E5E5E0" }}>
            <Text style={{ fontSize: "24px", fontWeight: "bold", color: "#0A0A0A", margin: "0 0 8px" }}>
              Your Order is on its way! 🚚
            </Text>
            <Text style={{ color: "#6B6B6B", fontSize: "14px", margin: "0 0 16px" }}>
              Hi {name || "there"}, order <strong>#{orderNumber}</strong> has been shipped.
            </Text>
            {trackingNumber && (
              <Section style={{ backgroundColor: "#F5F5F5", borderRadius: "6px", padding: "16px", marginBottom: "16px" }}>
                <Text style={{ color: "#6B6B6B", fontSize: "12px", margin: "0" }}>
                  Tracking: {trackingCarrier} — {trackingNumber}
                </Text>
              </Section>
            )}
            <Link
              href={`${process.env.NEXT_PUBLIC_APP_URL}/account/orders`}
              style={{ color: "#0055FF", fontSize: "14px" }}
            >
              Track Order →
            </Link>
          </Section>
          <Text style={{ textAlign: "center", color: "#999", fontSize: "12px", marginTop: "24px" }}>© 2026 wellnzanutrition.com</Text>
        </Container>
      </Body>
    </Html>
  );
}
