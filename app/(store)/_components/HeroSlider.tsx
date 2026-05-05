"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

const slides = [
  {
    id: 1,
    image: "https://cdn.zyrosite.com/cdn-cgi/image/format=auto,w=768,h=960,fit=crop,q=100/cdn-ecommerce/store_01KJVXS44M9NNG532TH40JSYHE/assets/d1ad28f5-ec9b-4d62-ba5c-91be9ef209d1.png",
    tagline: "Crafted for Performance, Rooted in Nature",
    subtagline: "Premium sports nutrition formulated with pure Maharashtra ingredients for athletes who demand the best.",
    cta: "Explore Products",
    href: "/products",
  },
  {
    id: 2,
    image: "https://cdn.zyrosite.com/cdn-cgi/image/format=auto,w=768,h=960,fit=crop,q=100/cdn-ecommerce/store_01KJVXS44M9NNG532TH40JSYHE/assets/d1ad28f5-ec9b-4d62-ba5c-91be9ef209d1.png",
    tagline: "Fuel Your Goals",
    subtagline: "Science-backed supplements for serious athletes who refuse to compromise.",
    cta: "View Products",
    href: "/products?category=PROTEIN",
  },
  {
    id: 3,
    image: "https://cdn.zyrosite.com/cdn-cgi/image/format=auto,w=768,h=960,fit=crop,q=100/cdn-ecommerce/store_01KJVXS44M9NNG532TH40JSYHE/assets/d1ad28f5-ec9b-4d62-ba5c-91be9ef209d1.png",
    tagline: "Performance Redefined",
    subtagline: "Trusted by champions who know the difference pure ingredients make.",
    cta: "Learn More",
    href: "/about",
  },
];

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const slide = slides[currentSlide];

  return (
    <section className="relative overflow-hidden" style={{ backgroundColor: "#FAFAF5" }}>
      {/* Subtle radial sage gradient background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at top right, rgba(134, 168, 115, 0.08) 0%, transparent 50%)",
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          {/* Left Column - 55% */}
          <div className="w-full lg:w-[55%] order-2 lg:order-1">
            {/* Badge - fadeInUp animation */}
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 md:mb-8"
              style={{ backgroundColor: "rgba(134, 168, 115, 0.15)" }}
              data-animate="fadeInUp"
            >
              <span
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: "#166534" }}
              />
              <span className="text-sm font-medium" style={{ color: "#166534" }}>
                NZ Made & Sourced
              </span>
            </div>

            {/* Headline - fadeInUp animation */}
            <h1
              className="text-4xl md:text-5xl lg:text-6xl leading-tight mb-6 md:mb-8"
              style={{
                fontFamily: "var(--font-playfair), Playfair Display, serif",
                color: "#166534",
              }}
              data-animate="fadeInUp"
              data-delay="0.1"
            >
              Crafted for Performance,{" "}
              <em style={{ fontStyle: "italic", color: "#86A873" }}>Rooted in Nature</em>
            </h1>

            {/* Subtitle - fadeInUp animation */}
            <p
              className="text-lg md:text-xl mb-8 md:mb-10 max-w-[480px]"
              style={{
                fontFamily: "var(--font-cormorant), Cormorant Garamond, serif",
                color: "#6B6B6B",
              }}
              data-animate="fadeInUp"
              data-delay="0.2"
            >
              {slide.subtagline}
            </p>

            {/* CTA Group - fadeInUp animation */}
            <div
              className="flex flex-wrap items-center gap-4 md:gap-6"
              data-animate="fadeInUp"
              data-delay="0.3"
            >
              {/* Primary CTA */}
              <Link
                href={slide.href}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                style={{
                  fontFamily: "var(--font-raleway), Raleway, sans-serif",
                  backgroundColor: "#166534",
                  color: "#FAFAF5",
                }}
              >
                {slide.cta}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>

              {/* Secondary CTA */}
              <Link
                href="/about"
                className="inline-flex items-center gap-2 font-medium transition-colors duration-300"
                style={{
                  fontFamily: "var(--font-raleway), Raleway, sans-serif",
                  color: "#166534",
                }}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Our Story
              </Link>
            </div>
          </div>

          {/* Right Column - 45% */}
          <div className="w-full lg:w-[45%] order-1 lg:order-2 flex justify-center lg:justify-end">
            {/* Organic Frame Container */}
            <div className="relative w-[320px] h-[400px] md:w-[380px] md:h-[480px] lg:w-[420px] lg:h-[520px]">
              {/* Outer Morphing Frame */}
              <div
                className="absolute inset-0 animate-morph"
                style={{
                  backgroundColor: "rgba(134, 168, 115, 0.08)",
                  borderRadius: "60% 40% 55% 45% / 50% 60% 40% 50%",
                }}
              />

              {/* Second Organic Frame */}
              <div
                className="absolute inset-[15px] animate-morph-reverse"
                style={{
                  background: "linear-gradient(135deg, rgba(134, 168, 115, 0.3) 0%, rgba(134, 168, 115, 0.15) 100%)",
                  borderRadius: "45% 55% 40% 60% / 55% 45% 55% 45%",
                }}
              />

              {/* Inner Frame with Product Image */}
              <div
                className="absolute inset-[30px] rounded-[50px] md:rounded-[60px] overflow-hidden flex items-center justify-center"
                style={{ backgroundColor: "#FAFAF5" }}
              >
                <Image
                  src={slide.image}
                  alt={slide.tagline}
                  width={360}
                  height={460}
                  className="object-cover w-full h-full"
                  priority={currentSlide === 0}
                />
              </div>

              {/* Floating Badge - Lab Tested */}
              <div
                className="absolute -top-2 -right-2 md:top-0 md:right-0 animate-float bg-white rounded-full px-4 py-2 shadow-lg flex items-center gap-2"
                data-animate="fadeInUp"
                data-delay="0.4"
              >
                <svg className="w-5 h-5" style={{ color: "#166534" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm font-medium" style={{ color: "#166534" }}>
                  Lab Tested
                </span>
              </div>

              {/* Floating Badge - Pure Ingredients */}
              <div
                className="absolute -bottom-2 -left-2 md:bottom-0 md:left-0 animate-float-delayed bg-white rounded-full px-4 py-2 shadow-lg flex items-center gap-2"
                data-animate="fadeInUp"
                data-delay="0.5"
              >
                <svg className="w-5 h-5" style={{ color: "#166534" }} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66c.95-2.3 2.22-4.9 4.1-6.67 2.01 1.55 3.49 2.97 4.47 4.17.36-.71.75-1.47 1.17-2.29.98-1.92 1.58-3.45 1.87-4.51-.52.53-1.15.95-1.32 1.1zM12.89 5.11c.77.02 1.49.17 2.18.42-.52.53-1.15.95-1.32 1.1C13.21 6.17 13 5.57 12.89 5.11zM12 4c-.77-.02-1.49-.17-2.18-.42.52-.53 1.15-.95 1.32-1.1.54.47.74 1.07.86 1.52z" />
                </svg>
                <span className="text-sm font-medium" style={{ color: "#166534" }}>
                  Pure Ingredients
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "w-8"
                : "w-3 hover:w-5"
            }`}
            style={{
              backgroundColor: index === currentSlide ? "#166534" : "rgba(134, 168, 115, 0.4)",
            }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full transition-all duration-300 flex items-center justify-center"
        style={{
          backgroundColor: "rgba(250, 250, 245, 0.9)",
          color: "#166534",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
        aria-label="Previous slide"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full transition-all duration-300 flex items-center justify-center"
        style={{
          backgroundColor: "rgba(250, 250, 245, 0.9)",
          color: "#166534",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
        aria-label="Next slide"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes morphShape {
          0% {
            border-radius: 60% 40% 55% 45% / 50% 60% 40% 50%;
          }
          50% {
            border-radius: 45% 55% 40% 60% / 55% 45% 55% 45%;
          }
          100% {
            border-radius: 60% 40% 55% 45% / 50% 60% 40% 50%;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-morph {
          animation: morphShape 8s ease-in-out infinite;
        }

        .animate-morph-reverse {
          animation: morphShape 8s ease-in-out infinite reverse;
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float 4s ease-in-out infinite;
          animation-delay: 0.5s;
        }

        [data-animate="fadeInUp"] {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
        }

        [data-delay="0.1"] {
          animation-delay: 0.1s;
        }

        [data-delay="0.2"] {
          animation-delay: 0.2s;
        }

        [data-delay="0.3"] {
          animation-delay: 0.3s;
        }

        [data-delay="0.4"] {
          animation-delay: 0.4s;
        }

        [data-delay="0.5"] {
          animation-delay: 0.5s;
        }
      `}</style>
    </section>
  );
}
