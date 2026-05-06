// AUDIT TODO P0: Line 8 defaults to INR instead of NZD
// FIX: Change default to "NZD" - this is an NZ store, all pricing must be in New Zealand Dollars
// See: docs/audit/FULL-AUDIT-2026-05-06.md
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// AUDIT TODO P0: currency defaults to INR - MUST CHANGE to "NZD"
export function formatCurrency(amount: number, currency = "NZD"): string {
  // amount is stored and transmitted as NZD (not paise)
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date))
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `WNZ-${timestamp}-${random}`
}
