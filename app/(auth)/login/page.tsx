"use client";

import { useActionState, useEffect } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Navbar } from "@/components/layout/Navbar";
import { loginAction } from "./actions";

export default function LoginPage() {
  // useActionState wires the server action to a form:
  //   • isPending  → true while the server action is in flight
  //   • errorMsg   → the string returned by loginAction on failure (null on success/redirect)
  const [errorMsg, formAction, isPending] = useActionState(loginAction, null);

  // Scroll to top on error so the message is visible
  useEffect(() => {
    if (errorMsg) window.scrollTo({ top: 0, behavior: "smooth" });
  }, [errorMsg]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF8] px-4 py-12">
        <div className="w-full max-w-md space-y-8">
          {/* Brand */}
          <div className="text-center">
            <Link href="/" className="inline-block">
              <span
                className="text-3xl font-bold tracking-wider"
                style={{ fontFamily: "var(--font-rajdhani,'Rajdhani',sans-serif)" }}
              >
                Well<span className="text-[#2E7D32]">nza</span>
              </span>
            </Link>
          </div>

          <div
            className="bg-white rounded-lg p-8 border border-[rgba(46,125,50,0.15)]"
            style={{ boxShadow: "0 4px 24px rgba(46,125,50,0.08)" }}
          >
            <div className="text-center mb-8">
              <h1
                className="text-4xl font-bold text-[#1a1a1a] mb-2"
                style={{ fontFamily: "var(--font-rajdhani,'Rajdhani',sans-serif)" }}
              >
                Welcome Back
              </h1>
              <p
                className="text-[#7B9E6B]"
                style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)" }}
              >
                Sign in to your account
              </p>
            </div>

            {/* Inline error banner */}
            {errorMsg && (
              <div
                className="mb-5 px-4 py-3 rounded-md text-sm border"
                style={{
                  background: "rgba(220,38,38,0.06)",
                  borderColor: "rgba(220,38,38,0.25)",
                  color: "#dc2626",
                  fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)",
                }}
              >
                {errorMsg}
              </div>
            )}

            {/*
              Native <form> with action={formAction} — the server action handles
              validation, JWT creation, cookie setting, and redirect all in one
              request. No client-side race condition.
            */}
            <form action={formAction} className="space-y-5">
              <div>
                <Label
                  htmlFor="email"
                  className="text-[#1a1a1a] font-medium"
                  style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)" }}
                >
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  disabled={isPending}
                  autoComplete="email"
                  className="mt-1.5 bg-[#FAFAF8] border-[rgba(46,125,50,0.15)] text-[#1a1a1a] placeholder-[#7B9E6B] focus:border-[#2E7D32] focus:ring-[#2E7D32]"
                />
              </div>
              <div>
                <Label
                  htmlFor="password"
                  className="text-[#1a1a1a] font-medium"
                  style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)" }}
                >
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  disabled={isPending}
                  autoComplete="current-password"
                  className="mt-1.5 bg-[#FAFAF8] border-[rgba(46,125,50,0.15)] text-[#1a1a1a] placeholder-[#7B9E6B] focus:border-[#2E7D32] focus:ring-[#2E7D32]"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-[#2E7D32] hover:bg-[#235F27] text-white font-semibold h-12"
                style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)" }}
                disabled={isPending}
              >
                {isPending ? "SIGNING IN..." : "SIGN IN"}
              </Button>
            </form>

            <div className="relative mt-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-[rgba(46,125,50,0.15)]" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span
                  className="bg-white px-3 text-[#7B9E6B]"
                  style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)" }}
                >
                  Or continue with
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full mt-6 h-12 border-[rgba(46,125,50,0.15)] text-[#7B9E6B] hover:text-[#2E7D32] hover:border-[#2E7D32] hover:bg-[#FAFAF8]"
              style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)" }}
              onClick={() => signIn("google", { callbackUrl: "/account" })}
              disabled={isPending}
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              CONTINUE WITH GOOGLE
            </Button>

            <p
              className="text-center text-sm text-[#7B9E6B] mt-6"
              style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)" }}
            >
              <Link href="/forgot-password" className="text-[#2E7D32] hover:underline">
                Forgot password?
              </Link>
            </p>
            <p
              className="text-center text-sm text-[#7B9E6B] mt-2"
              style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)" }}
            >
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-[#2E7D32] font-semibold hover:underline">
                Join the squad
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
