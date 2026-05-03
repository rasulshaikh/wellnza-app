import type { Metadata } from "next";
import { Playfair_Display, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Wellnza Nutrition: Quality Sports Nutrition & Supplements | Wellnza Nutrition",
    template: "%s | Wellnza Nutrition",
  },
  description:
    "Discover Wellnza Nutrition, your go-to brand for high-quality sports nutrition, including whey protein, pre-workout formulas, and health supplements designed to fuel athletes and fitness enthusiasts for optimal performance and recovery.",
  keywords: ["sports nutrition", "whey protein", "health supplements"],
  openGraph: {
    siteName: "Wellnza Nutrition",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
  icons: {
    icon: [
      { url: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=16,h=16,fit=crop,f=png/PQIno7kFVWk52uM2/picsart_26-03-02_10-48-00-834.jpg-cOseMepAL9dACAtL.jpeg", sizes: "16x16" },
      { url: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=32,h=32,fit=crop,f=png/PQIno7kFVWk52uM2/picsart_26-03-02_10-48-00-834.jpg-cOseMepAL9dACAtL.jpeg", sizes: "32x32" },
      { url: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=192,h=192,fit=crop,f=png/PQIno7kFVWk52uM2/picsart_26-03-02_10-48-00-834.jpg-cOseMepAL9dACAtL.jpeg", sizes: "192x192" },
    ],
    apple: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=180,h=180,fit=crop,f=png/PQIno7kFVWk52uM2/picsart_26-03-02_10-48-00-834.jpg-cOseMepAL9dACAtL.jpeg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${cormorant.variable}`}>
      <body>{children}</body>
    </html>
  );
}
