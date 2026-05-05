// lib/email-templates/cart-abandoned-1hr.tsx
import { Html, Head, Body, Container, Section, Text, Button } from "@react-email/components";

export function CartAbandoned1hrEmail({ items, name }: {
  items: { name: string; quantity: number; price: number; image?: string }[];
  name: string;
}) {
  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: "#FAFAFA", fontFamily: "sans-serif" }}>
        <Container style={{ maxWidth: "480px", margin: "0 auto", padding: "40px 20px" }}>
          <Section style={{ backgroundColor: "#fff", borderRadius: "8px", padding: "32px", border: "1px solid #E5E5E0" }}>
            <Text style={{ fontSize: "24px", fontWeight: "bold", color: "#0A0A0A", margin: "0 0 8px" }}>
              You left something behind 🏋️
            </Text>
            <Text style={{ color: "#6B6B6B", fontSize: "14px", margin: "0 0 24px" }}>
              Hi {name || "there"}, your cart is waiting. Don&apos;t let your fitness goals wait.
            </Text>
            {items.map((item, i) => (
              <Section key={i} style={{ display: "flex", alignItems: "center", marginBottom: "16px", padding: "12px", backgroundColor: "#F5F5F5", borderRadius: "6px" }}>
                {item.image && (
                  <img src={item.image} alt={item.name} style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "4px", marginRight: "12px" }} />
                )}
                <div>
                  <Text style={{ color: "#0A0A0A", fontWeight: "600", fontSize: "14px", margin: "0" }}>{item.name}</Text>
                  <Text style={{ color: "#6B6B6B", fontSize: "12px", margin: "4px 0 0" }}>Qty: {item.quantity} — ₹{item.price.toLocaleString()}</Text>
                </div>
              </Section>
            ))}
            <Button
              href={`${process.env.NEXT_PUBLIC_APP_URL}/cart`}
              style={{ display: "block", width: "100%", backgroundColor: "#0055FF", color: "#fff", padding: "14px", borderRadius: "6px", textDecoration: "none", fontWeight: "600", textAlign: "center" }}
            >
              Complete Your Order
            </Button>
            <Text style={{ color: "#999", fontSize: "12px", marginTop: "16px", textAlign: "center" }}>
              Your cart is reserved for 24 hours.
            </Text>
          </Section>
          <Text style={{ textAlign: "center", color: "#999", fontSize: "12px", marginTop: "24px" }}>© 2026 wellnzanutrition.com</Text>
        </Container>
      </Body>
    </Html>
  );
}