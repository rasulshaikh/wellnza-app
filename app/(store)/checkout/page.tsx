"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart-store";
import { formatCurrency, cn } from "@/lib/utils";
import { SHIPPING_METHODS, FREE_SHIPPING_THRESHOLD } from "@/lib/shipping";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Check,
  ChevronLeft,
  MapPin,
  CreditCard,
  Truck,
  Package,
  Loader2,
} from "lucide-react";

const FREE_SHIPPING_THRESHOLD = 99900;
const STANDARD_SHIPPING = 5000;
const EXPRESS_SHIPPING = 10000;

// Indian validation
const PHONE_REGEX = /^[6-9]\d{9}$/;
const PIN_REGEX = /^[1-9]\d{5}$/;

type Step = 1 | 2 | 3;

interface AddressForm {
  name: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  pin: string;
}

interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  price: number;
  days: string;
}

const SHIPPING_METHODS: ShippingMethod[] = [
  {
    id: "standard",
    name: "Standard Shipping",
    description: "Regular delivery",
    price: STANDARD_SHIPPING,
    days: "5-7 days",
  },
  {
    id: "express",
    name: "Express Shipping",
    description: "Fast delivery",
    price: EXPRESS_SHIPPING,
    days: "2-3 days",
  },
  {
    id: "free",
    name: "Free Shipping",
    description: "On orders above ₹999",
    price: 0,
    days: "5-7 days",
  },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart } = useCartStore();

  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Address form state
  const [addressForm, setAddressForm] = useState<AddressForm>({
    name: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pin: "",
  });
  const [saveAddress, setSaveAddress] = useState(false);

  // Shipping method state
  const [shippingMethod, setShippingMethod] = useState<string>("standard");

  // Order state
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [razorpayOrderId, setRazorpayOrderId] = useState<string | null>(null);

  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const selectedShipping = SHIPPING_METHODS.find((m) => m.id === shippingMethod) ?? SHIPPING_METHODS[0];
  const shippingCost =
    subtotal >= FREE_SHIPPING_THRESHOLD && shippingMethod !== "express"
      ? 0
      : selectedShipping.price;
  const total = subtotal + shippingCost;

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0 && !orderId) {
      router.push("/cart");
    }
  }, [items.length, orderId, router]);

  // Validation
  function validateAddress(): boolean {
    if (!addressForm.name.trim()) {
      setError("Name is required");
      return false;
    }
    if (!PHONE_REGEX.test(addressForm.phone)) {
      setError("Invalid phone number. Must be 10 digits starting with 6-9");
      return false;
    }
    if (!addressForm.line1.trim()) {
      setError("Address is required");
      return false;
    }
    if (!addressForm.city.trim()) {
      setError("City is required");
      return false;
    }
    if (!addressForm.state.trim()) {
      setError("State is required");
      return false;
    }
    if (!PIN_REGEX.test(addressForm.pin)) {
      setError("Invalid PIN code. Must be 6 digits");
      return false;
    }
    return true;
  }

  // Step 1 -> Step 2
  async function handleContinueToShipping() {
    if (!validateAddress()) return;

    setError(null);
    setStep(2);
  }

  // Step 2 -> Step 3 (Create order)
  async function handleContinueToPayment() {
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartItems: items.map((i) => ({
            productVariantId: i.productVariantId,
            quantity: i.quantity,
          })),
          paymentMethod: "RAZORPAY",
          guestAddress: addressForm,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create order");
      }

      const data = await response.json();
      setOrderId(data.orderId);
      setOrderNumber(data.orderNumber);
      setRazorpayOrderId(data.razorpayOrderId);
      setStep(3);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  // Initialize Razorpay
  async function loadRazorpay() {
    if (!orderId || !razorpayOrderId) return;

    setLoading(true);
    setError(null);

    // Load Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;

    const timeoutId = setTimeout(() => {
      if (!script.src) return; // already loaded
      script.remove();
      setError("Payment gateway timed out. Please try again.");
      setLoading(false);
    }, 10000);

    script.onload = () => {
      clearTimeout(timeoutId);
      initializeRazorpayCheckout();
    };
    script.onerror = () => {
      clearTimeout(timeoutId);
      setError("Failed to load payment gateway. Please try again.");
      setLoading(false);
    };
    document.body.appendChild(script);
  }

  function initializeRazorpayCheckout() {
    const Razorpay = (window as unknown as { Razorpay: new (options: unknown) => { open: () => void } }).Razorpay;

    if (!Razorpay) {
      setError("Payment gateway not available");
      setLoading(false);
      return;
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: total,
      currency: "INR",
      name: "Well NZ Nutrition",
      description: `Order #${orderNumber}`,
      order_id: razorpayOrderId,
      handler: async (response: {
        razorpay_payment_id: string;
        razorpay_order_id: string;
        razorpay_signature: string;
      }) => {
        try {
          const verifyResponse = await fetch("/api/checkout/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
            }),
          });

          const verifyData = await verifyResponse.json();

          if (verifyData.success) {
            clearCart();
            router.push(`/order-confirmation/${orderId}`);
          } else {
            setError(verifyData.error || "Payment verification failed");
          }
        } catch {
          setError("Payment verification failed");
        }
      },
      prefill: {
        name: addressForm.name,
        email: "",
        contact: addressForm.phone,
      },
      theme: {
        color: "#0055FF",
      },
      modal: {
        ondismiss: () => {
          setLoading(false);
        },
      },
    };

    const rzp = new Razorpay(options) as { on: (event: string, handler: (response: { error: { description: string } }) => void) => void; open: () => void };
    rzp.on("payment.failed", (response) => {
      setError(response.error.description || "Payment failed");
      setLoading(false);
    });

    rzp.open();
  }

  function handlePayment() {
    loadRazorpay();
  }

  // Step indicator
  function renderStepIndicator() {
    const steps = [
      { num: 1, label: "Address" },
      { num: 2, label: "Shipping" },
      { num: 3, label: "Payment" },
    ];

    return (
      <div className="mb-8">
        <div className="flex items-center justify-center gap-2">
          {steps.map((s, i) => (
            <div key={s.num} className="flex items-center">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                  step > s.num
                    ? "bg-[#0055FF] text-white"
                    : step === s.num
                    ? "bg-[#0055FF] text-white"
                    : "bg-[#E5E5E0] text-[#6B6B6B]"
                )}
              >
                {step > s.num ? <Check className="w-4 h-4" /> : s.num}
              </div>
              <span
                className={cn(
                  "ml-2 text-sm font-medium hidden sm:inline",
                  step >= s.num ? "text-[#1C1C1C]" : "text-[#6B6B6B]"
                )}
              >
                {s.label}
              </span>
              {i < steps.length - 1 && (
                <div
                  className={cn(
                    "w-12 sm:w-20 h-0.5 mx-3",
                    step > s.num ? "bg-[#0055FF]" : "bg-[#E5E5E0]"
                  )}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Step 1: Address Form
  function renderAddressStep() {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-[#1C1C1C] mb-4">
            Contact & Shipping Address
          </h2>
        </div>

        <div className="bg-white border border-[#E5E5E0] p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1C1C1C] mb-1">
                Full Name *
              </label>
              <Input
                value={addressForm.name}
                onChange={(e) =>
                  setAddressForm({ ...addressForm, name: e.target.value })
                }
                placeholder="Rahul Sharma"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1C1C1C] mb-1">
                Phone Number *
              </label>
              <Input
                value={addressForm.phone}
                onChange={(e) =>
                  setAddressForm({ ...addressForm, phone: e.target.value })
                }
                placeholder="9876543210"
                maxLength={10}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1C1C1C] mb-1">
              Address Line 1 *
            </label>
            <Input
              value={addressForm.line1}
              onChange={(e) =>
                setAddressForm({ ...addressForm, line1: e.target.value })
              }
              placeholder="123, MG Road"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1C1C1C] mb-1">
              Address Line 2
            </label>
            <Input
              value={addressForm.line2}
              onChange={(e) =>
                setAddressForm({ ...addressForm, line2: e.target.value })
              }
              placeholder="Near Metro Station"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1C1C1C] mb-1">
                City *
              </label>
              <Input
                value={addressForm.city}
                onChange={(e) =>
                  setAddressForm({ ...addressForm, city: e.target.value })
                }
                placeholder="Mumbai"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1C1C1C] mb-1">
                State *
              </label>
              <Input
                value={addressForm.state}
                onChange={(e) =>
                  setAddressForm({ ...addressForm, state: e.target.value })
                }
                placeholder="Maharashtra"
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-[#1C1C1C] mb-1">
                PIN Code *
              </label>
              <Input
                value={addressForm.pin}
                onChange={(e) =>
                  setAddressForm({ ...addressForm, pin: e.target.value })
                }
                placeholder="400001"
                maxLength={6}
              />
            </div>
          </div>
        </div>

        <Button
          onClick={handleContinueToShipping}
          className="w-full bg-[#1C1C1C] hover:bg-[#2D2D2D] text-white h-11"
        >
          Continue to Shipping
        </Button>
      </div>
    );
  }

  // Step 2: Shipping Method
  function renderShippingStep() {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-[#1C1C1C] mb-4">
            Shipping Method
          </h2>
        </div>

        {/* Address Summary */}
        <div className="bg-white border border-[#E5E5E0] p-4">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-[#6B6B6B] mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-[#1C1C1C]">
                {addressForm.name}
              </p>
              <p className="text-sm text-[#6B6B6B]">
                {addressForm.line1}
                {addressForm.line2 && `, ${addressForm.line2}`}
              </p>
              <p className="text-sm text-[#6B6B6B]">
                {addressForm.city}, {addressForm.state} - {addressForm.pin}
              </p>
              <p className="text-sm text-[#6B6B6B]">{addressForm.phone}</p>
            </div>
            <button
              onClick={() => setStep(1)}
              className="text-sm text-[#0055FF] hover:underline"
            >
              Edit
            </button>
          </div>
        </div>

        {/* Shipping Options */}
        <div className="bg-white border border-[#E5E5E0] p-6 space-y-3">
          {SHIPPING_METHODS.map((method) => {
            const isFree = method.id === "free" && subtotal < FREE_SHIPPING_THRESHOLD;
            const effectivePrice =
              method.id === "free" && subtotal >= FREE_SHIPPING_THRESHOLD
                ? 0
                : method.price;

            return (
              <label
                key={method.id}
                className={cn(
                  "flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors",
                  shippingMethod === method.id
                    ? "border-[#0055FF] bg-blue-50"
                    : "border-[#E5E5E0] hover:border-[#CCCCCC]",
                  isFree && "opacity-50 cursor-not-allowed"
                )}
              >
                <input
                  type="radio"
                  name="shipping"
                  value={method.id}
                  checked={shippingMethod === method.id}
                  onChange={() => !isFree && setShippingMethod(method.id)}
                  disabled={isFree}
                  className="w-4 h-4 accent-[#0055FF]"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-[#6B6B6B]" />
                    <span className="font-medium text-[#1C1C1C]">
                      {method.name}
                    </span>
                    {isFree && (
                      <span className="text-xs text-[#6B6B6B]">
                        (Add {formatCurrency(FREE_SHIPPING_THRESHOLD - subtotal)} more)
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-[#6B6B6B]">{method.description}</p>
                </div>
                <span className="font-medium text-[#1C1C1C]">
                  {effectivePrice === 0 ? "Free" : formatCurrency(effectivePrice)}
                </span>
                <span className="text-sm text-[#6B6B6B]">{method.days}</span>
              </label>
            );
          })}
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setStep(1)}
            className="flex-1 h-11"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
          <Button
            onClick={handleContinueToPayment}
            disabled={loading}
            className="flex-1 bg-[#1C1C1C] hover:bg-[#2D2D2D] text-white h-11"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              "Continue to Payment"
            )}
          </Button>
        </div>
      </div>
    );
  }

  // Step 3: Payment
  function renderPaymentStep() {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-[#1C1C1C] mb-4">Payment</h2>
        </div>

        {/* Order Summary */}
        <div className="bg-white border border-[#E5E5E0] p-6 space-y-4">
          <h3 className="font-semibold text-[#1C1C1C]">Order Summary</h3>

          {/* Items */}
          <div className="space-y-3 max-h-48 overflow-y-auto">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#F5F5F0] flex-shrink-0 flex items-center justify-center">
                  <Package className="w-5 h-5 text-[#CCCCCC]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#1C1C1C] truncate">
                    {item.name}
                  </p>
                  <p className="text-xs text-[#6B6B6B]">
                    {item.flavor} × {item.quantity}
                  </p>
                </div>
                <p className="text-sm font-medium text-[#1C1C1C]">
                  {formatCurrency(item.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>

          <Separator />

          {/* Totals */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-[#6B6B6B]">Subtotal</span>
              <span className="text-[#1C1C1C]">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6B6B6B]">Shipping</span>
              <span className="text-[#1C1C1C]">
                {shippingCost === 0 ? "Free" : formatCurrency(shippingCost)}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold">
              <span className="text-[#1C1C1C]">Total</span>
              <span className="text-[#1C1C1C]">{formatCurrency(total)}</span>
            </div>
          </div>
        </div>

        {/* Address Summary */}
        <div className="bg-white border border-[#E5E5E0] p-4">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-[#6B6B6B] mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-[#1C1C1C]">
                {addressForm.name}
              </p>
              <p className="text-sm text-[#6B6B6B]">
                {addressForm.line1}
                {addressForm.line2 && `, ${addressForm.line2}`}
              </p>
              <p className="text-sm text-[#6B6B6B]">
                {addressForm.city}, {addressForm.state} - {addressForm.pin}
              </p>
            </div>
            <button
              onClick={() => setStep(2)}
              className="text-sm text-[#0055FF] hover:underline"
            >
              Edit
            </button>
          </div>
        </div>

        {/* Razorpay Payment */}
        <Button
          onClick={handlePayment}
          disabled={loading}
          className="w-full bg-[#0055FF] hover:bg-[#0044CC] text-white h-12 text-base"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Loading Payment...
            </>
          ) : (
            <>
              <CreditCard className="w-4 h-4 mr-2" />
              Pay {formatCurrency(total)} with Razorpay
            </>
          )}
        </Button>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setStep(2)}
            disabled={loading}
            className="flex-1 h-11"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
        </div>
      </div>
    );
  }

  if (items.length === 0 && !orderId) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#FAFAF7] py-8">
      <div className="max-w-2xl mx-auto px-4">
        {renderStepIndicator()}

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        {step === 1 && renderAddressStep()}
        {step === 2 && renderShippingStep()}
        {step === 3 && renderPaymentStep()}
      </div>
    </div>
  );
}
