"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, User, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Shop" },
  { href: "/about", label: "About" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const itemCount = useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0));

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled ? "shadow-[0_4px_24px_rgba(11,15,12,0.22)]" : ""
      )}
      style={{ background: "#0B0F0C", borderBottom: "1px solid rgba(232,160,32,0.12)" }}
    >
      {/* Micro-bar: brand origin */}
      <div
        className="hidden md:flex items-center justify-center py-1.5"
        style={{
          background: "linear-gradient(90deg, #14532D 0%, #0B0F0C 35%, #0B0F0C 65%, #14532D 100%)",
          borderBottom: "1px solid rgba(232,160,32,0.08)",
        }}
      >
        <p
          className="text-[10px] tracking-[0.2em] uppercase"
          style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", color: "rgba(232,160,32,0.75)" }}
        >
          ◆&nbsp;&nbsp;Born in Amravati, Maharashtra&nbsp;&nbsp;·&nbsp;&nbsp;Made for Every Indian Athlete&nbsp;&nbsp;◆
        </p>
      </div>

      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span style={{ color: "#E8A020", fontSize: "18px", lineHeight: 1 }}>◆</span>
          <span
            className="text-2xl uppercase tracking-widest"
            style={{
              fontFamily: "var(--font-rajdhani,'Rajdhani',sans-serif)",
              fontWeight: 700,
              color: "#F7F3EC",
              letterSpacing: "0.1em",
            }}
          >
            Wellnza
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-5 py-2 transition-colors duration-200"
                style={{
                  fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: active ? "#E8A020" : "#8A9E90",
                }}
              >
                {link.label}
                {active && (
                  <span
                    className="absolute bottom-0 left-5 right-5 h-[2px] rounded-full"
                    style={{ background: "linear-gradient(90deg,#E8A020,#F5C842)" }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right icons */}
        <div className="flex items-center gap-0.5">
          <Link href="/account" className="p-2.5 rounded" aria-label="Account">
            <User className="h-[18px] w-[18px] transition-colors" style={{ color: "#8A9E90" }} />
          </Link>

          <Link href="/cart" className="relative p-2.5 rounded" aria-label={`Cart ${itemCount} items`}>
            <ShoppingBag
              className="h-[18px] w-[18px] transition-colors"
              style={{ color: itemCount > 0 ? "#E8A020" : "#8A9E90" }}
            />
            {itemCount > 0 && (
              <span
                className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full flex items-center justify-center text-[9px] font-bold"
                style={{ background: "#E8A020", color: "#0B0F0C" }}
              >
                {itemCount > 9 ? "9+" : itemCount}
              </span>
            )}
          </Link>

          <button
            className="md:hidden p-2.5 rounded ml-1"
            style={{ color: "#8A9E90" }}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="md:hidden border-t"
          style={{ background: "#141A16", borderColor: "rgba(232,160,32,0.12)" }}
        >
          <nav className="flex flex-col px-4 py-3 gap-1">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "px-3 py-3 text-[11px] font-bold uppercase tracking-[0.18em] rounded transition-colors",
                    active
                      ? "text-[#E8A020] bg-[rgba(232,160,32,0.08)]"
                      : "text-[#8A9E90] hover:text-[#F7F3EC]"
                  )}
                  style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)" }}
                >
                  {active && <span className="mr-2" style={{ color: "#E8A020" }}>◆</span>}
                  {link.label}
                </Link>
              );
            })}
            <p
              className="mt-3 pt-3 text-center text-[10px] tracking-[0.2em] uppercase"
              style={{ borderTop: "1px solid rgba(232,160,32,0.1)", color: "rgba(232,160,32,0.45)" }}
            >
              Born in Amravati · ◆ · Maharashtra
            </p>
          </nav>
        </div>
      )}
    </header>
  );
}
