"use client";

export function NewsletterForm() {
  return (
    <form className="flex flex-col gap-2" onSubmit={(e) => e.preventDefault()}>
      <input
        type="email"
        placeholder="Your email address"
        className="w-full px-4 py-3 bg-[#1A1A1A] border border-[rgba(22,101,52,0.3)] font-oswald text-sm text-white placeholder-[#666666] focus:outline-none focus:border-[#166534] transition-colors duration-200"
      />
      <button
        type="submit"
        className="w-full px-6 py-3 bg-[#166534] text-white font-bebas text-lg uppercase tracking-wider hover:bg-[#166534]/90 transition-colors duration-200"
        style={{ clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)" }}
      >
        Subscribe
      </button>
    </form>
  );
}
