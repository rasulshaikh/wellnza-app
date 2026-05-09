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
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF8] px-4 py-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <Link href="/" className="inline-block">
              <span className="text-3xl font-bold text-[#2E7D32] tracking-wider" style={{ fontFamily: "var(--font-rajdhani,'Rajdhani',sans-serif)" }}>
                WELLNZA
              </span>
            </Link>
          </div>

          <div className="bg-[#fff] rounded-lg p-8 border border-[rgba(46,125,50,0.15)]">
            {sent ? (
              <div className="text-center space-y-4">
                <div className="text-5xl mb-4">
                  <svg className="w-16 h-16 mx-auto text-[#2E7D32]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold text-[#1a1a1a] tracking-wider" style={{ fontFamily: "var(--font-rajdhani,'Rajdhani',sans-serif)" }}>
                  Check Your Email
                </h1>
                <p className="text-[#7B9E6B]" style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)" }}>
                  If an account exists for <strong className="text-[#1a1a1a]">{email}</strong>, we&apos;ve sent a password reset link.
                </p>
                <p className="text-sm text-[#7B9E6B]" style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)" }}>Check your inbox — the link expires in 1 hour.</p>
                <Link href="/login">
                  <Button variant="outline" className="mt-4 w-full h-12 border-[rgba(46,125,50,0.15)] text-[#7B9E6B] hover:text-[#2E7D32] hover:border-[#2E7D32] hover:bg-[#FAFAF8]" style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)" }}>
                    BACK TO SIGN IN
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <h1 className="text-4xl font-bold text-[#1a1a1a] mb-2" style={{ fontFamily: "var(--font-rajdhani,'Rajdhani',sans-serif)" }}>
                    Recover Your Account
                  </h1>
                  <p className="text-[#7B9E6B]" style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)" }}>Enter your email and we&apos;ll send you a reset link</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <Label htmlFor="email" className="text-[#1a1a1a] font-medium" style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)" }}>Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading}
                      className="mt-1.5 bg-[#FAFAF8] border-[rgba(46,125,50,0.15)] text-[#1a1a1a] placeholder-[#7B9E6B] focus:border-[#2E7D32] focus:ring-[#2E7D32]"
                      placeholder="you@example.com"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-[#2E7D32] hover:bg-[#235F27] text-white font-semibold h-12"
                    style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)" }}
                    disabled={isLoading}
                  >
                    {isLoading ? "SENDING..." : "SEND RESET LINK"}
                  </Button>
                </form>

                <p className="text-center text-sm text-[#7B9E6B] mt-6" style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)" }}>
                  Remember your password?{" "}
                  <Link href="/login" className="text-[#2E7D32] font-semibold hover:underline">
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
