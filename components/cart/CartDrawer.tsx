"use client";

import { useCartStore } from "@/store/cart-store";
import { formatCurrency } from "@/lib/utils";
import { X, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import Link from "next/link";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer";

export function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem } = useCartStore();
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <DrawerContent className="border-l shadow-none" style={{ background: "#FAFAF8", borderColor: "rgba(46,125,50,0.15)" }}>
        <DrawerHeader className="border-b pb-4" style={{ borderColor: "rgba(46,125,50,0.15)" }}>
          <DrawerTitle className="flex items-center gap-2 text-lg" style={{ fontFamily: "'Playfair Display', serif", color: "#1a1a1a" }}>
            <ShoppingBag className="h-5 w-5" />
            Your Cart ({items.length})
          </DrawerTitle>
        </DrawerHeader>
        <div className="flex-1 overflow-y-auto px-4">
          {items.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-base mb-2" style={{ fontFamily: "'DM Sans', sans-serif", color: "#1a1a1a" }}>Your cart is empty</p>
              <p className="text-sm" style={{ color: "#7B9E6B" }}>Add some products to get started</p>
              <Link
                href="/products"
                onClick={closeCart}
                className="underline-offset-4 hover:underline mt-4 inline-block"
                style={{ fontFamily: "'DM Sans', sans-serif", color: "#2E7D32" }}
              >
                Start shopping
              </Link>
            </div>
          ) : (
            <div className="py-4">
              {items.map((item: import("@/store/cart-store").CartItem) => (
                <div key={item.id} className="flex gap-3 py-4 border-b last:border-b-0" style={{ borderColor: "rgba(46,125,50,0.15)" }}>
                  <div className="flex-1">
                    <p className="text-sm" style={{ fontFamily: "'DM Sans', sans-serif", color: "#1a1a1a" }}>{item.name}</p>
                    <p className="text-xs" style={{ fontFamily: "'DM Sans', sans-serif", color: "#7B9E6B" }}>{item.flavor}</p>
                    <p className="text-sm font-medium" style={{ fontFamily: "'DM Sans', sans-serif", color: "#1a1a1a" }}>{formatCurrency(item.price)}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="inline-flex size-7 items-center justify-center rounded-md transition-all"
                      style={{ border: "1px solid rgba(46,125,50,0.15)", background: "#FAFAF8" }}
                      aria-label={item.quantity === 1 ? "Remove item" : "Decrease quantity"}
                    >
                      {item.quantity === 1 ? (
                        <Trash2 className="h-3 w-3" style={{ color: "#2E7D32" }} />
                      ) : (
                        <Minus className="h-3 w-3" style={{ color: "#2E7D32" }} />
                      )}
                    </button>
                    <span className="w-8 text-center text-sm" style={{ fontFamily: "'DM Sans', sans-serif", color: "#1a1a1a" }}>{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= 10}
                      className="inline-flex size-7 items-center justify-center rounded-md transition-all disabled:opacity-50 disabled:pointer-events-none"
                      style={{ border: "1px solid rgba(46,125,50,0.15)", background: "#FAFAF8" }}
                    >
                      <Plus className="h-3 w-3" style={{ color: "#2E7D32" }} />
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
          <DrawerFooter className="border-t pt-4" style={{ borderColor: "rgba(46,125,50,0.15)" }}>
            <div className="flex justify-between items-center py-2">
              <span className="font-medium" style={{ fontFamily: "'DM Sans', sans-serif", color: "#1a1a1a" }}>Subtotal</span>
              <span className="font-bold" style={{ fontFamily: "'DM Sans', sans-serif", color: "#1a1a1a" }}>{formatCurrency(subtotal)}</span>
            </div>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="inline-flex h-12 w-full items-center justify-center gap-1.5 rounded-lg text-base font-semibold transition-all hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{ fontFamily: "'DM Sans', sans-serif", background: "#2E7D32", color: "#fff" }}
            >
              Proceed to Checkout
            </Link>
            <Link
              href="/cart"
              onClick={closeCart}
              className="inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-lg text-sm font-medium transition-all"
              style={{ border: "1px solid rgba(46,125,50,0.15)", background: "#FAFAF8", fontFamily: "'DM Sans', sans-serif", color: "#1a1a1a" }}
            >
              View Cart
            </Link>
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  );
}
