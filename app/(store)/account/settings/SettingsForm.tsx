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
    <div className="min-h-screen bg-[#FAFAF5] py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Link href="/account" className="inline-flex items-center gap-2 text-sm text-[#6B6B6B] hover:text-[#1C1C1C] mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Account
        </Link>

        <div className="bg-white border border-[#E5E5E0] p-6">
          <div className="flex items-center gap-3 mb-6">
            <User className="w-6 h-6 text-[#6B6B6B]" />
            <h1 className="text-xl font-bold text-[#1C1C1C]">Account Settings</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                defaultValue={user.name || ""}
                className="border-[#E5E5E0] focus:border-[#1C1C1C]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                defaultValue={user.email}
                disabled
                className="border-[#E5E5E0] bg-[#FAFAF7]"
              />
              <p className="text-xs text-[#6B6B6B]">Email cannot be changed</p>
            </div>

            <div className="pt-4 border-t border-[#E5E5E0]">
              <h3 className="font-medium text-[#1C1C1C] mb-4">Change Password</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input
                    id="current-password"
                    name="current-password"
                    type="password"
                    required
                    className="border-[#E5E5E0] focus:border-[#1C1C1C]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    name="new-password"
                    type="password"
                    required
                    className="border-[#E5E5E0] focus:border-[#1C1C1C]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input
                    id="confirm-password"
                    name="confirm-password"
                    type="password"
                    required
                    className="border-[#E5E5E0] focus:border-[#1C1C1C]"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading} className="bg-[#1C1C1C] hover:bg-[#2D2D2D] text-white">
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-[#E5E5E0]">
            <p className="text-xs text-[#6B6B6B]">
              Member since {new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}