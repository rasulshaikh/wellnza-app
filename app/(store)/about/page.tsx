import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="py-16 md:py-24 min-h-screen bg-[#0D0D0D]">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-20">
          <h1 className="font-bebas text-4xl md:text-6xl tracking-wider text-white mb-6">
            LOCK IN. NO EXCUSES.
          </h1>
          <p className="font-oswald text-lg md:text-xl text-[#888888] uppercase tracking-widest leading-relaxed">
            Premium supplements for athletes who mean business.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto mb-20">
          <div className="bg-[#1A1A1A] p-8 md:p-10" style={{ clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))" }}>
            <h2 className="font-bebas text-2xl tracking-wider text-white mb-4">THE MISSION</h2>
            <p className="font-oswald text-[#888888] text-sm uppercase tracking-wide leading-relaxed mb-4">
              NO FRILLS. NO FLUFF. JUST RESULTS.
            </p>
            <p className="text-[#888888] leading-relaxed">
              We source ingredients from trusted manufacturers and test every batch for purity. No artificial fillers. No proprietary blends hiding ineffective doses. Just transparent, effective formulas.
            </p>
          </div>
          <div className="bg-[#1A1A1A] p-8 md:p-10" style={{ clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))" }}>
            <h2 className="font-bebas text-2xl tracking-wider text-white mb-4">THE ORIGIN</h2>
            <p className="font-oswald text-[#888888] text-sm uppercase tracking-wide leading-relaxed mb-4">
              BORN FOR THE GRIND. BUILT FOR VICTORY.
            </p>
            <p className="text-[#888888] leading-relaxed">
              Every athlete deserves access to high-quality supplements without the premium price tag. We deliver what we promise — clean labels, honest pricing, science-backed formulas.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="max-w-5xl mx-auto mb-20">
          <h2 className="font-heading text-3xl font-bold text-center text-white mb-10" style={{ fontFamily: "var(--font-bebas)" }}>
            Why Choose Wellnza?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-[#1A1A1A]" style={{ clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))" }}>
              <div className="w-16 h-16 bg-[#166534] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bebas text-lg tracking-wider text-white mb-2">ZERO COMPROMISES</h3>
              <p className="font-oswald text-[#888888] text-xs uppercase tracking-wide">Full label disclosure. No proprietary blends.</p>
            </div>
            <div className="text-center p-6 bg-[#1A1A1A]" style={{ clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))" }}>
              <div className="w-16 h-16 bg-[#166534] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="font-bebas text-lg tracking-wider text-white mb-2">EVERY BATCH TESTED</h3>
              <p className="font-oswald text-[#888888] text-xs uppercase tracking-wide">Third-party tested for purity and heavy metals.</p>
            </div>
            <div className="text-center p-6 bg-[#1A1A1A]" style={{ clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))" }}>
              <div className="w-16 h-16 bg-[#166534] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="font-bebas text-lg tracking-wider text-white mb-2">DELIVERED FAST</h3>
              <p className="font-oswald text-[#888888] text-xs uppercase tracking-wide">Free shipping. Pan-India in 5-7 days.</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-[#166534] p-8 md:p-12 max-w-5xl mx-auto mb-20" style={{ clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))" }}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="font-bebas text-4xl md:text-5xl tracking-wider text-white mb-2">10K+</p>
              <p className="font-oswald text-white/80 text-xs uppercase tracking-widest">Athletes Strong</p>
            </div>
            <div>
              <p className="font-bebas text-4xl md:text-5xl tracking-wider text-white mb-2">50+</p>
              <p className="font-oswald text-white/80 text-xs uppercase tracking-widest">Cities Served</p>
            </div>
            <div>
              <p className="font-bebas text-4xl md:text-5xl tracking-wider text-white mb-2">4.8★</p>
              <p className="font-oswald text-white/80 text-xs uppercase tracking-widest">Average Rating</p>
            </div>
            <div>
              <p className="font-bebas text-4xl md:text-5xl tracking-wider text-white mb-2">100%</p>
              <p className="font-oswald text-white/80 text-xs uppercase tracking-widest">Authentic Products</p>
            </div>
          </div>
        </div>

        {/* Video Section */}
        <div className="max-w-4xl mx-auto mb-20">
          <h2 className="font-bebas text-3xl tracking-wider text-center text-white mb-8">
            SEE THE DIFFERENCE
          </h2>
          <div className="aspect-video bg-[#1A1A1A]" style={{ clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))" }}>
            <iframe
              src="https://www.youtube.com/embed/ugYy-kMWNtY"
              className="w-full h-full"
              allowFullScreen
              title="Wellnza Quality"
            />
          </div>
        </div>

        {/* Testimonials */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="font-bebas text-3xl tracking-wider text-center text-white mb-12">
            REAL FEEDBACK FROM REAL ATHLETES
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#1A1A1A] p-8 border border-[rgba(22,101,52,0.3)]" style={{ clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))" }}>
              <div className="flex gap-1 text-[#22C55E] mb-4">★★★★★</div>
              <p className="font-oswald text-white text-sm uppercase tracking-wide leading-relaxed mb-6">
                &ldquo;WELLNZA GAVE ME UNMATCHED FOCUS AND ENERGY DURING MY TOUGHEST WORKOUTS. GAME CHANGER.&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#166534] rounded-full flex items-center justify-center text-white font-semibold">R</div>
                <div>
                  <p className="font-oswald font-semibold text-white text-sm uppercase tracking-wide">RAHUL MEHTA</p>
                  <p className="font-oswald text-xs text-[#888888] uppercase tracking-widest">CROSSFIT ATHLETE, NAGPUR</p>
                </div>
              </div>
            </div>
            <div className="bg-[#1A1A1A] p-8 border border-[rgba(22,101,52,0.3)]" style={{ clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))" }}>
              <div className="flex gap-1 text-[#22C55E] mb-4">★★★★★</div>
              <p className="font-oswald text-white text-sm uppercase tracking-wide leading-relaxed mb-6">
                &ldquo;CLEAN, POWERFUL BOOST. PUSHED PAST MY LIMITS WITHOUT THE CRASH.&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#166534] rounded-full flex items-center justify-center text-white font-semibold">S</div>
                <div>
                  <p className="font-oswald font-semibold text-white text-sm uppercase tracking-wide">SARAH KHAN</p>
                  <p className="font-oswald text-xs text-[#888888] uppercase tracking-widest">PERSONAL TRAINER, MUMBAI</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="font-bebas text-2xl tracking-wider text-white mb-4">
            READY TO FUEL YOUR POTENTIAL?
          </h2>
          <p className="font-oswald text-[#888888] text-sm uppercase tracking-widest mb-8">Join 10,000+ athletes who trust Wellnza.</p>
          <Link href="/products">
            <button className="bg-[#166534] text-white px-10 py-4 font-oswald text-sm uppercase tracking-wider hover:bg-[#14532D] transition-all" style={{ clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))" }}>
              SHOP NOW
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
