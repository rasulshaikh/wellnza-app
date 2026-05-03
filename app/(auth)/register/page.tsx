"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Navbar } from "@/components/layout/Navbar";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Registration failed");
        setIsLoading(false);
        return;
      }

      toast.success("Account created! Please sign in.");
      router.push("/login");
    } catch {
      toast.error("Something went wrong");
      setIsLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF5] px-4 py-12">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="text-center">
            <Link href="/" className="inline-block">
              <span className="text-3xl font-bold text-[#166534] tracking-tight" style={{ fontFamily: "var(--font-playfair), Playfair Display, serif" }}>
                Wellnza
              </span>
            </Link>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-[#E7E5E4] p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-[#1C1917] mb-2" style={{ fontFamily: "var(--font-playfair), Playfair Display, serif" }}>
                Create an account
              </h1>
              <p className="text-[#57534E]">Start shopping with Well NZ Nutrition</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label htmlFor="name" className="text-[#1C1917] font-medium">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={isLoading}
                  className="mt-1.5 border-[#E7E5E4] focus:border-[#166534] focus:ring-[#166534]"
                />
              </div>
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
                />
              </div>
              <div>
                <Label htmlFor="phone" className="text-[#1C1917] font-medium">
                  Phone Number <span className="text-[#A8A29E] font-normal">(optional, for order updates via WhatsApp)</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  disabled={isLoading}
                  className="mt-1.5 border-[#E7E5E4] focus:border-[#166534] focus:ring-[#166534]"
                />
              </div>
              <div>
                <Label htmlFor="password" className="text-[#1C1917] font-medium">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  disabled={isLoading}
                  className="mt-1.5 border-[#E7E5E4] focus:border-[#166534] focus:ring-[#166534]"
                />
                <p className="text-xs text-[#57534E] mt-1.5">Minimum 8 characters</p>
              </div>
              <Button type="submit" className="w-full bg-[#166534] hover:bg-[#14532D] text-white font-semibold h-11" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create account"}
              </Button>
            </form>

            <div className="relative mt-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-[#E7E5E4]" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-3 text-[#57534E]">Or continue with</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full mt-6 h-11 border-[#E7E5E4] hover:border-[#166534] hover:bg-[#FAFAF5]"
              onClick={() => signIn("google", { callbackUrl: "/account" })}
              disabled={isLoading}
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </Button>

            <p className="text-center text-sm text-[#57534E] mt-6">
              Already have an account?{" "}
              <Link href="/login" className="text-[#166534] font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}