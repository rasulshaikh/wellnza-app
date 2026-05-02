"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";

const PHONE_REGEX = /^[6-9]\d{9}$/;
const PIN_REGEX = /^[1-9]\d{5}$/;

interface AddressForm {
  name: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  pin: string;
  country: string;
  isDefault: boolean;
}

interface EditAddressPageProps {
  params: Promise<{ id: string }>;
}

export default function EditAddressPage({ params }: EditAddressPageProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addressId, setAddressId] = useState<string | null>(null);
  const [form, setForm] = useState<AddressForm>({
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

  useEffect(() => {
    params.then(({ id }) => {
      setAddressId(id);
      fetch(`/api/account/addresses/${id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            setError(data.error);
          } else {
            setForm({
              name: data.name || "",
              phone: data.phone || "",
              line1: data.line1 || "",
              line2: data.line2 || "",
              city: data.city || "",
              state: data.state || "",
              pin: data.pin || "",
              country: data.country || "India",
              isDefault: data.isDefault || false,
            });
          }
          setInitialLoading(false);
        })
        .catch(() => {
          setError("Failed to load address");
          setInitialLoading(false);
        });
    });
  }, [params]);

  function update(field: keyof AddressForm, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!addressId) return;
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
      const res = await fetch(`/api/account/addresses/${addressId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update address");
      }

      router.push("/account/addresses");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-[#FAFAF7] py-8 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-[#6B6B6B]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF7] py-8">
      <div className="max-w-xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/account/addresses">
            <Button variant="outline" size="icon" className="h-9 w-9 border-[#E5E5E0]">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-[#1C1C1C]">Edit Address</h1>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white border border-[#E5E5E0] p-6 space-y-4">
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
              <Button type="button" variant="outline" className="w-full h-10 border-[#E5E5E0]">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#1C1C1C] hover:bg-[#2D2D2D] text-white h-10"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Update Address"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
