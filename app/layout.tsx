import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Well NZ Nutrition — Precision Fuel for Performance",
    template: "%s | Well NZ Nutrition",
  },
  description:
    "Premium sports nutrition supplements. Transparent ingredients, no proprietary blends. Shop protein, pre-workout, omega-3, and more.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
