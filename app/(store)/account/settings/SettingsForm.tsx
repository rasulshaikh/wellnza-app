"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, User } from "lucide-react";
import { toast } from "sonner";

interface SettingsPageClientProps {
  user: {
    name: string | null;
    email: string;
    createdAt: Date;
  };
}

export default function SettingsPageClient({ user }: SettingsPageClientProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const currentPassword = formData.get("current-password") as string;
    const newPassword = formData.get("new-password") as string;
    const confirmPassword = formData.get("confirm-password") as string;

    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      setIsLoading(false);

      if (!res.ok) {
        toast.error(data.error || "Something went wrong");
        return;
      }

      toast.success("Password updated!");
      (e.target as HTMLFormElement).reset();
    } catch {
      setIsLoading(false);
      toast.error("Something went wrong");
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Link href="/account" className="inline-flex items-center gap-2 text-sm text-[#7B9E6B] hover:text-[#2E7D32] mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Account
        </Link>

        <div className="bg-white border border-[rgba(46,125,50,0.15)] p-6 rounded-lg shadow-[0_2px_8px_rgba(46,125,50,0.06)]">
          <div className="flex items-center gap-3 mb-6">
            <User className="w-6 h-6 text-[#7B9E6B]" />
            <h1 className="text-xl font-bold text-[#1a1a1a]" style={{ fontFamily: "'Playfair Display', serif" }}>Account Settings</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[#1a1a1a]">Full Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                defaultValue={user.name || ""}
                className="border-[rgba(46,125,50,0.15)] focus:border-[#2E7D32] bg-white text-[#1a1a1a]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#1a1a1a]">Email Address</Label>
              <Input
                id="email"
                type="email"
                defaultValue={user.email}
                disabled
                className="border-[rgba(46,125,50,0.15)] bg-white text-[#7B9E6B]"
              />
              <p className="text-xs text-[#7B9E6B]">Email cannot be changed</p>
            </div>

            <div className="pt-4 border-t border-[rgba(46,125,50,0.15)]">
              <h3 className="font-medium text-[#1a1a1a] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Change Password</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password" className="text-[#1a1a1a]">Current Password</Label>
                  <Input
                    id="current-password"
                    name="current-password"
                    type="password"
                    required
                    className="border-[rgba(46,125,50,0.15)] focus:border-[#2E7D32] bg-white text-[#1a1a1a]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password" className="text-[#1a1a1a]">New Password</Label>
                  <Input
                    id="new-password"
                    name="new-password"
                    type="password"
                    required
                    className="border-[rgba(46,125,50,0.15)] focus:border-[#2E7D32] bg-white text-[#1a1a1a]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-[#1a1a1a]">Confirm New Password</Label>
                  <Input
                    id="confirm-password"
                    name="confirm-password"
                    type="password"
                    required
                    className="border-[rgba(46,125,50,0.15)] focus:border-[#2E7D32] bg-white text-[#1a1a1a]"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading} className="bg-[#2E7D32] hover:bg-[#1B5E20] text-white">
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-[rgba(46,125,50,0.15)]">
            <p className="text-xs text-[#7B9E6B]">
              Member since {new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
