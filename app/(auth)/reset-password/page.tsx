"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Navbar } from "@/components/layout/Navbar";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [invalid, setInvalid] = useState(false);

  useEffect(() => {
    if (!token) setInvalid(true);
  }, [token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (password !== confirm) {
      toast.error("Passwords don't match");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();
      setIsLoading(false);

      if (!res.ok) {
        toast.error(data.error || "Something went wrong");
        return;
      }

      toast.success("Password updated! Sign in with your new password.");
      router.push("/login");
    } catch {
      setIsLoading(false);
      toast.error("Something went wrong");
    }
  }

  if (invalid) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-[#E7E5E4] p-8 text-center">
        <div className="text-5xl mb-4">🔗</div>
        <h1 className="text-2xl font-bold text-[#1C1917] mb-2" style={{ fontFamily: "var(--font-playfair), Playfair Display, serif" }}>
          Invalid reset link
        </h1>
        <p className="text-[#57534E] mb-6">This link is expired or invalid. Please request a new one.</p>
        <Link href="/forgot-password">
          <Button className="bg-[#166534] hover:bg-[#14532D] text-white">Request New Link</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-[#E7E5E4] p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[#1C1917] mb-2" style={{ fontFamily: "var(--font-playfair), Playfair Display, serif" }}>
          New password
        </h1>
        <p className="text-[#57534E]">Create a strong password for your account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <Label htmlFor="password" className="text-[#1C1917] font-medium">New Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
            className="mt-1.5 border-[#E7E5E4] focus:border-[#166534] focus:ring-[#166534]"
            placeholder="Min. 8 characters"
          />
          <p className="text-xs text-[#57534E] mt-1">Must include uppercase, number, and special character</p>
        </div>
        <div>
          <Label htmlFor="confirm" className="text-[#1C1917] font-medium">Confirm Password</Label>
          <Input
            id="confirm"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            disabled={isLoading}
            className="mt-1.5 border-[#E7E5E4] focus:border-[#166534] focus:ring-[#166534]"
            placeholder="Repeat new password"
          />
        </div>
        <Button type="submit" className="w-full bg-[#166534] hover:bg-[#14532D] text-white font-semibold h-11" disabled={isLoading}>
          {isLoading ? "Updating..." : "Update Password"}
        </Button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF5] px-4 py-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <Link href="/" className="inline-block">
              <span className="text-3xl font-bold text-[#166534] tracking-tight" style={{ fontFamily: "var(--font-playfair), Playfair Display, serif" }}>
                Wellnza
              </span>
            </Link>
          </div>

          <Suspense fallback={
            <div className="bg-white rounded-2xl shadow-lg border border-[#E7E5E4] p-8">
              <div className="animate-pulse text-center">Loading...</div>
            </div>
          }>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </>
  );
}