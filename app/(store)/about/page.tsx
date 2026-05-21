import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen" style={{ background: "#0B0F0C" }}>

      {/* ═══ HERO — HEADLINE ═══ */}
      <section
        className="relative overflow-hidden luxury-section"
        style={{ background: "linear-gradient(135deg, #0B0F0C 0%, #141A16 60%, #1a2e1e 100%)", minHeight: "60vh" }}
      >
        {/* Gold glow top-right */}
        <div
          className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(232,160,32,0.08) 0%, transparent 70%)" }}
        />
        {/* Green glow bottom-left */}
        <div
          className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(20,83,45,0.25) 0%, transparent 70%)" }}
        />

        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center pt-16 pb-12">

            {/* Origin pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-8 animate-fade-up" style={{ background: "rgba(232,160,32,0.1)", border: "1px solid rgba(232,160,32,0.25)" }}>
              <span style={{ color: "#E8A020", fontSize: "10px" }}>◆</span>
              <span className="text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: "#E8A020", fontFamily: "var(--font-jakarta)" }}>
                Amravati, Maharashtra
              </span>
            </div>

            {/* Headline */}
            <h1
              className="leading-none mb-6 animate-fade-up"
              style={{
                color: "#F7F3EC",
                textTransform: "uppercase",
                fontFamily: "var(--font-rajdhani)",
                fontWeight: 700,
                fontSize: "clamp(42px,7vw,80px)",
                letterSpacing: "0.01em"
              }}
            >
              Supplements Indian Athletes
              <br />
              <span style={{ color: "#E8A020" }}>
                Actually Deserve
              </span>
            </h1>

            <p
              className="text-base md:text-lg leading-relaxed animate-fade-up-delay-1 mx-auto"
              style={{ color: "rgba(247,243,236,0.6)", fontFamily: "var(--font-jakarta)", maxWidth: "640px" }}
            >
              Clean formulas. Honest ingredients. Premium quality at Indian price points.
              Born in Amravati, built for champions across India.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ ORIGIN STORY ═══ */}
      <section className="py-20" style={{ background: "#0B0F0C" }}>
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-3xl mx-auto">

            {/* Section label */}
            <div className="flex items-center gap-3 mb-6">
              <span className="accent-bar" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: "#E8A020", fontFamily: "var(--font-jakarta)" }}>
                Our Story
              </span>
            </div>

            <h2
              className="uppercase leading-none mb-8"
              style={{ fontFamily: "var(--font-rajdhani)", fontSize: "clamp(32px,5vw,52px)", fontWeight: 700, color: "#F7F3EC", letterSpacing: "0.02em" }}
            >
              Born in a Warehouse That Smelled Like Ambition
            </h2>

            <div className="space-y-5">
              <p style={{ color: "rgba(247,243,236,0.65)", fontFamily: "var(--font-jakarta)", fontSize: "15px", lineHeight: "1.8" }}>
                Wellnza started in 2021 in a small warehouse in Amravati, Maharashtra. Two gym friends — one a former state-level powerlifter, the other a food science graduate who'd worked with contract manufacturers overseas — sharing one frustration: Indian athletes were paying imported-brand prices for supplements that used the exact same manufacturers anyway.
              </p>
              <p style={{ color: "rgba(247,243,236,0.65)", fontFamily: "var(--font-jakarta)", fontSize: "15px", lineHeight: "1.8" }}>
                The realization was simple and infuriating. Every rupee of premium pricing was going toward brand marketing and import duties — not better ingredients. So they did something about it: they went direct to manufacturers, cut out the middlemen, and passed the savings to Indian athletes.
              </p>
              <p style={{ color: "rgba(247,243,236,0.65)", fontFamily: "var(--font-jakarta)", fontSize: "15px", lineHeight: "1.8" }}>
                First product: a plain-sellers whey protein concentrate. No proprietary blends. No hidden ingredients. Just 25g of protein per serving, clean label, honest price. It sold out in three weeks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ STATS BAR ═══ */}
      <section
        className="py-12 border-y"
        style={{ background: "#0B0F0C", borderColor: "rgba(232,160,32,0.12)" }}
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { val: "2021", label: "Est." },
              { val: "50K+", label: "Customers" },
              { val: "4.7★", label: "Avg. Rating" },
              { val: "100%", label: "Transparent" },
            ].map((s) => (
              <div key={s.label}>
                <p
                  className="text-3xl md:text-5xl font-bold leading-none mb-1"
                  style={{ fontFamily: "var(--font-rajdhani)", color: "#E8A020" }}
                >
                  {s.val}
                </p>
                <p
                  className="text-[10px] uppercase tracking-widest"
                  style={{ fontFamily: "var(--font-jakarta)", color: "rgba(247,243,236,0.4)" }}
                >
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ MISSION ═══ */}
      <section className="py-20" style={{ background: "#0B0F0C" }}>
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <span className="accent-bar" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: "#E8A020", fontFamily: "var(--font-jakarta)" }}>
                Our Mission
              </span>
            </div>

            <h2
              className="uppercase leading-none mb-8"
              style={{ fontFamily: "var(--font-rajdhani)", fontSize: "clamp(32px,5vw,52px)", fontWeight: 700, color: "#F7F3EC", letterSpacing: "0.02em" }}
            >
              We Solve One Problem
            </h2>

            <div
              className="p-8 md:p-10 rounded-xl"
              style={{ background: "rgba(232,160,32,0.04)", border: "1px solid rgba(232,160,32,0.15)" }}
            >
              <p
                className="text-lg md:text-xl leading-relaxed mb-6"
                style={{ color: "#F7F3EC", fontFamily: "var(--font-jakarta)", fontWeight: 600 }}
              >
                Give every Indian athlete — first-time gym-goers to competitive lifters — access to clean, transparent, effective sports nutrition without the imported markup.
              </p>
              <p style={{ color: "rgba(247,243,236,0.6)", fontFamily: "var(--font-jakarta)", fontSize: "15px", lineHeight: "1.8" }}>
                Not the watered-down local versions. Not the overpriced imports. The same world-class formulations — tested, transparent, and priced for Indian athletes who train hard and think smart.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ DIFFERENTIATORS ═══ */}
      <section className="py-20" style={{ background: "linear-gradient(180deg, #0B0F0C 0%, #111A13 100%)" }}>
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <span className="accent-bar" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: "#E8A020", fontFamily: "var(--font-jakarta)" }}>
                Why Wellnza
              </span>
            </div>

            <h2
              className="uppercase leading-none mb-10"
              style={{ fontFamily: "var(--font-rajdhani)", fontSize: "clamp(32px,5vw,52px)", fontWeight: 700, color: "#F7F3EC", letterSpacing: "0.02em" }}
            >
              What Makes Us Different
            </h2>

            <div className="space-y-4">
              {[
                {
                  title: "No Proprietary Blends. Ever.",
                  desc: "Every ingredient and exact dose is on the label. If it says 25g protein, you'll get a scoop that measures 25g protein. No fluff, no padding."
                },
                {
                  title: "Third-Party Tested. Every Batch.",
                  desc: "We don't just claim quality — we prove it. Each production run is verified by independent labs for purity, potency, and heavy metals."
                },
                {
                  title: "Priced for India. Not for Imports.",
                  desc: "Same contract manufacturers as premium international brands. But no import duties, no foreign marketing budgets, no luxury margins. Just fair pricing for Indian athletes."
                },
                {
                  title: "Zero Artificial Fillers.",
                  desc: "No artificial colors, no synthetic fillers, no junk. Clean formulas that support performance without compromising your health."
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex gap-4 p-5 rounded-lg"
                  style={{ background: "rgba(247,243,236,0.03)", border: "1px solid rgba(232,160,32,0.1)" }}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: "rgba(232,160,32,0.12)" }}
                  >
                    <span style={{ color: "#E8A020", fontFamily: "var(--font-rajdhani)", fontWeight: 700, fontSize: "14px" }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div>
                    <h3
                      className="font-bold uppercase mb-1"
                      style={{ fontFamily: "var(--font-rajdhani)", fontSize: "16px", color: "#F7F3EC", letterSpacing: "0.05em" }}
                    >
                      {item.title}
                    </h3>
                    <p style={{ color: "rgba(247,243,236,0.55)", fontFamily: "var(--font-jakarta)", fontSize: "13px", lineHeight: "1.7" }}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ VALUES ═══ */}
      <section className="py-20" style={{ background: "#0B0F0C" }}>
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <span className="accent-bar" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: "#E8A020", fontFamily: "var(--font-jakarta)" }}>
                What We Stand For
              </span>
            </div>

            <h2
              className="uppercase leading-none mb-12"
              style={{ fontFamily: "var(--font-rajdhani)", fontSize: "clamp(32px,5vw,52px)", fontWeight: 700, color: "#F7F3EC", letterSpacing: "0.02em" }}
            >
              Our Core Values
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: "01",
                  title: "TRANSPARENCY",
                  desc: "Full label disclosure isn't a marketing tactic — it's the baseline. You deserve to know exactly what you're putting in your body. Every ingredient, every dose."
                },
                {
                  icon: "02",
                  title: "PERFORMANCE",
                  desc: "We don't ship a product until we're convinced it delivers results. If it doesn't help you lift heavier, recover faster, or train harder, it doesn't carry our name."
                },
                {
                  icon: "03",
                  title: "INDIAN PRIDE",
                  desc: "Born in Amravati. Made for Indian athletes. We're unapologetic about our origins — and we believe Indian quality can match anything the world throws at us."
                },
              ].map((v) => (
                <div
                  key={v.title}
                  className="p-8 rounded-xl text-center"
                  style={{ background: "rgba(232,160,32,0.04)", border: "1px solid rgba(232,160,32,0.15)" }}
                >
                  <p
                    className="text-4xl font-bold mb-4"
                    style={{ fontFamily: "var(--font-rajdhani)", color: "rgba(232,160,32,0.4)" }}
                  >
                    {v.icon}
                  </p>
                  <h3
                    className="font-bold uppercase tracking-widest mb-4"
                    style={{ fontFamily: "var(--font-rajdhani)", fontSize: "16px", color: "#E8A020", letterSpacing: "0.12em" }}
                  >
                    {v.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "rgba(247,243,236,0.55)", fontFamily: "var(--font-jakarta)" }}
                  >
                    {v.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FOUNDERS ═══ */}
      <section className="py-20" style={{ background: "linear-gradient(180deg, #0B0F0C 0%, #111A13 100%)" }}>
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-3xl mx-auto">

            <div className="flex items-center gap-3 mb-6">
              <span className="accent-bar" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: "#E8A020", fontFamily: "var(--font-jakarta)" }}>
                The People
              </span>
            </div>

            <h2
              className="uppercase leading-none mb-10"
              style={{ fontFamily: "var(--font-rajdhani)", fontSize: "clamp(32px,5vw,52px)", fontWeight: 700, color: "#F7F3EC", letterSpacing: "0.02em" }}
            >
              Meet the Founders
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  name: "Karan Patel",
                  role: "Co-Founder & CEO",
                  bg: "rgba(232,160,32,0.08)",
                  initials: "KP",
                  bio: `Former state-level powerlifter who spent a decade watching talented Indian athletes get fleeced by overpriced imported supplements. After retiring from competition, he teamed up with Arjun to build something better. Trains early mornings, still. Mostly to justify the protein.`
                },
                {
                  name: "Arjun Deshmukh",
                  role: "Co-Founder & Head of Product",
                  bg: "rgba(20,83,45,0.15)",
                  initials: "AD",
                  bio: `Food science graduate who worked with supplement contract manufacturers across Europe and Southeast Asia before returning to India. Holds a Level 2 certification in sports nutrition from ISSPN. His kitchen pantry is 80% raw ingredients and 20% lab equipment.`
                },
              ].map((f) => (
                <div
                  key={f.name}
                  className="p-8 rounded-xl"
                  style={{ background: f.bg, border: "1px solid rgba(232,160,32,0.12)" }}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: "rgba(232,160,32,0.12)" }}
                    >
                      <span
                        className="text-lg font-bold"
                        style={{ fontFamily: "var(--font-rajdhani)", color: "#E8A020" }}
                      >
                        {f.initials}
                      </span>
                    </div>
                    <div>
                      <h3
                        className="font-bold uppercase"
                        style={{ fontFamily: "var(--font-rajdhani)", fontSize: "18px", color: "#F7F3EC", letterSpacing: "0.05em" }}
                      >
                        {f.name}
                      </h3>
                      <p
                        className="text-xs uppercase tracking-widest"
                        style={{ color: "#E8A020", fontFamily: "var(--font-jakarta)" }}
                      >
                        {f.role}
                      </p>
                    </div>
                  </div>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "rgba(247,243,236,0.55)", fontFamily: "var(--font-jakarta)" }}
                  >
                    {f.bio}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ PROMISE ═══ */}
      <section className="py-20" style={{ background: "#0B0F0C" }}>
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="h-[1px] w-16" style={{ background: "linear-gradient(90deg, transparent, #E8A020)" }} />
              <span style={{ color: "#E8A020" }}>◆</span>
              <div className="h-[1px] w-16" style={{ background: "linear-gradient(90deg, #E8A020, transparent)" }} />
            </div>

            <h2
              className="uppercase leading-none mb-6"
              style={{ fontFamily: "var(--font-rajdhani)", fontSize: "clamp(32px,5vw,52px)", fontWeight: 700, color: "#F7F3EC", letterSpacing: "0.02em" }}
            >
              Our Promise to You
            </h2>

            <p
              className="text-base leading-relaxed mb-4"
              style={{ color: "rgba(247,243,236,0.65)", fontFamily: "var(--font-jakarta)" }}
            >
              Every Wellnza product will always list every ingredient, in exact amounts, with nothing hidden.
            </p>
            <p
              className="text-base leading-relaxed mb-10"
              style={{ color: "rgba(247,243,236,0.65)", fontFamily: "var(--font-jakarta)" }}
            >
              If it says 25g of protein per serving, that's exactly what you'll measure. No rounding up. No vague "matrix" labels. Just the truth.
            </p>

            <div
              className="inline-block px-8 py-4 rounded-xl"
              style={{ background: "rgba(232,160,32,0.08)", border: "1px solid rgba(232,160,32,0.2)" }}
            >
              <p
                className="text-sm font-bold uppercase tracking-widest"
                style={{ color: "#E8A020", fontFamily: "var(--font-rajdhani)", letterSpacing: "0.1em" }}
              >
                Clean Labels. Honest Prices. No Compromise.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section
        className="py-20 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0B0F0C 0%, #141A16 100%)" }}
      >
        <div className="absolute inset-0 stripe-gold pointer-events-none opacity-30" />
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <h2
              className="uppercase leading-none mb-4"
              style={{ fontFamily: "var(--font-rajdhani)", fontSize: "clamp(36px,6vw,64px)", fontWeight: 700, color: "#F7F3EC", letterSpacing: "0.02em" }}
            >
              Ready to Feel the Difference?
            </h2>
            <p
              className="text-sm mb-10"
              style={{ color: "rgba(247,243,236,0.5)", fontFamily: "var(--font-jakarta)" }}
            >
              Browse our full range of clean, transparent sports nutrition — priced for Indian athletes.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/products" className="btn-gold inline-flex items-center gap-2 px-8 py-4">
                Shop Supplements <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/products?category=PROTEIN"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-lg text-sm font-bold uppercase tracking-wider transition-all"
                style={{
                  fontFamily: "var(--font-jakarta)",
                  fontSize: "13px",
                  letterSpacing: "0.1em",
                  color: "rgba(247,243,236,0.7)",
                  border: "1px solid rgba(247,243,236,0.15)",
                }}
              >
                View Protein Range
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
