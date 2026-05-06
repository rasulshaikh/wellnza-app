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
      <div className="min-h-screen flex items-center justify-center bg-[#0D0D0D] px-4 py-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <Link href="/" className="inline-block">
              <span className="text-3xl font-bold text-[#22C55E] tracking-wider" style={{ fontFamily: "var(--font-bebas)" }}>
                WELLNZA
              </span>
            </Link>
          </div>

          <div className="bg-[#1A1A1A] rounded-lg p-8 border border-[rgba(22,101,52,0.3)]" style={{ clipPath: "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))" }}>
            {sent ? (
              <div className="text-center space-y-4">
                <div className="text-5xl mb-4">
                  <svg className="w-16 h-16 mx-auto text-[#22C55E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold text-white tracking-wider" style={{ fontFamily: "var(--font-bebas)" }}>
                  CHECK YOUR EMAIL
                </h1>
                <p className="text-[#888888]" style={{ fontFamily: "var(--font-oswald)" }}>
                  If an account exists for <strong className="text-white">{email}</strong>, we&apos;ve sent a password reset link.
                </p>
                <p className="text-sm text-[#888888]" style={{ fontFamily: "var(--font-oswald)" }}>Check your inbox — the link expires in 1 hour.</p>
                <Link href="/login">
                  <Button variant="outline" className="mt-4 w-full h-12 border-[rgba(22,101,52,0.3)] text-[#888888] hover:text-[#22C55E] hover:border-[#166534] hover:bg-[#0D0D0D]" style={{ fontFamily: "var(--font-oswald)" }}>
                    BACK TO SIGN IN
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <h1 className="text-4xl font-bold text-white mb-2 tracking-wider" style={{ fontFamily: "var(--font-bebas)" }}>
                    RECOVER YOUR ACCOUNT
                  </h1>
                  <p className="text-[#888888]" style={{ fontFamily: "var(--font-oswald)" }}>Enter your email and we&apos;ll send you a reset link</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <Label htmlFor="email" className="text-white font-medium" style={{ fontFamily: "var(--font-oswald)" }}>Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading}
                      className="mt-1.5 bg-[#0D0D0D] border-[rgba(22,101,52,0.3)] text-white placeholder-[#666666] focus:border-[#166534] focus:ring-[#166534]"
                      placeholder="you@example.com"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-[#166534] hover:bg-[#14532D] text-white font-semibold h-12"
                    style={{ fontFamily: "var(--font-bebas)", clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)" }}
                    disabled={isLoading}
                  >
                    {isLoading ? "SENDING..." : "SEND RESET LINK"}
                  </Button>
                </form>

                <p className="text-center text-sm text-[#888888] mt-6" style={{ fontFamily: "var(--font-oswald)" }}>
                  Remember your password?{" "}
                  <Link href="/login" className="text-[#22C55E] font-semibold hover:underline">
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
