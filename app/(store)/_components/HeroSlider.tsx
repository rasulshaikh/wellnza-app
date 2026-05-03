"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const slides = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=1920&q=80",
    tagline: "Unleash Your Potential",
    subtagline: "Premium sports nutrition for peak performance",
    cta: "Shop Now",
    href: "/products",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1920&q=80",
    tagline: "Fuel Your Goals",
    subtagline: "Science-backed supplements for serious athletes",
    cta: "View Products",
    href: "/products?category=PROTEIN",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1920&q=80",
    tagline: "Performance Redefined",
    subtagline: "Trusted by champions worldwide",
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

  return (
    <section className="relative bg-[#1C1917] overflow-hidden">
      {/* Slides */}
      <div className="relative h-[500px] md:h-[600px]">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#1C1917]/90 via-[#1C1917]/70 to-transparent" />
            {/* Content */}
            <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
              <div className="max-w-xl">
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight" style={{ fontFamily: "var(--font-playfair), Playfair Display, serif" }}>
                  {slide.tagline}
                </h1>
                <p className="text-lg md:text-xl text-white/80 mb-8" style={{ fontFamily: "var(--font-cormorant), Cormorant Garamond, serif" }}>
                  {slide.subtagline}
                </p>
                <Link
                  href={slide.href}
                  className="inline-block bg-[#166534] text-white px-8 py-4 font-semibold hover:bg-[#14532D] transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                  style={{ fontFamily: "var(--font-raleway), Raleway, sans-serif" }}
                >
                  {slide.cta}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-white w-8"
                : "bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 flex items-center justify-center"
        aria-label="Previous slide"
      >
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 flex items-center justify-center"
        aria-label="Next slide"
      >
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </section>
  );
}
