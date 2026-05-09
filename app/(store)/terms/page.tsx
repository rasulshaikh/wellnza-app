export default function TermsPage() {
  return (
    <div className="flex flex-1 flex-col" style={{ background: "#FAFAF8", minHeight: "100vh" }}>
      {/* Header */}
      <div
        className="border-b border-[#2E7D32]/15 px-4 py-12"
        style={{ background: "#FAFAF8" }}
      >
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-[2px] w-8" style={{ background: "#2E7D32" }} />
            <span
              className="text-[12px] tracking-[3px]"
              style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", color: "#2E7D32" }}
            >
              LEGAL
            </span>
          </div>
          <h1
            className="text-4xl font-bold"
            style={{ fontFamily: "var(--font-rajdhani,'Rajdhani',sans-serif)", color: "#1a1a1a", letterSpacing: "1px" }}
          >
            Terms & Conditions
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-12">
        <div className="mx-auto max-w-3xl">
          <div
            className="p-8 md:p-10 rounded-md"
            style={{
              background: "#fff",
              border: "1px solid rgba(46, 125, 50, 0.15)",
              boxShadow: "0 2px 8px rgba(46, 125, 50, 0.06)",
            }}
          >
            <div className="space-y-8">
              <section>
                <h2
                  className="font-semibold mb-2"
                  style={{ fontFamily: "var(--font-rajdhani,'Rajdhani',sans-serif)", color: "#1a1a1a", fontSize: "18px" }}
                >
                  1. Acceptance of Terms
                </h2>
                <p
                  className="text-[14px] leading-relaxed"
                  style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", color: "#7B9E6B" }}
                >
                  By accessing and using wellnzanutrition.com, you agree to be bound by these Terms & Conditions. If you do not agree to these terms, please do not use this website.
                </p>
              </section>
              <section>
                <h2
                  className="font-semibold mb-2"
                  style={{ fontFamily: "var(--font-rajdhani,'Rajdhani',sans-serif)", color: "#1a1a1a", fontSize: "18px" }}
                >
                  2. Products & Information
                </h2>
                <p
                  className="text-[14px] leading-relaxed"
                  style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", color: "#7B9E6B" }}
                >
                  All products displayed on this website are subject to availability. Product descriptions, images, and pricing are for informational purposes only and may change without prior notice. Wellnza Nutrition reserves the right to modify product information at any time.
                </p>
              </section>
              <section>
                <h2
                  className="font-semibold mb-2"
                  style={{ fontFamily: "var(--font-rajdhani,'Rajdhani',sans-serif)", color: "#1a1a1a", fontSize: "18px" }}
                >
                  3. Pricing & Payment
                </h2>
                <p
                  className="text-[14px] leading-relaxed"
                  style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", color: "#7B9E6B" }}
                >
                  All prices are in Indian Rupees (₹ INR) and include applicable taxes where applicable. Payments are processed securely through Razorpay. Wellnza Nutrition reserves the right to change prices without notice.
                </p>
              </section>
              <section>
                <h2
                  className="font-semibold mb-2"
                  style={{ fontFamily: "var(--font-rajdhani,'Rajdhani',sans-serif)", color: "#1a1a1a", fontSize: "18px" }}
                >
                  4. Shipping & Delivery
                </h2>
                <p
                  className="text-[14px] leading-relaxed"
                  style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", color: "#7B9E6B" }}
                >
                  Orders are typically processed within 2-3 business days. Delivery timelines across India vary by location and are provided by our shipping partners (Shiprocket). Free shipping is available on all orders above ₹999.
                </p>
              </section>
              <section>
                <h2
                  className="font-semibold mb-2"
                  style={{ fontFamily: "var(--font-rajdhani,'Rajdhani',sans-serif)", color: "#1a1a1a", fontSize: "18px" }}
                >
                  5. Returns & Refunds
                </h2>
                <p
                  className="text-[14px] leading-relaxed"
                  style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", color: "#7B9E6B" }}
                >
                  Returns are accepted within 7 days of delivery for unused products in original packaging. Opened or used products cannot be returned. Refunds are processed within 5-7 business days after product inspection. Contact us at hello@wellnza.com for return requests.
                </p>
              </section>
              <section>
                <h2
                  className="font-semibold mb-2"
                  style={{ fontFamily: "var(--font-rajdhani,'Rajdhani',sans-serif)", color: "#1a1a1a", fontSize: "18px" }}
                >
                  6. Disclaimer
                </h2>
                <p
                  className="text-[14px] leading-relaxed"
                  style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", color: "#7B9E6B" }}
                >
                  The information provided on wellnzanutrition.com is for general informational purposes only and is not intended as a substitute for professional medical advice. Consult a healthcare professional before using any supplement.
                </p>
              </section>
              <section>
                <h2
                  className="font-semibold mb-2"
                  style={{ fontFamily: "var(--font-rajdhani,'Rajdhani',sans-serif)", color: "#1a1a1a", fontSize: "18px" }}
                >
                  7. Contact
                </h2>
                <p
                  className="text-[14px] leading-relaxed"
                  style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", color: "#7B9E6B" }}
                >
                  For any queries regarding these terms, contact us at hello@wellnza.com or call +64 21 XXXXXX.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
