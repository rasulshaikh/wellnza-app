import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-20">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-[#1C1917] mb-6">
            About Wellnza Nutrition
          </h1>
          <p className="text-xl text-[#57534E] leading-relaxed">
            Fueling athletes and fitness enthusiasts across India with science-backed supplements for optimal performance and recovery.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto mb-20">
          <div className="bg-[#FAFAF5] rounded-2xl p-8 md:p-10">
            <h2 className="font-heading text-2xl font-bold text-[#1C1917] mb-4">Our Story</h2>
            <p className="text-[#57534E] leading-relaxed mb-4">
              Wellnza Nutrition was born from a simple belief: every athlete deserves access to high-quality, clean supplements without the premium price tag. Born in India, built for performance.
            </p>
            <p className="text-[#57534E] leading-relaxed">
              We source our ingredients from trusted manufacturers and test every batch for purity and potency. No artificial fillers, no proprietary blends hiding ineffective doses — just transparent, effective formulas.
            </p>
          </div>
          <div className="bg-[#FAFAF5] rounded-2xl p-8 md:p-10">
            <h2 className="font-heading text-2xl font-bold text-[#1C1917] mb-4">Our Mission</h2>
            <p className="text-[#57534E] leading-relaxed mb-4">
              To make premium sports nutrition accessible to every Indian athlete — from gym beginners to seasoned competitors.
            </p>
            <p className="text-[#57534E] leading-relaxed">
              We believe in transparency: clear labeling, honest pricing, and formulas backed by real science. No hype, no hidden ingredients — just results you can measure.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="max-w-5xl mx-auto mb-20">
          <h2 className="font-heading text-3xl font-bold text-center text-[#1C1917] mb-10">
            Why Choose Wellnza?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-[#166534] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg text-[#1C1917] mb-2">100% Transparent</h3>
              <p className="text-[#57534E] text-sm">Full label disclosure. No proprietary blends. You know exactly what you&apos;re taking.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-[#166534] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg text-[#1C1917] mb-2">Lab Tested</h3>
              <p className="text-[#57534E] text-sm">Every batch is third-party tested for purity, potency, and heavy metals.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-[#166534] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg text-[#1C1917] mb-2">Fast Delivery</h3>
              <p className="text-[#57534E] text-sm">Free shipping on all orders. Pan-India delivery within 5-7 business days.</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-[#166534] rounded-2xl p-8 md:p-12 max-w-5xl mx-auto mb-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl md:text-5xl font-bold text-white mb-2">10K+</p>
              <p className="text-white/80 text-sm">Happy Customers</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-bold text-white mb-2">50+</p>
              <p className="text-white/80 text-sm">Cities Served</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-bold text-white mb-2">4.8★</p>
              <p className="text-white/80 text-sm">Average Rating</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-bold text-white mb-2">100%</p>
              <p className="text-white/80 text-sm">Authentic Products</p>
            </div>
          </div>
        </div>

        {/* Video Section */}
        <div className="max-w-4xl mx-auto mb-20">
          <h2 className="font-heading text-3xl font-bold text-center text-[#1C1917] mb-8">
            See the Difference
          </h2>
          <div className="aspect-video rounded-2xl overflow-hidden shadow-lg bg-[#1C1917]">
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
          <h2 className="font-heading text-3xl font-bold text-center text-[#1C1917] mb-12">
            Real Feedback from Real Athletes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl border border-[#E7E5E4]">
              <div className="flex gap-1 text-yellow-500 mb-4">★★★★★</div>
              <p className="text-[#1C1917] leading-relaxed mb-6">
                &ldquo;Wellnza gave me unmatched focus and energy during my toughest workouts. It&apos;s a game changer for my training.&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#166534] rounded-full flex items-center justify-center text-white font-semibold">R</div>
                <div>
                  <p className="font-semibold text-[#1C1917]">Rahul Mehta</p>
                  <p className="text-sm text-[#57534E]">CrossFit Athlete, Nagpur</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-xl border border-[#E7E5E4]">
              <div className="flex gap-1 text-yellow-500 mb-4">★★★★★</div>
              <p className="text-[#1C1917] leading-relaxed mb-6">
                &ldquo;The clean, powerful boost from Wellnza&apos;s pre-workout helped me push past my limits without the crash.&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#166534] rounded-full flex items-center justify-center text-white font-semibold">S</div>
                <div>
                  <p className="font-semibold text-[#1C1917]">Sarah Khan</p>
                  <p className="text-sm text-[#57534E]">Personal Trainer, Mumbai</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="font-heading text-2xl font-bold text-[#1C1917] mb-4">
            Ready to Fuel Your Potential?
          </h2>
          <p className="text-[#57534E] mb-8">Join 10,000+ athletes who trust Wellnza Nutrition.</p>
          <Link href="/products">
            <button className="bg-[#166534] text-white px-10 py-4 font-semibold rounded-lg hover:bg-[#14532D] transition-all">
              Shop Now
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
