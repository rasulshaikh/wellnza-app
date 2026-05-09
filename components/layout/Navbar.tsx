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
    <>
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300",
          scrolled ? "shadow-[0_4px_24px_rgba(11,15,12,0.22)]" : ""
        )}
        style={{ background: "#0B0F0C" }}
      >
        {/* Slim luxury nav bar */}
        <div
          className="relative"
          style={{
            borderBottom: "1px solid var(--luxury-border)",
          }}
        >
          {/* Gold shimmer line */}
          <div
            className="absolute inset-x-0 top-0 h-px luxury-shimmer"
            style={{
              background: "linear-gradient(90deg, transparent 0%, var(--luxury-gold) 30%, var(--luxury-gold-light) 50%, var(--luxury-gold) 70%, transparent 100%)",
            }}
          />

          <div className="container mx-auto flex h-[56px] items-center justify-between px-4 md:px-6">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <span
                className="text-[16px] leading-none transition-colors duration-300"
                style={{ color: "var(--luxury-gold)" }}
              >
                ◆
              </span>
              <span
                className="text-2xl uppercase tracking-[0.12em]"
                style={{
                  fontFamily: "var(--font-rajdhani,'Rajdhani',sans-serif)",
                  fontWeight: 700,
                  color: "#F7F3EC",
                  letterSpacing: "0.12em",
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
                    className="group relative px-5 py-2"
                    style={{
                      fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)",
                      fontSize: "11px",
                      fontWeight: 700,
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: active ? "var(--luxury-gold)" : "#8A9E90",
                      transition: "color 0.3s ease",
                    }}
                  >
                    <span className="relative z-10 transition-colors duration-300 group-hover:text-[var(--luxury-gold)]">
                      {link.label}
                    </span>
                    {/* Gold underline slide-in from left */}
                    <span
                      className="absolute bottom-0 left-5 right-5 h-[1px] origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100"
                      style={{
                        background: "linear-gradient(90deg, var(--luxury-gold-dark), var(--luxury-gold), var(--luxury-gold-light))",
                      }}
                    />
                  </Link>
                );
              })}
            </nav>

            {/* Right icons */}
            <div className="flex items-center gap-0.5">
              <Link
                href="/account"
                className="p-2.5 rounded"
                aria-label="Account"
              >
                <User
                  className="h-[18px] w-[18px] transition-colors duration-300"
                  style={{ color: "#8A9E90" }}
                />
              </Link>

              <Link
                href="/cart"
                className="relative p-2.5 rounded group"
                aria-label={`Cart ${itemCount} items`}
              >
                <ShoppingBag
                  className="h-[18px] w-[18px] transition-colors duration-300"
                  style={{ color: itemCount > 0 ? "var(--luxury-gold)" : "#8A9E90" }}
                />
                {itemCount > 0 && (
                  <span
                    className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full flex items-center justify-center text-[9px] font-bold"
                    style={{
                      background: "var(--luxury-gold)",
                      color: "#0B0F0C",
                    }}
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
                {mobileOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile full-screen overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 flex flex-col items-center justify-center md:hidden"
          style={{ background: "rgba(11,15,12,0.97)" }}
        >
          {/* Shimmer top border */}
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{
              background: "linear-gradient(90deg, transparent 0%, var(--luxury-gold) 50%, transparent 100%)",
            }}
          />

          {/* Close button */}
          <button
            className="absolute top-4 right-4 p-2.5 rounded"
            style={{ color: "var(--luxury-gold)" }}
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </button>

          <nav className="flex flex-col items-center gap-8">
            {navLinks.map((link, i) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="relative group"
                  style={{
                    fontFamily: "var(--font-rajdhani,'Rajdhani',sans-serif)",
                    fontSize: "28px",
                    fontWeight: 700,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: active ? "var(--luxury-gold)" : "#8A9E90",
                    transition: "color 0.3s ease",
                  }}
                >
                  <span className="relative z-10 transition-colors duration-300 group-hover:text-[var(--luxury-gold)]">
                    {link.label}
                  </span>
                  {/* Gold underline slide-in */}
                  <span
                    className="absolute -bottom-1 left-0 right-0 h-[1px] origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100"
                    style={{
                      background: "linear-gradient(90deg, var(--luxury-gold-dark), var(--luxury-gold), var(--luxury-gold-light))",
                    }}
                  />
                </Link>
              );
            })}

            {/* Divider */}
            <div
              className="w-16 h-px"
              style={{
                background: "linear-gradient(90deg, transparent, var(--luxury-border), transparent)",
              }}
            />

            {/* Cart link */}
            <Link
              href="/cart"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3"
              style={{
                fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)",
                fontSize: "13px",
                fontWeight: 600,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: itemCount > 0 ? "var(--luxury-gold)" : "#8A9E90",
              }}
            >
              <ShoppingBag className="h-5 w-5" />
              Cart {itemCount > 0 && `(${itemCount})`}
            </Link>
          </nav>

          {/* Bottom gold line */}
          <div
            className="absolute bottom-0 left-0 right-0 h-px"
            style={{
              background: "linear-gradient(90deg, transparent 0%, var(--luxury-gold) 50%, transparent 100%)",
            }}
          />
        </div>
      )}
    </>
  );
}