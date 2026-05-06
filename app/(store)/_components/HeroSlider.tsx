import Link from "next/link";

// Botanical leaf SVG component for subtle decoration
function BotanicalLeaf({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M60 180V60"
        stroke="#2E7D32"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M60 60C60 60 20 55 15 30C10 5 40 0 60 20C80 0 110 5 105 30C100 55 60 60 60 60Z"
        fill="#2E7D32"
        fillOpacity="0.15"
        stroke="#2E7D32"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M60 90C60 90 35 85 30 65C25 45 45 40 60 55"
        stroke="#2E7D32"
        strokeWidth="1"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M60 90C60 90 85 85 90 65C95 45 75 40 60 55"
        stroke="#2E7D32"
        strokeWidth="1"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

// Small decorative dot pattern
function DotPattern({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {[...Array(16)].map((_, row) =>
        [...Array(16)].map((__, col) => (
          <circle
            key={`${row}-${col}`}
            cx={col * 14 + 7}
            cy={row * 14 + 7}
            r="1.5"
            fill="#2E7D32"
            fillOpacity="0.12"
          />
        ))
      )}
    </svg>
  );
}

export function HeroSlider() {
  return (
    <section
      style={{
        backgroundColor: "#FAFAF8",
        minHeight: "85vh",
        display: "flex",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background decorative elements */}
      <div
        style={{
          position: "absolute",
          top: "5%",
          right: "5%",
          opacity: 0.6,
          pointerEvents: "none",
        }}
        className="hidden lg:block"
      >
        <BotanicalLeaf className="w-32 h-48" />
      </div>

      <div
        style={{
          position: "absolute",
          bottom: "10%",
          left: "3%",
          opacity: 0.4,
          pointerEvents: "none",
          transform: "rotate(-15deg)",
        }}
        className="hidden lg:block"
      >
        <BotanicalLeaf className="w-24 h-36" />
      </div>

      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "8%",
          opacity: 0.5,
          pointerEvents: "none",
        }}
        className="hidden md:block"
      >
        <DotPattern className="w-40 h-40" />
      </div>

      {/* Main content */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "80px 24px",
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "48px",
          alignItems: "center",
          position: "relative",
          zIndex: 1,
          width: "100%",
        }}
        className="lg:grid-cols-2"
      >
        {/* Left Column - Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: "32px",
          }}
          className="lg:items-start lg:text-left"
        >
          {/* Eyebrow */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "12px",
              fontSize: "13px",
              letterSpacing: "3px",
              color: "#2E7D32",
              textTransform: "uppercase",
              fontWeight: 500,
            }}
          >
            <span
              style={{
                width: "32px",
                height: "1px",
                backgroundColor: "#2E7D32",
              }}
            />
            Natural Wellness
          </div>

          {/* Headline */}
          <h1
            style={{
              fontFamily: "Playfair Display, Georgia, serif",
              fontSize: "clamp(40px, 6vw, 64px)",
              lineHeight: 1.1,
              letterSpacing: "-0.5px",
              color: "#1a1a1a",
              margin: 0,
              fontWeight: 600,
            }}
          >
            Wellness, Rooted in Nature
          </h1>

          {/* Subheadline */}
          <p
            style={{
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontSize: "18px",
              lineHeight: 1.7,
              color: "#5a5a5a",
              maxWidth: "520px",
              margin: 0,
            }}
          >
            Premium natural supplements crafted from whole-food ingredients.
            No artificial fillers. No synthetic compounds. Just the pure power
            of nature to support your health journey.
          </p>

          {/* CTA Button */}
          <Link
            href="/products"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              padding: "16px 36px",
              backgroundColor: "#2E7D32",
              color: "#ffffff",
              fontSize: "15px",
              fontWeight: 600,
              letterSpacing: "1px",
              textTransform: "uppercase",
              textDecoration: "none",
              borderRadius: "50px",
              border: "none",
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 20px rgba(46, 125, 50, 0.25)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#C9A227";
              e.currentTarget.style.boxShadow =
                "0 6px 24px rgba(201, 162, 39, 0.35)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#2E7D32";
              e.currentTarget.style.boxShadow =
                "0 4px 20px rgba(46, 125, 50, 0.25)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Shop Natural Supplements
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
            </svg>
          </Link>

          {/* Trust Indicators */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "32px",
              marginTop: "16px",
              paddingTop: "32px",
              borderTop: "1px solid rgba(46, 125, 50, 0.15)",
              justifyContent: "center",
            }}
            className="lg:justify-start"
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="#2E7D32"
              >
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
              </svg>
              <span
                style={{
                  fontSize: "12px",
                  letterSpacing: "0.5px",
                  color: "#666666",
                  fontWeight: 500,
                }}
              >
                100% Natural Ingredients
              </span>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="#2E7D32"
              >
                <path d="M18 1l-4 4-3-3-5 5 3 3-5 5 5 5 3-3 4 4 1-1-4-4 4-4-1-1z" />
              </svg>
              <span
                style={{
                  fontSize: "12px",
                  letterSpacing: "0.5px",
                  color: "#666666",
                  fontWeight: 500,
                }}
              >
                Third-Party Tested
              </span>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="#2E7D32"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
              <span
                style={{
                  fontSize: "12px",
                  letterSpacing: "0.5px",
                  color: "#666666",
                  fontWeight: 500,
                }}
              >
                Science-Backed Formulas
              </span>
            </div>
          </div>
        </div>

        {/* Right Column - Botanical Illustration */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
          }}
          className="hidden lg:flex"
        >
          {/* Decorative circle backdrop */}
          <div
            style={{
              width: "420px",
              height: "420px",
              borderRadius: "50%",
              background:
                "linear-gradient(135deg, rgba(46, 125, 50, 0.08) 0%, rgba(46, 125, 50, 0.03) 100%)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
            }}
          >
            {/* Central botanical element */}
            <svg
              viewBox="0 0 300 400"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{
                width: "280px",
                height: "380px",
              }}
              aria-label="Botanical wellness illustration"
            >
              {/* Main stem */}
              <path
                d="M150 380V120"
                stroke="#2E7D32"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Large left leaf */}
              <path
                d="M150 200C150 200 70 190 50 130C30 70 90 40 150 80C210 40 270 70 250 130C230 190 150 200 150 200Z"
                fill="#2E7D32"
                fillOpacity="0.12"
                stroke="#2E7D32"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Large right leaf */}
              <path
                d="M150 260C150 260 230 250 250 190C270 130 210 100 150 140C90 100 30 130 50 190C70 250 150 260 150 260Z"
                fill="#2E7D32"
                fillOpacity="0.08"
                stroke="#2E7D32"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Top leaf cluster */}
              <path
                d="M150 120C150 120 110 110 100 70C90 30 130 10 150 40C170 10 210 30 200 70C190 110 150 120 150 120Z"
                fill="#2E7D32"
                fillOpacity="0.15"
                stroke="#2E7D32"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Small accent leaves */}
              <path
                d="M150 300C150 300 120 295 115 275C110 255 130 245 150 260"
                stroke="#2E7D32"
                strokeWidth="1.5"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M150 300C150 300 180 295 185 275C190 255 170 245 150 260"
                stroke="#2E7D32"
                strokeWidth="1.5"
                strokeLinecap="round"
                fill="none"
              />

              {/* Decorative dots */}
              <circle cx="150" cy="180" r="4" fill="#2E7D32" fillOpacity="0.3" />
              <circle cx="150" cy="220" r="3" fill="#2E7D32" fillOpacity="0.25" />
              <circle cx="150" cy="280" r="3.5" fill="#2E7D32" fillOpacity="0.2" />

              {/* Gold accent dots */}
              <circle cx="95" cy="130" r="2.5" fill="#C9A227" fillOpacity="0.5" />
              <circle cx="205" cy="185" r="2" fill="#C9A227" fillOpacity="0.4" />
            </svg>

            {/* Floating badge */}
            <div
              style={{
                position: "absolute",
                top: "15%",
                right: "10%",
                backgroundColor: "#ffffff",
                padding: "12px 20px",
                borderRadius: "50px",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="#2E7D32"
              >
                <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z" />
              </svg>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: "1px",
                  color: "#2E7D32",
                  textTransform: "uppercase",
                }}
              >
                Premium Quality
              </span>
            </div>

            {/* Second floating badge */}
            <div
              style={{
                position: "absolute",
                bottom: "20%",
                left: "5%",
                backgroundColor: "#ffffff",
                padding: "12px 20px",
                borderRadius: "50px",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="#C9A227"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: "1px",
                  color: "#C9A227",
                  textTransform: "uppercase",
                }}
              >
                Customer Favorite
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "60px",
          background:
            "linear-gradient(to top, rgba(250, 250, 248, 1) 0%, rgba(250, 250, 248, 0) 100%)",
          pointerEvents: "none",
        }}
      />
    </section>
  );
}
