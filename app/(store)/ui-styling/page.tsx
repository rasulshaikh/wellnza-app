export const metadata = {
  title: "UI & Styling Guide",
  description: "Wellnza Nutrition design system — colors, typography, components, and interaction patterns.",
};

const colors = [
  { name: "Primary Blue", var: "--primary", hex: "#0055FF", use: "Buttons, links, active states" },
  { name: "Primary Hover", var: "--primary-hover", hex: "#0044CC", use: "Hover states" },
  { name: "Accent Cyan", var: "--accent", hex: "#00C2FF", use: "Accents, highlights" },
  { name: "Background", var: "--background", hex: "#FAFAFA", use: "Page background" },
  { name: "Surface", var: "--surface", hex: "#FFFFFF", use: "Cards, modals" },
  { name: "Dark", var: "--dark", hex: "#0A0A0A", use: "Hero sections, footer" },
  { name: "Text Primary", var: "--text-primary", hex: "#0A0A0A", use: "Headings, body text" },
  { name: "Text Secondary", var: "--text-secondary", hex: "#6B7280", use: "Muted text, captions" },
  { name: "Success Green", var: "--success", hex: "#10B981", use: "Success states, savings" },
  { name: "Warning Amber", var: "--warning", hex: "#F59E0B", use: "Warnings, badges" },
  { name: "Error Red", var: "--error", hex: "#EF4444", use: "Errors, destructive" },
  { name: "Rating Gold", var: "--rating", hex: "#F59E0B", use: "Star ratings" },
  { name: "Border", var: "--border", hex: "#E5E7EB", use: "Dividers, card borders" },
  { name: "WhatsApp Green", var: "#25D366", hex: "#25D366", use: "WhatsApp CTA" },
];

const typeScale = [
  { name: "5xl", size: "4rem / 64px", weight: 700, sample: "Unleash Energy" },
  { name: "4xl", size: "3rem / 48px", weight: 700, sample: "Featured Products" },
  { name: "3xl", size: "2rem / 32px", weight: 700, sample: "Category Name" },
  { name: "2xl", size: "1.5rem / 24px", weight: 700, sample: "Product Name" },
  { name: "xl", size: "1.25rem / 20px", weight: 600, sample: "Section Heading" },
  { name: "lg", size: "1.125rem / 18px", weight: 600, sample: "Subheading text" },
  { name: "base", size: "1rem / 16px", weight: 400, sample: "Body text — precision engineered for performance" },
  { name: "sm", size: "0.875rem / 14px", weight: 400, sample: "Secondary text, captions" },
  { name: "xs", size: "0.75rem / 12px", weight: 400, sample: "Labels, badges, metadata" },
];

export default function UIStylingPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      {/* Header */}
      <div className="bg-[#0A0A0A] text-white py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h1 className="font-heading text-4xl font-bold mb-2">Wellnza Design System</h1>
          <p className="text-gray-400">Colors, typography, spacing, and interaction patterns.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12 space-y-16">
        {/* Colors */}
        <section>
          <h2 className="font-heading text-2xl font-bold text-[#0A0A0A] mb-6 border-b border-[#E5E7EB] pb-2">Colors</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {colors.map((c) => (
              <div key={c.name} className="space-y-2">
                <div
                  className="h-20 rounded-lg shadow-sm border border-[#E5E7EB]"
                  style={{ backgroundColor: c.hex }}
                />
                <div>
                  <p className="font-semibold text-sm text-[#0A0A0A]">{c.name}</p>
                  <p className="text-xs text-[#6B7280] font-mono">{c.hex}</p>
                  <p className="text-xs text-[#6B7280] mt-1">{c.use}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Typography */}
        <section>
          <h2 className="font-heading text-2xl font-bold text-[#0A0A0A] mb-6 border-b border-[#E5E7EB] pb-2">Typography</h2>
          <div className="space-y-4">
            {typeScale.map((t) => (
              <div key={t.name} className="flex items-baseline gap-6 border-b border-[#F3F4F6] pb-4">
                <div className="w-16 shrink-0">
                  <span className="text-xs font-mono text-[#6B7280]">{t.name}</span>
                  <br />
                  <span className="text-xs font-mono text-[#6B7280]">{t.size}</span>
                </div>
                <p
                  className="font-heading text-[#0A0A0A] truncate"
                  style={{ fontSize: t.size.split(" / ")[1].toLowerCase(), fontWeight: t.weight }}
                >
                  {t.sample}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-6 grid grid-cols-2 gap-6">
            <div className="bg-[#0A0A0A] p-6 text-white">
              <p className="font-heading text-lg font-bold mb-2">Headings use Outfit</p>
              <p className="text-gray-400 text-sm">ABCDEFGHIJKLMNOPQRSTUVWXYZ<br />abcdefghijklmnopqrstuvwxyz<br />0123456789 ₹</p>
            </div>
            <div className="bg-white border border-[#E5E7EB] p-6">
              <p className="font-sans text-lg font-medium mb-2">Body text uses Inter</p>
              <p className="text-[#6B7280] text-sm">ABCDEFGHIJKLMNOPQRSTUVWXYZ<br />abcdefghijklmnopqrstuvwxyz<br />0123456789 ₹</p>
            </div>
          </div>
        </section>

        {/* Spacing */}
        <section>
          <h2 className="font-heading text-2xl font-bold text-[#0A0A0A] mb-6 border-b border-[#E5E7EB] pb-2">Spacing Scale</h2>
          <div className="space-y-3">
            {[4, 6, 8, 12, 16, 20, 24, 32, 40, 48, 64].map((px) => (
              <div key={px} className="flex items-center gap-4">
                <span className="text-xs font-mono text-[#6B7280] w-16">{px}px</span>
                <div className="h-4 bg-[#0055FF]/20 rounded" style={{ width: `${px * 2}px` }} />
                <span className="text-xs text-[#6B7280]">gap-{px / 4}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Button Variants */}
        <section>
          <h2 className="font-heading text-2xl font-bold text-[#0A0A0A] mb-6 border-b border-[#E5E7EB] pb-2">Buttons</h2>
          <div className="bg-white border border-[#E5E7EB] p-8 space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button className="bg-[#0055FF] text-white px-6 py-3 font-semibold text-sm hover:bg-[#0044CC] transition-colors">
                Primary Blue
              </button>
              <button className="bg-[#0A0A0A] text-white px-6 py-3 font-semibold text-sm hover:bg-[#2D2D2D] transition-colors">
                Dark / CTA
              </button>
              <button className="bg-white border border-[#E5E5E0] text-[#0A0A0A] px-6 py-3 font-semibold text-sm hover:border-[#CCCCCC] transition-colors">
                Outline
              </button>
              <button className="bg-green-500 text-white px-6 py-3 font-semibold text-sm hover:bg-green-600 transition-colors">
                WhatsApp
              </button>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <button className="bg-white border border-[#E5E5E0] text-[#0A0A0A] px-4 py-2 text-sm hover:bg-gray-50 transition-colors">
                Small Outline
              </button>
              <button className="bg-[#0055FF] text-white px-4 py-2 text-sm hover:bg-[#0044CC] transition-colors">
                Small Primary
              </button>
              <button className="bg-[#1C1C1C] text-white px-4 py-2 text-sm hover:bg-[#2D2D2D] transition-colors">
                Small Dark
              </button>
            </div>
          </div>
        </section>

        {/* Card Variants */}
        <section>
          <h2 className="font-heading text-2xl font-bold text-[#0A0A0A] mb-6 border-b border-[#E5E7EB] pb-2">Cards</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="bg-white border border-[#E5E5E0] p-6 hover:border-[#CCCCCC] transition-colors">
              <h3 className="font-heading font-bold text-[#0A0A0A] mb-2">Product Card</h3>
              <p className="text-sm text-[#6B7280]">Used for product grids. Hover lifts border to gray.</p>
              <div className="mt-4 h-32 bg-[#F5F5F0] rounded-md flex items-center justify-center text-[#CCCCCC] text-xs">Product Image</div>
              <div className="mt-3 text-sm font-semibold text-[#0A0A0A]">₹1,999</div>
            </div>
            <div className="bg-white border border-[#E5E5E0] p-6">
              <h3 className="font-heading font-bold text-[#0A0A0A] mb-2">Order Card</h3>
              <p className="text-sm text-[#6B7280]">Used in account dashboard. Clean, data-focused layout.</p>
              <div className="mt-4 space-y-2">
                <div className="h-3 bg-[#F3F4F6] rounded w-3/4" />
                <div className="h-3 bg-[#F3F4F6] rounded w-1/2" />
              </div>
            </div>
            <div className="bg-[#0A0A0A] text-white p-6">
              <h3 className="font-heading font-bold mb-2">Dark Card</h3>
              <p className="text-sm text-gray-400">Newsletter section, hero overlays, footer elements.</p>
              <div className="mt-4 flex gap-2">
                <div className="h-10 flex-1 bg-white/10 border border-white/20 rounded" />
                <div className="h-10 px-4 bg-white text-black text-sm font-semibold rounded flex items-center justify-center">Go</div>
              </div>
            </div>
          </div>
        </section>

        {/* Badges */}
        <section>
          <h2 className="font-heading text-2xl font-bold text-[#0A0A0A] mb-6 border-b border-[#E5E7EB] pb-2">Badges & Tags</h2>
          <div className="bg-white border border-[#E5E5E0] p-6 flex flex-wrap gap-3">
            <span className="bg-black text-white text-xs px-2 py-1 uppercase font-bold">BEST SELLER</span>
            <span className="bg-[#0055FF] text-white text-xs px-2 py-1 uppercase font-bold">NEW</span>
            <span className="bg-green-100 text-green-700 text-xs px-2 py-1 font-semibold">Save 20%</span>
            <span className="bg-[#E5E7EB] text-[#0A0A0A] text-xs px-2 py-1">Default</span>
            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1">Warning</span>
            <span className="bg-red-100 text-red-700 text-xs px-2 py-1">Error</span>
          </div>
        </section>

        {/* Form Elements */}
        <section>
          <h2 className="font-heading text-2xl font-bold text-[#0A0A0A] mb-6 border-b border-[#E5E7EB] pb-2">Form Elements</h2>
          <div className="bg-white border border-[#E5E5E0] p-6 space-y-4 max-w-lg">
            <div>
              <label className="block text-sm font-medium text-[#0A0A0A] mb-1">Email Address</label>
              <input type="email" placeholder="you@example.com" className="w-full px-3 py-2 border border-[#E5E7EB] text-sm focus:outline-none focus:border-[#0055FF] focus:ring-1 focus:ring-[#0055FF]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#0A0A0A] mb-1">Newsletter Subscribe</label>
              <div className="flex gap-2">
                <input type="email" placeholder="Email Address" className="flex-1 px-3 py-2 bg-white/10 border border-white/20 text-white placeholder-gray-400 text-sm" />
                <button className="px-4 py-2 bg-white text-black text-sm font-semibold hover:bg-gray-200 transition">Subscribe</button>
              </div>
            </div>
          </div>
        </section>

        {/* Star Rating */}
        <section>
          <h2 className="font-heading text-2xl font-bold text-[#0A0A0A] mb-6 border-b border-[#E5E7EB] pb-2">Star Ratings</h2>
          <div className="bg-white border border-[#E5E5E0] p-6 space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5 text-2xl text-yellow-500">{"★★★★★"}</div>
              <span className="text-sm font-medium text-[#0A0A0A]">5.0</span>
              <span className="text-sm text-[#6B7280]">(47 reviews)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5 text-2xl text-yellow-500">{"★★★★☆"}</div>
              <span className="text-sm font-medium text-[#0A0A0A]">4.0</span>
              <span className="text-sm text-[#6B7280]">(12 reviews)</span>
            </div>
          </div>
        </section>

        {/* WhatsApp CTA */}
        <section>
          <h2 className="font-heading text-2xl font-bold text-[#0A0A0A] mb-6 border-b border-[#E5E7EB] pb-2">WhatsApp Integration</h2>
          <div className="bg-white border border-[#E5E5E0] p-6 space-y-4">
            <p className="text-sm text-[#6B7280]">Floating button appears bottom-right on all pages. Links to WhatsApp with pre-filled product message.</p>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </div>
              <div>
                <p className="font-semibold text-[#0A0A0A]">Chat with us on WhatsApp</p>
                <p className="text-sm text-[#6B7280]">+91 8788396678</p>
                <p className="text-xs text-[#6B7280] mt-1">Pre-filled message includes product name and URL</p>
              </div>
            </div>
          </div>
        </section>

        {/* Price Display */}
        <section>
          <h2 className="font-heading text-2xl font-bold text-[#0A0A0A] mb-6 border-b border-[#E5E7EB] pb-2">Price Display</h2>
          <div className="bg-white border border-[#E5E5E0] p-6 space-y-4">
            <div className="flex items-baseline gap-3">
              <span className="font-heading text-3xl font-bold text-[#0A0A0A]">₹1,999</span>
              <span className="text-lg text-[#6B7280] line-through">₹2,499</span>
              <span className="rounded-md bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">Save 20%</span>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="font-heading text-2xl font-bold text-[#0A0A0A]">₹3499</span>
              <span className="text-base text-[#6B7280]">₹3999</span>
              <span className="rounded-md bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">Save 13%</span>
            </div>
            <div className="text-xs text-[#6B7280]">Prices displayed in Indian Rupees (₹) with free shipping above ₹999</div>
          </div>
        </section>

        {/* Navigation */}
        <section>
          <h2 className="font-heading text-2xl font-bold text-[#0A0A0A] mb-6 border-b border-[#E5E7EB] pb-2">Navigation</h2>
          <div className="bg-[#0A0A0A] px-6 py-4 flex items-center justify-between">
            <span className="font-bold text-white text-xl">Wellnza</span>
            <div className="hidden md:flex items-center gap-6">
              {["Home", "Shop", "About"].map((link) => (
                <span key={link} className={`text-sm font-medium ${link === "Shop" ? "text-white" : "text-gray-400"} hover:text-white transition-colors cursor-pointer`}>
                  {link}
                </span>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
