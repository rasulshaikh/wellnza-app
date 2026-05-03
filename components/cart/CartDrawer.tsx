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
      <DrawerContent className="bg-white border-l border-[#E7E5E4] shadow-none">
        <DrawerHeader className="border-b border-[#E7E5E4] pb-4">
          <DrawerTitle className="font-['Merriweather'] text-[#1C1917] flex items-center gap-2 text-lg">
            <ShoppingBag className="h-5 w-5" />
            Your Cart ({items.length})
          </DrawerTitle>
        </DrawerHeader>
        <div className="flex-1 overflow-y-auto px-4">
          {items.length === 0 ? (
            <div className="py-12 text-center">
              <p className="font-['Raleway'] text-[#1C1917] text-base mb-2">Your cart is empty</p>
              <p className="text-sm text-[#78716C]">Add some products to get started</p>
              <Link
                href="/products"
                onClick={closeCart}
                className="font-['Raleway'] text-[#166534] underline-offset-4 hover:underline mt-4 inline-block"
              >
                Start shopping
              </Link>
            </div>
          ) : (
            <div className="py-4">
              {items.map((item: import("@/store/cart-store").CartItem) => (
                <div key={item.id} className="flex gap-3 py-4 border-b border-[#E7E5E4] last:border-b-0">
                  <div className="flex-1">
                    <p className="font-['Merriweather'] text-sm text-[#1C1917]">{item.name}</p>
                    <p className="font-['Raleway'] text-xs text-[#78716C]">{item.flavor}</p>
                    <p className="font-['Raleway'] text-sm font-medium text-[#1C1917]">{formatCurrency(item.price)}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="inline-flex size-7 items-center justify-center rounded-md border border-[#E7E5E4] bg-[#FFFFFF] hover:bg-[#F5F5F4] transition-all"
                      aria-label={item.quantity === 1 ? "Remove item" : "Decrease quantity"}
                    >
                      {item.quantity === 1 ? (
                        <Trash2 className="h-3 w-3 text-[#166534]" />
                      ) : (
                        <Minus className="h-3 w-3 text-[#166534]" />
                      )}
                    </button>
                    <span className="font-['Raleway'] w-8 text-center text-sm text-[#1C1917]">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= 10}
                      className="inline-flex size-7 items-center justify-center rounded-md border border-[#E7E5E4] bg-[#FFFFFF] hover:bg-[#F5F5F4] transition-all disabled:opacity-50 disabled:pointer-events-none"
                    >
                      <Plus className="h-3 w-3 text-[#166534]" />
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
          <DrawerFooter className="border-t border-[#E7E5E4] pt-4">
            <div className="flex justify-between items-center py-2">
              <span className="font-['Raleway'] font-medium text-[#1C1917]">Subtotal</span>
              <span className="font-['Raleway'] font-bold text-[#1C1917]">{formatCurrency(subtotal)}</span>
            </div>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="inline-flex h-12 w-full items-center justify-center gap-1.5 rounded-lg bg-[#166534] text-[#FFFFFF] font-['Raleway'] font-semibold text-base transition-all hover:bg-[#14532D] focus:outline-none focus:ring-2 focus:ring-[#166534] focus:ring-offset-2"
            >
              Proceed to Checkout
            </Link>
            <Link
              href="/cart"
              onClick={closeCart}
              className="inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-lg border border-[#E7E5E4] bg-[#FFFFFF] hover:bg-[#F5F5F4] font-['Raleway'] text-sm font-medium text-[#1C1917] transition-all"
            >
              View Cart
            </Link>
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  );
}
