"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface HeroCarouselImage {
  src: string;
  alt: string;
  slug: string;
}

interface HeroCarouselProps {
  images: HeroCarouselImage[];
}

export function HeroCarousel({ images }: HeroCarouselProps) {
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (images.length <= 1) return;
    intervalRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % images.length);
    }, 4000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [images.length]);

  if (images.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <span className="text-6xl font-bold" style={{ fontFamily: "var(--font-rajdhani)", color: "#E8A020" }}>W</span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {/* Image layers with crossfade */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <Link
            href={`/products/${images[current].slug}`}
            className="block w-full h-full"
            aria-label={`View ${images[current].alt}`}
          >
            <Image
              src={images[current].src}
              alt={images[current].alt}
              fill
              className="object-contain"
              priority
              style={{
                filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.3)) drop-shadow(0 4px 12px rgba(232,160,32,0.15))",
              }}
            />
          </Link>
        </motion.div>
      </AnimatePresence>

      {/* Dot indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setCurrent(i);
                if (intervalRef.current) clearInterval(intervalRef.current);
                intervalRef.current = setInterval(() => {
                  setCurrent((c) => (c + 1) % images.length);
                }, 4000);
              }}
              className="w-2 h-2 rounded-full transition-all duration-300"
              style={{
                background: i === current ? "#E8A020" : "rgba(232,160,32,0.3)",
                transform: i === current ? "scale(1.4)" : "scale(1)",
              }}
              aria-label={`View product ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}