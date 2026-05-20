import Link from "next/link";
import { MessageCircle, MapPin, Mail, ArrowUpRight } from "lucide-react";
import { getWhatsAppUrl } from "@/lib/whatsapp";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        background: "#0B0F0C",
        borderTop: "1px solid var(--luxury-border)",
      }}
    >
      {/* Main grid - 4 columns */}
      <div className="container mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">

          {/* Brand */}
          <div className="md:col-span-3 space-y-5">
            <Link href="/" className="inline-flex items-center gap-2">
              <span
                style={{ color: "var(--luxury-gold)", fontSize: "14px" }}
              >
                ◆
              </span>
              <span
                className="text-2xl uppercase tracking-widest"
                style={{
                  fontFamily: "var(--font-rajdhani,'Rajdhani',sans-serif)",
                  fontWeight: 700,
                  color: "#F7F3EC",
                }}
              >
                Wellnza
              </span>
            </Link>

            <p
              className="text-sm leading-relaxed"
              style={{
                fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)",
                color: "rgba(247,243,236,0.5)",
                lineHeight: 1.75,
              }}
            >
              Premium sports nutrition born in Amravati, Maharashtra.
              Clean formulas for every Indian athlete who refuses to settle.
            </p>

            {/* Origin tag — prominent gold banner */}
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg"
              style={{ background: "#E8A020" }}
            >
              <span style={{ color: "#0B0F0C", fontSize: "12px" }}>◆</span>
              <span
                className="text-xs font-bold uppercase tracking-[0.16em]"
                style={{
                  color: "#0B0F0C",
                  fontFamily: "var(--font-jakarta)",
                }}
              >
                Made in India 🇮🇳
              </span>
            </div>

            {/* Social - Outlined icons */}
            <div className="flex items-center gap-3 pt-1">
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="transition-opacity hover:opacity-70"
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{
                    background: "transparent",
                    border: "1px solid rgba(37,211,102,0.25)",
                  }}
                >
                  <MessageCircle
                    className="w-4 h-4"
                    style={{ color: "#25D366", strokeWidth: 1.5 }}
                  />
                </div>
              </a>
              <a
                href="https://instagram.com/wellnzanutrition"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="transition-opacity hover:opacity-70"
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{
                    background: "transparent",
                    border: "1px solid var(--luxury-border)",
                  }}
                >
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--luxury-gold)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </div>
              </a>
              <a
                href="mailto:hello@wellnzanutrition.com"
                aria-label="Email"
                className="transition-opacity hover:opacity-70"
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{
                    background: "transparent",
                    border: "1px solid rgba(247,243,236,0.12)",
                  }}
                >
                  <Mail
                    className="w-4 h-4"
                    style={{ color: "rgba(247,243,236,0.45)", strokeWidth: 1.5 }}
                  />
                </div>
              </a>
            </div>
          </div>

          {/* Shop */}
          <div className="md:col-span-2 space-y-4">
            <h4
              className="text-[11px] font-bold uppercase tracking-[0.18em]"
              style={{ color: "var(--luxury-gold)", fontFamily: "var(--font-jakarta)" }}
            >
              Shop
            </h4>
            <ul className="space-y-3">
              {[
                { label: "All Products", href: "/products" },
                { label: "Pre-Workout", href: "/products?category=PRE_WORKOUT" },
                { label: "Protein", href: "/products?category=PROTEIN" },
                { label: "Mass Gainer", href: "/products?category=MASS_GAINER" },
                { label: "Omega-3", href: "/products?category=OMEGA_3" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm transition-colors hover:text-[var(--luxury-gold-light)]"
                    style={{
                      fontFamily: "var(--font-jakarta)",
                      color: "rgba(247,243,236,0.45)",
                    }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="md:col-span-2 space-y-4">
            <h4
              className="text-[11px] font-bold uppercase tracking-[0.18em]"
              style={{ color: "var(--luxury-gold)", fontFamily: "var(--font-jakarta)" }}
            >
              Company
            </h4>
            <ul className="space-y-3">
              {[
                { label: "About Us", href: "/about" },
                { label: "My Account", href: "/account" },
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Terms of Service", href: "/terms" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm transition-colors hover:text-[var(--luxury-gold-light)]"
                    style={{
                      fontFamily: "var(--font-jakarta)",
                      color: "rgba(247,243,236,0.45)",
                    }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-5 space-y-4">
            <h4
              className="text-[11px] font-bold uppercase tracking-[0.18em]"
              style={{ color: "var(--luxury-gold)", fontFamily: "var(--font-jakarta)" }}
            >
              Contact
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:hello@wellnzanutrition.com"
                  className="flex items-center gap-2 text-sm transition-colors hover:text-[var(--luxury-gold)]"
                  style={{
                    fontFamily: "var(--font-jakarta)",
                    color: "rgba(247,243,236,0.5)",
                  }}
                >
                  <Mail className="w-4 h-4 flex-shrink-0" style={{ strokeWidth: 1.5 }} />
                  hello@wellnzanutrition.com
                </a>
              </li>
              <li>
                <a
                  href={getWhatsAppUrl("Hi! I have a question about Wellnza products.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm transition-colors hover:text-[#25D366]"
                  style={{
                    fontFamily: "var(--font-jakarta)",
                    color: "rgba(247,243,236,0.5)",
                  }}
                >
                  <MessageCircle className="w-4 h-4 flex-shrink-0" style={{ strokeWidth: 1.5 }} />
                  WhatsApp Support
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://maps.google.com/?q=Amravati,Maharashtra,India"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 text-sm transition-colors hover:text-[var(--luxury-gold)]"
                  style={{
                    fontFamily: "var(--font-jakarta)",
                    color: "rgba(247,243,236,0.5)",
                  }}
                >
                  <MapPin
                    className="w-4 h-4 flex-shrink-0 mt-0.5"
                    style={{ color: "var(--luxury-gold)", strokeWidth: 1.5 }}
                  />
                  <span>Amravati, Maharashtra, India</span>
                </a>
              </li>
            </ul>

            {/* Simplified Trust */}
            <div className="flex flex-wrap gap-3 pt-2">
              {["GMP Certified", "Lab Tested", "100% Natural"].map((b) => (
                <span
                  key={b}
                  className="text-[10px] font-medium uppercase tracking-wider px-2.5 py-1 rounded-full"
                  style={{
                    background: "rgba(201,168,76,0.06)",
                    border: "1px solid var(--luxury-border)",
                    color: "var(--luxury-gold)",
                  }}
                >
                  {b}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar - Minimal */}
      <div style={{ borderTop: "1px solid var(--luxury-border)" }}>
        <div className="container mx-auto px-4 md:px-8 py-4 flex flex-col md:flex-row items-center justify-center gap-2">
          <p
            className="text-[11px] tracking-wider"
            style={{
              fontFamily: "var(--font-jakarta)",
              color: "rgba(247,243,236,0.25)",
            }}
          >
            © {currentYear} Wellnza Nutrition. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
