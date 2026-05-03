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
    <header className="sticky top-0 z-50 w-full bg-white border-b border-[#E7E5E4]">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-[#166534] font-merriweather">Wellnza</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium font-raleway transition-colors hover:text-[#166534]",
                pathname === link.href ? "text-[#166534]" : "text-[#1C1917]"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-1">
          {/* Search */}
          <Link href="/search" className="p-2">
            <Search className="h-5 w-5 text-[#57534E]" />
          </Link>

          {/* Cart */}
          <Link href="/cart" className="relative p-2">
            <ShoppingCart className="h-5 w-5 text-[#57534E]" />
            {itemCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-[#166534] text-white border-0">
                {itemCount > 9 ? "9+" : itemCount}
              </Badge>
            )}
          </Link>

          {/* Account - outline ghost variant */}
          <Link href="/account" className="p-2 border border-[#E7E5E4] rounded-md hover:border-[#166534] transition-colors">
            <User className="h-5 w-5 text-[#57534E]" />
          </Link>

          {/* Mobile menu toggle */}
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            className="md:hidden flex h-8 w-8 items-center justify-center rounded-md hover:bg-[#FAFAF5] transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5 text-[#1C1917]" /> : <Menu className="h-5 w-5 text-[#1C1917]" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div id="mobile-menu" className="md:hidden border-t border-[#E7E5E4] bg-[#FAFAF5]">
          <nav className="container mx-auto px-4 py-6 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "text-sm font-medium font-raleway py-2",
                  pathname === link.href ? "text-[#166534]" : "text-[#1C1917]"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
