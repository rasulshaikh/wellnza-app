import { z } from "zod";

export const ProductFilterSchema = z.object({
  category: z.string().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  dietary: z.string().optional(),
  sort: z.enum(["featured", "price-asc", "price-desc", "newest"]).default("featured"),
  search: z.string().optional(),
});