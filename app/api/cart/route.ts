import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const ValidateItemSchema = z.object({
  productVariantId: z.string().min(1),
  quantity: z.number().int().positive(),
});
const bodySchema = z.object({ items: z.array(ValidateItemSchema) });

interface ValidatedCartItem {
  id: string;
  productVariantId: string;
  name: string;
  flavor: string;
  size: string | null;
  price: number;
  quantity: number;
  maxAvailable: number;
  image: string | null;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    const items = parsed.data.items;

    // N+1 fix: single findMany instead of one findUnique per item
    const variantIds = items.map((i) => i.productVariantId);
    const variants = await db.productVariant.findMany({
      where: { id: { in: variantIds } },
      include: {
        product: { select: { name: true, images: true, isActive: true } },
        inventory: true,
      },
    });
    const variantMap = new Map(variants.map((v) => [v.id, v]));

    const validated: ValidatedCartItem[] = [];
    const invalid: string[] = [];

    for (const item of items) {
      const variant = variantMap.get(item.productVariantId);
      if (!variant || !variant.product.isActive) {
        invalid.push(item.productVariantId);
        continue;
      }

      const maxAvailable = variant.inventory.reduce(
        (sum, inv) => sum + inv.quantity,
        0
      );

      validated.push({
        id: item.productVariantId,
        productVariantId: item.productVariantId,
        name: variant.product.name,
        flavor: variant.flavor,
        size: variant.size,
        price: variant.price,
        quantity: Math.min(item.quantity, maxAvailable),
        maxAvailable,
        image: variant.product.images[0] ?? null,
      });
    }

    return NextResponse.json({ items: validated, invalid });
  } catch (error) {
    console.error("[cart API]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
