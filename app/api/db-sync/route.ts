import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ProductCategory } from "@prisma/client";

interface ProductVariantSeed {
  flavor: string;
  size: string;
  price: number;
  sku: string;
}

interface ProductSeed {
  slug: string;
  name: string;
  category: ProductCategory;
  basePrice: number;
  comparePrice: number;
  featured: boolean;
  isActive: boolean;
  description: string;
  image: string;
  variants: ProductVariantSeed[];
}

const PRODUCTS_SEED: ProductSeed[] = [
  { slug: "ultra-bulk-mass-gainer", name: "ULTRA BULK Mass Gainer", category: "MASS_GAINER", basePrice: 1999, comparePrice: 2499, featured: true, isActive: true, description: "Fuel your muscle growth with Ultra Bulk Mass Gainer by Wellnza Nutrition. Designed for rapid mass gain, it delivers an optimal blend of protein, carbs, and calories in a delicious Alphonso Mango flavor.", image: "https://cdn.zyrosite.com/cdn-cgi/image/format=auto,w=768,h=960,fit=crop,q=100/cdn-ecommerce/store_01KJVXS44M9NNG532TH40JSYHE/assets/b1f35a43-b7f2-433a-bca7-46ee6a701d39.png", variants: [{ flavor: "Alphonso Mango", size: "60 servings", price: 1999, sku: "UBMG-AM" }, { flavor: "Chocolate Charge", size: "60 servings", price: 1999, sku: "UBMG-CC" }] },
  { slug: "ultrahype-pre-workout", name: "ULTRAHYPE Pre-Workout", category: "PRE_WORKOUT", basePrice: 1299, comparePrice: 1599, featured: true, isActive: true, description: "Experience explosive energy and razor-sharp focus with ULTRAHYPE Pre-Workout.", image: "https://cdn.zyrosite.com/cdn-cgi/image/format=auto,w=768,h=960,fit=crop,q=100/cdn-ecommerce/store_01KJVXS44M9NNG532TH40JSYHE/assets/2643346f-3234-479c-9a98-353043b45e2c.png", variants: [{ flavor: "Fruit Punch", size: "30 servings", price: 1299, sku: "UHP-FP" }, { flavor: "Blue Raspberry", size: "30 servings", price: 1299, sku: "UHP-BR" }] },
  { slug: "whey-protein-isolate", name: "ULTRA CORE Whey Isolate", category: "PROTEIN", basePrice: 3499, comparePrice: 4199, featured: true, isActive: true, description: "Pure, fast-absorbing whey protein isolate for maximum muscle recovery.", image: "https://cdn.zyrosite.com/cdn-cgi/image/format=auto,w=768,h=960,fit=crop,q=100/cdn-ecommerce/store_01KJVXS44M9NNG532TH40JSYHE/assets/d1ad28f5-ec9b-4d62-ba5c-91be9ef209d1.png", variants: [{ flavor: "Vanilla Ice Cream", size: "2 lb", price: 3499, sku: "UCWI-VI" }, { flavor: "Chocolate", size: "2 lb", price: 3499, sku: "UCWI-CH" }] },
  { slug: "ultraflex-whey-protein-supplement", name: "ULTRA FLEX Whey Protein", category: "PROTEIN", basePrice: 2199, comparePrice: 2699, featured: true, isActive: true, description: "Premium whey protein blend for lean muscle building and recovery.", image: "https://cdn.zyrosite.com/cdn-cgi/image/format=auto,w=768,h=960,fit=crop,q=100/cdn-ecommerce/store_01KJVXS44M9NNG532TH40JSYHE/assets/1b9a2c29-ce25-4c88-bb70-b0f8ccf93c42b.png", variants: [{ flavor: "Chocolate", size: "2 lb", price: 2199, sku: "UFWP-CH" }, { flavor: "Peanut Butter", size: "2 lb", price: 2199, sku: "UFWP-PB" }] },
  { slug: "whey-protein", name: "Wellnza Whey Protein", category: "PROTEIN", basePrice: 4399, comparePrice: 5299, featured: false, isActive: true, description: "Advanced formula whey protein for serious athletes seeking peak performance.", image: "https://cdn.zyrosite.com/cdn-cgi/image/format=auto,w=768,h=960,fit=crop,q=100/cdn-ecommerce/store_01KJVXS44M9NNG532TH40JSYHE/assets/49186a64-8a51-474b-a0b6-d50e2f3dfb46.png", variants: [{ flavor: "Chocolate Hazelnut", size: "4 lb", price: 4399, sku: "UFWP-CH4" }] },
  { slug: "omega-3-supplement", name: "ULTRA SEA Omega-3", category: "OMEGA_3", basePrice: 899, comparePrice: 1199, featured: true, isActive: true, description: "Pure fish oil omega-3 capsules for heart, brain, and joint health.", image: "https://cdn.zyrosite.com/cdn-cgi/image/format=auto,w=768,h=960,fit=crop,q=100/cdn-ecommerce/store_01KJVXS44M9NNG532TH40JSYHE/assets/5dc9d684-7389-4a41-ae7e-81890be3e86e.png", variants: [{ flavor: "Unflavored", size: "90 capsules", price: 899, sku: "USO3-UF" }] },
  { slug: "multivitamins", name: "ULTRA LIFE Multivitamins", category: "MULTIVITAMIN", basePrice: 699, comparePrice: 999, featured: true, isActive: true, description: "Complete daily multivitamin for men and women covering all essential nutrients.", image: "https://cdn.zyrosite.com/cdn-cgi/image/format=auto,w=768,h=960,fit=crop,q=100/cdn-ecommerce/store_01KJVXS44M9NNG532TH40JSYHE/assets/73d50708-e4e5-4161-b90e-ad621bf97a52.png", variants: [{ flavor: "Unflavored", size: "60 tablets", price: 699, sku: "ULM-UF" }] },
];

const SYNC_SECRET = process.env.DB_SYNC_SECRET;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get("secret");
  const fix = searchParams.get("fix") === "true";

  if (!SYNC_SECRET || secret !== SYNC_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const reset = searchParams.get("reset");

  if (reset === "products") {
    await db.product.deleteMany();
    const created = [];
    for (const p of PRODUCTS_SEED) {
      const { variants, image, ...productData } = p;
      const createdProduct = await db.product.create({
        data: {
          ...productData,
          category: p.category,
          images: [image],
          variants: { create: variants }
        }
      });
      created.push(createdProduct.slug);
    }
    return NextResponse.json({ reset: "products", count: created.length, products: created });
  }

  if (fix) {
    const results: string[] = [];

    // Add emailSent column using $executeRawUnsafe
    try {
      await db.$executeRawUnsafe('ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "emailSent" BOOLEAN DEFAULT false');
      results.push("emailSent: OK");
    } catch (e: any) {
      const msg = String(e);
      if (msg.includes("already exists") || msg.includes("does not exist") || msg.includes("column")) {
        results.push("emailSent: exists/skipped");
      } else {
        results.push(`emailSent: ${msg.substring(0, 120)}`);
      }
    }

    // Create CartAbandonment table
    try {
      await db.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "CartAbandonment" (
          "id" TEXT NOT NULL,
          "userId" TEXT,
          "email" TEXT,
          "phone" TEXT,
          "cartData" JSONB,
          "lastActiveAt" TIMESTAMP(3),
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT now(),
          "updatedAt" TIMESTAMP(3) NOT NULL,
          "reminderSent" BOOLEAN DEFAULT false,
          "recoveryLink" TEXT,
          PRIMARY KEY ("id")
        )
      `);
      results.push("CartAbandonment: OK");
    } catch (e: any) {
      const msg = String(e);
      if (msg.includes("already exists")) {
        results.push("CartAbandonment: exists");
      } else {
        results.push(`CartAbandonment: ${msg.substring(0, 150)}`);
      }
    }

    return NextResponse.json({ fixResults: results });
  }

  // Diagnostic mode
  try {
    const results: Record<string, string> = {};

    try {
      results.userCount = String(await db.user.count());
    } catch (e) {
      results.userError = String(e).substring(0, 200);
    }

    try {
      results.productCount = String(await db.product.count());
    } catch (e) {
      results.productError = String(e).substring(0, 200);
    }

    try {
      results.cartAbandonmentCount = String(await db.cartAbandonment.count());
    } catch (e) {
      results.cartAbandonmentError = String(e).substring(0, 200);
    }

    try {
      await db.user.findMany({ take: 1, select: { id: true, email: true, emailSent: true } });
      results.userEmailSent = "OK";
    } catch (e) {
      results.userEmailSentError = String(e).substring(0, 200);
    }

    return NextResponse.json({ diagnostic: results });
  } catch (error) {
    return NextResponse.json({
      error: "Diagnostic failed",
      detail: String(error).substring(0, 500)
    }, { status: 500 });
  }
}