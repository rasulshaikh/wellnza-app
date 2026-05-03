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
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <p className="mt-4 text-sm font-medium text-green-300">
        Thanks for subscribing!
      </p>
    );
  }

  return (
    <form className="mt-4 flex justify-center gap-2" onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email Address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="px-4 py-2 bg-white/10 border border-white/20 text-white placeholder-gray-400 w-64"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="px-6 py-2 bg-white text-black font-semibold hover:bg-gray-200 transition disabled:opacity-60"
      >
        {status === "loading" ? "..." : "Subscribe"}
      </button>
    </form>
  );
}
