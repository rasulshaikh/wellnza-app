// lib/email-templates/cart-abandoned-24hr.tsx
import { Html, Head, Body, Container, Section, Text, Button } from "@react-email/components";

export function CartAbandoned24hrEmail({ items, name, discountCode = "COMEBACK10" }: {
  items: { name: string; quantity: number; price: number; image?: string }[];
  name: string;
  discountCode?: string;
}) {
  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: "#FAFAFA", fontFamily: "sans-serif" }}>
        <Container style={{ maxWidth: "480px", margin: "0 auto", padding: "40px 20px" }}>
          <Section style={{ backgroundColor: "#fff", borderRadius: "8px", padding: "32px", border: "1px solid #E5E5E0" }}>
            <Text style={{ fontSize: "24px", fontWeight: "bold", color: "#0A0A0A", margin: "0 0 8px" }}>
              Still thinking? Here&apos;s 10% off ⚡
            </Text>
            <Text style={{ color: "#6B6B6B", fontSize: "14px", margin: "0 0 16px" }}>
              Hi {name || "there"}, your cart is still waiting. Use the code below for 10% off your order.
            </Text>
            <Section style={{ backgroundColor: "#0A0A0A", borderRadius: "6px", padding: "16px", textAlign: "center", marginBottom: "24px" }}>
              <Text style={{ color: "#fff", fontSize: "20px", fontWeight: "bold", letterSpacing: "4px", margin: "0" }}>
                {discountCode}
              </Text>
              <Text style={{ color: "#999", fontSize: "12px", margin: "8px 0 0" }}>10% off your order</Text>
            </Section>
            {items.slice(0, 3).map((item, i) => (
              <Text key={i} style={{ color: "#6B6B6B", fontSize: "14px", margin: "4px 0" }}>
                • {item.name} × {item.quantity}
              </Text>
            ))}
            <Button
              href={`${process.env.NEXT_PUBLIC_APP_URL}/cart?discount=${discountCode}`}
              style={{ display: "block", width: "100%", backgroundColor: "#0055FF", color: "#fff", padding: "14px", borderRadius: "6px", textDecoration: "none", fontWeight: "600", textAlign: "center", marginTop: "24px" }}
            >
              Apply Discount & Checkout
            </Button>
            <Text style={{ color: "#999", fontSize: "12px", marginTop: "16px", textAlign: "center" }}>
              Offer expires in 48 hours.
            </Text>
          </Section>
          <Text style={{ textAlign: "center", color: "#999", fontSize: "12px", marginTop: "24px" }}>© 2026 wellnzanutrition.com</Text>
        </Container>
      </Body>
    </Html>
  );
}