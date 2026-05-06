import Link from "next/link";
import { MessageCircle, Phone, MapPin } from "lucide-react";
import { NewsletterForm } from "./NewsletterForm";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[#2E7D32]/15" style={{ background: "#FAFAF8" }}>
      <div className="mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <span
                className="text-2xl tracking-wider"
                style={{ fontFamily: "'Playfair Display', serif", color: "#1a1a1a" }}
              >
                Well
              </span>
              <span
                className="text-2xl tracking-wider"
                style={{ fontFamily: "'Playfair Display', serif", color: "#2E7D32" }}
              >
                nza
              </span>
            </Link>
            <p
              className="text-sm leading-relaxed"
              style={{ fontFamily: "'DM Sans', sans-serif", color: "#7B9E6B" }}
            >
              Premium sports nutrition crafted for peak performance. Clean ingredients, transparent dosing.
            </p>
            <div className="flex gap-4 mt-4">
              <a
                href="https://wa.me/6421XXXXXX"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors duration-200"
                style={{ color: "#2E7D32" }}
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              <a
                href="tel:+6421XXXXXX"
                className="transition-colors duration-200"
                style={{ color: "#2E7D32" }}
                aria-label="Call"
              >
                <Phone className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors duration-200"
                style={{ color: "#2E7D32" }}
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.445.645-1.445 1.44 0 .794.649 1.44 1.445 1.44.795 0 1.439-.646 1.439-1.44 0-.795-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3
              className="text-lg tracking-wider mb-4"
              style={{ fontFamily: "'Playfair Display', serif", color: "#1a1a1a" }}
            >
              Contact
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:hello@wellnza.com"
                  className="text-sm transition-colors duration-200"
                  style={{ fontFamily: "'DM Sans', sans-serif", color: "#7B9E6B" }}
                >
                  hello@wellnza.com
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/6421XXXXXX"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm transition-colors duration-200"
                  style={{ fontFamily: "'DM Sans', sans-serif", color: "#7B9E6B" }}
                >
                  WhatsApp: +64 21 XXX XXX
                </a>
              </li>
              <li
                className="flex items-start gap-2 text-sm"
                style={{ fontFamily: "'DM Sans', sans-serif", color: "#7B9E6B" }}
              >
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "#2E7D32" }} />
                <span>Auckland, New Zealand</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3
              className="text-lg tracking-wider mb-4"
              style={{ fontFamily: "'Playfair Display', serif", color: "#1a1a1a" }}
            >
              Stay Updated
            </h3>
            <p
              className="text-sm mb-4"
              style={{ fontFamily: "'DM Sans', sans-serif", color: "#7B9E6B" }}
            >
              Subscribe for wellness tips and exclusive offers.
            </p>
            <NewsletterForm />
          </div>

          {/* Quick Links */}
          <div>
            <h3
              className="text-lg tracking-wider mb-4"
              style={{ fontFamily: "'Playfair Display', serif", color: "#1a1a1a" }}
            >
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/products"
                  className="text-sm transition-colors duration-200"
                  style={{ fontFamily: "'DM Sans', sans-serif", color: "#7B9E6B" }}
                >
                  Shop All
                </Link>
              </li>
              <li>
                <Link
                  href="/account"
                  className="text-sm transition-colors duration-200"
                  style={{ fontFamily: "'DM Sans', sans-serif", color: "#7B9E6B" }}
                >
                  My Account
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm transition-colors duration-200"
                  style={{ fontFamily: "'DM Sans', sans-serif", color: "#7B9E6B" }}
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm transition-colors duration-200"
                  style={{ fontFamily: "'DM Sans', sans-serif", color: "#7B9E6B" }}
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div
          className="mt-12 pt-8"
          style={{ borderTop: "1px solid rgba(46, 125, 50, 0.1)" }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p
              className="text-sm text-center"
              style={{ fontFamily: "'DM Sans', sans-serif", color: "#7B9E6B" }}
            >
              &copy; {currentYear} Wellnza Nutrition. All rights reserved.
            </p>
            <p className="text-xs" style={{ fontFamily: "'DM Sans', sans-serif", color: "#7B9E6B" }}>
              Fuel better. Recover faster. Perform at your best.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
