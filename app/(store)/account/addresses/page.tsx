"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MapPin, Plus, Pencil, Trash2, ArrowLeft, Loader2 } from "lucide-react";

interface Address {
  id: string;
  name: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  pin: string;
  phone: string;
  country: string;
  isDefault: boolean;
}

export default function AddressesPage() {
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/account/addresses")
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setAddresses([]);
        } else {
          setAddresses(data);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Delete this address?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/account/addresses/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.refresh();
      }
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] py-8 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-[#888888]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href="/account">
              <Button variant="outline" size="icon" className="h-9 w-9 border-[rgba(22,101,52,0.3)] text-white hover:bg-[#1A1A1A]">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-bebas)" }}>My Addresses</h1>
              <p className="text-sm text-[#888888]">
                {addresses.length} address{addresses.length !== 1 ? "es" : ""}
              </p>
            </div>
          </div>
          <Link href="/account/addresses/new">
            <Button className="bg-[#166534] hover:bg-[#14532D] text-white h-9" style={{ fontFamily: "var(--font-bebas)", clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))" }}>
              <Plus className="w-4 h-4 mr-1" />
              Add New
            </Button>
          </Link>
        </div>

        {addresses.length === 0 ? (
          <div className="bg-[#1A1A1A] border border-[rgba(22,101,52,0.3)] p-12 text-center rounded-lg" style={{ clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))" }}>
            <MapPin className="w-12 h-12 text-[#666666] mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-white mb-2">
              No saved addresses
            </h2>
            <p className="text-[#888888] mb-6">
              Add an address to speed up your checkout.
            </p>
            <Link href="/account/addresses/new">
              <Button className="bg-[#166534] hover:bg-[#14532D] text-white h-10" style={{ fontFamily: "var(--font-bebas)", clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))" }}>
                <Plus className="w-4 h-4 mr-1" />
                Add Address
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {addresses.map((address) => (
              <div
                key={address.id}
                className="bg-[#1A1A1A] border border-[rgba(22,101,52,0.3)] p-4 rounded-lg"
                style={{ clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))" }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#888888]" />
                    <span className="font-medium text-white">
                      {address.name}
                    </span>
                    {address.isDefault && (
                      <Badge className="bg-[#166534] text-white text-xs border-none">
                        Default
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="text-sm text-[#888888] mb-4">
                  <p>{address.line1}</p>
                  {address.line2 && <p>{address.line2}</p>}
                  <p>
                    {address.city}, {address.state} - {address.pin}
                  </p>
                  <p>{address.phone}</p>
                  <p>{address.country}</p>
                </div>
                <div className="flex gap-2">
                  <Link href={`/account/addresses/${address.id}`} className="flex-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full h-8 border-[rgba(22,101,52,0.3)] text-white hover:bg-[#0D0D0D]"
                    >
                      <Pencil className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                  </Link>
                  <Button
                      onClick={() => handleDelete(address.id)}
                      disabled={deletingId === address.id}
                      variant="outline"
                      size="sm"
                      className="flex-1 h-8 border-[rgba(22,101,52,0.3)] text-red-400 hover:bg-[#0D0D0D]"
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      {deletingId === address.id ? "..." : "Delete"}
                    </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
