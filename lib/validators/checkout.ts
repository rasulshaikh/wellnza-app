import { z } from "zod";

export const AddressSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  // Indian mobile numbers: 10 digits starting with 6-9, optionally prefixed with +91
  phone: z.string().regex(/^(\+91)?[6-9]\d{9}$/, "Enter a valid Indian mobile number (e.g., 9876543210)"),
  line1: z.string().min(5, "Address is required"),
  line2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  // Indian PIN codes: 6 digits
  pin: z.string().regex(/^\d{6}$/, "Enter a valid 6-digit PIN code"),
  country: z.string().default("India"),
});

export const CheckoutSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  phone: z.string().regex(/^(\+91)?[6-9]\d{9}$/, "Enter a valid Indian mobile number"),
  address: AddressSchema,
  shippingMethodId: z.string().min(1, "Select a shipping method"),
  paymentMethod: z.enum(["RAZORPAY", "STRIPE"]),
  saveAddress: z.boolean().default(false),
});
