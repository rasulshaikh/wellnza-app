import { Html, Head, Body, Container, Section, Text, Link } from "@react-email/components";

export function OrderConfirmedEmail({
  name, orderNumber, total, items, estimatedDelivery,
}: {
  name: string;
  orderNumber: string;
  total: number;
  items: { name: string; quantity: number; price: number }[];
  estimatedDelivery: string;
}) {
  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: "#FAFAFA", fontFamily: "sans-serif" }}>
        <Container style={{ maxWidth: "480px", margin: "0 auto", padding: "40px 20px" }}>
          <Section style={{ backgroundColor: "#fff", borderRadius: "8px", padding: "32px", border: "1px solid #E5E5E0" }}>
            <Text style={{ fontSize: "24px", fontWeight: "bold", color: "#0A0A0A", margin: "0 0 8px" }}>
              Order Confirmed ✅
            </Text>
            <Text style={{ color: "#6B6B6B", fontSize: "14px", margin: "0 0 16px" }}>
              Hi {name || "there"}, your order <strong>#{orderNumber}</strong> is confirmed.
            </Text>
            <Section style={{ backgroundColor: "#F5F5F5", borderRadius: "6px", padding: "16px", marginBottom: "24px" }}>
              {items.map((item, i) => (
                <Text key={i} style={{ color: "#0A0A0A", fontSize: "14px", margin: "4px 0" }}>
                  {item.name} × {item.quantity} — ₹{item.price.toLocaleString()}
                </Text>
              ))}
              <Text style={{ borderTop: "1px solid #E5E5E0", marginTop: "8px", paddingTop: "8px", fontWeight: "bold", color: "#0A0A0A" }}>
                Total: ₹{total.toLocaleString()}
              </Text>
            </Section>
            <Text style={{ color: "#6B6B6B", fontSize: "14px" }}>
              Estimated delivery: <strong>{estimatedDelivery}</strong>
            </Text>
            <Link
              href={`${process.env.NEXT_PUBLIC_APP_URL}/account/orders`}
              style={{ display: "inline-block", marginTop: "20px", color: "#0055FF", fontSize: "14px" }}
            >
              Track your order →
            </Link>
          </Section>
          <Text style={{ textAlign: "center", color: "#999", fontSize: "12px", marginTop: "24px" }}>
            © 2026 wellnzanutrition.com
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
