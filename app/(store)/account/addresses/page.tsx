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
      <div className="min-h-screen bg-[#FAFAF8] py-8 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-[#7B9E6B]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href="/account">
              <Button variant="outline" size="icon" className="h-9 w-9 border-[rgba(46,125,50,0.15)] text-[#1a1a1a] hover:bg-white">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-[#1a1a1a]">My Addresses</h1>
              <p className="text-sm text-[#7B9E6B]">
                {addresses.length} address{addresses.length !== 1 ? "es" : ""}
              </p>
            </div>
          </div>
          <Link href="/account/addresses/new">
            <Button className="bg-[#2E7D32] hover:bg-[#1B5E20] text-white h-9">
              <Plus className="w-4 h-4 mr-1" />
              Add New
            </Button>
          </Link>
        </div>

        {addresses.length === 0 ? (
          <div className="bg-white border border-[rgba(46,125,50,0.15)] p-12 text-center rounded-lg shadow-[0_2px_8px_rgba(46,125,50,0.06)]">
            <MapPin className="w-12 h-12 text-[#7B9E6B] mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-[#1a1a1a] mb-2">
              No saved addresses
            </h2>
            <p className="text-[#7B9E6B] mb-6">
              Add an address to speed up your checkout.
            </p>
            <Link href="/account/addresses/new">
              <Button className="bg-[#2E7D32] hover:bg-[#1B5E20] text-white h-10">
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
                className="bg-white border border-[rgba(46,125,50,0.15)] p-4 rounded-lg shadow-[0_2px_8px_rgba(46,125,50,0.06)]"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#7B9E6B]" />
                    <span className="font-medium text-[#1a1a1a]">
                      {address.name}
                    </span>
                    {address.isDefault && (
                      <Badge className="bg-[#2E7D32] text-white text-xs border-none">
                        Default
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="text-sm text-[#7B9E6B] mb-4">
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
                      className="w-full h-8 border-[rgba(46,125,50,0.15)] text-[#1a1a1a] hover:bg-white"
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
                      className="flex-1 h-8 border-[rgba(46,125,50,0.15)] text-red-600 hover:bg-white"
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
