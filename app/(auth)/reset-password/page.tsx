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
      <div className="bg-[#fff] rounded-lg p-8 border border-[rgba(46,125,50,0.15)] text-center">
        <div className="text-5xl mb-4">
          <svg className="w-16 h-16 mx-auto text-[#7B9E6B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-[#1a1a1a] mb-2" style={{ fontFamily: "var(--font-rajdhani,'Rajdhani',sans-serif)" }}>
          Invalid Reset Link
        </h1>
        <p className="text-[#7B9E6B] mb-6" style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)" }}>This link is expired or invalid. Please request a new one.</p>
        <Link href="/forgot-password">
          <Button className="bg-[#2E7D32] hover:bg-[#235F27] text-white h-12 px-8" style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)" }}>
            REQUEST NEW LINK
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#fff] rounded-lg p-8 border border-[rgba(46,125,50,0.15)]">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-[#1a1a1a] mb-2" style={{ fontFamily: "var(--font-rajdhani,'Rajdhani',sans-serif)" }}>
          Reset Password
        </h1>
        <p className="text-[#7B9E6B]" style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)" }}>Create a strong password for your account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <Label htmlFor="password" className="text-[#1a1a1a] font-medium" style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)" }}>New Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
            className="mt-1.5 bg-[#FAFAF8] border-[rgba(46,125,50,0.15)] text-[#1a1a1a] placeholder-[#7B9E6B] focus:border-[#2E7D32] focus:ring-[#2E7D32]"
            placeholder="Min. 8 characters"
          />
          <p className="text-xs text-[#7B9E6B] mt-1" style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)" }}>Must include uppercase, number, and special character</p>
        </div>
        <div>
          <Label htmlFor="confirm" className="text-[#1a1a1a] font-medium" style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)" }}>Confirm Password</Label>
          <Input
            id="confirm"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            disabled={isLoading}
            className="mt-1.5 bg-[#FAFAF8] border-[rgba(46,125,50,0.15)] text-[#1a1a1a] placeholder-[#7B9E6B] focus:border-[#2E7D32] focus:ring-[#2E7D32]"
            placeholder="Repeat new password"
          />
        </div>
        <Button
          type="submit"
          className="w-full bg-[#2E7D32] hover:bg-[#235F27] text-white font-semibold h-12"
          style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)" }}
          disabled={isLoading}
        >
          {isLoading ? "UPDATING..." : "UPDATE PASSWORD"}
        </Button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
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

          <Suspense fallback={
            <div className="bg-[#fff] rounded-lg p-8 border border-[rgba(46,125,50,0.15)]">
              <div className="animate-pulse text-center text-[#2E7D32]" style={{ fontFamily: "var(--font-rajdhani,'Rajdhani',sans-serif)" }}>Loading...</div>
            </div>
          }>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </>
  );
}
