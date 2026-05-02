import { db } from "../lib/db";
import { ProductCategory } from "@prisma/client";

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
  console.log("Seeding database...");

  // Clean existing data
  await db.inventory.deleteMany();
  await db.productVariant.deleteMany();
  await db.location.deleteMany();
  await db.product.deleteMany();

  // 1. Create Location
  const location = await db.location.create({
    data: {
      name: "Main Warehouse",
      address: "Mumbai, Maharashtra",
      isActive: true,
    },
  });
  console.log(`Created location: ${location.name}`);

  // 2. Products and Variants
  type ProductData = {
    name: string;
    description: string;
    category: ProductCategory;
    basePrice: number;
    comparePrice?: number;
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    featured?: boolean;
    variants: { flavor: string; price: number; comparePrice?: number }[];
  };

  const products: ProductData[] = [
    // PRE_WORKOUT (4 products)
    {
      name: "Hypernox Pre-Workout",
      description: "Explosive energy, focus, and endurance. Contains 200mg caffeine per serving.",
      category: "PRE_WORKOUT",
      basePrice: 149900,
      comparePrice: 179900,
      calories: 10,
      protein: 0,
      carbs: 2,
      fat: 0,
      featured: true,
      variants: [
        { flavor: "Blue Raspberry", price: 149900, comparePrice: 179900 },
        { flavor: "Fruit Punch", price: 149900, comparePrice: 179900 },
        { flavor: "Green Apple", price: 149900, comparePrice: 179900 },
      ],
    },
    {
      name: "C4 Original",
      description: "America's #1 selling pre-workout. Carnitine, betaine, caffeine.",
      category: "PRE_WORKOUT",
      basePrice: 229900,
      comparePrice: 269900,
      calories: 5,
      protein: 0,
      carbs: 1,
      fat: 0,
      variants: [
        { flavor: "Blue Raspberry", price: 229900, comparePrice: 269900 },
        { flavor: "Fruit Punch", price: 229900, comparePrice: 269900 },
        { flavor: "Green Apple", price: 229900, comparePrice: 269900 },
      ],
    },
    {
      name: "Gorilla Mode Nitro",
      description: "Maximum pumps and intensity. 350mg caffeine.",
      category: "PRE_WORKOUT",
      basePrice: 289900,
      calories: 15,
      protein: 0,
      carbs: 3,
      fat: 0,
      variants: [
        { flavor: "Blue Raspberry", price: 289900 },
        { flavor: "Fruit Punch", price: 289900 },
        { flavor: "Green Apple", price: 289900 },
      ],
    },
    {
      name: "Jym Stack Science",
      description: "6-matrix delivery system for energy, focus, pump.",
      category: "PRE_WORKOUT",
      basePrice: 199900,
      comparePrice: 229900,
      calories: 20,
      protein: 1,
      carbs: 4,
      fat: 0,
      variants: [
        { flavor: "Blue Raspberry", price: 199900, comparePrice: 229900 },
        { flavor: "Fruit Punch", price: 199900, comparePrice: 229900 },
        { flavor: "Green Apple", price: 199900, comparePrice: 229900 },
      ],
    },
    // PROTEIN (5 products)
    {
      name: "Optimum Nutrition Gold Standard Whey",
      description: "100% Whey Protein Isolate. 24g protein per serving.",
      category: "PROTEIN",
      basePrice: 249900,
      comparePrice: 299900,
      calories: 120,
      protein: 24,
      carbs: 3,
      fat: 1,
      featured: true,
      variants: [
        { flavor: "Chocolate", price: 249900, comparePrice: 299900 },
        { flavor: "Vanilla", price: 249900, comparePrice: 299900 },
        { flavor: "Cookies & Cream", price: 259900, comparePrice: 309900 },
      ],
    },
    {
      name: "Dymatize ISO100",
      description: "100% hydrolyzed whey isolate. Fast absorbing.",
      category: "PROTEIN",
      basePrice: 279900,
      comparePrice: 329900,
      calories: 100,
      protein: 25,
      carbs: 2,
      fat: 0,
      variants: [
        { flavor: "Chocolate", price: 279900, comparePrice: 329900 },
        { flavor: "Vanilla", price: 279900, comparePrice: 329900 },
        { flavor: "Cookies & Cream", price: 279900, comparePrice: 329900 },
      ],
    },
    {
      name: "Myprotein Impact Whey",
      description: "Best value protein. 21g protein per serving.",
      category: "PROTEIN",
      basePrice: 129900,
      calories: 103,
      protein: 21,
      carbs: 4,
      fat: 1,
      variants: [
        { flavor: "Chocolate", price: 129900 },
        { flavor: "Vanilla", price: 129900 },
        { flavor: "Cookies & Cream", price: 129900 },
      ],
    },
    {
      name: "MuscleTech Phase8",
      description: "8-hour sustained release protein matrix.",
      category: "PROTEIN",
      basePrice: 219900,
      calories: 110,
      protein: 24,
      carbs: 5,
      fat: 2,
      variants: [
        { flavor: "Chocolate", price: 219900 },
        { flavor: "Vanilla", price: 219900 },
        { flavor: "Cookies & Cream", price: 219900 },
      ],
    },
    {
      name: "BSN Syntha-6",
      description: "6-protein blend. Great taste, smooth texture.",
      category: "PROTEIN",
      basePrice: 189900,
      comparePrice: 219900,
      calories: 130,
      protein: 22,
      carbs: 6,
      fat: 3,
      variants: [
        { flavor: "Chocolate", price: 189900, comparePrice: 219900 },
        { flavor: "Vanilla", price: 189900, comparePrice: 219900 },
        { flavor: "Cookies & Cream", price: 199900, comparePrice: 229900 },
      ],
    },
    // MASS_GAINER (3 products)
    {
      name: "Optimum Nutrition Serious Mass",
      description: "1,250 calories per serving. 50g protein.",
      category: "MASS_GAINER",
      basePrice: 349900,
      comparePrice: 399900,
      calories: 1250,
      protein: 50,
      carbs: 252,
      fat: 9,
      variants: [
        { flavor: "Chocolate", price: 349900, comparePrice: 399900 },
        { flavor: "Vanilla", price: 349900, comparePrice: 399900 },
        { flavor: "Strawberry", price: 349900, comparePrice: 399900 },
      ],
    },
    {
      name: "Dymatize Super Mass Gainer",
      description: "1,280 calories. 52g protein. Triple chocolate.",
      category: "MASS_GAINER",
      basePrice: 329900,
      calories: 1280,
      protein: 52,
      carbs: 245,
      fat: 12,
      variants: [
        { flavor: "Chocolate", price: 329900 },
        { flavor: "Vanilla", price: 329900 },
        { flavor: "Strawberry", price: 329900 },
      ],
    },
    {
      name: "MuscleTech Mass Tech",
      description: "1,000 calories with 60g protein matrix.",
      category: "MASS_GAINER",
      basePrice: 289900,
      calories: 1000,
      protein: 60,
      carbs: 190,
      fat: 8,
      variants: [
        { flavor: "Chocolate", price: 289900 },
        { flavor: "Vanilla", price: 289900 },
        { flavor: "Strawberry", price: 289900 },
      ],
    },
    // OMEGA_3 (4 products)
    {
      name: "MusclePharm Fish Oil",
      description: "3000mg fish oil. 900mg EPA + 600mg DHA.",
      category: "OMEGA_3",
      basePrice: 89900,
      calories: 20,
      protein: 0,
      carbs: 0,
      fat: 2,
      featured: true,
      variants: [{ flavor: "Unflavored", price: 89900 }],
    },
    {
      name: "Optimum Nutrition Fish Oil",
      description: "180 softgels. 360mg EPA + 240mg DHA.",
      category: "OMEGA_3",
      basePrice: 119900,
      calories: 18,
      protein: 0,
      carbs: 0,
      fat: 2,
      variants: [{ flavor: "Unflavored", price: 119900 }],
    },
    {
      name: "NOW Foods Omega-3",
      description: "1000mg fish oil. High potency.",
      category: "OMEGA_3",
      basePrice: 69900,
      calories: 10,
      protein: 0,
      carbs: 0,
      fat: 1,
      variants: [{ flavor: "Unflavored", price: 69900 }],
    },
    {
      name: "Dead Sea Omega-3",
      description: "Premium omega-3 from Dead Sea minerals.",
      category: "OMEGA_3",
      basePrice: 149900,
      comparePrice: 179900,
      calories: 15,
      protein: 0,
      carbs: 0,
      fat: 2,
      variants: [{ flavor: "Unflavored", price: 149900, comparePrice: 179900 }],
    },
    // MULTIVITAMIN (4 products)
    {
      name: "Optimum Nutrition Opti-Men",
      description: "75+ ingredients. Complete sports multivitamin.",
      category: "MULTIVITAMIN",
      basePrice: 189900,
      calories: 15,
      protein: 1,
      carbs: 2,
      fat: 0,
      variants: [{ flavor: "Unflavored", price: 189900 }],
    },
    {
      name: "Garden of Life RAW Men's",
      description: "75+ ingredients. Food-based multivitamin.",
      category: "MULTIVITAMIN",
      basePrice: 229900,
      calories: 20,
      protein: 0,
      carbs: 4,
      fat: 0,
      variants: [{ flavor: "Unflavored", price: 229900 }],
    },
    {
      name: "Animal Pak",
      description: "The original comprehensive multivitamin. 11 tablets.",
      category: "MULTIVITAMIN",
      basePrice: 249900,
      comparePrice: 289900,
      calories: 30,
      protein: 2,
      carbs: 5,
      fat: 0,
      featured: true,
      variants: [{ flavor: "Unflavored", price: 249900, comparePrice: 289900 }],
    },
    {
      name: "Centrum Men",
      description: "Daily multivitamin for men. Complete nutrition.",
      category: "MULTIVITAMIN",
      basePrice: 99900,
      calories: 5,
      protein: 0,
      carbs: 1,
      fat: 0,
      variants: [{ flavor: "Unflavored", price: 99900 }],
    },
  ];

  let productCount = 0;
  let variantCount = 0;

  for (const productData of products) {
    const { variants, ...productFields } = productData;

    const product = await db.product.create({
      data: {
        name: productFields.name,
        slug: slugify(productFields.name),
        description: productFields.description,
        category: productFields.category,
        basePrice: productFields.basePrice,
        comparePrice: productFields.comparePrice,
        images: [],
        isActive: true,
        featured: productFields.featured ?? false,
        calories: productFields.calories,
        protein: productFields.protein,
        carbs: productFields.carbs,
        fat: productFields.fat,
      },
    });
    productCount++;

    for (const variant of variants) {
      const sku = `${slugify(productFields.name)}-${slugify(variant.flavor)}`.slice(0, 50);

      const productVariant = await db.productVariant.create({
        data: {
          productId: product.id,
          flavor: variant.flavor,
          price: variant.price,
          comparePrice: variant.comparePrice,
          sku,
          weightG: productFields.category === "OMEGA_3" || productFields.category === "MULTIVITAMIN" ? 90 : 1000,
        },
      });
      variantCount++;

      // Create inventory for each variant at Main Warehouse
      await db.inventory.create({
        data: {
          productVariantId: productVariant.id,
          locationId: location.id,
          quantity: randInt(50, 200),
          lowStockThreshold: 10,
        },
      });
    }

    console.log(`Created product: ${productFields.name} (${variants.length} variants)`);
  }

  console.log(`\nSeeding complete!`);
  console.log(`- 1 location`);
  console.log(`- ${productCount} products`);
  console.log(`- ${variantCount} variants`);
  console.log(`- ${variantCount} inventory records`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });