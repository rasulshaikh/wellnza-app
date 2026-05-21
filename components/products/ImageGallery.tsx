"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

interface ImageGalleryProps {
  images: string[];
  productName: string;
  /** Which variant index is selected — gallery resets to that variant's first image */
  variantHint?: number;
  /** All variants — used to filter images by flavor when variant changes */
  variants?: { id: string; flavor: string; size: string | null; price: number }[];
}

export function ImageGallery({ images, productName, variantHint = 0, variants }: ImageGalleryProps) {
  const imageRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Mouse-tracking motion values — subtle 2-3° max
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springCfg = { stiffness: 400, damping: 30, mass: 0.5 };
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-2.5, 2.5]), springCfg);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [2.5, -2.5]), springCfg);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = imageRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Filter images by selected variant's flavor name
  const filteredImages = (() => {
    if (!variants || variants.length <= 1) return images;
    const selectedVariant = variants[variantHint];
    if (!selectedVariant) return images;
    const flavorLower = selectedVariant.flavor.toLowerCase();
    // Split flavor into words and check if any word from the flavor appears in filename
    // This handles cases like "Alphonso Mango" matching "alphanso-mango front.png"
    const flavorWords = flavorLower.split(/\s+/);
    const variantImages = images.filter(img => {
      const nameLower = img.toLowerCase();
      // Check if any flavor word appears in the image filename
      return flavorWords.some(word => nameLower.includes(word));
    });
    return variantImages.length > 0 ? variantImages : images;
  })();

  // When variantHint changes, reset to first image of the new variant
  useEffect(() => {
    setSelectedIndex(0);
  }, [variantHint]);

  if (!images || images.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center" style={{ background: "#FAFAF8" }}>
        <div className="flex h-20 w-20 items-center justify-center rounded-full" style={{ background: "rgba(20,83,45,0.1)" }}>
          <span className="text-sm font-medium" style={{ color: "#7B9E6B" }}>
            {productName
              .split(" ")
              .map((w) => w[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </span>
        </div>
      </div>
    );
  }

  const hasMultiple = filteredImages.length > 1;

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <motion.div
        ref={imageRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          perspective: 800,
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          background: "#FAFAF8",
        }}
        className="relative aspect-square overflow-hidden rounded-xl"
      >
        <Image
          src={filteredImages[selectedIndex]}
          alt={`${productName} - Image ${selectedIndex + 1}`}
          fill
          className="object-cover product-3d"
          priority
          sizes="(max-width: 768px) 100vw, 60vw"
        />
      </motion.div>

      {/* Thumbnails */}
      {hasMultiple && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {filteredImages.map((image, idx) => (
            <motion.button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className="relative shrink-0 overflow-hidden rounded-lg border-2 transition-colors"
              style={{
                width: "4rem",
                height: "4rem",
                border: idx === selectedIndex
                  ? "2px solid #14532D"
                  : "2px solid transparent",
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Image
                src={image}
                alt={`${productName} - Thumbnail ${idx + 1}`}
                fill
                className="object-cover"
                sizes="64px"
              />
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}
