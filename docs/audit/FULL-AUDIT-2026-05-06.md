# WellNZ Full Audit — 2026-05-06

## Executive Summary
This is a comprehensive audit of the WellNZ e-commerce platform. The platform is built on Next.js 15 with Prisma, Razorpay, Twilio, and Resend. **The codebase contains extensive India-specific code that must be replaced with New Zealand equivalents before launch.**

---

## P0 Issues (Critical)

### 1. WRONG WHATSAPP NUMBER — Placeholder + Indian Number in Production
**Severity: P0**

Multiple pages still have Indian WhatsApp number `+91 8788396678` and placeholder `6421XXXXXX`:

| File | Line | Issue |
|------|------|-------|
| `app/(store)/page.tsx` | 731 | `wa.me/918788396678` — Indian number |
| `app/(store)/products/[slug]/page.tsx` | 224 | `wa.me/+6421XXXXXX` — PLACEHOLDER |
| `components/layout/Footer.tsx` | 36, 88 | `wa.me/6421XXXXXX` — PLACEHOLDER |
| `lib/email-templates/welcome.tsx` | 23 | `+91 8788396678` — Indian number |
| `lib/email-templates/order-cancelled.tsx` | 18 | `+91 8788396678` — Indian number |
| `app/api/cart-abandonment/notify/route.ts` | 47 | `whatsapp:+91${phone}` — hardcoded India prefix |

**Expected:** All WhatsApp links should use `getWhatsAppUrl()` from `lib/whatsapp.ts` which reads `NEXT_PUBLIC_WHATSAPP_NUMBER`.

**Fix:** Replace all hardcoded wa.me links with `getWhatsAppUrl()` and ensure `NEXT_PUBLIC_WHATSAPP_NUMBER` env var is set to a valid NZ number.

---

### 2. ALL PRICING IN INDIAN RUPEES (INR) — Must Be NZD
**Severity: P0**

Every price display, email template, and payment API uses INR:

| File | Line | Issue |
|------|------|-------|
| `lib/utils.ts` | 8 | `formatCurrency(amount: number, currency = "INR")` — WRONG DEFAULT |
| `app/api/checkout/create-order/route.ts` | 324-325 | Razorpay `amount: total, currency: "INR"` — WRONG CURRENCY |
| `app/(store)/checkout/page.tsx` | 232 | `currency: "INR"` — WRONG |
| `lib/email-templates/order-confirmed.tsx` | 27, 31 | `₹{item.price.toLocaleString()}` — WRONG SYMBOL |
| `lib/email-templates/cart-abandoned-1hr.tsx` | 27 | `₹{item.price.toLocaleString()}` — WRONG SYMBOL |
| `lib/email-templates/cart-abandonment.tsx` | 49 | `₹{total.toLocaleString()}` — WRONG SYMBOL |
| `store/cart-store.ts` | 10 | `price: number; // in rupees (INR)` — WRONG COMMENT |

**Impact:** Customers will see incorrect pricing. Razorpay will process payments in INR, not NZD.

**Fix:**
1. Change `lib/utils.ts` default to `"NZD"`
2. Change Razorpay `currency` to `"NZD"` and multiply amount by 100 (paise equivalent)
3. Replace all `₹` symbols with NZD formatting
4. Update `store/cart-store.ts` comment

---

### 3. RAZORPAY AMOUNT NOT CONVERTED TO PAISE
**Severity: P0**

`app/api/checkout/create-order/route.ts:324`:
```typescript
amount: total, // amount in rupees
```
Razorpay requires amount in paise (smallest currency unit). `total` is in rupees, so it must be multiplied by 100.

**Fix:** Change to `amount: Math.round(total * 100)`.

---

### 4. India-Specific Content Throughout Codebase
**Severity: P0**

| File | Line | Issue |
|------|------|-------|
| `lib/validators/checkout.ts` | 5, 11, 16 | Phone regex `/^[6-9]\d{9}$/` — Indian phone format |
| `lib/validators/checkout.ts` | 10 | PIN code regex `/^[1-9]\d{5}$/` — Indian postal code |
| `lib/validators/checkout.ts` | 11 | `country: z.string().default("India")` |
| `app/(store)/checkout/page.tsx` | 35-43 | `INDIAN_STATES` array — all Indian states |
| `prisma/schema.prisma` | 81 | `country String @default("India")` |
| `app/(store)/account/addresses/[id]/page.tsx` | 44, 65 | `country: "India"` |
| `app/(store)/account/addresses/new/page.tsx` | 26, 191 | `country: "India"`, placeholder `"India"` |
| `app/(store)/products/ProductsContent.tsx` | 392 | `"Shipped from India · Delivered to NZ"` |
| `app/(store)/ui-styling/page.tsx` | 235, 256 | Display of Indian phone `+91 8788396678` and "Indian Rupees" |

**Fix:** Replace Indian states with NZ regions, phone validation with NZ format, country default to "New Zealand".

---

## P1 Issues (Important)

### 5. HMAC Signature Verification Uses String Comparison
**Severity: P1**

`app/api/checkout/verify-payment/route.ts:90-95`:
```typescript
const expectedSignature = crypto
  .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
  .update(`${razorpayOrderId}|${razorpayPaymentId}`)
  .digest("hex");

if (expectedSignature !== razorpaySignature) {
```
String comparison of HMAC output is timing-safe in Node.js but `crypto.timingSafeEqual()` is the idiomatic approach for security-sensitive comparisons.

---

### 6. INCONSISTENT RATE LIMITING
**Severity: P1**

Only 3 of ~20 API routes implement rate limiting:
- `app/api/auth/register/route.ts` — has rate limiting
- `app/api/cart/abandon/route.ts` — has rate limiting
- `app/api/auth/[...nextauth]/route.ts` — has rate limiting

**Missing rate limiting:**
- `app/api/checkout/create-order/route.ts` — payment creation
- `app/api/checkout/verify-payment/route.ts` — payment verification
- `app/api/auth/forgot-password/route.ts` — password reset
- `app/api/auth/register/route.ts` — already has
- `app/api/newsletter/route.ts` — email subscription
- `app/api/cart/route.ts` — cart operations
- `app/api/products/route.ts` — product queries
- All admin routes
- `app/api/webhooks/razorpay/route.ts` — webhook (consider, may interfere with Razorpay)

**Fix:** Apply rate limiting to all public-facing API routes.

---

### 7. WhatsApp Cart Abandonment Uses India Prefix
**Severity: P1**

`app/api/cart-abandonment/notify/route.ts:47`:
```typescript
To: `whatsapp:+91${phone}`,
```
Phone numbers from checkout are validated as Indian format, then sent with India prefix to Twilio WhatsApp. This will fail for NZ phone numbers.

---

### 8. Razorpay Verify-Payment Fetches Actual Amount But May Mismatch Due to Currency
**Severity: P1**

`app/api/checkout/verify-payment/route.ts:74-81`:
```typescript
const amountPaid = paymentData.amount;
if (amountPaid !== order.total) {
```
Razorpay returns `amount` in paise (e.g., `199900` for ₹1,999), but `order.total` is stored in rupees. This comparison will always fail for non-zero amounts.

---

## P2 Issues (Minor)

### 9. Welcome Email Button Color Wrong (#0055FF vs #2E7D32)
**Severity: P2**

`lib/email-templates/welcome.tsx:18`:
```typescript
style={{ backgroundColor: "#0055FF", ... }}
```
Brand color is `#2E7D32` (green). Blue is used in welcome email.

---

### 10. Cart Abandonment Email Uses ₹ in Total but NZD for Items
**Severity: P2**

`lib/email-templates/cart-abandonment.tsx`:
- Line 42: Item prices use `Intl.NumberFormat('en-NZ', { currency: 'NZD' })`
- Line 49: Total uses `₹{total.toLocaleString()}`

Inconsistent currency display within the same email.

---

### 11. Auth Error Messages Expose Implementation Details in Logs
**Severity: P2**

`app/api/auth/register/route.ts:45`:
```typescript
console.error("[register] Registration failed");
```
Could log more context without exposing sensitive data.

---

### 12. Welcome Email Uses Hardcoded Copyright Year
**Severity: P2**

`lib/email-templates/welcome.tsx:27`:
```typescript
© 2026 wellnzanutrition.com
```
Should use dynamic year.

---

## Recommendations

### Immediate Actions (Before Launch)
1. Set `NEXT_PUBLIC_WHATSAPP_NUMBER` to valid NZ WhatsApp number
2. Change all currency from INR to NZD
3. Replace all Indian state/address defaults with NZ equivalents
4. Fix Razorpay amount calculation (multiply by 100)
5. Fix India phone prefix in WhatsApp cart abandonment

### Short-term
1. Apply rate limiting consistently across all public API routes
2. Replace hardcoded India WhatsApp numbers with `getWhatsAppUrl()` helper
3. Fix email template button colors to match brand `#2E7D32`
4. Fix currency inconsistency in cart abandonment email

### Code Quality
1. Consider moving `INDIAN_STATES` to a `lib/constants.ts` for easier replacement
2. Add `NZD` as explicit currency type in `lib/utils.ts`
3. Add validation for NZ phone numbers (prefix +64)
4. Consider `timingSafeEqual()` for HMAC comparisons

---

## Summary Statistics

| Category | Count |
|----------|-------|
| P0 Issues | 4 |
| P1 Issues | 4 |
| P2 Issues | 4 |
| **Total Issues** | **12** |

### Issue Breakdown by Category
- WhatsApp/Contact: 3 issues
- Currency/Payment: 3 issues
- India-specific content: 3 issues
- Security (rate limiting): 2 issues
- Email templates: 2 issues
