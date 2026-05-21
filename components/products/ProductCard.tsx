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
import { ShoppingBag, Zap } from "lucide-react";

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
  PROTEIN: "#14532D",
  MASS_GAINER: "#14532D",
  OMEGA_3: "#14532D",
  MULTIVITAMIN: "#E8A020",
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
  const accent = CATEGORY_ACCENT[category] ?? "#14532D";

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: 900 }}
    >
      <Link href={`/products/${slug}`} className="block" tabIndex={-1}>
        <motion.div
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={handleMouseLeave}
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
            boxShadow: isHovered
              ? `0 ${shadowY.get()}px ${shadowBlur.get()}px rgba(0,0,0,0.12), 0 4px 20px rgba(201,168,76,0.08)`
              : "0 2px 12px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.02)",
          }}
          className="relative rounded-2xl overflow-hidden cursor-pointer luxury-card"
          transition={{ type: "spring", stiffness: 280, damping: 28 }}
        >
          {/* ── 3D Image Stage ── */}
          <div
            className="relative overflow-hidden"
            style={{
              aspectRatio: "1 / 1",
              background: "linear-gradient(135deg, #FAF8F5 0%, #FFFFFF 50%, #F5F1EB 100%)",
            }}
          >
            {/* Subtle ambient glow — refined, not overpowering */}
            <motion.div
              className="absolute inset-0"
              animate={{
                background: isHovered
                  ? `radial-gradient(50% 50% at 50% 55%, ${accent}18 0%, transparent 70%)`
                  : `radial-gradient(35% 35% at 50% 55%, ${accent}0A 0%, transparent 70%)`,
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
                      ? "drop-shadow(0 16px 32px rgba(0,0,0,0.2)) drop-shadow(0 2px 8px rgba(0,0,0,0.1))"
                      : "drop-shadow(0 6px 16px rgba(0,0,0,0.08))",
                    transition: "filter 0.3s ease",
                  }}
                />
              </div>
            </motion.div>

            {/* Bottom edge accent line */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-[1.5px]"
              style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
              animate={{ opacity: isHovered ? 1 : 0.4 }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* ── Card Content ── */}
          <div
            className="p-5 luxury-card"
            style={{
              background: "#FFFFFF",
            }}
          >
            {/* Top badges - refined positioning */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {featured && (
                  <motion.span
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider"
                    style={{
                      background: "linear-gradient(135deg, #E8A020 0%, #D4920A 100%)",
                      color: "#FFFFFF",
                      border: "1px solid rgba(232, 160, 32, 0.3)",
                      fontFamily: "var(--font-jakarta)",
                    }}
                  >
                    <Zap className="w-2.5 h-2.5" />
                    Featured
                  </motion.span>
                )}
                {hasDiscount && (
                  <span
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider"
                    style={{
                      background: "transparent",
                      color: "#14532D",
                      border: "1px solid rgba(20, 83, 45, 0.25)",
                      fontFamily: "var(--font-jakarta)",
                    }}
                  >
                    Save {discountPercent}%
                  </span>
                )}
              </div>
              {variants.length > 1 && (
                <span
                  className="text-[10px] font-medium"
                  style={{ color: "#8A9E90", fontFamily: "var(--font-jakarta)" }}
                >
                  {variants.length} options
                </span>
              )}
            </div>

            {/* Category - refined pill with border */}
            <div className="mb-2">
              <span
                className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider"
                style={{
                  color: accent,
                  border: `1px solid ${accent}30`,
                  background: `${accent}08`,
                  fontFamily: "var(--font-jakarta)",
                }}
              >
                {categoryLabel}
              </span>
            </div>

            {/* Name - Rajdhani uppercase with refined tracking */}
            <h3
              className="luxury-heading mb-2 leading-tight line-clamp-2"
              style={{
                fontSize: "17px",
                letterSpacing: "0.06em",
                color: "#0B0F0C",
              }}
            >
              {name}
            </h3>

            {/* Description */}
            <p
              className="text-xs line-clamp-2 leading-relaxed mb-4"
              style={{ color: "#6B7B6F", fontFamily: "var(--font-jakarta)" }}
            >
              {description}
            </p>

            {/* Price row */}
            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-2">
                <span className="luxury-price" style={{ fontSize: "22px", color: "#1A1A1A" }}>
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
                className="flex items-center justify-center w-10 h-10 rounded-xl transition-colors"
                style={{
                  background: isHovered ? accent : "transparent",
                  border: `1.5px solid ${isHovered ? accent : `${accent}40`}`,
                }}
                whileTap={{ scale: 0.88 }}
                aria-label={`Add ${name} to cart`}
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
