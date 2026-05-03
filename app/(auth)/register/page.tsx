"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
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