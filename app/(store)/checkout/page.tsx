"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import { useSession } from "next-auth/react";
import { useCartStore } from "@/store/cart-store";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SHIPPING_METHODS, calculateShipping, FREE_SHIPPING_THRESHOLD } from "@/lib/shipping";
import {
  ArrowLeft,
  Shield,
  Zap,
  CheckCircle,
  MapPin,
  CreditCard,
  Truck,
  Lock,
  LogIn,
} from "lucide-react";

// Razorpay browser SDK types
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: new (options: Record<string, unknown>) => { open(): void; on(event: string, handler: (data: unknown) => void): void };
  }
}

interface AddressFormData {
  name: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  pin: string;
}

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry",
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart } = useCartStore();
  const { status: authStatus } = useSession();
  const isGuest = authStatus === "unauthenticated";
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<"contact" | "shipping" | "payment">("contact");
  const [shippingMethod, setShippingMethod] = useState<"standard" | "express">("standard");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [addressForm, setAddressForm] = useState<AddressFormData>({
    name: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pin: "",
  });

  const [sameAsContact, setSameAsContact] = useState(true);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<"RAZORPAY" | "COD">("RAZORPAY");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#FAFAF8" }}>
        <div className="animate-pulse text-sm tracking-widest" style={{ color: "#2E7D32", fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)" }}>
          Loading...
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#FAFAF8" }}>
        <div className="text-center max-w-md">
          <p
            className="text-sm mb-4"
            style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", color: "#7B9E6B" }}
          >
            Your cart is empty. Add items before checkout.
          </p>
          <Link href="/products">
            <button
              className="px-8 py-3 text-sm font-semibold tracking-wider"
              style={{
                fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)",
                background: "#2E7D32",
                color: "#fff",
                borderRadius: "6px",
              }}
            >
              Shop Supplements
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = calculateShipping(subtotal, shippingMethod);
  const total = subtotal + shipping;

  const isContactValid = () => {
    return (
      contactForm.name.trim().length >= 2 &&
      /^[6-9]\d{9}$/.test(contactForm.phone.replace(/\D/g, "")) &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactForm.email)
    );
  };

  const isAddressValid = () => {
    return (
      addressForm.name.trim().length >= 2 &&
      /^[6-9]\d{9}$/.test(addressForm.phone.replace(/\D/g, "")) &&
      addressForm.line1.trim().length >= 3 &&
      addressForm.city.trim().length >= 2 &&
      addressForm.state.trim().length >= 2 &&
      /^[1-9]\d{5}$/.test(addressForm.pin)
    );
  };

  const handleContactContinue = () => {
    if (isContactValid()) {
      if (sameAsContact) {
        setAddressForm({
          name: contactForm.name,
          phone: contactForm.phone.replace(/\D/g, ""),
          line1: "",
          line2: "",
          city: "",
          state: "",
          pin: "",
        });
        setStep("shipping");
      } else {
        setShowAddressForm(true);
        setStep("shipping");
      }
    }
  };

  const handleShippingContinue = () => {
    if (isAddressValid()) {
      setStep("payment");
    }
  };

  const handlePlaceOrder = async (paymentMethod: "RAZORPAY" | "COD") => {
    setError(null);
    setIsProcessing(true);

    try {
      const res = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartItems: items.map((item) => ({
            productVariantId: item.productVariantId,
            quantity: item.quantity,
          })),
          paymentMethod,
          shippingMethod: shippingMethod.toUpperCase(),
          guestEmail: contactForm.email,
          guestPhone: contactForm.phone.replace(/\D/g, ""),
          guestName: contactForm.name,
          guestAddress: sameAsContact
            ? {
                name: contactForm.name,
                phone: contactForm.phone.replace(/\D/g, ""),
                line1: addressForm.line1,
                line2: addressForm.line2,
                city: addressForm.city,
                state: addressForm.state,
                pin: addressForm.pin,
              }
            : {
                name: addressForm.name,
                phone: addressForm.phone.replace(/\D/g, ""),
                line1: addressForm.line1,
                line2: addressForm.line2,
                city: addressForm.city,
                state: addressForm.state,
                pin: addressForm.pin,
              },
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create order");
      }

      const data = await res.json();

      if (paymentMethod === "COD") {
        clearCart();
        router.push(`/order-confirmation/${data.orderId}`);
        return;
      }

      // Razorpay flow — use browser checkout.js (loaded via <Script> tag below)
      const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      if (!razorpayKey || !data.razorpayOrderId) {
        throw new Error("Razorpay not configured");
      }
      if (typeof window === "undefined" || !window.Razorpay) {
        throw new Error("Razorpay SDK not loaded. Please refresh and try again.");
      }

      const options: Record<string, unknown> = {
        key: razorpayKey,
        order_id: data.razorpayOrderId,
        amount: data.total * 100, // convert rupees → paise for Razorpay browser SDK
        currency: "INR",
        name: "Wellnza Nutrition",
        description: `Order #${data.orderNumber}`,
        image: "/logo.png",
        prefill: {
          name: contactForm.name,
          email: contactForm.email,
          contact: contactForm.phone.replace(/\D/g, ""),
        },
        theme: { color: "#2E7D32" },
        handler: async (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
          try {
            const verifyRes = await fetch("/api/checkout/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId: data.orderId,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
              }),
            });
            if (verifyRes.ok) {
              clearCart();
              router.push(`/order-confirmation/${data.orderId}`);
            } else {
              setError("Payment verification failed. Please contact support.");
              setIsProcessing(false);
            }
          } catch {
            setError("Payment verification failed. Please contact support.");
            setIsProcessing(false);
          }
        },
        modal: {
          ondismiss: () => {
            setError("Payment cancelled. Please try again.");
            setIsProcessing(false);
          },
        },
      };

      const rz = new window.Razorpay(options);
      rz.on("payment.failed", (resp: unknown) => {
        const r = resp as { error?: { description?: string } };
        setError(r?.error?.description || "Payment failed. Please try again.");
        setIsProcessing(false);
      });
      rz.open();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setError(message);
      setIsProcessing(false);
    }
  };

  return (
    <>
    {/* Load Razorpay browser checkout SDK */}
    <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
    <div className="min-h-screen py-8" style={{ background: "#FAFAF8" }}>
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link
            href="/cart"
            className="inline-flex items-center justify-center w-10 h-10 border transition-colors"
            style={{ borderColor: "rgba(46, 125, 50, 0.15)", color: "#7B9E6B" }}
            aria-label="Back to cart"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1
            className="text-3xl font-bold"
            style={{ fontFamily: "var(--font-rajdhani,'Rajdhani',sans-serif)", color: "#1a1a1a", letterSpacing: "1px" }}
          >
            Checkout
          </h1>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center gap-2 mb-8">
          {(["contact", "shipping", "payment"] as const).map((s, i) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <button
                onClick={() => {
                  if (s === "contact") setStep("contact");
                  if (s === "shipping" && (step === "shipping" || step === "payment")) setStep("shipping");
                  if (s === "payment" && step === "payment") setStep("payment");
                }}
                className="flex items-center gap-2 flex-1"
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold"
                  style={{
                    background: step === s ? "#2E7D32" : ["contact", "shipping", "payment"].indexOf(step) > i ? "#2E7D32" : "rgba(46,125,50,0.1)",
                    color: step === s ? "#fff" : "#7B9E6B",
                  }}
                >
                  {["contact", "shipping", "payment"].indexOf(step) > i ? <CheckCircle className="w-4 h-4" /> : i + 1}
                </div>
                <span
                  className="text-sm font-medium hidden sm:block"
                  style={{
                    fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)",
                    color: step === s ? "#1a1a1a" : "#7B9E6B",
                  }}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </span>
              </button>
              {i < 2 && <div className="h-px flex-1" style={{ background: "rgba(46,125,50,0.15)" }} />}
            </div>
          ))}
        </div>

        {/* Guest checkout notice — shown only to unauthenticated visitors */}
        {isGuest && (
          <div
            className="mb-6 flex items-center justify-between gap-4 px-4 py-3 rounded-md"
            style={{
              background: "rgba(46, 125, 50, 0.05)",
              border: "1px solid rgba(46, 125, 50, 0.18)",
            }}
          >
            <div className="flex items-center gap-3">
              <LogIn className="w-4 h-4 flex-shrink-0" style={{ color: "#2E7D32" }} />
              <p
                className="text-sm"
                style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", color: "#7B9E6B" }}
              >
                <strong style={{ color: "#1a1a1a" }}>Checking out as guest.</strong>{" "}
                Sign in to track your order and earn rewards.
              </p>
            </div>
            <Link
              href={`/login?callbackUrl=${encodeURIComponent("/checkout")}`}
              className="flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded"
              style={{
                fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)",
                background: "#2E7D32",
                color: "#fff",
              }}
            >
              Sign In
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Contact */}
            {step === "contact" && (
              <div
                className="p-6 bg-white rounded-md"
                style={{
                  border: "1px solid rgba(46, 125, 50, 0.15)",
                  boxShadow: "0 2px 8px rgba(46, 125, 50, 0.06)",
                }}
              >
                <div className="flex items-center gap-2 mb-6">
                  <CreditCard className="w-5 h-5" style={{ color: "#2E7D32" }} />
                  <h2
                    className="font-semibold"
                    style={{ fontFamily: "var(--font-rajdhani,'Rajdhani',sans-serif)", color: "#1a1a1a" }}
                  >
                    Contact Information
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs mb-1.5" style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", color: "#7B9E6B" }}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={contactForm.name}
                      onChange={(e) => setContactForm((f) => ({ ...f, name: e.target.value }))}
                      placeholder="Rahul Sharma"
                      className="w-full h-11 px-3 border text-sm"
                      style={{
                        borderColor: "rgba(46, 125, 50, 0.15)",
                        background: "#fff",
                        color: "#1a1a1a",
                        fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)",
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs mb-1.5" style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", color: "#7B9E6B" }}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm((f) => ({ ...f, email: e.target.value }))}
                      placeholder="rahul@example.com"
                      className="w-full h-11 px-3 border text-sm"
                      style={{
                        borderColor: "rgba(46, 125, 50, 0.15)",
                        background: "#fff",
                        color: "#1a1a1a",
                        fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)",
                      }}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs mb-1.5" style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", color: "#7B9E6B" }}>
                      Phone Number (10 digits)
                    </label>
                    <input
                      type="tel"
                      value={contactForm.phone}
                      onChange={(e) => setContactForm((f) => ({ ...f, phone: e.target.value }))}
                      placeholder="9876543210"
                      maxLength={10}
                      className="w-full h-11 px-3 border text-sm"
                      style={{
                        borderColor: "rgba(46, 125, 50, 0.15)",
                        background: "#fff",
                        color: "#1a1a1a",
                        fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)",
                      }}
                    />
                  </div>
                </div>

                <button
                  onClick={handleContactContinue}
                  disabled={!isContactValid()}
                  className="w-full mt-6 py-3 text-sm font-semibold tracking-wider transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)",
                    background: "#2E7D32",
                    color: "#fff",
                    borderRadius: "6px",
                    letterSpacing: "1px",
                  }}
                >
                  Continue to Shipping
                </button>
              </div>
            )}

            {/* Step 2: Shipping Address */}
            {step === "shipping" && (
              <div
                className="p-6 bg-white rounded-md"
                style={{
                  border: "1px solid rgba(46, 125, 50, 0.15)",
                  boxShadow: "0 2px 8px rgba(46, 125, 50, 0.06)",
                }}
              >
                <div className="flex items-center gap-2 mb-6">
                  <MapPin className="w-5 h-5" style={{ color: "#2E7D32" }} />
                  <h2
                    className="font-semibold"
                    style={{ fontFamily: "var(--font-rajdhani,'Rajdhani',sans-serif)", color: "#1a1a1a" }}
                  >
                    Shipping Address
                  </h2>
                </div>

                <div
                  className="p-4 rounded-md mb-4 cursor-pointer transition-colors"
                  style={{
                    background: sameAsContact ? "rgba(46, 125, 50, 0.06)" : "transparent",
                    border: `1px solid ${sameAsContact ? "rgba(46, 125, 50, 0.3)" : "rgba(46, 125, 50, 0.15)"}`,
                  }}
                  onClick={() => setSameAsContact(!sameAsContact)}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={sameAsContact}
                      onChange={() => setSameAsContact(!sameAsContact)}
                      className="w-4 h-4 accent-[#2E7D32]"
                    />
                    <div>
                      <p className="text-sm font-medium" style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", color: "#1a1a1a" }}>
                        Same as contact details
                      </p>
                      <p className="text-xs mt-0.5" style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", color: "#7B9E6B" }}>
                        {contactForm.name} · {contactForm.phone} · {contactForm.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Delivery address fields — always shown; name/phone auto-filled when "same as contact" */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    {!sameAsContact && (
                    <>
                    <div className="sm:col-span-2">
                      <label className="block text-xs mb-1.5" style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", color: "#7B9E6B" }}>
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={addressForm.name}
                        onChange={(e) => setAddressForm((f) => ({ ...f, name: e.target.value }))}
                        placeholder="Full delivery name"
                        className="w-full h-11 px-3 border text-sm"
                        style={{
                          borderColor: "rgba(46, 125, 50, 0.15)",
                          background: "#fff",
                          color: "#1a1a1a",
                          fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)",
                        }}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs mb-1.5" style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", color: "#7B9E6B" }}>
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={addressForm.phone}
                        onChange={(e) => setAddressForm((f) => ({ ...f, phone: e.target.value }))}
                        placeholder="10-digit mobile"
                        maxLength={10}
                        className="w-full h-11 px-3 border text-sm"
                        style={{
                          borderColor: "rgba(46, 125, 50, 0.15)",
                          background: "#fff",
                          color: "#1a1a1a",
                          fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)",
                        }}
                      />
                    </div>
                    </>
                    )}
                    <div className="sm:col-span-2">
                      <label className="block text-xs mb-1.5" style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", color: "#7B9E6B" }}>
                        Address Line 1
                      </label>
                      <input
                        type="text"
                        value={addressForm.line1}
                        onChange={(e) => setAddressForm((f) => ({ ...f, line1: e.target.value }))}
                        placeholder="House/Flat number, Street"
                        className="w-full h-11 px-3 border text-sm"
                        style={{
                          borderColor: "rgba(46, 125, 50, 0.15)",
                          background: "#fff",
                          color: "#1a1a1a",
                          fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)",
                        }}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs mb-1.5" style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", color: "#7B9E6B" }}>
                        Address Line 2 (Optional)
                      </label>
                      <input
                        type="text"
                        value={addressForm.line2}
                        onChange={(e) => setAddressForm((f) => ({ ...f, line2: e.target.value }))}
                        placeholder="Landmark, Area"
                        className="w-full h-11 px-3 border text-sm"
                        style={{
                          borderColor: "rgba(46, 125, 50, 0.15)",
                          background: "#fff",
                          color: "#1a1a1a",
                          fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)",
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-xs mb-1.5" style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", color: "#7B9E6B" }}>
                        City
                      </label>
                      <input
                        type="text"
                        value={addressForm.city}
                        onChange={(e) => setAddressForm((f) => ({ ...f, city: e.target.value }))}
                        placeholder="Mumbai"
                        className="w-full h-11 px-3 border text-sm"
                        style={{
                          borderColor: "rgba(46, 125, 50, 0.15)",
                          background: "#fff",
                          color: "#1a1a1a",
                          fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)",
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-xs mb-1.5" style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", color: "#7B9E6B" }}>
                        State
                      </label>
                      <select
                        value={addressForm.state}
                        onChange={(e) => setAddressForm((f) => ({ ...f, state: e.target.value }))}
                        className="w-full h-11 px-3 border text-sm"
                        style={{
                          borderColor: "rgba(46, 125, 50, 0.15)",
                          background: "#fff",
                          color: addressForm.state ? "#1a1a1a" : "#7B9E6B",
                          fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)",
                        }}
                      >
                        <option value="">Select State</option>
                        {INDIAN_STATES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs mb-1.5" style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", color: "#7B9E6B" }}>
                        PIN Code
                      </label>
                      <input
                        type="text"
                        value={addressForm.pin}
                        onChange={(e) => setAddressForm((f) => ({ ...f, pin: e.target.value.replace(/\D/g, "").slice(0, 6) }))}
                        placeholder="400001"
                        maxLength={6}
                        className="w-full h-11 px-3 border text-sm"
                        style={{
                          borderColor: "rgba(46, 125, 50, 0.15)",
                          background: "#fff",
                          color: "#1a1a1a",
                          fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)",
                        }}
                      />
                    </div>
                  </div>

                {/* Shipping Method */}
                <div className="mt-6 pt-6 border-t" style={{ borderColor: "rgba(46,125,50,0.15)" }}>
                  <div className="flex items-center gap-2 mb-4">
                    <Truck className="w-4 h-4" style={{ color: "#2E7D32" }} />
                    <h3
                      className="text-sm font-semibold"
                      style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", color: "#1a1a1a" }}
                    >
                      Shipping Method
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {SHIPPING_METHODS.map((method) => (
                      <label
                        key={method.id}
                        className="flex items-center gap-3 p-4 rounded-md cursor-pointer transition-colors"
                        style={{
                          background: shippingMethod === method.id ? "rgba(46, 125, 50, 0.06)" : "transparent",
                          border: `1px solid ${shippingMethod === method.id ? "rgba(46, 125, 50, 0.3)" : "rgba(46, 125, 50, 0.15)"}`,
                        }}
                      >
                        <input
                          type="radio"
                          name="shippingMethod"
                          value={method.id}
                          checked={shippingMethod === method.id}
                          onChange={() => setShippingMethod(method.id as "standard" | "express")}
                          className="w-4 h-4 accent-[#2E7D32]"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium" style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", color: "#1a1a1a" }}>
                            {method.name}
                          </p>
                          <p className="text-xs" style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", color: "#7B9E6B" }}>
                            {method.description} · {method.days}
                          </p>
                        </div>
                        <span
                          className="text-sm font-semibold"
                          style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", color: "#2E7D32" }}
                        >
                          {formatCurrency(method.price)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setStep("contact")}
                    className="px-4 py-3 text-sm border transition-colors"
                    style={{
                      fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)",
                      borderColor: "rgba(46, 125, 50, 0.15)",
                      color: "#7B9E6B",
                      borderRadius: "6px",
                    }}
                  >
                    Back
                  </button>
                  <button
                    onClick={handleShippingContinue}
                    className="flex-1 py-3 text-sm font-semibold tracking-wider"
                    style={{
                      fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)",
                      background: "#2E7D32",
                      color: "#fff",
                      borderRadius: "6px",
                      letterSpacing: "1px",
                    }}
                  >
                    Continue to Payment
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Payment */}
            {step === "payment" && (
              <div
                className="p-6 bg-white rounded-md"
                style={{
                  border: "1px solid rgba(46, 125, 50, 0.15)",
                  boxShadow: "0 2px 8px rgba(46, 125, 50, 0.06)",
                }}
              >
                <div className="flex items-center gap-2 mb-6">
                  <Lock className="w-5 h-5" style={{ color: "#2E7D32" }} />
                  <h2
                    className="font-semibold"
                    style={{ fontFamily: "var(--font-rajdhani,'Rajdhani',sans-serif)", color: "#1a1a1a" }}
                  >
                    Payment Method
                  </h2>
                </div>

                <div className="space-y-4">
                  {/* Razorpay */}
                  <label
                    className="flex items-center gap-3 p-4 rounded-md cursor-pointer transition-colors"
                    style={{
                      background: selectedPaymentMethod === "RAZORPAY" ? "rgba(46, 125, 50, 0.08)" : "rgba(46, 125, 50, 0.04)",
                      border: selectedPaymentMethod === "RAZORPAY" ? "1px solid rgba(46, 125, 50, 0.4)" : "1px solid rgba(46, 125, 50, 0.15)",
                    }}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="RAZORPAY"
                      checked={selectedPaymentMethod === "RAZORPAY"}
                      onChange={() => setSelectedPaymentMethod("RAZORPAY")}
                      className="w-4 h-4 accent-[#2E7D32]"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium" style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", color: "#1a1a1a" }}>
                        Pay with Razorpay
                      </p>
                      <p className="text-xs mt-0.5" style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", color: "#7B9E6B" }}>
                        UPI, Cards, NetBanking, Wallets
                      </p>
                    </div>
                    <div className="flex gap-1">
                      {["visa", "mastercard", "upi"].map((method) => (
                        <span
                          key={method}
                          className="text-[10px] px-1.5 py-0.5 rounded"
                          style={{ background: "rgba(46,125,50,0.08)", color: "#7B9E6B", fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)" }}
                        >
                          {method}
                        </span>
                      ))}
                    </div>
                  </label>

                  {/* COD */}
                  <label
                    className="flex items-center gap-3 p-4 rounded-md cursor-pointer transition-colors"
                    style={{
                      background: selectedPaymentMethod === "COD" ? "rgba(46, 125, 50, 0.08)" : "transparent",
                      border: selectedPaymentMethod === "COD" ? "1px solid rgba(46, 125, 50, 0.4)" : "1px solid rgba(46, 125, 50, 0.15)",
                    }}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={selectedPaymentMethod === "COD"}
                      onChange={() => setSelectedPaymentMethod("COD")}
                      className="w-4 h-4 accent-[#2E7D32]"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium" style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", color: "#1a1a1a" }}>
                        Cash on Delivery
                      </p>
                      <p className="text-xs mt-0.5" style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", color: "#7B9E6B" }}>
                        Pay when you receive your order
                      </p>
                    </div>
                  </label>
                </div>

                {error && (
                  <p
                    className="mt-4 text-xs p-3 rounded-md"
                    style={{
                      background: "rgba(239, 68, 68, 0.08)",
                      border: "1px solid rgba(239, 68, 68, 0.2)",
                      color: "#dc2626",
                      fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)",
                    }}
                  >
                    {error}
                  </p>
                )}

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setStep("shipping")}
                    className="px-4 py-3 text-sm border transition-colors"
                    style={{
                      fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)",
                      borderColor: "rgba(46, 125, 50, 0.15)",
                      color: "#7B9E6B",
                      borderRadius: "6px",
                    }}
                  >
                    Back
                  </button>
                  <button
                    onClick={() => handlePlaceOrder(selectedPaymentMethod)}
                    disabled={isProcessing}
                    className="flex-1 py-3 text-sm font-semibold tracking-wider transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)",
                      background: "#2E7D32",
                      color: "#fff",
                      borderRadius: "6px",
                      letterSpacing: "1px",
                    }}
                  >
                    {isProcessing ? "Processing..." : "Place Order"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div
              className="bg-white p-6 rounded-md sticky top-4"
              style={{
                border: "1px solid rgba(46, 125, 50, 0.15)",
                boxShadow: "0 2px 8px rgba(46, 125, 50, 0.06)",
              }}
            >
              <div
                className="p-4 -m-px rounded-t-md"
                style={{ background: "#2E7D32" }}
              >
                <span
                  className="text-lg text-white tracking-wide"
                  style={{ fontFamily: "var(--font-rajdhani,'Rajdhani',sans-serif)" }}
                >
                  Order Summary
                </span>
              </div>

              {/* Items */}
              <div className="mt-4 space-y-3 max-h-64 overflow-y-auto">
                {items.map((item: import("@/store/cart-store").CartItem) => (
                  <div key={item.id} className="flex gap-3">
                    <div
                      className="w-14 h-14 bg-[#FAFAF8] rounded-md flex-shrink-0 relative flex items-center justify-center overflow-hidden"
                    >
                      {item.image ? (
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full bg-[#FAFAF8]" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-xs font-medium line-clamp-1"
                        style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", color: "#1a1a1a" }}
                      >
                        {item.name}
                      </p>
                      <p className="text-[10px]" style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", color: "#7B9E6B" }}>
                        {item.flavor}{item.size ? ` · ${item.size}` : ""}
                      </p>
                      <p className="text-xs mt-0.5" style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", color: "#7B9E6B" }}>
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p
                      className="text-xs font-medium"
                      style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", color: "#1a1a1a" }}
                    >
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div
                className="mt-4 pt-4 space-y-2 border-t"
                style={{ borderColor: "rgba(46, 125, 50, 0.15)" }}
              >
                <div className="flex justify-between text-sm">
                  <span style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", color: "#7B9E6B" }}>Subtotal</span>
                  <span style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", color: "#1a1a1a" }}>
                    {formatCurrency(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", color: "#7B9E6B" }}>Shipping</span>
                  <span style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", color: "#1a1a1a" }}>
                    {shipping === 0 ? (
                      <span style={{ color: "#2E7D32" }}>FREE</span>
                    ) : (
                      formatCurrency(shipping)
                    )}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t" style={{ borderColor: "rgba(46,125,50,0.15)" }}>
                  <span
                    className="font-semibold"
                    style={{ fontFamily: "var(--font-rajdhani,'Rajdhani',sans-serif)", color: "#1a1a1a" }}
                  >
                    Total
                  </span>
                  <span
                    className="font-bold text-xl"
                    style={{ fontFamily: "var(--font-rajdhani,'Rajdhani',sans-serif)", color: "#2E7D32" }}
                  >
                    {formatCurrency(total)}
                  </span>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-[rgba(46,125,50,0.1)] space-y-3">
                <div className="flex items-center gap-3 text-xs" style={{ color: "#7B9E6B" }}>
                  <Shield className="w-4 h-4 flex-shrink-0" style={{ color: "#2E7D32" }} />
                  <span>100% Authentic — Lab Tested</span>
                </div>
                <div className="flex items-center gap-3 text-xs" style={{ color: "#7B9E6B" }}>
                  <Zap className="w-4 h-4 flex-shrink-0" style={{ color: "#2E7D32" }} />
                  <span>Fast Delivery — Within 48 Hours</span>
                </div>
                <div className="flex items-center gap-3 text-xs" style={{ color: "#7B9E6B" }}>
                  <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: "#2E7D32" }} />
                  <span>Every Batch Verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Tagline */}
        <div
          className="mt-12 pt-8 border-t flex flex-col lg:flex-row items-center justify-between gap-6"
          style={{ borderColor: "rgba(46, 125, 50, 0.1)" }}
        >
          <p className="text-sm tracking-wide" style={{ color: "#7B9E6B" }}>
            Wellness, rooted in <span style={{ color: "#2E7D32" }}>nature</span>.
          </p>
          <div className="flex items-center gap-2 text-xs" style={{ color: "#7B9E6B" }}>
            <div className="w-2 h-2 rounded-full" style={{ background: "#2E7D32" }} />
            <span>Secure Checkout · Encrypted Payment</span>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
