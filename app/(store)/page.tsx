import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";
import { NewsletterForm } from "./_components/newsletter-form";
import { HeroSlider } from "./_components/HeroSlider";

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
    return { text: "MASS", color: "#166534" };
  }
  if (slug.includes("pre-workout")) {
    return { text: "PRE", color: "#22C55E" };
  }
  if (slug.includes("isolate")) {
    return { text: "BEST SELLER", color: "#888888" };
  }
  if (slug.includes("omega")) {
    return { text: "BEST SELLER", color: "#888888" };
  }
  if (slug.includes("multivitamin")) {
    return { text: "NEW", color: "#166534" };
  }
  return { text: "BEST SELLER", color: "#888888" };
}

export default async function HomePage() {
  const products = await getFeaturedProducts();

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0D0D0D" }}>
      {/* Hero Slider */}
      <HeroSlider />

      {/* Categories Section - Athletic Dark Theme */}
      <section
        className="py-20"
        style={{
          background: "linear-gradient(180deg, #0D0D0D 0%, #1A1A1A 100%)",
          borderTop: "1px solid rgba(22, 101, 52, 0.2)",
        }}
      >
        <div className="container mx-auto px-4">
          <h3
            className="text-center mb-12"
            style={{
              fontFamily: "var(--font-bebas), Bebas Neue, sans-serif",
              fontSize: "clamp(32px, 5vw, 48px)",
              letterSpacing: "4px",
              textTransform: "uppercase",
              color: "#FFFFFF",
            }}
          >
            CHOOSE YOUR <span style={{ color: "#166534" }}>WEAPONS</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "PRE-WORKOUT",
                desc: "FUEL UP. CRUSH IT. REPEAT. Pre-workout formulas engineered for explosive energy, razor-sharp focus.",
                href: "/products?category=PRE_WORKOUT",
                icon: (
                  <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="#166534" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
                  </svg>
                ),
              },
              {
                name: "PROTEINS",
                desc: "PURE PROTEIN. MAXIMUM RECOVERY. Fast-absorbing whey built for athletes who train hard.",
                href: "/products?category=PROTEIN",
                icon: (
                  <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="#166534" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.87c1.355 0 2.697.055 4.024.165C17.155 8.51 18 9.473 18 10.608v2.513m-3-4.87v-1.5m-6 1.5v-1.5m12 9.75l-1.5.75a3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0L3 16.5m15-3.379a48.474 48.474 0 00-6-.371c-2.032 0-4.034.126-6 .371m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.169c0 .621-.504 1.125-1.125 1.125H4.125A1.125 1.125 0 013 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 016 13.12M12.265 3.11a.375.375 0 11-.53 0L12 2.845l.265.265zm-3 0a.375.375 0 11-.53 0L9 2.845l.265.265zm6 0a.375.375 0 11-.53 0L15 2.845l.265.265z" />
                  </svg>
                ),
              },
              {
                name: "MASS GAINER",
                desc: "LOAD UP. BULK UP. BREAK THROUGH. High-calorie mass gainers designed for serious size.",
                href: "/products?category=MASS_GAINER",
                icon: (
                  <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="#166534" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                  </svg>
                ),
              },
            ].map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                className="group p-8 transition-all duration-300"
                style={{
                  background: "linear-gradient(135deg, #1A1A1A 0%, rgba(26,26,26,0.6) 100%)",
                  border: "1px solid rgba(22, 101, 52, 0.2)",
                  clipPath: "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))",
                  textDecoration: "none",
                }}
              >
                <div className="relative flex flex-col items-center text-center">
                  <div className="mb-6 p-4" style={{ background: "rgba(22, 101, 52, 0.1)", borderRadius: "0" }}>
                    {cat.icon}
                  </div>
                  <h4
                    style={{
                      fontFamily: "var(--font-bebas), Bebas Neue, sans-serif",
                      fontSize: "24px",
                      letterSpacing: "3px",
                      color: "#FFFFFF",
                      marginBottom: "12px",
                    }}
                  >
                    {cat.name}
                  </h4>
                  <p
                    style={{
                      fontFamily: "var(--font-oswald), Oswald, sans-serif",
                      fontSize: "14px",
                      letterSpacing: "1px",
                      color: "#888888",
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

      {/* Featured Products - Athletic Grid */}
      <section
        className="py-20"
        style={{
          background: "#0D0D0D",
          borderTop: "1px solid rgba(22, 101, 52, 0.1)",
        }}
      >
        <div className="container mx-auto px-4">
          <p
            className="text-center mb-4"
            style={{
              fontFamily: "var(--font-oswald), Oswald, sans-serif",
              fontSize: "12px",
              letterSpacing: "4px",
              color: "#166534",
              textTransform: "uppercase",
            }}
          >
            BESTSELLERS
          </p>
          <h3
            className="text-center mb-12"
            style={{
              fontFamily: "var(--font-bebas), Bebas Neue, sans-serif",
              fontSize: "clamp(32px, 5vw, 48px)",
              letterSpacing: "4px",
              textTransform: "uppercase",
              color: "#FFFFFF",
            }}
          >
            <Link
              href="/products"
              style={{
                color: "#FFFFFF",
                textDecoration: "none",
                transition: "color 0.3s ease",
              }}
            >
              DOMINATE YOUR GOALS
            </Link>
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((product) => {
              const badge = getProductBadge(product.slug);
              return (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="group"
                  style={{
                    background: "linear-gradient(135deg, #1A1A1A 0%, rgba(26,26,26,0.8) 100%)",
                    border: "1px solid rgba(22, 101, 52, 0.2)",
                    clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))",
                    textDecoration: "none",
                    transition: "all 0.3s ease",
                  }}
                >
                  <div className="relative p-6">
                    <div className="relative w-full aspect-square">
                      {/* Angular Frame */}
                      <div
                        className="absolute -inset-2"
                        style={{
                          background: "rgba(22, 101, 52, 0.1)",
                          clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
                        }}
                      />
                      <div
                        className="relative w-full h-full flex items-center justify-center"
                        style={{
                          background: "#0D0D0D",
                          clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
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
                          <div
                            className="w-full h-full flex items-center justify-center"
                            style={{
                              fontFamily: "var(--font-bebas), Bebas Neue, sans-serif",
                              fontSize: "24px",
                              color: "#166534",
                            }}
                          >
                            {product.name
                              .split(" ")
                              .map((w: string) => w[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase()}
                          </div>
                        )}
                      </div>
                    </div>
                    {/* Badge */}
                    <span
                      style={{
                        position: "absolute",
                        top: "12px",
                        right: "12px",
                        background: badge.color,
                        color: badge.color === "#888888" ? "#0D0D0D" : "#0D0D0D",
                        fontSize: "10px",
                        padding: "4px 12px",
                        fontFamily: "var(--font-bebas), Bebas Neue, sans-serif",
                        letterSpacing: "2px",
                        textTransform: "uppercase",
                      }}
                    >
                      {badge.text}
                    </span>
                  </div>
                  <div className="px-6 pb-6">
                    <h4
                      style={{
                        fontFamily: "var(--font-bebas), Bebas Neue, sans-serif",
                        fontSize: "18px",
                        letterSpacing: "2px",
                        color: "#FFFFFF",
                        marginBottom: "4px",
                        textTransform: "uppercase",
                      }}
                    >
                      {product.name}
                    </h4>
                    <p
                      style={{
                        fontFamily: "var(--font-oswald), Oswald, sans-serif",
                        fontSize: "12px",
                        letterSpacing: "2px",
                        color: "#888888",
                        textTransform: "uppercase",
                        marginBottom: "16px",
                      }}
                    >
                      {product.category}
                    </p>
                    <div className="flex items-center justify-between">
                      <p
                        style={{
                          fontFamily: "var(--font-bebas), Bebas Neue, sans-serif",
                          fontSize: "20px",
                          color: "#22C55E",
                          letterSpacing: "1px",
                        }}
                      >
                        {formatCurrency(product.basePrice)}
                      </p>
                      <button
                        className="add-to-cart-btn"
                        style={{
                          background: "#166534",
                          color: "#0D0D0D",
                          padding: "8px 16px",
                          fontSize: "12px",
                          fontFamily: "var(--font-bebas), Bebas Neue, sans-serif",
                          letterSpacing: "2px",
                          textTransform: "uppercase",
                          border: "none",
                          cursor: "pointer",
                          clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)",
                          transition: "all 0.3s ease",
                        }}
                      >
                        ADD
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
                fontFamily: "var(--font-bebas), Bebas Neue, sans-serif",
                fontSize: "16px",
                letterSpacing: "3px",
                textTransform: "uppercase",
                color: "#166534",
                textDecoration: "none",
                transition: "color 0.3s ease",
              }}
            >
              VIEW ALL PRODUCTS
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter - Athletic Dark */}
      <section
        className="py-16"
        style={{
          background: "linear-gradient(180deg, #1A1A1A 0%, #0D0D0D 100%)",
          borderTop: "1px solid rgba(22, 101, 52, 0.2)",
        }}
      >
        <div className="container mx-auto px-4 text-center">
          <h3
            style={{
              fontFamily: "var(--font-bebas), Bebas Neue, sans-serif",
              fontSize: "clamp(28px, 4vw, 40px)",
              letterSpacing: "4px",
              textTransform: "uppercase",
              color: "#FFFFFF",
              marginBottom: "8px",
            }}
          >
            LOCK IN WITH <span style={{ color: "#166534" }}>WELLNZA</span>
          </h3>
          <p
            style={{
              fontFamily: "var(--font-oswald), Oswald, sans-serif",
              fontSize: "14px",
              letterSpacing: "2px",
              color: "#888888",
              textTransform: "uppercase",
              marginBottom: "24px",
            }}
          >
            Get exclusive drops, athlete-only deals, and first access to new products.
            JUST GAINS.
          </p>
          <div className="mt-6 max-w-md mx-auto">
            <NewsletterForm />
          </div>
        </div>
      </section>

      {/* Floating WhatsApp */}
      <a
        href="https://wa.me/918788396678"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 transition-all duration-300 hover:scale-110"
        style={{
          background: "#166534",
          color: "#FFFFFF",
          padding: "16px",
          clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
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
