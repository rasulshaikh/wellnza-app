import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="flex flex-1 flex-col" style={{ background: "#FAFAF8", minHeight: "100vh" }}>
      {/* Page header */}
      <div
        className="border-b border-[#2E7D32]/15 px-4 py-16 md:py-20"
        style={{ background: "#FAFAF8" }}
      >
        <div className="mx-auto max-w-4xl text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-[2px] w-8" style={{ background: "#2E7D32" }} />
            <span
              className="text-[12px] tracking-[3px]"
              style={{ fontFamily: "'DM Sans', sans-serif", color: "#2E7D32" }}
            >
              OUR STORY
            </span>
            <div className="h-[2px] w-8" style={{ background: "#2E7D32" }} />
          </div>
          <h1
            className="text-4xl md:text-5xl font-bold tracking-tight mb-6"
            style={{ fontFamily: "'Playfair Display', serif", color: "#1a1a1a", letterSpacing: "1px" }}
          >
            Wellness, Rooted in Nature
          </h1>
          <p
            className="max-w-2xl mx-auto text-[15px] leading-relaxed"
            style={{ fontFamily: "'DM Sans', sans-serif", color: "#7B9E6B" }}
          >
            We believe in transparency above all. Every ingredient, every dose — you know exactly what you are putting into your body. Clean supplements for a healthier you.
          </p>
        </div>
      </div>

      {/* Story Section */}
      <div className="py-16 px-4 md:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div
              className="p-8 md:p-10 rounded-md"
              style={{
                background: "#fff",
                border: "1px solid rgba(46, 125, 50, 0.15)",
                boxShadow: "0 2px 8px rgba(46, 125, 50, 0.06)",
              }}
            >
              <h2
                className="text-xl font-bold mb-3"
                style={{ fontFamily: "'Playfair Display', serif", color: "#1a1a1a" }}
              >
                Our Mission
              </h2>
              <p
                className="text-[13px] mb-3 uppercase tracking-wider"
                style={{ fontFamily: "'DM Sans', sans-serif", color: "#2E7D32", letterSpacing: "1px" }}
              >
                Clean labels. Honest pricing. No compromise.
              </p>
              <p
                className="text-[14px] leading-relaxed"
                style={{ fontFamily: "'DM Sans', sans-serif", color: "#7B9E6B" }}
              >
                We source ingredients from trusted manufacturers and test every batch for purity. No artificial fillers. No proprietary blends hiding ineffective doses. Just transparent, effective formulas that support your wellbeing.
              </p>
            </div>
            <div
              className="p-8 md:p-10 rounded-md"
              style={{
                background: "#fff",
                border: "1px solid rgba(46, 125, 50, 0.15)",
                boxShadow: "0 2px 8px rgba(46, 125, 50, 0.06)",
              }}
            >
              <h2
                className="text-xl font-bold mb-3"
                style={{ fontFamily: "'Playfair Display', serif", color: "#1a1a1a" }}
              >
                Why We Started
              </h2>
              <p
                className="text-[13px] mb-3 uppercase tracking-wider"
                style={{ fontFamily: "'DM Sans', sans-serif", color: "#2E7D32", letterSpacing: "1px" }}
              >
                Premium wellness should be accessible
              </p>
              <p
                className="text-[14px] leading-relaxed"
                style={{ fontFamily: "'DM Sans', sans-serif", color: "#7B9E6B" }}
              >
                We noticed the supplement industry was full of hidden ingredients and inflated claims. We decided to do things differently — clean labels, third-party testing, and pricing that makes sense. Every person deserves access to quality supplements.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="py-16 px-4 md:px-8" style={{ background: "#fff" }}>
        <div className="mx-auto max-w-5xl">
          <h2
            className="text-2xl font-bold text-center mb-10"
            style={{ fontFamily: "'Playfair Display', serif", color: "#1a1a1a" }}
          >
            Why Choose Wellnza?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div
              className="text-center p-8 rounded-md"
              style={{
                background: "#FAFAF8",
                border: "1px solid rgba(46, 125, 50, 0.1)",
              }}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                style={{ background: "rgba(46, 125, 50, 0.1)" }}
              >
                <svg className="w-8 h-8" style={{ color: "#2E7D32" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3
                className="text-lg font-bold mb-2"
                style={{ fontFamily: "'Playfair Display', serif", color: "#1a1a1a" }}
              >
                Full Label Disclosure
              </h3>
              <p
                className="text-[13px]"
                style={{ fontFamily: "'DM Sans', sans-serif", color: "#7B9E6B", letterSpacing: "0.5px" }}
              >
                No proprietary blends. Every ingredient listed transparently.
              </p>
            </div>
            <div
              className="text-center p-8 rounded-md"
              style={{
                background: "#FAFAF8",
                border: "1px solid rgba(46, 125, 50, 0.1)",
              }}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                style={{ background: "rgba(46, 125, 50, 0.1)" }}
              >
                <svg className="w-8 h-8" style={{ color: "#2E7D32" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h3
                className="text-lg font-bold mb-2"
                style={{ fontFamily: "'Playfair Display', serif", color: "#1a1a1a" }}
              >
                Third-Party Tested
              </h3>
              <p
                className="text-[13px]"
                style={{ fontFamily: "'DM Sans', sans-serif", color: "#7B9E6B", letterSpacing: "0.5px" }}
              >
                Every batch verified for purity and potency by independent labs.
              </p>
            </div>
            <div
              className="text-center p-8 rounded-md"
              style={{
                background: "#FAFAF8",
                border: "1px solid rgba(46, 125, 50, 0.1)",
              }}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                style={{ background: "rgba(46, 125, 50, 0.1)" }}
              >
                <svg className="w-8 h-8" style={{ color: "#2E7D32" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3
                className="text-lg font-bold mb-2"
                style={{ fontFamily: "'Playfair Display', serif", color: "#1a1a1a" }}
              >
                Delivered to Your Door
              </h3>
              <p
                className="text-[13px]"
                style={{ fontFamily: "'DM Sans', sans-serif", color: "#7B9E6B", letterSpacing: "0.5px" }}
              >
                Fast, reliable shipping from New Zealand to your doorstep.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div
        className="py-12 px-8 mx-4 md:mx-8 my-8 rounded-md"
        style={{ background: "linear-gradient(180deg, #fff 0%, #FAFAF8 100%)", border: "1px solid rgba(46, 125, 50, 0.1)" }}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <p
              className="text-4xl md:text-5xl font-bold mb-2"
              style={{ fontFamily: "'Playfair Display', serif", color: "#2E7D32" }}
            >
              10K+
            </p>
            <p
              className="text-xs uppercase tracking-widest"
              style={{ fontFamily: "'DM Sans', sans-serif", color: "#7B9E6B", letterSpacing: "2px" }}
            >
              Happy Customers
            </p>
          </div>
          <div>
            <p
              className="text-4xl md:text-5xl font-bold mb-2"
              style={{ fontFamily: "'Playfair Display', serif", color: "#2E7D32" }}
            >
              50+
            </p>
            <p
              className="text-xs uppercase tracking-widest"
              style={{ fontFamily: "'DM Sans', sans-serif", color: "#7B9E6B", letterSpacing: "2px" }}
            >
              Countries Served
            </p>
          </div>
          <div>
            <p
              className="text-4xl md:text-5xl font-bold mb-2"
              style={{ fontFamily: "'Playfair Display', serif", color: "#2E7D32" }}
            >
              4.8
            </p>
            <p
              className="text-xs uppercase tracking-widest"
              style={{ fontFamily: "'DM Sans', sans-serif", color: "#7B9E6B", letterSpacing: "2px" }}
            >
              Average Rating
            </p>
          </div>
          <div>
            <p
              className="text-4xl md:text-5xl font-bold mb-2"
              style={{ fontFamily: "'Playfair Display', serif", color: "#2E7D32" }}
            >
              100%
            </p>
            <p
              className="text-xs uppercase tracking-widest"
              style={{ fontFamily: "'DM Sans', sans-serif", color: "#7B9E6B", letterSpacing: "2px" }}
            >
              Authentic Products
            </p>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-16 px-4 md:px-8">
        <div className="mx-auto max-w-4xl">
          <h2
            className="text-2xl font-bold text-center mb-12"
            style={{ fontFamily: "'Playfair Display', serif", color: "#1a1a1a" }}
          >
            What Our Customers Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div
              className="p-8 rounded-md"
              style={{
                background: "#fff",
                border: "1px solid rgba(46, 125, 50, 0.15)",
                boxShadow: "0 2px 8px rgba(46, 125, 50, 0.06)",
              }}
            >
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <svg key={i} className="w-5 h-5" style={{ color: "#C9A227" }} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                  </svg>
                ))}
              </div>
              <p
                className="text-[15px] leading-relaxed mb-6"
                style={{ fontFamily: "'DM Sans', sans-serif", color: "#1a1a1a", fontStyle: "italic" }}
              >
                &ldquo;The clean, powerful boost from Wellnza&apos;s pre-workout helped me push past my limits without the crash.&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                  style={{ background: "#2E7D32" }}
                >
                  S
                </div>
                <div>
                  <p
                    className="font-semibold text-sm"
                    style={{ fontFamily: "'DM Sans', sans-serif", color: "#1a1a1a" }}
                  >
                    Sam K.
                  </p>
                  <p
                    className="text-xs uppercase tracking-wider"
                    style={{ fontFamily: "'DM Sans', sans-serif", color: "#7B9E6B" }}
                  >
                    Christchurch, NZ
                  </p>
                </div>
              </div>
            </div>
            <div
              className="p-8 rounded-md"
              style={{
                background: "#fff",
                border: "1px solid rgba(46, 125, 50, 0.15)",
                boxShadow: "0 2px 8px rgba(46, 125, 50, 0.06)",
              }}
            >
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <svg key={i} className="w-5 h-5" style={{ color: "#C9A227" }} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                  </svg>
                ))}
              </div>
              <p
                className="text-[15px] leading-relaxed mb-6"
                style={{ fontFamily: "'DM Sans', sans-serif", color: "#1a1a1a", fontStyle: "italic" }}
              >
                &ldquo;Finally a supplement brand that is transparent about what is in their products. The quality is outstanding and shipping to NZ was fast.&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                  style={{ background: "#2E7D32" }}
                >
                  J
                </div>
                <div>
                  <p
                    className="font-semibold text-sm"
                    style={{ fontFamily: "'DM Sans', sans-serif", color: "#1a1a1a" }}
                  >
                    James T.
                  </p>
                  <p
                    className="text-xs uppercase tracking-wider"
                    style={{ fontFamily: "'DM Sans', sans-serif", color: "#7B9E6B" }}
                  >
                    Wellington, NZ
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-16 px-4 text-center" style={{ background: "#FAFAF8", borderTop: "1px solid rgba(46, 125, 50, 0.1)" }}>
        <h2
          className="text-2xl font-bold mb-4"
          style={{ fontFamily: "'Playfair Display', serif", color: "#1a1a1a" }}
        >
          Ready to Start Your Wellness Journey?
        </h2>
        <p
          className="text-[14px] mb-8"
          style={{ fontFamily: "'DM Sans', sans-serif", color: "#7B9E6B" }}
        >
          Join thousands of customers who trust Wellnza for their daily supplements.
        </p>
        <Link href="/products">
          <button
            className="px-10 py-4 text-sm font-semibold tracking-wider transition-opacity"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              background: "#2E7D32",
              color: "#fff",
              borderRadius: "6px",
              letterSpacing: "1px",
            }}
          >
            Shop Supplements
          </button>
        </Link>
      </div>
    </div>
  );
}
