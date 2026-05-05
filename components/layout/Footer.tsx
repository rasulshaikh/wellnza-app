import Link from "next/link";
import { MessageCircle, Phone, MapPin } from "lucide-react";
import { NewsletterForm } from "./NewsletterForm";

const FSSAI_LICENSE = process.env.NEXT_PUBLIC_FSSAI_LICENSE || "XXXXXXXXXXXXXX";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0D0D0D] border-t border-[rgba(22,101,52,0.3)]">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <span className="font-bebas text-2xl tracking-wider text-white">WELL</span>
              <span className="font-bebas text-2xl tracking-wider text-[#22C55E]">NZA</span>
            </Link>
            <p className="font-oswald text-sm text-[#888888] leading-relaxed">
              Premium nutritional supplements crafted for peak athletic performance. New Zealand quality, worldwide results.
            </p>
            <div className="flex gap-4 mt-4">
              <a href="https://wa.me/6421XXXXXX" target="_blank" rel="noopener noreferrer" className="text-[#22C55E] hover:text-[#22C55E]/80 transition-colors duration-200" aria-label="WhatsApp">
                <MessageCircle className="w-5 h-5" />
              </a>
              <a href="tel:+6421XXXXXX" className="text-[#22C55E] hover:text-[#22C55E]/80 transition-colors duration-200" aria-label="Call">
                <Phone className="w-5 h-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-[#22C55E] hover:text-[#22C55E]/80 transition-colors duration-200" aria-label="Instagram">
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bebas text-lg uppercase tracking-wider text-white mb-4">Contact</h3>
            <ul className="space-y-3">
              <li>
                <a href="mailto:hello@wellnza.com" className="font-oswald text-sm text-[#888888] hover:text-[#22C55E] transition-colors duration-200">
                  hello@wellnza.com
                </a>
              </li>
              <li>
                <a href="https://wa.me/6421XXXXXX" target="_blank" rel="noopener noreferrer" className="font-oswald text-sm text-[#888888] hover:text-[#22C55E] transition-colors duration-200">
                  WhatsApp: +64 21 XXXXXX
                </a>
              </li>
              <li className="flex items-start gap-2 font-oswald text-sm text-[#888888]">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Auckland, New Zealand</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-bebas text-lg uppercase tracking-wider text-white mb-4">Stay Updated</h3>
            <p className="font-oswald text-sm text-[#888888] mb-4">
              Subscribe for exclusive offers and fitness tips.
            </p>
            <NewsletterForm />
          </div>

          {/* Terms */}
          <div>
            <h3 className="font-bebas text-lg uppercase tracking-wider text-white mb-4">Information</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/privacy" className="font-oswald text-sm text-[#888888] hover:text-[#22C55E] transition-colors duration-200">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="font-oswald text-sm text-[#888888] hover:text-[#22C55E] transition-colors duration-200">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="font-oswald text-sm text-[#888888] hover:text-[#22C55E] transition-colors duration-200">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/returns" className="font-oswald text-sm text-[#888888] hover:text-[#22C55E] transition-colors duration-200">
                  Returns
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[rgba(22,101,52,0.1)]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="font-oswald text-sm text-[#666666] text-center">
              &copy; {currentYear} Wellnza Nutrition. All rights reserved.
            </p>
            <p className="font-oswald text-xs text-[#666666]">
              FSSAI: {FSSAI_LICENSE}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
