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
    images: [
      "/products/gainer-3kg--alphanso-mango-front.png",
      "/products/gainer-3kg-chocolate-front.png",
      "/products/gainer-3kg--alphanso-mango-right.png",
      "/products/gainer-3kg--alphanso-mango.png-left.png",
      "/products/gainer-3kg-chocolate.png-right.png",
      "/products/gainer-3kg-chocolate-left.png",
    ],
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
    images: [
      "/products/PreWorkout-Tangy-orange-front.png",
      "/products/PreWorkout-Blueberry-front.png",
      "/products/PreWorkout-Tangy-orange-left.png",
      "/products/PreWorkout-Tangy-orange-right.png",
      "/products/PreWorkout-Blueberry-left.png",
      "/products/PreWorkout-Blueberry--right.png",
    ],
    variants: {
      create: [
        { flavor: "Tangy Orange", size: "30 servings", price: 1299, comparePrice: 1599, sku: "UHP-TO", weightG: 900 },
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
    images: [
      "/products/isolate-protein-chocolate-1kg-front.png",
      "/products/isolate-protein-pistacho-almond-1kg-front.png",
      "/products/isolate-protein-chocolate-1kg-right.png",
      "/products/isolate-protein-chocolate-1k-left.png",
      "/products/isolate-protein-pistacho-almond-1kg-right.png",
      "/products/isolate-protein-pistacho-almond-1kg-left.png",
    ],
    variants: {
      create: [
        { flavor: "Chocolate", size: "1 kg", price: 3499, comparePrice: 4199, sku: "UCWI-CH", weightG: 1000 },
        { flavor: "Pistachio Almond", size: "1 kg", price: 3499, comparePrice: 4199, sku: "UCWI-PA", weightG: 1000 },
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
    images: [
      "/products/whey-protein-chocolate-2kg-front.png",
      "/products/whey-protein-kesar-pista-1kg-front.png",
      "/products/whey-protein-chocolate-2kg-left.png",
      "/products/whey-protein-chocolate-2kg-right.png",
      "/products/whey-protein-kesar-pista-1kg-left.png",
      "/products/whey-protein-kesar-pista-1kg-right.png",
    ],
    variants: {
      create: [
        { flavor: "Chocolate", size: "2 lb", price: 2199, comparePrice: 2699, sku: "UFWP-CH", weightG: 907 },
        { flavor: "Kesar Pista", size: "1 kg", price: 2199, comparePrice: 2699, sku: "UFWP-KP", weightG: 1000 },
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
    images: [
      "/products/omega-3.png",
      "/products/omega-3-left.png",
      "/products/omega-3-right.png",
    ],
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
    images: [
      "/products/Multivitamin.png",
      "/products/Multivitamin-left.png",
      "/products/Multivitamin.png-right.png",
    ],
    variants: {
      create: [
        { flavor: "Unflavored", size: "60 tablets", price: 699, comparePrice: 999, sku: "ULM-UF", weightG: 100 },
      ]
    }
  },
];

async function main() {
  console.log("Start seeding...");
  await prisma.inventory.deleteMany();
  await prisma.product.deleteMany();

  // Create default location for inventory
  const location = await prisma.location.create({
    data: { name: "Main Warehouse", address: "Amravati, Maharashtra, India", isActive: true }
  });

  for (const product of products) {
    const created = await prisma.product.create({ data: product });
    // Create inventory for each variant
    const variants = await prisma.productVariant.findMany({ where: { productId: created.id } });
    for (const variant of variants) {
      await prisma.inventory.create({
        data: { productVariantId: variant.id, locationId: location.id, quantity: 100, lowStockThreshold: 10 }
      });
    }
    console.log(`  ✓ ${created.name} (${variants.length} variants)`);
  }
  console.log(`Seeded ${products.length} products with inventory`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());