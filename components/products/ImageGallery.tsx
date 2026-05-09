"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ImageGalleryProps {
  images: string[];
  productName: string;
}

export function ImageGallery({ images, productName }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

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
      <div className="relative aspect-square overflow-hidden rounded-xl" style={{ background: "#FAFAF8" }}>
        <Image
          src={images[selectedIndex]}
          alt={`${productName} - Image ${selectedIndex + 1}`}
          fill
          className="object-cover product-3d"
          priority
          sizes="(max-width: 768px) 100vw, 60vw"
        />
      </div>

      {/* Thumbnails */}
      {hasMultiple && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((image, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={cn(
                "relative size-16 shrink-0 overflow-hidden rounded-lg border-2 transition-colors",
                idx === selectedIndex
                  ? "border-[#2E7D32]"
                  : "border-transparent hover:border-[rgba(46,125,50,0.3)]"
              )}
            >
              <Image
                src={image}
                alt={`${productName} - Thumbnail ${idx + 1}`}
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}