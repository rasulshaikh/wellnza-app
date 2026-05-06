"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch (err) {
      console.error("[newsletter] submission error:", err);
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <p className="mt-4 text-sm font-medium text-[#2E7D32]">
        Welcome to the Wellnza community!
      </p>
    );
  }

  return (
    <form className="mt-4 flex justify-center gap-2" onSubmit={handleSubmit}>
      <label htmlFor="newsletter-email" className="sr-only">Email Address</label>
      <input
        id="newsletter-email"
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="px-4 py-2 bg-white border border-[#2E7D32]/30 text-[#0D0D0D] placeholder-[#6B7280] w-64 rounded-md font-sans"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="px-6 py-2 bg-[#2E7D32] text-white font-semibold hover:bg-[#1B5E20] transition disabled:opacity-60 rounded-md"
        style={{ borderRadius: '4px' }}
      >
        {status === "loading" ? "..." : "Get 10% Off"}
      </button>
    </form>
  );
}
