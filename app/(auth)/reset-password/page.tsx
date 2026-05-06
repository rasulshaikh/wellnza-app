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
      <div className="bg-[#1A1A1A] rounded-lg p-8 border border-[rgba(22,101,52,0.3)] text-center" style={{ clipPath: "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))" }}>
        <div className="text-5xl mb-4">
          <svg className="w-16 h-16 mx-auto text-[#888888]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2 tracking-wider" style={{ fontFamily: "var(--font-bebas)" }}>
          INVALID RESET LINK
        </h1>
        <p className="text-[#888888] mb-6" style={{ fontFamily: "var(--font-oswald)" }}>This link is expired or invalid. Please request a new one.</p>
        <Link href="/forgot-password">
          <Button className="bg-[#166534] hover:bg-[#14532D] text-white h-12 px-8" style={{ fontFamily: "var(--font-bebas)", clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)" }}>
            REQUEST NEW LINK
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#1A1A1A] rounded-lg p-8 border border-[rgba(22,101,52,0.3)]" style={{ clipPath: "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))" }}>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2 tracking-wider" style={{ fontFamily: "var(--font-bebas)" }}>
          RESET PASSWORD
        </h1>
        <p className="text-[#888888]" style={{ fontFamily: "var(--font-oswald)" }}>Create a strong password for your account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <Label htmlFor="password" className="text-white font-medium" style={{ fontFamily: "var(--font-oswald)" }}>New Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
            className="mt-1.5 bg-[#0D0D0D] border-[rgba(22,101,52,0.3)] text-white placeholder-[#666666] focus:border-[#166534] focus:ring-[#166534]"
            placeholder="Min. 8 characters"
          />
          <p className="text-xs text-[#888888] mt-1" style={{ fontFamily: "var(--font-oswald)" }}>Must include uppercase, number, and special character</p>
        </div>
        <div>
          <Label htmlFor="confirm" className="text-white font-medium" style={{ fontFamily: "var(--font-oswald)" }}>Confirm Password</Label>
          <Input
            id="confirm"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            disabled={isLoading}
            className="mt-1.5 bg-[#0D0D0D] border-[rgba(22,101,52,0.3)] text-white placeholder-[#666666] focus:border-[#166534] focus:ring-[#166534]"
            placeholder="Repeat new password"
          />
        </div>
        <Button
          type="submit"
          className="w-full bg-[#166534] hover:bg-[#14532D] text-white font-semibold h-12"
          style={{ fontFamily: "var(--font-bebas)", clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)" }}
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
      <div className="min-h-screen flex items-center justify-center bg-[#0D0D0D] px-4 py-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <Link href="/" className="inline-block">
              <span className="text-3xl font-bold text-[#22C55E] tracking-wider" style={{ fontFamily: "var(--font-bebas)" }}>
                WELLNZA
              </span>
            </Link>
          </div>

          <Suspense fallback={
            <div className="bg-[#1A1A1A] rounded-lg p-8 border border-[rgba(22,101,52,0.3)]" style={{ clipPath: "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))" }}>
              <div className="animate-pulse text-center text-[#22C55E]" style={{ fontFamily: "var(--font-bebas)" }}>Loading...</div>
            </div>
          }>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </>
  );
}
