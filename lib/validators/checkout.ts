// AUDIT TODO P0: India-specific validation - phone regex, PIN code, default country
// FIX: Replace with NZ validation - phone +64 format, NZ postal codes, country default "New Zealand"
// See: docs/audit/FULL-AUDIT-2026-05-06.md
import { z } from "zod";

export const AddressSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  // AUDIT TODO P0: Indian phone regex - NZ phones start with +64
  phone: z.string().regex(/^\+64[1-9]\d{7,9}$/, "Enter a valid NZ phone number (e.g., +64 21 123 4567)"),
  line1: z.string().min(5, "Address is required"),
  line2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "Region is required"),
  // AUDIT TODO P0: Indian PIN code regex - NZ has 4-digit postal codes
  pin: z.string().regex(/^\d{4}$/, "Enter a valid 4-digit NZ postal code"),
  // AUDIT TODO P0: Default country is India - should be New Zealand
  country: z.string().default("New Zealand"),
});

export const CheckoutSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  // AUDIT TODO P0: Indian phone regex
  phone: z.string().regex(/^\+64[1-9]\d{7,9}$/, "Enter a valid NZ phone number"),
  address: AddressSchema,
  shippingMethodId: z.string().min(1, "Select a shipping method"),
  paymentMethod: z.enum(["RAZORPAY", "STRIPE"]),
  saveAddress: z.boolean().default(false),
});