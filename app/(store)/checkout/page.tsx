"use client";

import { useState, useEffect, useRef } from "react";
import { Bebas_Neue, Oswald } from "next/font/google";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
});

const oswald = Oswald({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-oswald",
});

// Mock cart data - no backend needed for this page
const CART_ITEMS = [
  {
    id: "1",
    name: "Mega Mass Gainer",
    variant: "5KG / CHOCOLATE BLAST",
    price: 4299,
  },
  {
    id: "2",
    name: "Premium Whey Protein",
    variant: "2KG / VANILLA STORM",
    price: 2849,
  },
  {
    id: "3",
    name: "Explosive Pre-Workout",
    variant: "300G / GREEN APPLE",
    price: 1599,
  },
];

const SUBTOTAL = 8747;
const GST = 1574;
const TOTAL = 10321;

export default function AthleticCheckoutPage() {
  const prefersReducedMotion =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [tiltStyles, setTiltStyles] = useState<Record<string, React.CSSProperties>>({});
  const [reducedMotion, setReducedMotion] = useState(prefersReducedMotion);

  const heroContentRef = useRef<HTMLDivElement>(null);
  const cartPanelRef = useRef<HTMLDivElement>(null);
  const floatingBadgesRef = useRef<HTMLDivElement>(null);
  const perspectiveGridRef = useRef<HTMLDivElement>(null);
  const angleDecorationRef = useRef<HTMLDivElement>(null);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Mouse parallax effect
  useEffect(() => {
    if (reducedMotion) return;

    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;
    let lastMove = 0;
    const THROTTLE_MS = 16;
    const MAX_ROTATION = 5;

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastMove < THROTTLE_MS) return;
      lastMove = now;

      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;

      targetY = (mouseX / centerX) * MAX_ROTATION;
      targetX = -(mouseY / centerY) * MAX_ROTATION;

      setMousePos({ x: targetX, y: targetY });
    };

    // Smooth animation loop
    let animationId: number;
    function animate() {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;

      // Apply transforms to hero content (same direction as mouse)
      if (heroContentRef.current) {
        heroContentRef.current.style.transform = `rotateX(${currentX}deg) rotateY(${currentY}deg)`;
      }

      // Apply opposite transforms to cart panel for depth effect
      if (cartPanelRef.current) {
        cartPanelRef.current.style.transform = `translateZ(50px) rotateY(${-currentY * 0.5}deg) rotateX(${currentX * 0.5}deg)`;
      }

      // Apply subtle transform to floating badges
      if (floatingBadgesRef.current) {
        floatingBadgesRef.current.style.transform = `translateZ(20px) rotateY(${currentY * 0.3}deg) rotateX(${-currentX * 0.3}deg)`;
      }

      // Apply subtle shift to perspective grid
      if (perspectiveGridRef.current) {
        perspectiveGridRef.current.style.transform = `rotateX(${-currentX * 0.2}deg) rotateY(${currentY * 0.2}deg)`;
      }

      // Apply subtle shift to angle decoration
      if (angleDecorationRef.current) {
        angleDecorationRef.current.style.transform = `translateZ(-50px) rotateY(${currentY * 0.1}deg)`;
      }

      animationId = requestAnimationFrame(animate);
    }

    animate();
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, [reducedMotion]);

  // Item tilt effect
  const handleItemMouseMove = (e: React.MouseEvent<HTMLDivElement>, itemId: string) => {
    if (reducedMotion) return;

    const target = e.currentTarget as HTMLDivElement;
    const rect = target.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    const rotateY = (mouseX / (rect.width / 2)) * 8;
    const rotateX = -(mouseY / (rect.height / 2)) * 8;

    setTiltStyles((prev) => ({
      ...prev,
      [itemId]: { transform: `rotateY(${rotateY}deg) rotateX(${rotateX}deg)` },
    }));
  };

  const handleItemMouseLeave = (itemId: string) => {
    setTiltStyles((prev) => ({
      ...prev,
      [itemId]: { transform: "rotateY(0deg) rotateX(0deg)" },
    }));
  };

  return (
    <div
      className={`${bebasNeue.variable} ${oswald.variable}`}
      style={{ fontFamily: "var(--font-oswald), sans-serif" }}
    >
      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        :root {
          --black: #0d0d0d;
          --brand-green: #166534;
          --brand-green-light: #22c55e;
          --white: #ffffff;
          --gray: #888888;
          --dark-gray: #1a1a1a;
        }

        body {
          font-family: var(--font-oswald), sans-serif;
          background: var(--black);
          color: var(--white);
          min-height: 100vh;
          overflow-x: hidden;
        }

        @keyframes fadeSlideIn {
          0% {
            opacity: 0;
            transform: translateY(40px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      {/* Perspective Grid Background */}
      <div
        ref={perspectiveGridRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 0,
          overflow: "hidden",
          willChange: "transform",
          transition: "transform 0.1s ease-out",
        }}
      >
        <div
          style={{
            content: "",
            position: "absolute",
            top: "-150%",
            left: "-50%",
            width: "200%",
            height: "400%",
            background: `repeating-linear-gradient(
              -75deg,
              transparent,
              transparent 40px,
              rgba(22, 101, 52, 0.04) 40px,
              rgba(22, 101, 52, 0.04) 42px
            )`,
            transform: "rotateX(60deg)",
            willChange: "transform",
          }}
        />
      </div>

      {/* Diagonal Lines */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "200px",
          overflow: "hidden",
          pointerEvents: "none",
          zIndex: 1,
        }}
      >
        <div
          style={{
            content: "",
            position: "absolute",
            bottom: 0,
            left: "-50px",
            width: "150%",
            height: "100%",
            background: `repeating-linear-gradient(
              -75deg,
              transparent,
              transparent 20px,
              rgba(173, 255, 47, 0.03) 20px,
              rgba(173, 255, 47, 0.03) 22px
            )`,
          }}
        />
      </div>

      {/* Angular Decorative Element */}
      <div
        ref={angleDecorationRef}
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "400px",
          height: "100%",
          overflow: "hidden",
          pointerEvents: "none",
          transform: "translateZ(-50px)",
          willChange: "transform",
        }}
      >
        <div
          style={{
            content: "",
            position: "absolute",
            top: "-50%",
            right: "-100px",
            width: "300px",
            height: "200%",
            background: "var(--brand-green)",
            transform: "skewX(-20deg)",
            opacity: 0.08,
          }}
        />
        <div
          style={{
            content: "",
            position: "absolute",
            top: 0,
            right: "80px",
            width: "4px",
            height: "100%",
            background: "var(--brand-green)",
            transform: "skewX(-10deg)",
            opacity: 0.6,
          }}
        />
      </div>

      <div style={{ perspective: "1000px", perspectiveOrigin: "center center" }}>
        {/* HEADER */}
        <header
          style={{
            position: "relative",
            padding: "24px 48px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid rgba(173, 255, 47, 0.15)",
            transformStyle: "preserve-3d",
            willChange: "transform, opacity",
            opacity: reducedMotion ? 1 : 0,
            animation: reducedMotion
              ? "none"
              : "fadeSlideIn 0.6s ease-out 0.1s forwards",
          }}
        >
          <div className="logo" style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                background: "var(--brand-green)",
                clipPath:
                  "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transform: "translateZ(20px)",
                willChange: "transform",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-bebas), sans-serif",
                  fontSize: "24px",
                  color: "var(--black)",
                  fontWeight: "bold",
                }}
              >
                W
              </span>
            </div>
            <div
              style={{
                fontFamily: "var(--font-bebas), sans-serif",
                fontSize: "28px",
                letterSpacing: "4px",
                color: "var(--white)",
              }}
            >
              WELL <span style={{ color: "var(--brand-green)" }}>NZ</span>
            </div>
          </div>
          <div
            style={{
              fontSize: "12px",
              letterSpacing: "3px",
              color: "var(--gray)",
              textTransform: "uppercase",
              border: "1px solid var(--gray)",
              padding: "6px 16px",
              transform: "translateZ(10px)",
              willChange: "transform",
            }}
          >
            ORDER LOCKED
          </div>
        </header>

        {/* HERO SECTION */}
        <section
          style={{
            position: "relative",
            padding: "60px 48px 80px",
            display: "grid",
            gridTemplateColumns: "1fr 400px",
            gap: "80px",
            minHeight: "70vh",
            alignItems: "center",
            transformStyle: "preserve-3d",
            willChange: "transform",
          }}
        >
          {/* Hero Content */}
          <div
            ref={heroContentRef}
            style={{
              position: "relative",
              zIndex: 2,
              transformStyle: "preserve-3d",
              willChange: "transform, opacity",
              opacity: reducedMotion ? 1 : 0,
              animation: reducedMotion
                ? "none"
                : "fadeSlideIn 0.6s ease-out 0.3s forwards",
            }}
          >
            {/* Hero Tag */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "12px",
                fontSize: "13px",
                letterSpacing: "4px",
                color: "var(--brand-green)",
                textTransform: "uppercase",
                marginBottom: "24px",
                transform: "translateZ(30px)",
                willChange: "transform",
                opacity: reducedMotion ? 1 : 0,
                animation: reducedMotion
                  ? "none"
                  : "fadeSlideIn 0.6s ease-out 0.5s forwards",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "2px",
                  background: "var(--brand-green)",
                }}
              />
              EVERY REP. EVERY SET. EVERY DAY.
            </div>

            {/* Hero Title */}
            <h1
              style={{
                fontFamily: "var(--font-bebas), sans-serif",
                fontSize: "96px",
                lineHeight: 0.9,
                letterSpacing: "2px",
                marginBottom: "24px",
                textTransform: "uppercase",
                transform: "translateZ(40px)",
                willChange: "transform",
                opacity: reducedMotion ? 1 : 0,
                animation: reducedMotion
                  ? "none"
                  : "fadeSlideIn 0.6s ease-out 0.7s forwards",
              }}
            >
              <span
                style={{
                  color: "var(--brand-green)",
                  display: "block",
                }}
              >
                LOCK IN
              </span>
              YOUR GAINS
            </h1>

            {/* Hero Subtitle */}
            <p
              style={{
                fontSize: "18px",
                color: "var(--gray)",
                letterSpacing: "2px",
                textTransform: "uppercase",
                marginBottom: "48px",
                transform: "translateZ(20px)",
                willChange: "transform",
                opacity: reducedMotion ? 1 : 0,
                animation: reducedMotion
                  ? "none"
                  : "fadeSlideIn 0.6s ease-out 0.9s forwards",
              }}
            >
              Built for athletes who demand maximum performance. No shortcuts. No
              compromise. Stack your supplements, dominate your goals.
            </p>
          </div>

          {/* Floating Badges */}
          <div
            ref={floatingBadgesRef}
            style={{
              position: "absolute",
              top: "20px",
              right: "420px",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              transform: "translateZ(20px)",
              willChange: "transform",
              opacity: reducedMotion ? 1 : 0,
              animation: reducedMotion
                ? "none"
                : "fadeSlideIn 0.6s ease-out 1.1s forwards",
            }}
          >
            {["FREE SHIPPING", "LAB TESTED", "100% AUTHENTIC"].map((badge) => (
              <div
                key={badge}
                style={{
                  background: "rgba(22, 101, 52, 0.15)",
                  border: "1px solid var(--brand-green)",
                  padding: "8px 16px",
                  fontSize: "11px",
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  color: "var(--brand-green-light)",
                  transform: "translateZ(20px)",
                  willChange: "transform",
                  transition: "transform 0.3s ease",
                  cursor: "default",
                }}
              >
                {badge}
              </div>
            ))}
          </div>

          {/* CART PANEL */}
          <div
            ref={cartPanelRef}
            style={{
              position: "relative",
              zIndex: 2,
              background:
                "linear-gradient(135deg, var(--dark-gray) 0%, rgba(26,26,26,0.8) 100%)",
              border: "1px solid rgba(173, 255, 47, 0.2)",
              clipPath:
                "polygon(0 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%)",
              transformStyle: "preserve-3d",
              transform: "translateZ(50px) rotateY(0deg) rotateX(0deg)",
              willChange: "transform",
              transition: "transform 0.4s ease, box-shadow 0.4s ease",
              opacity: reducedMotion ? 1 : 0,
              animation: reducedMotion
                ? "none"
                : "fadeSlideIn 0.6s ease-out 1.3s forwards",
            }}
          >
            {/* Cart Header */}
            <div
              style={{
                background: "var(--brand-green)",
                padding: "16px 24px",
                clipPath:
                  "polygon(0 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%)",
                margin: "-1px -1px 0 -1px",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-bebas), sans-serif",
                  fontSize: "24px",
                  color: "var(--black)",
                  letterSpacing: "3px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span>YOUR STACK</span>
                <div
                  style={{
                    background: "var(--black)",
                    color: "var(--brand-green)",
                    width: "32px",
                    height: "32px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "16px",
                  }}
                >
                  3
                </div>
              </div>
            </div>

            {/* Cart Items */}
            <div
              style={{
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              {CART_ITEMS.map((item, index) => (
                <div
                  key={item.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "64px 1fr auto",
                    gap: "16px",
                    alignItems: "center",
                    paddingBottom: "16px",
                    borderBottom:
                      index < CART_ITEMS.length - 1
                        ? "1px solid rgba(255,255,255,0.08)"
                        : "none",
                    transform: "translateZ(0)",
                    willChange: "transform",
                    opacity: reducedMotion ? 1 : 0,
                    animation: reducedMotion
                      ? "none"
                      : `fadeSlideIn 0.5s ease-out ${1.5 + index * 0.2}s forwards`,
                  }}
                >
                  {/* Item Image */}
                  <div
                    data-tilt
                    onMouseMove={(e) => handleItemMouseMove(e, item.id)}
                    onMouseLeave={() => handleItemMouseLeave(item.id)}
                    style={{
                      width: "64px",
                      height: "64px",
                      background: "var(--black)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                      overflow: "hidden",
                      transformStyle: "preserve-3d",
                      willChange: "transform",
                      transition: "transform 0.2s ease",
                      ...tiltStyles[item.id],
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "3px",
                        background: "var(--brand-green)",
                      }}
                    />
                    <svg
                      viewBox="0 0 24 24"
                      style={{
                        width: "36px",
                        height: "36px",
                        fill: "var(--brand-green)",
                        opacity: 0.8,
                      }}
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                  </div>

                  {/* Item Details */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "4px",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "var(--font-bebas), sans-serif",
                        fontSize: "18px",
                        letterSpacing: "1px",
                        textTransform: "uppercase",
                      }}
                    >
                      {item.name}
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "var(--gray)",
                        letterSpacing: "1px",
                      }}
                    >
                      {item.variant}
                    </div>
                  </div>

                  {/* Item Price */}
                  <div
                    style={{
                      fontFamily: "var(--font-bebas), sans-serif",
                      fontSize: "20px",
                      color: "var(--white)",
                      letterSpacing: "1px",
                    }}
                  >
                    <span style={{ fontSize: "14px", color: "var(--gray)", marginRight: "2px" }}>
                      ₹
                    </span>
                    {item.price.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div
              style={{
                padding: "24px",
                borderTop: "1px solid rgba(173, 255, 47, 0.2)",
                background: "rgba(0,0,0,0.3)",
                transform: "translateZ(10px)",
                willChange: "transform",
                opacity: reducedMotion ? 1 : 0,
                animation: reducedMotion
                  ? "none"
                  : "fadeSlideIn 0.5s ease-out 2.1s forwards",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "12px",
                  fontSize: "14px",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                }}
              >
                <span style={{ color: "var(--gray)" }}>Subtotal</span>
                <span style={{ color: "var(--white)" }}>₹{SUBTOTAL.toLocaleString()}</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "12px",
                  fontSize: "14px",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                }}
              >
                <span style={{ color: "var(--gray)" }}>GST (18%)</span>
                <span style={{ color: "var(--white)" }}>₹{GST.toLocaleString()}</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "12px",
                  fontSize: "14px",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                }}
              >
                <span style={{ color: "var(--gray)" }}>Shipping</span>
                <span style={{ color: "var(--brand-green)" }}>FREE</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingTop: "16px",
                  borderTop: "1px solid rgba(173, 255, 47, 0.3)",
                  marginTop: "8px",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-bebas), sans-serif",
                    fontSize: "20px",
                    letterSpacing: "3px",
                    textTransform: "uppercase",
                  }}
                >
                  TOTAL
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-bebas), sans-serif",
                    fontSize: "36px",
                    color: "var(--brand-green)",
                    letterSpacing: "1px",
                  }}
                >
                  <span style={{ fontSize: "18px", marginRight: "4px" }}>₹</span>
                  {TOTAL.toLocaleString()}
                </span>
              </div>
            </div>

            {/* CTA Button */}
            <div
              style={{
                padding: "24px",
                paddingTop: 0,
                opacity: reducedMotion ? 1 : 0,
                animation: reducedMotion
                  ? "none"
                  : "fadeSlideIn 0.5s ease-out 2.3s forwards",
              }}
            >
              <button
                aria-label="Complete order for ₹10,321"
                style={{
                  width: "100%",
                  padding: "20px 32px",
                  background: "var(--brand-green)",
                  color: "var(--black)",
                  fontFamily: "var(--font-bebas), sans-serif",
                  fontSize: "24px",
                  letterSpacing: "4px",
                  textTransform: "uppercase",
                  border: "none",
                  cursor: "pointer",
                  position: "relative",
                  clipPath:
                    "polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)",
                  transformStyle: "preserve-3d",
                  transform: "translateZ(30px) rotateX(0deg)",
                  willChange: "transform",
                  transition: "transform 0.3s ease, color 0.3s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "16px",
                  perspective: "500px",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "var(--black)",
                    clipPath:
                      "polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)",
                    opacity: 0,
                    transition: "opacity 0.3s ease",
                  }}
                />
                <span style={{ position: "relative", zIndex: 1 }}>LOCK IN MY STACK</span>
                <svg
                  viewBox="0 0 24 24"
                  style={{
                    width: "24px",
                    height: "24px",
                    fill: "currentColor",
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
                </svg>
              </button>
            </div>
          </div>
        </section>

        {/* BOTTOM SECTION */}
        <div
          style={{
            padding: "32px 48px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(173, 255, 47, 0.1)",
            transformStyle: "preserve-3d",
            willChange: "transform, opacity",
            opacity: reducedMotion ? 1 : 0,
            animation: reducedMotion
              ? "none"
              : "fadeSlideIn 0.6s ease-out 2.5s forwards",
          }}
        >
          <div
            style={{
              fontSize: "14px",
              letterSpacing: "3px",
              color: "var(--gray)",
              textTransform: "uppercase",
            }}
          >
            BUILT FOR{" "}
            <span style={{ color: "var(--brand-green)" }}>ATHLETES</span>. PROVEN BY{" "}
            <span style={{ color: "var(--brand-green)" }}>GAINS</span>
          </div>

          <div style={{ display: "flex", gap: "24px" }}>
            {/* Shield Badge */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "11px",
                letterSpacing: "1px",
                color: "var(--gray)",
                textTransform: "uppercase",
                transform: "translateZ(15px)",
                willChange: "transform",
              }}
            >
              <svg viewBox="0 0 24 24" style={{ width: "16px", height: "16px", fill: "var(--brand-green)" }}>
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
              </svg>
              <span>100% AUTHENTIC — SOURCE DIRECT</span>
            </div>

            {/* Lightning Badge */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "11px",
                letterSpacing: "1px",
                color: "var(--gray)",
                textTransform: "uppercase",
                transform: "translateZ(15px)",
                willChange: "transform",
              }}
            >
              <svg viewBox="0 0 24 24" style={{ width: "16px", height: "16px", fill: "var(--brand-green)" }}>
                <path d="M18 1l-4 4-3-3-5 5 3 3-5 5 5 5 3-3 4 4 1-1-4-4 4-4-1-1zm-6 8l-2 2 4 4 4-4-2-2-2 2-2-2z" />
              </svg>
              <span>SPEED DELIVERY — WITHIN 48 HOURS</span>
            </div>

            {/* Check Badge */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "11px",
                letterSpacing: "1px",
                color: "var(--gray)",
                textTransform: "uppercase",
                transform: "translateZ(15px)",
                willChange: "transform",
              }}
            >
              <svg viewBox="0 0 24 24" style={{ width: "16px", height: "16px", fill: "var(--brand-green)" }}>
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
              <span>EVERY BATCH TESTED — PERIOD</span>
            </div>
          </div>
        </div>
      </div>

      {/* Responsive Styles */}
      <style jsx>{`
        @media (max-width: 1024px) {
          section.hero {
            grid-template-columns: 1fr 360px !important;
            gap: 48px !important;
            padding: 48px 32px 64px !important;
          }
          h1 {
            font-size: 72px !important;
          }
          .floating-badges {
            display: none;
          }
        }

        @media (max-width: 900px) {
          section.hero {
            grid-template-columns: 1fr !important;
            gap: 48px !important;
            padding: 40px 24px 60px !important;
          }
          h1 {
            font-size: 56px !important;
          }
          .cart-panel {
            max-width: 500px;
            margin: 0 auto;
          }
          header {
            padding: 16px 24px !important;
          }
          .logo-text {
            font-size: 20px !important;
            letter-spacing: 2px !important;
          }
          .bottom-section {
            flex-direction: column !important;
            gap: 24px !important;
            text-align: center !important;
          }
        }

        @media (max-width: 600px) {
          h1 {
            font-size: 40px !important;
          }
          section.hero {
            padding: 32px 16px 48px !important;
          }
          .cart-panel {
            max-width: 100%;
          }
          .cart-items {
            padding: 16px !important;
          }
          .order-summary {
            padding: 16px !important;
          }
          .cta-section {
            padding: 16px !important;
            padding-top: 0 !important;
          }
          .bottom-section {
            padding: 24px 16px !important;
          }
          header {
            padding: 12px 16px !important;
          }
          .trust-badges {
            flex-wrap: wrap;
            justify-content: center;
            gap: 16px;
          }
        }

        /* Hover effects */
        button:hover > div:first-of-type {
          opacity: 1 !important;
        }
        button:hover {
          color: var(--brand-green) !important;
          transform: translateZ(30px) rotateX(15deg) !important;
        }
        button:active {
          transform: translateZ(30px) rotateX(20deg) scale(0.98) !important;
        }

        .floating-badge:hover {
          transform: translateZ(30px) scale(1.05) !important;
          outline: 2px solid var(--brand-green);
          outline-offset: 2px;
        }

        .cart-panel:hover {
          transform: translateZ(60px) rotateY(5deg) rotateX(-3deg) !important;
          box-shadow: -20px 20px 60px rgba(0, 0, 0, 0.8),
            0 0 40px rgba(22, 101, 52, 0.15) !important;
        }
      `}</style>
    </div>
  );
}
