"use client";

import { useRef, useState } from "react";
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
}

export function ImageGallery({ images, productName }: ImageGalleryProps) {
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

  if (!images || images.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center" style={{ background: "#FAFAF8" }}>
        <div className="flex h-20 w-20 items-center justify-center rounded-full" style={{ background: "rgba(46,125,50,0.1)" }}>
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

  const hasMultiple = images.length > 1;

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
          src={images[selectedIndex]}
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
          {images.map((image, idx) => (
            <motion.button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className="relative shrink-0 overflow-hidden rounded-lg border-2 transition-colors"
              style={{
                width: "4rem",
                height: "4rem",
                border: idx === selectedIndex
                  ? "2px solid #2E7D32"
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