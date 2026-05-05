"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Navbar } from "@/components/layout/Navbar";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      setIsLoading(false);

      if (!res.ok) {
        toast.error(data.error || "Something went wrong");
        return;
      }

      setSent(true);
    } catch {
      setIsLoading(false);
      toast.error("Something went wrong");
    }
  }

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

          <div className="bg-white rounded-2xl shadow-lg border border-[#E7E5E4] p-8">
            {sent ? (
              <div className="text-center space-y-4">
                <div className="text-5xl">📧</div>
                <h1 className="text-2xl font-bold text-[#1C1917]" style={{ fontFamily: "var(--font-playfair), Playfair Display, serif" }}>
                  Check your email
                </h1>
                <p className="text-[#57534E]">
                  If an account exists for <strong>{email}</strong>, we've sent a password reset link.
                </p>
                <p className="text-sm text-[#57534E]">Check your inbox — the link expires in 1 hour.</p>
                <Link href="/login">
                  <Button variant="outline" className="mt-4 w-full border-[#E7E5E4]">Back to Sign In</Button>
                </Link>
              </div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-[#1C1917] mb-2" style={{ fontFamily: "var(--font-playfair), Playfair Display, serif" }}>
                    Forgot password
                  </h1>
                  <p className="text-[#57534E]">Enter your email and we'll send you a reset link</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <Label htmlFor="email" className="text-[#1C1917] font-medium">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading}
                      className="mt-1.5 border-[#E7E5E4] focus:border-[#166534] focus:ring-[#166534]"
                      placeholder="you@example.com"
                    />
                  </div>
                  <Button type="submit" className="w-full bg-[#166534] hover:bg-[#14532D] text-white font-semibold h-11" disabled={isLoading}>
                    {isLoading ? "Sending..." : "Send Reset Link"}
                  </Button>
                </form>

                <p className="text-center text-sm text-[#57534E] mt-6">
                  Remember your password?{" "}
                  <Link href="/login" className="text-[#166534] font-semibold hover:underline">
                    Sign in
                  </Link>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}