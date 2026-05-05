"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, User, Menu, X, Search } from "lucide-react";
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
    <header className="sticky top-0 z-50 w-full bg-[#0D0D0D] border-b border-[rgba(22,101,52,0.3)]">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="font-bebas text-2xl tracking-wider text-white">WELL</span>
          <span className="font-bebas text-2xl tracking-wider text-[#22C55E]">NZA</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "font-oswald text-sm uppercase tracking-widest transition-colors duration-200",
                pathname === link.href ? "text-[#22C55E]" : "text-white hover:text-[#22C55E]"
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
            <Search className="h-5 w-5 text-[#888888] hover:text-[#22C55E] transition-colors duration-200" />
          </Link>

          {/* Cart */}
          <Link href="/cart" className="relative p-2">
            <ShoppingBag className="h-5 w-5 text-[#22C55E]" />
            {itemCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-[#166534] text-white border-0">
                {itemCount > 9 ? "9+" : itemCount}
              </Badge>
            )}
          </Link>

          {/* Account */}
          <Link href="/account" className="p-2 border border-[rgba(22,101,52,0.3)] hover:border-[#22C55E] transition-colors duration-200">
            <User className="h-5 w-5 text-[#888888] hover:text-[#22C55E] transition-colors duration-200" />
          </Link>

          {/* Mobile menu toggle */}
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            className="md:hidden flex h-8 w-8 items-center justify-center hover:bg-[#1A1A1A] transition-colors duration-200"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5 text-white" /> : <Menu className="h-5 w-5 text-white" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div id="mobile-menu" className="md:hidden border-t border-[rgba(22,101,52,0.3)] bg-[#1A1A1A]">
          <nav className="container mx-auto px-6 py-8 flex flex-col gap-5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "font-oswald text-sm uppercase tracking-widest py-2",
                  pathname === link.href ? "text-[#22C55E]" : "text-white hover:text-[#22C55E]"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}

      <style jsx>{`
        .clip-path-cta {
          clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%);
        }
      `}</style>
    </header>
  );
}
