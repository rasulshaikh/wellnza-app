"use client";

import { useCartStore } from "@/store/cart-store";
import { formatCurrency } from "@/lib/utils";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer";

export function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem } = useCartStore();
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Your Cart ({items.length})
          </DrawerTitle>
        </DrawerHeader>
        <div className="flex-1 overflow-y-auto px-4">
          {items.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              <ShoppingBag className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>Your cart is empty</p>
              <Link
                href="/products"
                onClick={closeCart}
                className="text-primary underline-offset-4 hover:underline mt-2 inline-block"
              >
                Start shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4 py-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.flavor}</p>
                    <p className="text-sm font-mono">{formatCurrency(item.price)}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="inline-flex size-7 items-center justify-center rounded-[min(var(--radius-md),12px)] border border-border bg-background hover:bg-muted hover:text-foreground transition-all"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= 10}
                      className="inline-flex size-7 items-center justify-center rounded-[min(var(--radius-md),12px)] border border-border bg-background hover:bg-muted hover:text-foreground transition-all disabled:opacity-50 disabled:pointer-events-none"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="inline-flex size-7 items-center justify-center rounded-[min(var(--radius-md),12px)] hover:bg-muted hover:text-foreground text-destructive transition-all"
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
          <DrawerFooter>
            <div className="flex justify-between items-center py-2">
              <span className="font-medium">Subtotal</span>
              <span className="font-mono font-bold">{formatCurrency(subtotal)}</span>
            </div>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium transition-all focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50"
            >
              Proceed to Checkout
            </Link>
            <Link
              href="/cart"
              onClick={closeCart}
              className="inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-lg border border-border bg-background hover:bg-muted hover:text-foreground text-sm font-medium transition-all"
            >
              View Cart
            </Link>
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  );
}
