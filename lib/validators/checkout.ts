import { z } from "zod";

export const AddressSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian phone number"),
  line1: z.string().min(5, "Address is required"),
  line2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pin: z.string().regex(/^[1-9]\d{5}$/, "Enter a valid 6-digit PIN code"),
  country: z.string().default("India"),
});

export const CheckoutSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian phone number"),
  address: AddressSchema,
  shippingMethodId: z.string().min(1, "Select a shipping method"),
  paymentMethod: z.enum(["RAZORPAY", "STRIPE"]),
  saveAddress: z.boolean().default(false),
});