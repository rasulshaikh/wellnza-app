import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, User } from "lucide-react";
import Link from "next/link";

export default async function SettingsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/account/settings");
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true, createdAt: true },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[#FAFAF7] py-8">
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

          <form className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
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
                    type="password"
                    className="border-[#E5E5E0] focus:border-[#1C1C1C]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    className="border-[#E5E5E0] focus:border-[#1C1C1C]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    className="border-[#E5E5E0] focus:border-[#1C1C1C]"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button className="bg-[#1C1C1C] hover:bg-[#2D2D2D] text-white">
                Save Changes
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
