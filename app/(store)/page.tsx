import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";
import { NewsletterForm } from "./_components/newsletter-form";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { ArrowRight, ShieldCheck, FlaskConical, Zap, Heart } from "lucide-react";
import { HeroProductFloat } from "@/components/ui-styling/HeroProductFloat";

export const dynamic = "force-dynamic";

async function getFeaturedProducts() {
  return db.product.findMany({
    where: { isActive: true, featured: true },
    take: 6,
    select: {
      id: true, name: true, slug: true, basePrice: true, comparePrice: true,
      images: true, category: true, featured: true, description: true,
    },
  });
}

const CATEGORY_LABELS: Record<string, string> = {
  PRE_WORKOUT: "Pre-Workout",
  PROTEIN: "Protein",
  MASS_GAINER: "Mass Gainer",
  OMEGA_3: "Omega-3",
  MULTIVITAMIN: "Multivitamin",
};

export default async function HomePage() {
  const products = await getFeaturedProducts();

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F7F3EC" }}>

      {/* ═══ HERO ═══ */}
      <section
        className="relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0B0F0C 0%, #141A16 60%, #1a2e1e 100%)", minHeight: "92vh" }}
      >
        {/* Decorative diagonal gold stripe */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "repeating-linear-gradient(-55deg, transparent, transparent 80px, rgba(232,160,32,0.025) 80px, rgba(232,160,32,0.025) 81px)",
          }}
        />
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
          <div className="grid md:grid-cols-2 gap-8 items-center min-h-[92vh] py-16">

            {/* LEFT — Text */}
            <div className="animate-fade-up">
              {/* Origin pill */}
              <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full" style={{ background: "rgba(232,160,32,0.1)", border: "1px solid rgba(232,160,32,0.25)" }}>
                <span style={{ color: "#E8A020", fontSize: "10px" }}>◆</span>
                <span className="text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: "#E8A020", fontFamily: "var(--font-jakarta)" }}>
                  Amravati, Maharashtra
                </span>
              </div>

              {/* Headline */}
              <h1
                className="mb-6 leading-none"
                style={{
                  fontFamily: "var(--font-rajdhani,'Rajdhani',sans-serif)",
                  fontSize: "clamp(52px, 8vw, 96px)",
                  fontWeight: 700,
                  color: "#F7F3EC",
                  textTransform: "uppercase",
                  letterSpacing: "0.02em",
                  lineHeight: 0.95,
                }}
              >
                Built for<br />
                <span style={{
                  background: "linear-gradient(135deg, #E8A020 0%, #F5C842 50%, #E8A020 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}>
                  Champions
                </span>
              </h1>

              <p
                className="mb-8 max-w-md leading-relaxed animate-fade-up-delay-1"
                style={{
                  fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)",
                  fontSize: "16px",
                  color: "rgba(247,243,236,0.65)",
                  lineHeight: 1.75,
                }}
              >
                Premium sports nutrition rooted in Maharashtra. Clean formulas, honest ingredients,
                and a commitment to every Indian athlete who refuses to settle.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3 animate-fade-up-delay-2">
                <Link href="/products" className="btn-gold inline-flex items-center gap-2">
                  Shop Now <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-md text-sm font-bold uppercase tracking-wider transition-all"
                  style={{
                    fontFamily: "var(--font-jakarta)",
                    fontSize: "13px",
                    letterSpacing: "0.1em",
                    color: "rgba(247,243,236,0.7)",
                    border: "1px solid rgba(247,243,236,0.15)",
                  }}
                >
                  Our Story
                </Link>
              </div>

              {/* Stats */}
              <div className="flex gap-8 mt-12 animate-fade-up-delay-3">
                {[
                  { val: "100%", label: "Natural" },
                  { val: "0g", label: "Added Sugar" },
                  { val: "GMP", label: "Certified" },
                ].map((s) => (
                  <div key={s.label}>
                    <p
                      className="text-2xl font-bold leading-none mb-1"
                      style={{ fontFamily: "var(--font-rajdhani)", color: "#E8A020" }}
                    >
                      {s.val}
                    </p>
                    <p
                      className="text-[11px] uppercase tracking-widest"
                      style={{ fontFamily: "var(--font-jakarta)", color: "rgba(247,243,236,0.45)" }}
                    >
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT — Visual */}
            <div className="relative flex items-center justify-center animate-fade-up-delay-1">
              <div className="relative w-full max-w-md aspect-square">
                {/* Outer ring */}
                <div
                  className="absolute inset-0 rounded-full"
                  style={{ border: "1px solid rgba(232,160,32,0.12)" }}
                />
                {/* Inner ring */}
                <div
                  className="absolute inset-8 rounded-full"
                  style={{ border: "1px dashed rgba(232,160,32,0.08)" }}
                />
                {/* Center panel */}
                <div
                  className="absolute inset-16 rounded-2xl flex items-center justify-center"
                  style={{ background: "rgba(232,160,32,0.06)", border: "1px solid rgba(232,160,32,0.15)" }}
                >
                  {products[0]?.images[0] ? (
                    <HeroProductFloat
                      imageSrc={products[0].images[0]}
                      imageAlt={products[0].name ?? "Featured product"}
                    />
                  ) : (
                    <div className="text-center p-8">
                      <p
                        className="text-6xl font-bold leading-none mb-2"
                        style={{ fontFamily: "var(--font-rajdhani)", color: "#E8A020" }}
                      >
                        W
                      </p>
                      <p className="text-xs uppercase tracking-widest" style={{ color: "rgba(232,160,32,0.5)" }}>
                        Wellnza
                      </p>
                    </div>
                  )}
                </div>

                {/* Floating badge — top right */}
                <div
                  className="absolute top-6 right-0 px-3 py-2 rounded-lg text-center"
                  style={{ background: "#E8A020", transform: "translateX(20%)" }}
                >
                  <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#0B0F0C" }}>
                    Made in
                  </p>
                  <p className="text-sm font-bold" style={{ color: "#0B0F0C", fontFamily: "var(--font-rajdhani)" }}>
                    India 🇮🇳
                  </p>
                </div>

                {/* Floating badge — bottom left */}
                <div
                  className="absolute bottom-6 left-0 px-3 py-2 rounded-lg"
                  style={{ background: "rgba(20,83,45,0.9)", border: "1px solid rgba(34,197,94,0.3)", transform: "translateX(-20%)" }}
                >
                  <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#22C55E" }}>
                    ✓ Lab Tested
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══ TRUST BAR ═══ */}
      <section
        className="py-5 border-y"
        style={{ background: "#0B0F0C", borderColor: "rgba(232,160,32,0.12)" }}
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12">
            {[
              { icon: <ShieldCheck className="w-4 h-4" />, label: "GMP Certified" },
              { icon: <FlaskConical className="w-4 h-4" />, label: "Third-Party Tested" },
              { icon: <Zap className="w-4 h-4" />, label: "No Artificial Fillers" },
              { icon: <Heart className="w-4 h-4" />, label: "100% Natural" },
            ].map((t) => (
              <div key={t.label} className="flex items-center gap-2">
                <span style={{ color: "#E8A020" }}>{t.icon}</span>
                <span
                  className="text-[11px] font-semibold uppercase tracking-widest"
                  style={{ color: "rgba(247,243,236,0.6)", fontFamily: "var(--font-jakarta)" }}
                >
                  {t.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CATEGORIES ═══ */}
      <section className="py-20" style={{ background: "#F7F3EC" }}>
        <div className="container mx-auto px-4 md:px-8">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-3">
              <span className="accent-bar" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: "#E8A020", fontFamily: "var(--font-jakarta)" }}>
                Shop by Goal
              </span>
            </div>
            <h2
              className="text-4xl md:text-5xl font-bold uppercase leading-none"
              style={{ fontFamily: "var(--font-rajdhani)", color: "#0B0F0C", letterSpacing: "0.02em" }}
            >
              Find Your Formula
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "Pre-Workout", desc: "Clean energy, razor focus", href: "/products?category=PRE_WORKOUT", icon: "⚡", color: "#E8A020" },
              { name: "Protein", desc: "Pure recovery fuel", href: "/products?category=PROTEIN", icon: "💪", color: "#22C55E" },
              { name: "Mass Gainer", desc: "Size without compromise", href: "/products?category=MASS_GAINER", icon: "📈", color: "#E8A020" },
              { name: "Omega-3", desc: "Heart & brain support", href: "/products?category=OMEGA_3", icon: "🧠", color: "#22C55E" },
            ].map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                className="group block card-premium rounded-xl p-6 text-center"
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-2xl mx-auto mb-4 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: `rgba(${cat.color === "#E8A020" ? "232,160,32" : "34,197,94"},0.1)` }}
                >
                  {cat.icon}
                </div>
                <h3
                  className="font-bold uppercase mb-1"
                  style={{ fontFamily: "var(--font-rajdhani)", fontSize: "15px", color: "#0B0F0C", letterSpacing: "0.05em" }}
                >
                  {cat.name}
                </h3>
                <p className="text-xs leading-relaxed" style={{ color: "#6B7B6F", fontFamily: "var(--font-jakarta)" }}>
                  {cat.desc}
                </p>
                <p
                  className="text-xs font-bold uppercase tracking-widest mt-3 transition-colors duration-200 group-hover:text-[#E8A020]"
                  style={{ color: "#14532D", fontFamily: "var(--font-jakarta)" }}
                >
                  Shop →
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ BESTSELLERS ═══ */}
      {products.length > 0 && (
        <section className="py-20" style={{ background: "#FFFFFF" }}>
          <div className="container mx-auto px-4 md:px-8">
            {/* Header */}
            <div className="flex items-end justify-between mb-12">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="accent-bar" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: "#E8A020", fontFamily: "var(--font-jakarta)" }}>
                    Most Popular
                  </span>
                </div>
                <h2
                  className="text-4xl md:text-5xl font-bold uppercase leading-none"
                  style={{ fontFamily: "var(--font-rajdhani)", color: "#0B0F0C", letterSpacing: "0.02em" }}
                >
                  Bestsellers
                </h2>
              </div>
              <Link
                href="/products"
                className="hidden md:flex items-center gap-2 text-sm font-bold uppercase tracking-widest transition-colors"
                style={{ color: "#14532D", fontFamily: "var(--font-jakarta)", fontSize: "11px" }}
              >
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
              {products.map((product, i) => {
                const hasDiscount = product.comparePrice && product.comparePrice > product.basePrice;
                const discountPercent = hasDiscount
                  ? Math.round(((product.comparePrice! - product.basePrice) / product.comparePrice!) * 100)
                  : 0;

                return (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    className="group card-premium rounded-xl overflow-hidden"
                    style={{ animationDelay: `${i * 0.08}s` }}
                  >
                    {/* Image */}
                    <div className="relative aspect-square img-zoom" style={{ background: "#F7F3EC" }}>
                      {product.images[0] ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span
                            className="text-5xl font-bold"
                            style={{ fontFamily: "var(--font-rajdhani)", color: "rgba(232,160,32,0.3)" }}
                          >
                            {product.name.slice(0, 2).toUpperCase()}
                          </span>
                        </div>
                      )}

                      {/* Badges */}
                      <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
                        {product.featured && (
                          <span className="badge-gold">Bestseller</span>
                        )}
                        {hasDiscount && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider" style={{ background: "#14532D", color: "#F7F3EC" }}>
                            -{discountPercent}%
                          </span>
                        )}
                      </div>

                      {/* Hover overlay */}
                      <div
                        className="absolute inset-0 flex items-end p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{ background: "linear-gradient(to top, rgba(11,15,12,0.7) 0%, transparent 55%)" }}
                      >
                        <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: "rgba(247,243,236,0.9)" }}>
                          View Product →
                        </span>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <p className="tag-category mb-1.5">{CATEGORY_LABELS[product.category] ?? product.category}</p>
                      <h3
                        className="font-bold uppercase leading-tight mb-2 line-clamp-2"
                        style={{ fontFamily: "var(--font-rajdhani)", fontSize: "16px", color: "#0B0F0C", letterSpacing: "0.02em" }}
                      >
                        {product.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <div className="flex items-baseline gap-2">
                          <span className="font-bold text-lg" style={{ fontFamily: "var(--font-rajdhani)", color: "#14532D" }}>
                            {formatCurrency(product.basePrice)}
                          </span>
                          {hasDiscount && (
                            <span className="text-xs line-through" style={{ color: "#A8B5AC" }}>
                              {formatCurrency(product.comparePrice!)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Mobile view all */}
            <div className="text-center mt-8 md:hidden">
              <Link href="/products" className="btn-green inline-flex items-center gap-2">
                View All Products <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ═══ BRAND STORY BANNER ═══ */}
      <section
        className="py-20 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0B0F0C 0%, #141A16 100%)" }}
      >
        <div className="absolute inset-0 stripe-gold pointer-events-none" />
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-[1px] w-16" style={{ background: "linear-gradient(90deg, transparent, #E8A020)" }} />
              <span style={{ color: "#E8A020" }}>◆</span>
              <div className="h-[1px] w-16" style={{ background: "linear-gradient(90deg, #E8A020, transparent)" }} />
            </div>

            <h2
              className="mb-6 uppercase leading-none"
              style={{ fontFamily: "var(--font-rajdhani)", fontSize: "clamp(36px,6vw,64px)", fontWeight: 700, color: "#F7F3EC", letterSpacing: "0.02em" }}
            >
              From the Heart of<br />
              <span style={{
                background: "linear-gradient(135deg, #E8A020, #F5C842)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                Maharashtra
              </span>
            </h2>
            <p
              className="text-base leading-relaxed mb-8"
              style={{ color: "rgba(247,243,236,0.6)", fontFamily: "var(--font-jakarta)" }}
            >
              Wellnza was born in Amravati with a single mission: give every Indian athlete access
              to world-class nutrition without compromising on quality, transparency, or price.
            </p>
            <Link href="/about" className="btn-gold inline-flex items-center gap-2">
              Our Story <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ NEWSLETTER ═══ */}
      <section className="py-16" style={{ background: "#F7F3EC", borderTop: "1px solid rgba(232,160,32,0.12)" }}>
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="accent-bar" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: "#E8A020", fontFamily: "var(--font-jakarta)" }}>
              Stay in the Loop
            </span>
            <span className="accent-bar" />
          </div>
          <h3
            className="mb-2 uppercase"
            style={{ fontFamily: "var(--font-rajdhani)", fontSize: "clamp(24px,4vw,36px)", fontWeight: 700, color: "#0B0F0C", letterSpacing: "0.02em" }}
          >
            Join the Wellnza Community
          </h3>
          <p className="text-sm mb-8" style={{ color: "#6B7B6F", fontFamily: "var(--font-jakarta)" }}>
            Get 10% off your first order and be first to know about new launches.
          </p>
          <div className="max-w-md mx-auto">
            <NewsletterForm />
          </div>
        </div>
      </section>

      {/* Floating WhatsApp */}
      <a
        href={getWhatsAppUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-transform hover:scale-110"
        style={{ background: "#25D366", boxShadow: "0 4px 20px rgba(37,211,102,0.35)" }}
        aria-label="WhatsApp"
      >
        <svg className="w-7 h-7" fill="white" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </div>
  );
}
