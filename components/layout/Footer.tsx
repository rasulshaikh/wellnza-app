import Link from "next/link";
import { MessageCircle, MapPin, Mail, ArrowUpRight } from "lucide-react";
import { getWhatsAppUrl } from "@/lib/whatsapp";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{ background: "#0B0F0C", borderTop: "1px solid rgba(232,160,32,0.12)" }}>

      {/* Main grid */}
      <div className="container mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">

          {/* Brand — wider col */}
          <div className="md:col-span-4 space-y-5">
            <Link href="/" className="inline-flex items-center gap-2">
              <span style={{ color: "#E8A020", fontSize: "16px" }}>◆</span>
              <span
                className="text-2xl uppercase tracking-widest"
                style={{ fontFamily: "var(--font-rajdhani,'Rajdhani',sans-serif)", fontWeight: 700, color: "#F7F3EC" }}
              >
                Wellnza
              </span>
            </Link>

            <p
              className="text-sm leading-relaxed max-w-xs"
              style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", color: "rgba(247,243,236,0.5)", lineHeight: 1.75 }}
            >
              Premium sports nutrition born in Amravati, Maharashtra.
              Clean formulas for every Indian athlete who refuses to settle.
            </p>

            {/* Origin tag */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
              style={{ background: "rgba(232,160,32,0.08)", border: "1px solid rgba(232,160,32,0.2)" }}
            >
              <span className="text-xs" style={{ color: "#E8A020" }}>◆</span>
              <span
                className="text-[10px] font-bold uppercase tracking-[0.18em]"
                style={{ color: "rgba(232,160,32,0.8)", fontFamily: "var(--font-jakarta)" }}
              >
                Made in India 🇮🇳
              </span>
            </div>

            {/* Social */}
            <div className="flex items-center gap-4 pt-1">
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="transition-opacity hover:opacity-80"
              >
                <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "rgba(37,211,102,0.12)", border: "1px solid rgba(37,211,102,0.2)" }}>
                  <MessageCircle className="w-4 h-4" style={{ color: "#25D366" }} />
                </div>
              </a>
              <a
                href="https://instagram.com/wellnzanutrition"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="transition-opacity hover:opacity-80"
              >
                <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "rgba(232,160,32,0.08)", border: "1px solid rgba(232,160,32,0.2)" }}>
                  <svg className="w-4 h-4" fill="#E8A020" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.445.645-1.445 1.44 0 .794.649 1.44 1.445 1.44.795 0 1.439-.646 1.439-1.44 0-.795-.644-1.44-1.439-1.44z"/>
                  </svg>
                </div>
              </a>
              <a
                href="mailto:hello@wellnzanutrition.com"
                aria-label="Email"
                className="transition-opacity hover:opacity-80"
              >
                <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "rgba(247,243,236,0.05)", border: "1px solid rgba(247,243,236,0.1)" }}>
                  <Mail className="w-4 h-4" style={{ color: "rgba(247,243,236,0.5)" }} />
                </div>
              </a>
            </div>
          </div>

          {/* Shop */}
          <div className="md:col-span-2 space-y-4">
            <h4
              className="text-[11px] font-bold uppercase tracking-[0.18em]"
              style={{ color: "#E8A020", fontFamily: "var(--font-jakarta)" }}
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
                    className="text-sm transition-colors hover:text-[#F7F3EC]"
                    style={{ fontFamily: "var(--font-jakarta)", color: "rgba(247,243,236,0.45)" }}
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
              style={{ color: "#E8A020", fontFamily: "var(--font-jakarta)" }}
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
                    className="text-sm transition-colors hover:text-[#F7F3EC]"
                    style={{ fontFamily: "var(--font-jakarta)", color: "rgba(247,243,236,0.45)" }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-4 space-y-4">
            <h4
              className="text-[11px] font-bold uppercase tracking-[0.18em]"
              style={{ color: "#E8A020", fontFamily: "var(--font-jakarta)" }}
            >
              Contact Us
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:hello@wellnzanutrition.com"
                  className="flex items-center gap-2 text-sm transition-colors hover:text-[#E8A020]"
                  style={{ fontFamily: "var(--font-jakarta)", color: "rgba(247,243,236,0.5)" }}
                >
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  hello@wellnzanutrition.com
                </a>
              </li>
              <li>
                <a
                  href={getWhatsAppUrl("Hi! I have a question about Wellnza products.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm transition-colors hover:text-[#25D366]"
                  style={{ fontFamily: "var(--font-jakarta)", color: "rgba(247,243,236,0.5)" }}
                >
                  <MessageCircle className="w-4 h-4 flex-shrink-0" />
                  WhatsApp Support
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </li>
              <li>
                <div
                  className="flex items-start gap-2 text-sm"
                  style={{ fontFamily: "var(--font-jakarta)", color: "rgba(247,243,236,0.5)" }}
                >
                  <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#E8A020" }} />
                  <span>Amravati, Maharashtra, India</span>
                </div>
              </li>
            </ul>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-2 pt-2">
              {["GMP Certified", "Lab Tested", "100% Natural"].map((b) => (
                <span
                  key={b}
                  className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                  style={{ background: "rgba(20,83,45,0.15)", border: "1px solid rgba(34,197,94,0.2)", color: "rgba(34,197,94,0.8)" }}
                >
                  ✓ {b}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: "1px solid rgba(232,160,32,0.08)" }}>
        <div className="container mx-auto px-4 md:px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <p
            className="text-[11px] uppercase tracking-wider"
            style={{ fontFamily: "var(--font-jakarta)", color: "rgba(247,243,236,0.25)" }}
          >
            © {currentYear} Wellnza Nutrition. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <span style={{ color: "#E8A020", fontSize: "10px" }}>◆</span>
            <p
              className="text-[11px] uppercase tracking-wider"
              style={{ fontFamily: "var(--font-jakarta)", color: "rgba(247,243,236,0.25)" }}
            >
              Born in Amravati · Built for Champions
            </p>
            <span style={{ color: "#E8A020", fontSize: "10px" }}>◆</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
