export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF7] py-16">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="font-heading text-4xl font-bold text-[#1C1C1C] mb-8">Privacy Policy</h1>
        <div className="bg-white border border-[#E5E5E0] p-8 space-y-6 text-sm text-[#6B6B6B]">
          <section>
            <h2 className="font-semibold text-[#1C1C1C] text-base mb-2">1. Information We Collect</h2>
            <p>We collect personal information such as name, email, phone number, shipping address, and payment details when you place an order or create an account. We also collect usage data through cookies to improve your browsing experience.</p>
          </section>
          <section>
            <h2 className="font-semibold text-[#1C1C1C] text-base mb-2">2. How We Use Your Information</h2>
            <p>Your information is used to process orders, provide customer support, send order updates, and improve our services. We may also use your email to send newsletters and promotional offers if you have subscribed. You can unsubscribe at any time.</p>
          </section>
          <section>
            <h2 className="font-semibold text-[#1C1C1C] text-base mb-2">3. Data Protection</h2>
            <p>We implement appropriate security measures to protect your personal data. Payment information is processed through Razorpay, which is PCI-DSS compliant. We do not store your credit card details on our servers.</p>
          </section>
          <section>
            <h2 className="font-semibold text-[#1C1C1C] text-base mb-2">4. Third-Party Services</h2>
            <p>We may share your data with trusted third parties such as shipping partners for order delivery and Razorpay for payment processing. These parties are obligated to protect your data and use it only for the services requested.</p>
          </section>
          <section>
            <h2 className="font-semibold text-[#1C1C1C] text-base mb-2">5. Cookies</h2>
            <p>Our website uses cookies to enhance user experience, analyze site traffic, and personalize content. You can disable cookies in your browser settings, but this may affect some website functionality.</p>
          </section>
          <section>
            <h2 className="font-semibold text-[#1C1C1C] text-base mb-2">6. Your Rights</h2>
            <p>You have the right to access, correct, or delete your personal data. Contact us at info@wellnzanutrition.com for any data-related requests. You can also unsubscribe from marketing emails at any time.</p>
          </section>
          <section>
            <h2 className="font-semibold text-[#1C1C1C] text-base mb-2">7. Contact</h2>
            <p>For privacy-related concerns, contact us at info@wellnzanutrition.com or call +91 8788396678.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
