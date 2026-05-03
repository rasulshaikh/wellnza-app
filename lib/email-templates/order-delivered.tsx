// lib/email-templates/order-delivered.tsx
import { Html, Head, Body, Container, Section, Text, Button } from "@react-email/components";

export function OrderDeliveredEmail({ name, orderNumber }: { name: string; orderNumber: string }) {
  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: "#FAFAFA", fontFamily: "sans-serif" }}>
        <Container style={{ maxWidth: "480px", margin: "0 auto", padding: "40px 20px" }}>
          <Section style={{ backgroundColor: "#fff", borderRadius: "8px", padding: "32px", border: "1px solid #E5E5E0" }}>
            <Text style={{ fontSize: "24px", fontWeight: "bold", color: "#0A0A0A", margin: "0 0 8px" }}>
              Order Delivered! 🎉
            </Text>
            <Text style={{ color: "#6B6B6B", fontSize: "14px", margin: "0 0 24px" }}>
              Hi {name || "there"}, order <strong>#{orderNumber}</strong> has been delivered. We hope you love it!
            </Text>
            <Button
              href={`${process.env.NEXT_PUBLIC_APP_URL}/products`}
              style={{ backgroundColor: "#0055FF", color: "#fff", padding: "12px 24px", borderRadius: "6px", textDecoration: "none", fontWeight: "600" }}
            >
              Shop More
            </Button>
          </Section>
          <Text style={{ textAlign: "center", color: "#999", fontSize: "12px", marginTop: "24px" }}>© 2026 wellnzanutrition.com</Text>
        </Container>
      </Body>
    </Html>
  );
}
