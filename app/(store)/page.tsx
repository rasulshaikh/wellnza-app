import Link from "next/link";
import { db } from "@/lib/db";
import { NewsletterForm } from "./_components/newsletter-form";

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

export default async function HomePage() {
  const products = await getFeaturedProducts();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-black text-white">
        <div className="absolute inset-0">
          <img
            src="https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=2800,fit=crop/PQIno7kFVWk52uM2/gemini_generated_image_a36coaa36coaa36c-GpqVKDujnWLGwkc7.png"
            alt="Hero"
            className="w-full h-full object-cover opacity-60"
          />
        </div>
        <div className="relative z-10 container mx-auto px-4 py-32 text-center">
          <h1 className="font-heading text-5xl md:text-7xl font-bold tracking-tight">
            Unleash Energy
          </h1>
          <p className="mt-4 text-xl md:text-2xl text-gray-200">
            Precision engineered for power, focus, and performance
          </p>
          <p className="mt-6 text-sm tracking-widest text-gray-400 uppercase">
            Feel the difference
          </p>
          <Link
            href="/products"
            className="mt-10 inline-block bg-white text-black px-8 py-4 font-semibold hover:bg-gray-100 transition"
          >
            View Products
          </Link>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h3 className="font-heading text-3xl font-bold text-center mb-12">Categories</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Pre-Workout",
                desc: "Fuel your sessions with precision energy.",
                href: "/products?category=PRE_WORKOUT",
                icon: "💪",
              },
              {
                name: "Proteins",
                desc: "Pure strength in every scoop.",
                href: "/products?category=PROTEIN",
                icon: "🏋️",
              },
              {
                name: "Mass Gainer",
                desc: "Build muscle with rich nutrition.",
                href: "/products?category=MASS_GAINER",
                icon: "⚡",
              },
            ].map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                className="group p-8 border border-gray-200 hover:border-primary transition text-center"
              >
                <div className="text-4xl mb-4">{cat.icon}</div>
                <h4 className="font-heading text-xl font-bold">{cat.name}</h4>
                <p className="mt-2 text-muted-foreground">{cat.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h3 className="font-heading text-3xl font-bold text-center mb-12">
            <Link href="/products" className="hover:text-primary transition">
              Featured Products
            </Link>
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((product) => {
              const badge = product.slug.includes("mass-gainer") ? "BEST SELLER"
                : product.slug.includes("pre-workout") ? "NEW"
                : product.slug.includes("isolate") ? "BEST SELLER"
                : product.slug.includes("omega") ? "BEST SELLER"
                : product.slug.includes("multivitamin") ? "NEW"
                : "BEST";
              return (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="group bg-white"
                >
                  <div className="relative">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full aspect-square object-cover"
                    />
                    <span className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 uppercase font-bold">
                      {badge}
                    </span>
                  </div>
                  <div className="p-4">
                    <h4 className="font-heading font-bold text-sm truncate">{product.name}</h4>
                    <p className="mt-1 font-semibold">₹{product.basePrice.toLocaleString()}</p>
                  </div>
                </Link>
              );
            })}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/products"
              className="text-primary font-semibold hover:underline"
            >
              Shop Pre-Workout → Elevate your performance with our curated selection...
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-black text-white">
        <div className="container mx-auto px-4 text-center">
          <h3 className="font-heading text-2xl font-bold">Join Our Elite Circle</h3>
          <p className="mt-2 text-gray-400">Your Email</p>
          <NewsletterForm />
          <p className="mt-2 text-sm text-gray-500">Get exclusive offers and insider updates</p>
        </div>
      </section>

      {/* Floating WhatsApp */}
      <a
        href="https://wa.me/918788396678"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition"
        aria-label="Open WhatsApp"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </div>
  );
}
