"use client";

export function NewsletterForm() {
  return (
    <form className="mt-4 flex justify-center gap-2" onSubmit={(e) => e.preventDefault()}>
      <input
        type="email"
        placeholder="Email Address"
        className="px-4 py-2 bg-white/10 border border-white/20 text-white placeholder-gray-400 w-64"
      />
      <button
        type="submit"
        className="px-6 py-2 bg-white text-black font-semibold hover:bg-gray-200 transition"
      >
        Subscribe
      </button>
    </form>
  );
}
