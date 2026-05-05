import { db } from "../lib/db";

const prisma = db;

import { Prisma } from "@prisma/client";

const products: Prisma.ProductCreateInput[] = [
  {
    slug: "ultra-bulk-mass-gainer",
    name: "ULTRA BULK Mass Gainer",
    description: "Fuel your muscle growth with Ultra Bulk Mass Gainer by Wellnza Nutrition. Designed for rapid mass gain, it delivers an optimal blend of protein, carbs, and calories in a delicious Alphonso Mango flavor. Perfect for athletes and bodybuilders who want to maximize bulk and strength. Comes in a 60-serving container—support your progress with every scoop!",
    category: "MASS_GAINER" as const,
    basePrice: 1999,
    comparePrice: 2499,
    featured: true,
    isActive: true,
    images: ["https://cdn.zyrosite.com/cdn-cgi/image/format=auto,w=768,h=960,fit=crop,q=100/cdn-ecommerce/store_01KJVXS44M9NNG532TH40JSYHE/assets/b1f35a43-b7f2-433a-bca7-46ee6a701d39.png"],
    variants: {
      create: [
        { flavor: "Alphonso Mango", size: "60 servings", price: 1999, comparePrice: 2499, sku: "UBMG-AM", weightG: 2000 },
        { flavor: "Chocolate Charge", size: "60 servings", price: 1999, comparePrice: 2499, sku: "UBMG-CC", weightG: 2000 },
      ]
    }
  },
  {
    slug: "ultrahype-pre-workout",
    name: "ULTRAHYPE Pre-Workout",
    description: "Experience explosive energy and razor-sharp focus with ULTRAHYPE Pre-Workout. Engineered for athletes who demand more from their training. No crash formula, just pure performance.",
    category: "PRE_WORKOUT" as const,
    basePrice: 1299,
    comparePrice: 1599,
    featured: true,
    isActive: true,
    images: ["https://cdn.zyrosite.com/cdn-cgi/image/format=auto,w=768,h=960,fit=crop,q=100/cdn-ecommerce/store_01KJVXS44M9NNG532TH40JSYHE/assets/2643346f-3234-479c-9a98-353043b45e2c.png"],
    variants: {
      create: [
        { flavor: "Fruit Punch", size: "30 servings", price: 1299, comparePrice: 1599, sku: "UHP-FP", weightG: 900 },
        { flavor: "Blue Raspberry", size: "30 servings", price: 1299, comparePrice: 1599, sku: "UHP-BR", weightG: 900 },
      ]
    }
  },
  {
    slug: "whey-protein-isolate",
    name: "ULTRA CORE Whey Isolate",
    description: "Pure, fast-absorbing whey protein isolate for maximum muscle recovery. 25g protein per serving with zero sugar.",
    category: "PROTEIN" as const,
    basePrice: 3499,
    comparePrice: 4199,
    featured: true,
    isActive: true,
    images: ["https://cdn.zyrosite.com/cdn-cgi/image/format=auto,w=768,h=960,fit=crop,q=100/cdn-ecommerce/store_01KJVXS44M9NNG532TH40JSYHE/assets/d1ad28f5-ec9b-4d62-ba5c-91be9ef209d1.png"],
    variants: {
      create: [
        { flavor: "Vanilla Ice Cream", size: "2 lb", price: 3499, comparePrice: 4199, sku: "UCWI-VI", weightG: 907 },
        { flavor: "Chocolate", size: "2 lb", price: 3499, comparePrice: 4199, sku: "UCWI-CH", weightG: 907 },
      ]
    }
  },
  {
    slug: "ultraflex-whey-protein-supplement",
    name: "ULTRA FLEX Whey Protein",
    description: "Premium whey protein blend for lean muscle building and recovery.",
    category: "PROTEIN" as const,
    basePrice: 2199,
    comparePrice: 2699,
    featured: true,
    isActive: true,
    images: ["https://cdn.zyrosite.com/cdn-cgi/image/format=auto,w=768,h=960,fit=crop,q=100/cdn-ecommerce/store_01KJVXS44M9NNG532TH40JSYHE/assets/49186a64-8a51-474b-a0b6-d50e2f3dfb46.png"],
    variants: {
      create: [
        { flavor: "Chocolate", size: "2 lb", price: 2199, comparePrice: 2699, sku: "UFWP-CH", weightG: 907 },
        { flavor: "Peanut Butter", size: "2 lb", price: 2199, comparePrice: 2699, sku: "UFWP-PB", weightG: 907 },
      ]
    }
  },
  {
    slug: "whey-protein",
    name: "ULTRA FLEX Whey Protein",
    description: "Advanced formula whey protein for serious athletes seeking peak performance.",
    category: "PROTEIN" as const,
    basePrice: 4399,
    comparePrice: 5299,
    featured: false,
    isActive: true,
    images: ["https://cdn.zyrosite.com/cdn-cgi/image/format=auto,w=768,h=960,fit=crop,q=100/cdn-ecommerce/store_01KJVXS44M9NNG532TH40JSYHE/assets/49186a64-8a51-474b-a0b6-d50e2f3dfb46.png"],
    variants: {
      create: [
        { flavor: "Chocolate Hazelnut", size: "4 lb", price: 4399, comparePrice: 5299, sku: "UFWP-CH4", weightG: 1814 },
      ]
    }
  },
  {
    slug: "omega-3-supplement",
    name: "ULTRA SEA Omega-3",
    description: "Pure fish oil omega-3 capsules for heart, brain, and joint health.",
    category: "OMEGA_3" as const,
    basePrice: 899,
    comparePrice: 1199,
    featured: true,
    isActive: true,
    images: ["https://cdn.zyrosite.com/cdn-cgi/image/format=auto,w=768,h=960,fit=crop,q=100/cdn-ecommerce/store_01KJVXS44M9NNG532TH40JSYHE/assets/5dc9d684-7389-4a41-ae7e-81890be3e86e.png"],
    variants: {
      create: [
        { flavor: "Unflavored", size: "90 capsules", price: 899, comparePrice: 1199, sku: "USO3-UF", weightG: 150 },
      ]
    }
  },
  {
    slug: "multivitamins",
    name: "ULTRA LIFE Multivitamins",
    description: "Complete daily multivitamin for men and women covering all essential nutrients.",
    category: "MULTIVITAMIN" as const,
    basePrice: 699,
    comparePrice: 999,
    featured: true,
    isActive: true,
    images: ["https://cdn.zyrosite.com/cdn-cgi/image/format=auto,w=768,h=960,fit=crop,q=100/cdn-ecommerce/store_01KJVXS44M9NNG532TH40JSYHE/assets/73d50708-e4e5-4161-b90e-ad621bf97a52.png"],
    variants: {
      create: [
        { flavor: "Unflavored", size: "60 tablets", price: 699, comparePrice: 999, sku: "ULM-UF", weightG: 100 },
      ]
    }
  },
];

async function main() {
  console.log("Start seeding...");
  await prisma.product.deleteMany();
  for (const product of products) {
    await prisma.product.create({ data: product });
  }
  console.log(`Seeded ${products.length} products`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
