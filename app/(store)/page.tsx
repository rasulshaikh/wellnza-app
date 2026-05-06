import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";
import { NewsletterForm } from "./_components/newsletter-form";
import { Navbar } from "@/components/layout/Navbar";

export const dynamic = "force-dynamic";

async function getFeaturedProducts() {
  return db.product.findMany({
    where: { isActive: true, featured: true },
    take: 6,
    select: {
      id: true, name: true, slug: true, basePrice: true, comparePrice: true,
      images: true, category: true, featured: true,
    },
  });
}

function getProductBadge(slug: string): { text: string; color: string } {
  if (slug.includes("mass-gainer")) {
    return { text: "MASS GAINER", color: "#7B9E6B" };
  }
  if (slug.includes("pre-workout")) {
    return { text: "PRE-WORKOUT", color: "#2E7D32" };
  }
  if (slug.includes("isolate")) {
    return { text: "ISOLATE", color: "#C9A227" };
  }
  if (slug.includes("omega")) {
    return { text: "OMEGA-3", color: "#C9A227" };
  }
  if (slug.includes("multivitamin")) {
    return { text: "NEW", color: "#2E7D32" };
  }
  return { text: "BESTSELLER", color: "#2E7D32" };
}

export default async function HomePage() {
  const products = await getFeaturedProducts();

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FAFAF8" }}>
      {/* Sticky White Navbar */}
      <Navbar />

      {/* Split Hero Section */}
      <section
        className="relative overflow-hidden"
        style={{ backgroundColor: "#FAFAF8" }}
      >
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Headline & CTA */}
            <div className="text-center md:text-left">
              <p
                className="mb-4"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "14px",
                  letterSpacing: "2px",
                  color: "#7B9E6B",
                  textTransform: "uppercase",
                }}
              >
                Premium Nutrition
              </p>
              <h1
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(36px, 5vw, 56px)",
                  fontWeight: "600",
                  color: "#2E7D32",
                  lineHeight: 1.2,
                  marginBottom: "24px",
                }}
              >
                Wellness, Rooted in Nature
              </h1>
              <p
                className="mb-8"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "18px",
                  color: "#6B7280",
                  lineHeight: 1.7,
                  maxWidth: "480px",
                }}
              >
                Clean, transparent supplements crafted from whole-food ingredients.
                No artificial fillers. Just nature working for you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link
                  href="/products"
                  style={{
                    display: "inline-block",
                    padding: "14px 32px",
                    backgroundColor: "#2E7D32",
                    color: "#FFFFFF",
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: "600",
                    fontSize: "14px",
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                    textDecoration: "none",
                    borderRadius: "4px",
                    transition: "all 0.3s ease",
                  }}
                >
                  Shop Collection
                </Link>
                <Link
                  href="/about"
                  style={{
                    display: "inline-block",
                    padding: "14px 32px",
                    backgroundColor: "transparent",
                    color: "#2E7D32",
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: "600",
                    fontSize: "14px",
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                    textDecoration: "none",
                    borderRadius: "4px",
                    border: "1px solid #2E7D32",
                    transition: "all 0.3s ease",
                  }}
                >
                  Our Story
                </Link>
              </div>
            </div>

            {/* Right: Botanical Image */}
            <div className="relative">
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "1",
                  maxWidth: "500px",
                  margin: "0 auto",
                  borderRadius: "8px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(135deg, #7B9E6B 0%, #2E7D32 100%)",
                    opacity: 0.1,
                    borderRadius: "8px",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: "20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {/* Decorative botanical leaves */}
                  <svg
                    viewBox="0 0 200 200"
                    style={{ width: "80%", height: "80%", opacity: 0.3 }}
                    fill="none"
                  >
                    <path
                      d="M100 20C100 20 140 60 140 100C140 140 100 180 100 180C100 180 60 140 60 100C60 60 100 20 100 20Z"
                      stroke="#2E7D32"
                      strokeWidth="2"
                    />
                    <path
                      d="M100 40C100 40 130 70 130 100C130 130 100 160 100 160"
                      stroke="#7B9E6B"
                      strokeWidth="1.5"
                    />
                    <circle cx="100" cy="100" r="8" fill="#2E7D32" opacity="0.3" />
                  </svg>
                </div>
                <div
                  style={{
                    position: "absolute",
                    bottom: "-10px",
                    right: "-10px",
                    width: "120px",
                    height: "120px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #C9A227 0%, #7B9E6B 100%)",
                    opacity: 0.15,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section
        className="py-8"
        style={{
          backgroundColor: "#FFFFFF",
          borderTop: "1px solid rgba(46, 125, 50, 0.1)",
          borderBottom: "1px solid rgba(46, 125, 50, 0.1)",
        }}
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            {[
              { icon: "GMP", label: "GMP Certified" },
              { icon: "100%", label: "Natural Ingredients" },
              { icon: "0", label: "Artificial Fillers" },
              { icon: "Lab", label: "Third-Party Tested" },
            ].map((trust) => (
              <div
                key={trust.icon}
                className="flex items-center gap-3"
              >
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    backgroundColor: "#2E7D32",
                    color: "#FFFFFF",
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "12px",
                    fontWeight: "600",
                  }}
                >
                  {trust.icon}
                </span>
                <span
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "14px",
                    color: "#6B7280",
                  }}
                >
                  {trust.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20" style={{ backgroundColor: "#FAFAF8" }}>
        <div className="container mx-auto px-4">
          <h2
            className="text-center mb-4"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(28px, 4vw, 40px)",
              fontWeight: "600",
              color: "#2E7D32",
            }}
          >
            Shop by Category
          </h2>
          <p
            className="text-center mb-12"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "16px",
              color: "#6B7280",
            }}
          >
            Clean formulas for every wellness goal
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                name: "PRE-WORKOUT",
                desc: "Clean energy from natural sources. Focus without the crash.",
                href: "/products?category=PRE_WORKOUT",
                icon: (
                  <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="#2E7D32" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                  </svg>
                ),
              },
              {
                name: "PROTEINS",
                desc: "Pure protein for recovery. Clean ingredients, complete transparency.",
                href: "/products?category=PROTEIN",
                icon: (
                  <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="#2E7D32" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.87c1.355 0 2.697.055 4.024.165C17.155 8.51 18 9.473 18 10.608v2.513m-3-4.87v-1.5m-6 1.5v-1.5m12 9.75l-1.5.75a3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0L3 16.5m15-3.379a48.474 48.474 0 00-6-.371c-2.032 0-4.034.126-6 .371m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.169c0 .621-.504 1.125-1.125 1.125H4.125A1.125 1.125 0 013 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 016 13.12M12.265 3.11a.375.375 0 11-.53 0L12 2.845l.265.265zm-3 0a.375.375 0 11-.53 0L9 2.845l.265.265zm6 0a.375.375 0 11-.53 0L15 2.845l.265.265z" />
                  </svg>
                ),
              },
              {
                name: "MASS GAINER",
                desc: "Clean calories from whole foods. Size without compromise.",
                href: "/products?category=MASS_GAINER",
                icon: (
                  <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="#2E7D32" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                  </svg>
                ),
              },
              {
                name: "OMEGA-3",
                desc: "Essential fatty acids from fish oil. Heart and brain health.",
                href: "/products?category=OMEGA_3",
                icon: (
                  <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="#2E7D32" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                ),
              },
            ].map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                className="group"
                style={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid rgba(46, 125, 50, 0.15)",
                  borderRadius: "4px",
                  padding: "32px 24px",
                  textDecoration: "none",
                  transition: "all 0.3s ease",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                }}
              >
                <div className="flex flex-col items-center text-center">
                  <div
                    className="mb-5 p-4"
                    style={{
                      backgroundColor: "rgba(46, 125, 50, 0.08)",
                      borderRadius: "50%",
                    }}
                  >
                    {cat.icon}
                  </div>
                  <h3
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "18px",
                      fontWeight: "600",
                      color: "#2E7D32",
                      marginBottom: "8px",
                    }}
                  >
                    {cat.name}
                  </h3>
                  <p
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "14px",
                      color: "#6B7280",
                      lineHeight: 1.6,
                    }}
                  >
                    {cat.desc}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Bestsellers Section */}
      <section
        className="py-20"
        style={{
          backgroundColor: "#FFFFFF",
        }}
      >
        <div className="container mx-auto px-4">
          <h2
            className="text-center mb-4"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(28px, 4vw, 40px)",
              fontWeight: "600",
              color: "#2E7D32",
            }}
          >
            Our Bestsellers
          </h2>
          <p
            className="text-center mb-12"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "16px",
              color: "#6B7280",
            }}
          >
            Trusted by thousands for clean, effective nutrition
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((product) => {
              const badge = getProductBadge(product.slug);
              return (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="group"
                  style={{
                    backgroundColor: "#FFFFFF",
                    border: "1px solid rgba(46, 125, 50, 0.12)",
                    borderRadius: "4px",
                    textDecoration: "none",
                    transition: "all 0.3s ease",
                    overflow: "hidden",
                  }}
                >
                  <div className="relative p-6">
                    <div className="relative w-full aspect-square">
                      <div
                        className="absolute inset-0 flex items-center justify-center"
                        style={{
                          backgroundColor: "#FAFAF8",
                          borderRadius: "4px",
                        }}
                      >
                        {product.images[0] ? (
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-contain"
                            sizes="(max-width: 768px) 50vw, 33vw"
                          />
                        ) : (
                          <span
                            style={{
                              fontFamily: "'Playfair Display', serif",
                              fontSize: "24px",
                              color: "#7B9E6B",
                            }}
                          >
                            {product.name
                              .split(" ")
                              .map((w: string) => w[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase()}
                          </span>
                        )}
                      </div>
                    </div>
                    {/* Badge */}
                    <span
                      style={{
                        position: "absolute",
                        top: "12px",
                        left: "12px",
                        backgroundColor: badge.color,
                        color: "#FFFFFF",
                        fontSize: "10px",
                        padding: "4px 10px",
                        fontFamily: "'DM Sans', sans-serif",
                        fontWeight: "600",
                        letterSpacing: "1px",
                        textTransform: "uppercase",
                        borderRadius: "2px",
                      }}
                    >
                      {badge.text}
                    </span>
                  </div>
                  <div className="px-6 pb-6">
                    <h3
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: "16px",
                        fontWeight: "600",
                        color: "#2E7D32",
                        marginBottom: "4px",
                      }}
                    >
                      {product.name}
                    </h3>
                    <p
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "12px",
                        letterSpacing: "1px",
                        color: "#6B7280",
                        textTransform: "uppercase",
                        marginBottom: "16px",
                      }}
                    >
                      {product.category}
                    </p>
                    <div className="flex items-center justify-between">
                      <p
                        style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: "18px",
                          fontWeight: "600",
                          color: "#2E7D32",
                        }}
                      >
                        {formatCurrency(product.basePrice)}
                      </p>
                      <button
                        className="add-to-cart-btn"
                        style={{
                          backgroundColor: "#2E7D32",
                          color: "#FFFFFF",
                          padding: "8px 16px",
                          fontSize: "12px",
                          fontFamily: "'DM Sans', sans-serif",
                          fontWeight: "600",
                          letterSpacing: "1px",
                          textTransform: "uppercase",
                          border: "none",
                          cursor: "pointer",
                          borderRadius: "4px",
                          transition: "all 0.3s ease",
                        }}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
          <div className="text-center mt-12">
            <Link
              href="/products"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "14px",
                fontWeight: "600",
                letterSpacing: "2px",
                textTransform: "uppercase",
                color: "#2E7D32",
                textDecoration: "none",
                transition: "color 0.3s ease",
              }}
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Ingredient Transparency Section */}
      <section
        className="py-20"
        style={{
          backgroundColor: "#FAFAF8",
        }}
      >
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(28px, 4vw, 40px)",
                  fontWeight: "600",
                  color: "#2E7D32",
                  marginBottom: "16px",
                }}
              >
                Full Transparency, Always
              </h2>
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "16px",
                  color: "#6B7280",
                  lineHeight: 1.7,
                  marginBottom: "32px",
                }}
              >
                We believe you deserve to know exactly what you are putting in your body.
                Every ingredient is listed with its purpose and source.
              </p>
              <div className="space-y-4">
                {[
                  { label: "No Artificial Colors", desc: "Naturally sourced pigments only" },
                  { label: "No Preservatives", desc: "Fresh from nature to you" },
                  { label: "No Hidden Fillers", desc: "Every capsule counts" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-start gap-4"
                  >
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "24px",
                        height: "24px",
                        borderRadius: "50%",
                        backgroundColor: "#2E7D32",
                        color: "#FFFFFF",
                        fontSize: "12px",
                        flexShrink: 0,
                        marginTop: "2px",
                      }}
                    >
                      ✓
                    </span>
                    <div>
                      <p
                        style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: "15px",
                          fontWeight: "600",
                          color: "#2E7D32",
                        }}
                      >
                        {item.label}
                      </p>
                      <p
                        style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: "14px",
                          color: "#6B7280",
                        }}
                      >
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div
              className="flex items-center justify-center"
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "8px",
                padding: "48px",
                border: "1px solid rgba(46, 125, 50, 0.1)",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "24px",
                  textAlign: "center",
                }}
              >
                {[
                  { value: "100%", label: "Natural" },
                  { value: "0g", label: "Added Sugar" },
                  { value: "0", label: "Artificial Ingredients" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: "32px",
                        fontWeight: "600",
                        color: "#C9A227",
                      }}
                    >
                      {stat.value}
                    </p>
                    <p
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "12px",
                        color: "#6B7280",
                        textTransform: "uppercase",
                        letterSpacing: "1px",
                      }}
                    >
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section
        className="py-16"
        style={{
          backgroundColor: "#FFFFFF",
          borderTop: "1px solid rgba(46, 125, 50, 0.1)",
        }}
      >
        <div className="container mx-auto px-4 text-center">
          <h3
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(24px, 3vw, 32px)",
              fontWeight: "600",
              color: "#2E7D32",
              marginBottom: "8px",
            }}
          >
            Join the Wellnza Community
          </h3>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "14px",
              color: "#6B7280",
              marginBottom: "24px",
            }}
          >
            Get 10% off your first order and be the first to know about new products.
          </p>
          <div className="mt-6 max-w-md mx-auto">
            <NewsletterForm />
          </div>
        </div>
      </section>

      {/* Floating WhatsApp */}
      <a
        href={getWhatsAppUrl("Hi!%20I%27d%20like%20to%20know%20more%20about%20your%20products.")}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 transition-all duration-300 hover:scale-110"
        style={{
          backgroundColor: "#2E7D32",
          color: "#FFFFFF",
          padding: "16px",
          borderRadius: "50%",
          boxShadow: "0 4px 12px rgba(46, 125, 50, 0.3)",
        }}
        aria-label="Open WhatsApp"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </div>
  );
}
