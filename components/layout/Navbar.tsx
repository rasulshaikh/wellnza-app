"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, User, Menu, X, Search } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/store/cart-store";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Shop" },
  { href: "/about", label: "About" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const itemCount = useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0));

  return (
    <header className="sticky top-0 z-50 w-full bg-[#FAFAF5]/95 backdrop-blur-md border-b border-[#86A873]/20">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold tracking-tight" style={{ fontFamily: "var(--font-playfair), Playfair Display, serif" }}>
            <span className="text-[#166534]">Well</span><span className="text-[#8B6B4F] italic">nza</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-[15px] font-medium transition-colors duration-200 hover:text-[#86A873]",
                pathname === link.href ? "text-[#166534]" : "text-[#1C1917]"
              )}
              style={{ fontFamily: "var(--font-body), Cormorant Garamond, serif" }}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/products"
            className="px-5 py-2 bg-[#166534] text-[#FAFAF5] text-[15px] font-medium rounded-full hover:bg-[#14532d] hover:-translate-y-0.5 transition-all duration-200 shadow-sm"
            style={{ fontFamily: "var(--font-body), Cormorant Garamond, serif" }}
          >
            Shop Now
          </Link>
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-1">
          {/* Search */}
          <Link href="/search" className="p-2">
            <Search className="h-5 w-5 text-[#57534E] hover:text-[#8B6B4F] transition-colors duration-200" />
          </Link>

          {/* Cart */}
          <Link href="/cart" className="relative p-2">
            <ShoppingCart className="h-5 w-5 text-[#57534E]" />
            {itemCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-[#166534]/90 text-white border-0">
                {itemCount > 9 ? "9+" : itemCount}
              </Badge>
            )}
          </Link>

          {/* Account - rounded-full for organic feel */}
          <Link href="/account" className="p-2 border border-[#E7E5E4] rounded-full hover:border-[#86A873] transition-colors duration-200">
            <User className="h-5 w-5 text-[#57534E]" />
          </Link>

          {/* Mobile menu toggle */}
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            className="md:hidden flex h-8 w-8 items-center justify-center rounded-full hover:bg-[#F5F5ED] transition-colors duration-200"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5 text-[#1C1917]" /> : <Menu className="h-5 w-5 text-[#1C1917]" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div id="mobile-menu" className="md:hidden border-t border-[#86A873]/20 bg-[#F5F5ED]">
          <nav className="container mx-auto px-6 py-8 flex flex-col gap-5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "text-[15px] font-medium py-2",
                  pathname === link.href ? "text-[#166534]" : "text-[#1C1917]"
                )}
                style={{ fontFamily: "var(--font-body), Cormorant Garamond, serif" }}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/products"
              onClick={() => setMobileOpen(false)}
              className="mt-2 px-5 py-2.5 bg-[#166534] text-[#FAFAF5] text-[15px] font-medium rounded-full text-center hover:bg-[#14532d] transition-colors duration-200"
              style={{ fontFamily: "var(--font-body), Cormorant Garamond, serif" }}
            >
              Shop Now
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
