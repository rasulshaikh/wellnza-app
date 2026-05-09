"use client";

import { useCartStore } from "@/store/cart-store";
import { formatCurrency } from "@/lib/utils";
import { X, Minus, Plus, ShoppingBag, Trash2, Shield, Zap, CheckCircle } from "lucide-react";
import Link from "next/link";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer";

export function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem } = useCartStore();
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <DrawerContent className="border-l shadow-none" style={{ background: "var(--luxury-cream)", borderColor: "var(--luxury-border)" }}>
        <DrawerHeader className="border-b pb-4" style={{ borderColor: "var(--luxury-border)" }}>
          <DrawerTitle className="flex items-center gap-2 text-lg" style={{ fontFamily: "'Playfair Display', serif", color: "var(--luxury-text)", fontWeight: 600 }}>
            <ShoppingBag className="h-5 w-5" style={{ color: "var(--luxury-gold)" }} />
            Your Cart ({items.length})
          </DrawerTitle>
        </DrawerHeader>
        <div className="flex-1 overflow-y-auto px-4">
          {items.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-base mb-2" style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--luxury-text)" }}>Your cart is empty</p>
              <p className="text-sm" style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--luxury-text-muted)" }}>Add some products to get started</p>
              <Link
                href="/products"
                onClick={closeCart}
                className="underline-offset-4 hover:underline mt-4 inline-block"
                style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--luxury-gold-dark)" }}
              >
                Start shopping
              </Link>
            </div>
          ) : (
            <div className="py-4 space-y-3">
              {items.map((item: import("@/store/cart-store").CartItem) => (
                <div key={item.id} className="card-premium rounded-lg p-3 flex gap-3">
                  <div className="flex-1">
                    <p className="text-sm font-medium" style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--luxury-text)" }}>{item.name}</p>
                    <p className="text-xs" style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--luxury-text-muted)" }}>{item.flavor}</p>
                    <p className="text-sm luxury-price" style={{ color: "var(--luxury-gold-dark)" }}>{formatCurrency(item.price)}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="inline-flex size-7 items-center justify-center rounded-md transition-all"
                      style={{ border: "1px solid var(--luxury-border)", background: "var(--luxury-cream)" }}
                      aria-label={item.quantity === 1 ? "Remove item" : "Decrease quantity"}
                    >
                      {item.quantity === 1 ? (
                        <Trash2 className="h-3 w-3" style={{ color: "var(--luxury-gold-dark)" }} />
                      ) : (
                        <Minus className="h-3 w-3" style={{ color: "var(--luxury-gold-dark)" }} />
                      )}
                    </button>
                    <span className="w-8 text-center text-sm" style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--luxury-text)" }}>{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= 10}
                      className="inline-flex size-7 items-center justify-center rounded-md transition-all disabled:opacity-50 disabled:pointer-events-none"
                      style={{ border: "1px solid var(--luxury-border)", background: "var(--luxury-cream)" }}
                    >
                      <Plus className="h-3 w-3" style={{ color: "var(--luxury-gold-dark)" }} />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="inline-flex size-7 items-center justify-center rounded-md text-[#B91C1C] hover:bg-[#FEF2F2] transition-all bg-transparent"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {items.length > 0 && (
          <DrawerFooter className="border-t pt-4" style={{ borderColor: "var(--luxury-border)" }}>
            {/* Trust badges - refined and small */}
            <div className="flex items-center justify-center gap-4 py-2">
              <div className="flex items-center gap-1">
                <Shield className="h-3 w-3" style={{ color: "var(--luxury-gold)" }} />
                <span className="text-xs" style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--luxury-text-muted)" }}>Secure Checkout</span>
              </div>
              <div className="flex items-center gap-1">
                <Zap className="h-3 w-3" style={{ color: "var(--luxury-gold)" }} />
                <span className="text-xs" style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--luxury-text-muted)" }}>Fast Delivery</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3" style={{ color: "var(--luxury-gold)" }} />
                <span className="text-xs" style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--luxury-text-muted)" }}>Quality Guaranteed</span>
              </div>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="font-medium" style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--luxury-text)" }}>Subtotal</span>
              <span className="font-bold luxury-price" style={{ color: "var(--luxury-text)" }}>{formatCurrency(subtotal)}</span>
            </div>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="btn-gold justify-center"
            >
              Proceed to Checkout
            </Link>
            <Link
              href="/cart"
              onClick={closeCart}
              className="inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-lg text-sm font-medium transition-all"
              style={{ border: "1px solid var(--luxury-border)", background: "var(--luxury-cream)", fontFamily: "'DM Sans', sans-serif", color: "var(--luxury-text)" }}
            >
              View Cart
            </Link>
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  );
}