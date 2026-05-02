import { z } from "zod";

export const AddToCartSchema = z.object({
  productVariantId: z.string().min(1, "Product variant is required"),
  quantity: z.number().int().min(1).max(10).default(1),
});

export const UpdateCartItemSchema = z.object({
  itemId: z.string().min(1),
  quantity: z.number().int().min(0).max(10),
});