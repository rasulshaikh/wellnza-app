"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";

const PHONE_REGEX = /^[6-9]\d{9}$/;
const PIN_REGEX = /^[1-9]\d{5}$/;

export default function NewAddressPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pin: "",
    country: "India",
    isDefault: false,
  });

  function update(field: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.name.trim()) {
      setError("Name is required");
      return;
    }
    if (!PHONE_REGEX.test(form.phone)) {
      setError("Invalid phone. Must be 10 digits starting with 6-9");
      return;
    }
    if (!form.line1.trim()) {
      setError("Address is required");
      return;
    }
    if (!form.city.trim()) {
      setError("City is required");
      return;
    }
    if (!form.state.trim()) {
      setError("State is required");
      return;
    }
    if (!PIN_REGEX.test(form.pin)) {
      setError("Invalid PIN. Must be 6 digits");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/account/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save address");
      }

      router.push("/account/addresses");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen py-8" style={{ background: "#FAFAF8" }}>
      <div className="max-w-xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/account/addresses">
            <Button variant="outline" size="icon" className="h-9 w-9" style={{ borderColor: "rgba(46,125,50,0.15)" }}>
              <ArrowLeft className="w-4 h-4" style={{ color: "#2E7D32" }} />
            </Button>
          </Link>
          <h1 className="text-xl font-bold" style={{ fontFamily: "var(--font-rajdhani,'Rajdhani',sans-serif)", color: "#1a1a1a" }}>Add New Address</h1>
        </div>

        {error && (
          <div role="alert" className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white border p-6 space-y-4" style={{ borderColor: "rgba(46,125,50,0.15)" }}>
          <div>
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="Rahul Sharma"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              placeholder="9876543210"
              maxLength={10}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="line1">Address Line 1 *</Label>
            <Input
              id="line1"
              value={form.line1}
              onChange={(e) => update("line1", e.target.value)}
              placeholder="123, MG Road"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="line2">Address Line 2</Label>
            <Input
              id="line2"
              value={form.line2}
              onChange={(e) => update("line2", e.target.value)}
              placeholder="Near Metro Station"
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                value={form.city}
                onChange={(e) => update("city", e.target.value)}
                placeholder="Mumbai"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="state">State *</Label>
              <Input
                id="state"
                value={form.state}
                onChange={(e) => update("state", e.target.value)}
                placeholder="Maharashtra"
                className="mt-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="pin">PIN Code *</Label>
              <Input
                id="pin"
                value={form.pin}
                onChange={(e) => update("pin", e.target.value)}
                placeholder="400001"
                maxLength={6}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={form.country}
                onChange={(e) => update("country", e.target.value)}
                placeholder="India"
                className="mt-1"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isDefault"
              checked={form.isDefault}
              onChange={(e) => update("isDefault", e.target.checked)}
              className="w-4 h-4 accent-[#0055FF]"
            />
            <Label htmlFor="isDefault" className="font-normal">
              Set as default address
            </Label>
          </div>

          <div className="flex gap-3 pt-2">
            <Link href="/account/addresses" className="flex-1">
              <Button type="button" variant="outline" className="w-full h-10" style={{ borderColor: "rgba(46,125,50,0.15)", color: "#1a1a1a" }}>
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 text-white h-10"
              style={{ background: "#2E7D32" }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Address"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
