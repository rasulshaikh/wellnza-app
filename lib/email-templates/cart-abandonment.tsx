import { Html, Head, Body, Container, Section, Text, Link, Button } from "@react-email/components";

export function CartAbandonmentEmail({
  name,
  items,
  total,
  recoveryLink,
  couponCode,
}: {
  name: string;
  items: { name: string; flavor: string; quantity: number; price: number }[];
  total: number;
  recoveryLink: string;
  couponCode: string;
}) {
  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: "#FAFAFA", fontFamily: "sans-serif" }}>
        <Container style={{ maxWidth: "480px", margin: "0 auto", padding: "40px 20px" }}>
          <Section style={{ backgroundColor: "#fff", borderRadius: "8px", padding: "32px", border: "1px solid #E5E5E0" }}>
            <Text style={{ fontSize: "24px", fontWeight: "bold", color: "#0A0A0A", margin: "0 0 8px" }}>
              You left something behind 🛒
            </Text>
            <Text style={{ color: "#6B6B6B", fontSize: "14px", margin: "0 0 24px" }}>
              Hi {name || "there"}, your cart is waiting. Don&apos;t let your fitness goals wait.
            </Text>

            {/* Cart Items */}
            <Section style={{ backgroundColor: "#F5F5F5", borderRadius: "6px", padding: "16px", marginBottom: "24px" }}>
              {items.map((item, i) => (
                <Section key={i} style={{ display: "flex", alignItems: "center", marginBottom: "12px", paddingBottom: "12px", borderBottom: i < items.length - 1 ? "1px solid #E5E5E0" : "none" }}>
                  <div style={{ flex: 1 }}>
                    <Text style={{ color: "#0A0A0A", fontWeight: "600", fontSize: "14px", margin: "0" }}>
                      {item.name}
                    </Text>
                    <Text style={{ color: "#6B6B6B", fontSize: "12px", margin: "4px 0 0" }}>
                      {item.flavor} × {item.quantity}
                    </Text>
                  </div>
                  <Text style={{ color: "#0A0A0A", fontWeight: "600", fontSize: "14px" }}>
                    {new Intl.NumberFormat("en-NZ", { style: "currency", currency: "NZD" }).format(item.price)}
                  </Text>
                </Section>
              ))}
              <Section style={{ borderTop: "1px solid #E5E5E0", marginTop: "12px", paddingTop: "12px" }}>
                <Text style={{ display: "flex", justifyContent: "space-between", color: "#0A0A0A", fontWeight: "bold", fontSize: "16px", margin: "0" }}>
                  <span>Total</span>
                  <span>{new Intl.NumberFormat("en-NZ", { style: "currency", currency: "NZD" }).format(total)}</span>
                </Text>
              </Section>
            </Section>

            {/* Coupon Code */}
            <Section style={{ backgroundColor: "#FFF9E6", borderRadius: "6px", padding: "16px", marginBottom: "24px", textAlign: "center" }}>
              <Text style={{ color: "#6B6B6B", fontSize: "12px", margin: "0 0 4px" }}>
                Your exclusive code
              </Text>
              <Text style={{ color: "#0A0A0A", fontWeight: "bold", fontSize: "24px", margin: "0", letterSpacing: "2px" }}>
                {couponCode}
              </Text>
            </Section>

            {/* CTA Button */}
            <Button
              href={recoveryLink}
              style={{ display: "block", width: "100%", backgroundColor: "#2E7D32", color: "#fff", padding: "14px", borderRadius: "6px", textDecoration: "none", fontWeight: "600", textAlign: "center", fontSize: "16px" }}
            >
              Complete Your Order
            </Button>

            <Text style={{ color: "#999", fontSize: "12px", marginTop: "16px", textAlign: "center" }}>
              This offer expires in 24 hours.
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
