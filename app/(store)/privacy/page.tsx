export default function PrivacyPage() {
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
            Privacy Policy
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
                  className="font-semibold text-base mb-2"
                  style={{ fontFamily: "var(--font-rajdhani,'Rajdhani',sans-serif)", color: "#1a1a1a", fontSize: "18px" }}
                >
                  1. Information We Collect
                </h2>
                <p
                  className="text-[14px] leading-relaxed"
                  style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", color: "#7B9E6B" }}
                >
                  We collect personal information such as name, email, phone number, shipping address, and payment details when you place an order or create an account. We also collect usage data through cookies to improve your browsing experience.
                </p>
              </section>
              <section>
                <h2
                  className="font-semibold text-base mb-2"
                  style={{ fontFamily: "var(--font-rajdhani,'Rajdhani',sans-serif)", color: "#1a1a1a", fontSize: "18px" }}
                >
                  2. How We Use Your Information
                </h2>
                <p
                  className="text-[14px] leading-relaxed"
                  style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", color: "#7B9E6B" }}
                >
                  Your information is used to process orders, provide customer support, send order updates, and improve our services. We may also use your email to send newsletters and promotional offers if you have subscribed. You can unsubscribe at any time.
                </p>
              </section>
              <section>
                <h2
                  className="font-semibold text-base mb-2"
                  style={{ fontFamily: "var(--font-rajdhani,'Rajdhani',sans-serif)", color: "#1a1a1a", fontSize: "18px" }}
                >
                  3. Data Protection
                </h2>
                <p
                  className="text-[14px] leading-relaxed"
                  style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", color: "#7B9E6B" }}
                >
                  We implement appropriate security measures to protect your personal data. Payment information is processed through Razorpay, which is PCI-DSS compliant. We do not store your credit card details on our servers.
                </p>
              </section>
              <section>
                <h2
                  className="font-semibold text-base mb-2"
                  style={{ fontFamily: "var(--font-rajdhani,'Rajdhani',sans-serif)", color: "#1a1a1a", fontSize: "18px" }}
                >
                  4. Third-Party Services
                </h2>
                <p
                  className="text-[14px] leading-relaxed"
                  style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", color: "#7B9E6B" }}
                >
                  We may share your data with trusted third parties such as shipping partners for order delivery and Razorpay for payment processing. These parties are obligated to protect your data and use it only for the services requested.
                </p>
              </section>
              <section>
                <h2
                  className="font-semibold text-base mb-2"
                  style={{ fontFamily: "var(--font-rajdhani,'Rajdhani',sans-serif)", color: "#1a1a1a", fontSize: "18px" }}
                >
                  5. Cookies
                </h2>
                <p
                  className="text-[14px] leading-relaxed"
                  style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", color: "#7B9E6B" }}
                >
                  Our website uses cookies to enhance user experience, analyze site traffic, and personalize content. You can disable cookies in your browser settings, but this may affect some website functionality.
                </p>
              </section>
              <section>
                <h2
                  className="font-semibold text-base mb-2"
                  style={{ fontFamily: "var(--font-rajdhani,'Rajdhani',sans-serif)", color: "#1a1a1a", fontSize: "18px" }}
                >
                  6. Your Rights
                </h2>
                <p
                  className="text-[14px] leading-relaxed"
                  style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", color: "#7B9E6B" }}
                >
                  You have the right to access, correct, or delete your personal data. Contact us at hello@wellnza.com for any data-related requests. You can also unsubscribe from marketing emails at any time.
                </p>
              </section>
              <section>
                <h2
                  className="font-semibold text-base mb-2"
                  style={{ fontFamily: "var(--font-rajdhani,'Rajdhani',sans-serif)", color: "#1a1a1a", fontSize: "18px" }}
                >
                  7. Contact
                </h2>
                <p
                  className="text-[14px] leading-relaxed"
                  style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", color: "#7B9E6B" }}
                >
                  For privacy-related concerns, contact us at hello@wellnza.com or call +64 21 XXXXXX.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
