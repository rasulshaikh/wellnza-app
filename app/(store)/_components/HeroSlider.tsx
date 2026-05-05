"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";

const THROTTLE_MS = 16;
const MAX_ROTATION = 5;
const EASING = 0.08;

interface Slide {
  id: number;
  image: string;
  tagline: string;
  subtagline: string;
  cta: string;
  href: string;
}

const slides: Slide[] = [
  {
    id: 1,
    image: "https://cdn.zyrosite.com/cdn-cgi/image/format=auto,w=768,h=960,fit=crop,q=100/cdn-ecommerce/store_01KJVXS44M9NNG532TH40JSYHE/assets/d1ad28f5-ec9b-4d62-ba5c-91be9ef209d1.png",
    tagline: "EVERY REP. EVERY SET. EVERY DAY.",
    subtagline: "Stack the right supplements. Crush every session. Zero excuses.",
    cta: "LOCK IN MY STACK",
    href: "/products",
  },
  {
    id: 2,
    image: "https://cdn.zyrosite.com/cdn-cgi/image=format=auto,w=768,h=960,fit=crop,q=100/cdn-ecommerce/store_01KJVXS44M9NNG532TH40JSYHE/assets/d1ad28f5-ec9b-4d62-ba5c-91be9ef209d1.png",
    tagline: "FUEL THE GRIND.",
    subtagline: "High-quality proteins, mass gainers, and pre-workouts built for serious athletes.",
    cta: "VIEW PRODUCTS",
    href: "/products?category=PROTEIN",
  },
  {
    id: 3,
    image: "https://cdn.zyrosite.com/cdn-cgi/image=format=auto,w=768,h=960,fit=crop,q=100/cdn-ecommerce/store_01KJVXS44M9NNG532TH40JSYHE/assets/d1ad28f5-ec9b-4d62-ba5c-91be9ef209d1.png",
    tagline: "DOMINATE YOUR WORKOUT.",
    subtagline: "Pre-workout power that kicks in fast. No crash. No compromise.",
    cta: "LEARN MORE",
    href: "/about",
  },
];

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const productRef = useRef<HTMLDivElement>(null);
  const lastMoveRef = useRef(0);
  const targetXRef = useRef(0);
  const targetYRef = useRef(0);
  const currentXRef = useRef(0);
  const currentYRef = useRef(0);
  const animationFrameRef = useRef<number | undefined>(undefined);

  // Detect prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Auto-advance slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Mouse parallax with 16ms throttle
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastMoveRef.current < THROTTLE_MS) return;
      lastMoveRef.current = now;

      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;

      targetYRef.current = (mouseX / centerX) * MAX_ROTATION;
      targetXRef.current = -(mouseY / centerY) * MAX_ROTATION;
    },
    []
  );

  // Smooth animation loop
  useEffect(() => {
    if (prefersReducedMotion) return;

    const animate = () => {
      currentXRef.current += (targetXRef.current - currentXRef.current) * EASING;
      currentYRef.current += (targetYRef.current - currentYRef.current) * EASING;

      setRotateX(currentXRef.current);
      setRotateY(currentYRef.current);

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [prefersReducedMotion]);

  // Attach mouse listener
  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  const slide = slides[currentSlide];

  return (
    <section
      ref={heroRef}
      className="relative overflow-hidden"
      style={{
        backgroundColor: "#0D0D0D",
        perspective: "1000px",
      }}
    >
      {/* Perspective Grid Background */}
      {!prefersReducedMotion && (
        <div
          className="perspective-grid"
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            zIndex: 0,
            overflow: "hidden",
            willChange: "transform",
            transition: "transform 0.1s ease-out",
            transform: `rotateX(${-rotateX * 0.2}deg) rotateY(${rotateY * 0.2}deg)`,
          }}
        />
      )}

      {/* Angular Decoration */}
      <div
        className="angle-decoration"
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "400px",
          height: "100%",
          overflow: "hidden",
          pointerEvents: "none",
          transform: `translateZ(-50px) rotateY(${rotateY * 0.1}deg)`,
          willChange: "transform",
          opacity: 0.08,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-50%",
            right: "-100px",
            width: "300px",
            height: "200%",
            background: "#166534",
            transform: "skewX(-20deg)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            right: "80px",
            width: "4px",
            height: "100%",
            background: "#166534",
            transform: "skewX(-10deg)",
            opacity: 0.6,
          }}
        />
      </div>

      {/* Main Content */}
      <div
        className="relative z-10 container mx-auto px-4 md:px-8 py-12 md:py-20"
        style={{
          minHeight: "80vh",
          display: "grid",
          gridTemplateColumns: "1fr 400px",
          gap: "80px",
          alignItems: "center",
        }}
      >
        {/* Left Column - Hero Content */}
        <div
          className="hero-content"
          ref={productRef}
          style={{
            transformStyle: "preserve-3d",
            willChange: "transform, opacity",
            transform: prefersReducedMotion
              ? "none"
              : `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
            opacity: 1,
          }}
        >
          {/* Hero Tag */}
          <div
            className="hero-tag"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "12px",
              fontSize: "13px",
              letterSpacing: "4px",
              color: "#166534",
              textTransform: "uppercase",
              marginBottom: "24px",
              transform: "translateZ(30px)",
              willChange: "transform",
              animation: prefersReducedMotion
                ? "none"
                : "fadeSlideIn 0.6s ease-out 0.5s forwards",
              opacity: prefersReducedMotion ? 1 : 0,
            }}
          >
            <span
              style={{
                width: "40px",
                height: "2px",
                background: "#166534",
              }}
            />
            {slide.tagline}
          </div>

          {/* Hero Title */}
          <h1
            className="hero-title"
            style={{
              fontFamily: "var(--font-bebas), Bebas Neue, sans-serif",
              fontSize: "clamp(56px, 8vw, 96px)",
              lineHeight: 0.9,
              letterSpacing: "2px",
              textTransform: "uppercase",
              marginBottom: "24px",
              color: "#FFFFFF",
              transform: "translateZ(40px)",
              willChange: "transform",
              animation: prefersReducedMotion
                ? "none"
                : "fadeSlideIn 0.6s ease-out 0.7s forwards",
              opacity: prefersReducedMotion ? 1 : 0,
            }}
          >
            <span style={{ color: "#166534", display: "block" }}>LOCK IN</span>
            YOUR GAINS
          </h1>

          {/* Hero Subtitle */}
          <p
            className="hero-subtitle"
            style={{
              fontFamily: "var(--font-oswald), Oswald, sans-serif",
              fontSize: "18px",
              color: "#888888",
              letterSpacing: "2px",
              textTransform: "uppercase",
              marginBottom: "48px",
              maxWidth: "480px",
              transform: "translateZ(20px)",
              willChange: "transform",
              animation: prefersReducedMotion
                ? "none"
                : "fadeSlideIn 0.6s ease-out 0.9s forwards",
              opacity: prefersReducedMotion ? 1 : 0,
            }}
          >
            {slide.subtagline}
          </p>

          {/* CTA Group */}
          <div
            className="cta-group"
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "24px",
              animation: prefersReducedMotion
                ? "none"
                : "fadeSlideIn 0.6s ease-out 1.1s forwards",
              opacity: prefersReducedMotion ? 1 : 0,
            }}
          >
            {/* Primary CTA - Angular Clip-path */}
            <Link
              href={slide.href}
              className="cta-button"
              aria-label={slide.cta}
            >
              <span>{slide.cta}</span>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
              </svg>
            </Link>

            {/* Secondary CTA */}
            <Link
              href="/about"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                fontFamily: "var(--font-oswald), Oswald, sans-serif",
                fontSize: "14px",
                letterSpacing: "2px",
                textTransform: "uppercase",
                color: "#22C55E",
                textDecoration: "none",
                transition: "color 0.3s ease",
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
              OUR STORY
            </Link>
          </div>

          {/* Trust Badges - Bottom */}
          <div
            className="trust-badges"
            style={{
              display: "flex",
              gap: "24px",
              marginTop: "48px",
              paddingTop: "32px",
              borderTop: "1px solid rgba(22, 101, 52, 0.2)",
              animation: prefersReducedMotion
                ? "none"
                : "fadeSlideIn 0.6s ease-out 1.3s forwards",
              opacity: prefersReducedMotion ? 1 : 0,
            }}
          >
            <div className="badge" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#166534">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
              </svg>
              <span
                style={{
                  fontSize: "11px",
                  letterSpacing: "1px",
                  color: "#888888",
                  textTransform: "uppercase",
                }}
              >
                100% AUTHENTIC — ZERO FAKES
              </span>
            </div>
            <div className="badge" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#166534">
                <path d="M18 1l-4 4-3-3-5 5 3 3-5 5 5 5 3-3 4 4 1-1-4-4 4-4-1-1z" />
              </svg>
              <span
                style={{
                  fontSize: "11px",
                  letterSpacing: "1px",
                  color: "#888888",
                  textTransform: "uppercase",
                }}
              >
                SPEED DELIVERY — NO WAITING AROUND
              </span>
            </div>
            <div className="badge" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#166534">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
              <span
                style={{
                  fontSize: "11px",
                  letterSpacing: "1px",
                  color: "#888888",
                  textTransform: "uppercase",
                }}
              >
                EVERY BATCH TESTED — PERIOD
              </span>
            </div>
          </div>
        </div>

        {/* Right Column - Product Showcase with 3D Parallax */}
        <div
          className="product-showcase"
          style={{
            position: "relative",
            transformStyle: "preserve-3d",
            willChange: "transform",
            transform: prefersReducedMotion
              ? "none"
              : `translateZ(50px) rotateY(${-rotateY * 0.5}deg) rotateX(${rotateX * 0.5}deg)`,
          }}
        >
          {/* Floating Badges */}
          <div
            className="floating-badges-container"
            style={{
              position: "absolute",
              top: "-20px",
              right: "-20px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              zIndex: 10,
              transform: "translateZ(20px)",
              willChange: "transform",
              animation: prefersReducedMotion
                ? "none"
                : "fadeSlideIn 0.6s ease-out 1.5s forwards",
              opacity: prefersReducedMotion ? 1 : 0,
            }}
          >
            {["FREE SHIPPING", "LAB TESTED", "100% AUTHENTIC"].map((badge) => (
              <button
                key={badge}
                className="floating-badge"
                type="button"
              >
                {badge}
              </button>
            ))}
          </div>

          {/* Product Image Container - Angular Shape */}
          <div
            className="product-frame"
            style={{
              position: "relative",
              background: "linear-gradient(135deg, #1A1A1A 0%, rgba(26,26,26,0.8) 100%)",
              border: "1px solid rgba(22, 101, 52, 0.2)",
              clipPath:
                "polygon(0 0, calc(100% - 32px) 0, 100% 32px, 100% 100%, 32px 100%, 0 calc(100% - 32px))",
              transformStyle: "preserve-3d",
              transform: "translateZ(50px)",
              willChange: "transform",
              transition: "transform 0.4s ease, box-shadow 0.4s ease",
              overflow: "hidden",
            }}
          >
            {/* Inner Frame with Image */}
            <div
              style={{
                padding: "24px",
                background: "rgba(0,0,0,0.3)",
              }}
            >
              <div
                className="relative w-full aspect-square"
                style={{
                  borderRadius: "0",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#0D0D0D",
                  transformStyle: "preserve-3d",
                }}
              >
                <Image
                  src={slide.image}
                  alt={`Featured product: ${slide.tagline}`}
                  width={360}
                  height={460}
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-contain"
                  style={{
                    width: "100%",
                    height: "auto",
                    maxHeight: "400px",
                    objectFit: "contain",
                  }}
                  priority={currentSlide === 0}
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFhAJ/wlseKgAAAABJRU5ErkJggg=="
                />
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Bottom Tagline Bar */}
      <div
        className="bottom-bar"
        style={{
          padding: "24px 48px",
          borderTop: "1px solid rgba(22, 101, 52, 0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          transformStyle: "preserve-3d",
          willChange: "transform, opacity",
          animation: prefersReducedMotion
            ? "none"
            : "fadeSlideIn 0.6s ease-out 2.5s forwards",
          opacity: prefersReducedMotion ? 1 : 0,
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-oswald), Oswald, sans-serif",
            fontSize: "14px",
            letterSpacing: "3px",
            color: "#888888",
            textTransform: "uppercase",
          }}
        >
          BUILT FOR <span style={{ color: "#166534" }}>ATHLETES</span>. PROVEN BY{" "}
          <span style={{ color: "#166534" }}>GAINS</span>
        </div>

        {/* Slide Indicators */}
        <div className="slide-indicators" style={{ display: "flex", gap: "12px" }}>
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className="indicator"
              style={{
                height: index === currentSlide ? "8px" : "3px",
                width: index === currentSlide ? "32px" : "12px",
                backgroundColor:
                  index === currentSlide ? "#166534" : "rgba(22, 101, 52, 0.4)",
                border: "none",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() =>
          setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
        }
        className="nav-arrow nav-arrow-prev"
        aria-label="Previous slide"
        style={{
          position: "absolute",
          left: "24px",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 20,
          width: "48px",
          height: "48px",
          background: "rgba(13, 13, 13, 0.9)",
          border: "1px solid rgba(22, 101, 52, 0.3)",
          color: "#166534",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          transition: "all 0.3s ease",
        }}
      >
        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
        className="nav-arrow nav-arrow-next"
        aria-label="Next slide"
        style={{
          position: "absolute",
          right: "24px",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 20,
          width: "48px",
          height: "48px",
          background: "rgba(13, 13, 13, 0.9)",
          border: "1px solid rgba(22, 101, 52, 0.3)",
          color: "#166534",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          transition: "all 0.3s ease",
        }}
      >
        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* CSS Animations */}
      <style>{`
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

        .nav-arrow:hover {
          background: rgba(22, 101, 52, 0.2) !important;
          border-color: #166534 !important;
          transform: translateY(-50%) scale(1.05);
        }

        .nav-arrow:focus-visible {
          outline: 2px solid #166534;
          outline-offset: 2px;
        }

        .cta-button {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 20px 32px;
          background: #166534;
          color: #0D0D0D;
          font-family: var(--font-bebas), Bebas Neue, sans-serif;
          font-size: 20px;
          letter-spacing: 4px;
          text-transform: uppercase;
          text-decoration: none;
          clip-path: polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px));
          transform: translateZ(30px);
          will-change: transform;
          transition: transform 0.3s ease, color 0.3s ease, background 0.3s ease;
        }

        .cta-button:hover {
          transform: translateZ(30px) rotateX(5deg);
          color: #22C55E;
        }

        .cta-button:focus-visible {
          outline: 2px solid #22C55E;
          outline-offset: 2px;
        }

        .floating-badge {
          background: rgba(22, 101, 52, 0.15);
          border: 1px solid #166534;
          padding: 8px 16px;
          font-size: 11px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #22C55E;
          transform: translateZ(20px);
          will-change: transform;
          transition: transform 0.3s ease;
          outline: none;
        }

        .floating-badge:hover,
        .floating-badge:focus {
          transform: translateZ(30px) scale(1.05);
          outline: 2px solid #166534;
          outline-offset: 2px;
        }

        .floating-badge:focus {
          outline: 2px solid #166534;
          outline-offset: 2px;
        }

        .hero-section {
          background-color: #0D0D0D;
          perspective: 1000px;
        }

        .hero-tag {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          font-size: 13px;
          letter-spacing: 4px;
          color: #166534;
          text-transform: uppercase;
          margin-bottom: 24px;
          transform: translateZ(30px);
          will-change: transform;
        }

        .hero-tag-line {
          width: 40px;
          height: 2px;
          background: #166534;
        }

        .hero-title {
          font-family: var(--font-bebas), Bebas Neue, sans-serif;
          font-size: clamp(56px, 8vw, 96px);
          line-height: 0.9;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: 24px;
          color: #FFFFFF;
          transform: translateZ(40px);
          will-change: transform;
        }

        .hero-title-accent {
          color: #166534;
          display: block;
        }

        .hero-subtitle {
          font-family: var(--font-oswald), Oswald, sans-serif;
          font-size: 18px;
          color: #888888;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: 48px;
          max-width: 480px;
          transform: translateZ(20px);
          will-change: transform;
        }

        .cta-group {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 24px;
        }

        .secondary-cta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-oswald), Oswald, sans-serif;
          font-size: 14px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #22C55E;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .trust-badge {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .trust-badge-text {
          font-size: 11px;
          letter-spacing: 1px;
          color: #888888;
          text-transform: uppercase;
        }

        .trust-badges {
          display: flex;
          gap: 24px;
          margin-top: 48px;
          padding-top: 32px;
          border-top: 1px solid rgba(22, 101, 52, 0.2);
        }

        .product-showcase {
          position: relative;
          transform-style: preserve-3d;
          will-change: transform;
        }

        .floating-badges-container {
          position: absolute;
          top: -20px;
          right: -20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          z-index: 10;
          transform: translateZ(20px);
          will-change: transform;
        }

        .product-frame {
          position: relative;
          background: linear-gradient(135deg, #1A1A1A 0%, rgba(26,26,26,0.8) 100%);
          border: 1px solid rgba(22, 101, 52, 0.2);
          clip-path: polygon(0 0, calc(100% - 32px) 0, 100% 32px, 100% 100%, 32px 100%, 0 calc(100% - 32px));
          transform-style: preserve-3d;
          transform: translateZ(50px);
          will-change: transform;
          transition: transform 0.4s ease, box-shadow 0.4s ease;
          overflow: hidden;
        }

        .product-frame-inner {
          padding: 24px;
          background: rgba(0,0,0,0.3);
        }

        .product-image-container {
          position: relative;
          width: 100%;
          aspect: square;
          border-radius: 0;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #0D0D0D;
          transform-style: preserve-3d;
        }

        .product-label {
          background: #166534;
          padding: 16px 24px;
          clip-path: polygon(0 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%);
        }

        .product-label-text {
          font-family: var(--font-bebas), Bebas Neue, sans-serif;
          font-size: 18px;
          color: #0D0D0D;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        .bottom-bar {
          padding: 24px 48px;
          border-top: 1px solid rgba(22, 101, 52, 0.1);
          display: flex;
          align-items: center;
          justify-content: space-between;
          transform-style: preserve-3d;
          will-change: transform, opacity;
        }

        .bottom-bar-text {
          font-family: var(--font-oswald), Oswald, sans-serif;
          font-size: 14px;
          letter-spacing: 3px;
          color: #888888;
          text-transform: uppercase;
        }

        .bottom-bar-accent {
          color: #166534;
        }

        .slide-indicators {
          display: flex;
          gap: 12px;
        }

        .indicator {
          height: 3px;
          width: 12px;
          background-color: rgba(22, 101, 52, 0.4);
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .indicator.active {
          height: 8px;
          width: 32px;
          background-color: #166534;
        }

        .nav-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 20;
          width: 48px;
          height: 48px;
          background: rgba(13, 13, 13, 0.9);
          border: 1px solid rgba(22, 101, 52, 0.3);
          color: #166534;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .nav-arrow-prev {
          left: 24px;
        }

        .nav-arrow-next {
          right: 24px;
        }

        .hero-content {
          transform-style: preserve-3d;
          will-change: transform, opacity;
        }

        .hero-container {
          position: relative;
          overflow: hidden;
        }

        .perspective-grid {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          overflow: hidden;
          will-change: transform;
          transition: transform 0.1s ease-out;
        }

        .angle-decoration {
          position: absolute;
          top: 0;
          right: 0;
          width: 400px;
          height: 100%;
          overflow: hidden;
          pointer-events: none;
          opacity: 0.08;
        }

        .angle-decoration-inner {
          position: absolute;
          top: -50%;
          right: -100px;
          width: 300px;
          height: 200%;
          background: #166534;
          transform: skewX(-20deg);
        }

        .angle-decoration-line {
          position: absolute;
          top: 0;
          right: 80px;
          width: 4px;
          height: 100%;
          background: #166534;
          transform: skewX(-10deg);
          opacity: 0.6;
        }

        .hero-main-content {
          position: relative;
          z-index: 10;
          container mx-auto px-4 md:px-8 py-12 md:py-20;
          min-height: 80vh;
          display: grid;
          grid-template-columns: 1fr 400px;
          gap: 80px;
          align-items: center;
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

        @media (max-width: 1024px) {
          .hero-main-content {
            grid-template-columns: 1fr !important;
            gap: 48px !important;
          }
        }

        @media (max-width: 768px) {
          .bottom-bar {
            flex-direction: column !important;
            gap: 16px !important;
            text-align: center !important;
            padding: 24px 16px !important;
          }
        }
      `}</style>
    </section>
  );
}
