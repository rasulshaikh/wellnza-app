"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { formatCurrency } from "@/lib/utils";
import { ShoppingBag, ArrowUpRight, Zap } from "lucide-react";

interface ProductVariant {
  id: string;
  flavor: string;
  size: string | null;
  price: number;
  sku: string;
  weightG: number | null;
}

interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  basePrice: number;
  comparePrice: number | null;
  images: string[];
  featured?: boolean;
  variants?: ProductVariant[];
}

const CATEGORY_LABELS: Record<string, string> = {
  PRE_WORKOUT: "Pre-Workout",
  PROTEIN: "Protein",
  MASS_GAINER: "Mass Gainer",
  OMEGA_3: "Omega-3",
  MULTIVITAMIN: "Multivitamin",
};

const CATEGORY_ACCENT: Record<string, string> = {
  PRE_WORKOUT: "#E8A020",
  PROTEIN: "#2E7D32",
  MASS_GAINER: "#1565C0",
  OMEGA_3: "#0097A7",
  MULTIVITAMIN: "#6A1B9A",
};

export function ProductCard({
  name,
  slug,
  description,
  category,
  basePrice,
  comparePrice,
  images,
  featured,
  variants = [],
}: ProductCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse-tracking motion values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring config for smooth, physical feel
  const springCfg = { stiffness: 300, damping: 30, mass: 0.5 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [3, -3]), springCfg);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), springCfg);
  const imgX = useSpring(useTransform(mouseX, [-0.5, 0.5], [-3, 3]), springCfg);
  const imgY = useSpring(useTransform(mouseY, [-0.5, 0.5], [-3, 3]), springCfg);
  const glareX = useTransform(mouseX, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(mouseY, [-0.5, 0.5], ["0%", "100%"]);
  const shadowBlur = useSpring(isHovered ? 40 : 12, springCfg);
  const shadowY = useSpring(isHovered ? 20 : 4, springCfg);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  const displayPrice = variants[0]?.price ?? basePrice;
  const hasDiscount = comparePrice && comparePrice > basePrice;
  const discountPercent = hasDiscount
    ? Math.round(((comparePrice - basePrice) / comparePrice) * 100)
    : 0;

  const primaryImage = images[0];
  const fallback = `https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=600&fit=crop`;
  const imageSrc = imageError || !primaryImage ? fallback : primaryImage;
  const categoryLabel = CATEGORY_LABELS[category] ?? category;
  const accent = CATEGORY_ACCENT[category] ?? "#2E7D32";

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: 900 }}
    >
      <Link href={`/products/${slug}`} className="block" tabIndex={-1}>
        <motion.div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={handleMouseLeave}
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
            boxShadow: isHovered
              ? `0 ${shadowY.get()}px ${shadowBlur.get()}px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.08)`
              : "0 4px 12px rgba(0,0,0,0.07)",
          }}
          className="relative rounded-2xl overflow-hidden cursor-pointer"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {/* ── 3D Image Stage ── */}
          <div
            className="relative overflow-hidden"
            style={{
              aspectRatio: "1 / 1",
              // Transparent glass gradient background — lets product pop
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.92) 0%, rgba(240,248,240,0.85) 50%, rgba(255,255,255,0.9) 100%)",
              backdropFilter: "blur(12px)",
            }}
          >
            {/* Ambient radial glow behind product */}
            <motion.div
              className="absolute inset-0"
              animate={{
                background: isHovered
                  ? `radial-gradient(60% 60% at 50% 60%, ${accent}22 0%, transparent 70%)`
                  : `radial-gradient(40% 40% at 50% 60%, ${accent}11 0%, transparent 70%)`,
              }}
              transition={{ duration: 0.4 }}
            />

            {/* Product image — floats in 3D */}
            <motion.div
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              style={{
                x: imgX,
                y: imgY,
                translateZ: 20,
                transformStyle: "preserve-3d",
              }}
              className="absolute inset-0 flex items-center justify-center p-4"
            >
              <div className="relative w-full h-full">
                <Image
                  src={imageSrc}
                  alt={name}
                  fill
                  className="object-contain drop-shadow-2xl"
                  onError={() => setImageError(true)}
                  sizes="(max-width: 768px) 50vw, 25vw"
                  style={{
                    filter: isHovered
                      ? "drop-shadow(0 20px 40px rgba(0,0,0,0.25)) drop-shadow(0 4px 12px rgba(0,0,0,0.15))"
                      : "drop-shadow(0 8px 20px rgba(0,0,0,0.12))",
                    transition: "filter 0.3s ease",
                  }}
                />
              </div>
            </motion.div>

            {/* Glare reflection */}
            <motion.div
              className="pointer-events-none absolute inset-0 rounded-t-2xl opacity-0 group-hover:opacity-100"
              style={{
                background: `radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.15) 0%, transparent 60%)`,
                opacity: isHovered ? 0.15 : 0,
                transition: "opacity 0.3s",
              }}
            />

            {/* Top badges */}
            <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
              {featured && (
                <motion.span
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase"
                  style={{ background: "#E8A020", color: "#0B0F0C" }}
                >
                  <Zap className="w-2.5 h-2.5" />
                  Featured
                </motion.span>
              )}
              {hasDiscount && (
                <span
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase"
                  style={{ background: "#14532D", color: "#F7F3EC" }}
                >
                  Save {discountPercent}%
                </span>
              )}
            </div>

            {/* Hover overlay with CTA */}
            <motion.div
              className="absolute inset-0 flex items-end justify-between p-3 z-10"
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.2 }}
              style={{
                background: "linear-gradient(to top, rgba(11,15,12,0.65) 0%, transparent 55%)",
              }}
            >
              <span
                className="text-[11px] font-bold uppercase tracking-widest"
                style={{ color: "rgba(247,243,236,0.92)", fontFamily: "var(--font-jakarta)" }}
              >
                View Details
              </span>
              <motion.span
                className="flex items-center justify-center w-8 h-8 rounded-full"
                style={{ background: accent, color: "#fff" }}
                animate={{ scale: isHovered ? 1 : 0.7, opacity: isHovered ? 1 : 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <ArrowUpRight className="w-4 h-4" />
              </motion.span>
            </motion.div>

            {/* Bottom edge accent line */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-[2px]"
              style={{ background: accent }}
              animate={{ scaleX: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              initial={{ scaleX: 0, transformOrigin: "left" }}
            />
          </div>

          {/* ── Card Content ── */}
          <div
            className="p-4"
            style={{
              background: "#FFFFFF",
              borderTop: `1px solid rgba(0,0,0,0.06)`,
            }}
          >
            {/* Category + variants */}
            <div className="flex items-center justify-between mb-2">
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider"
                style={{
                  background: `${accent}15`,
                  color: accent,
                  border: `1px solid ${accent}30`,
                  fontFamily: "var(--font-jakarta)",
                }}
              >
                {categoryLabel}
              </span>
              {variants.length > 1 && (
                <span
                  className="text-[10px] font-semibold"
                  style={{ color: "#8A9E90", fontFamily: "var(--font-jakarta)" }}
                >
                  {variants.length} options
                </span>
              )}
            </div>

            {/* Name */}
            <h3
              className="font-bold leading-tight mb-1 line-clamp-2"
              style={{
                fontFamily: "var(--font-rajdhani,'Rajdhani',sans-serif)",
                fontSize: "16px",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                color: "#0B0F0C",
              }}
            >
              {name}
            </h3>

            {/* Description */}
            <p
              className="text-xs line-clamp-2 leading-relaxed mb-3"
              style={{ color: "#6B7B6F", fontFamily: "var(--font-jakarta)" }}
            >
              {description}
            </p>

            {/* Price row */}
            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-1.5">
                <span
                  className="font-bold"
                  style={{
                    fontFamily: "var(--font-rajdhani,'Rajdhani',sans-serif)",
                    fontSize: "18px",
                    color: "#14532D",
                  }}
                >
                  {formatCurrency(displayPrice)}
                </span>
                {hasDiscount && (
                  <span
                    className="text-xs line-through"
                    style={{ color: "#A8B5AC", fontFamily: "var(--font-jakarta)" }}
                  >
                    {formatCurrency(comparePrice)}
                  </span>
                )}
              </div>

              <motion.button
                className="flex items-center justify-center w-9 h-9 rounded-xl transition-colors"
                style={{
                  background: isHovered ? accent : `${accent}15`,
                  border: `1.5px solid ${accent}40`,
                }}
                whileTap={{ scale: 0.88 }}
                aria-label={`View ${name}`}
              >
                <ShoppingBag
                  className="w-4 h-4 transition-colors"
                  style={{ color: isHovered ? "#fff" : accent }}
                />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}
