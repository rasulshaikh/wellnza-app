"use client";

import Image from "next/image";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useRef, useState } from "react";

interface HeroProductFloatProps {
  imageSrc: string;
  imageAlt: string;
}

export function HeroProductFloat({ imageSrc, imageAlt }: HeroProductFloatProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springCfg = { stiffness: 200, damping: 25, mass: 0.6 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [4, -4]), springCfg);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), springCfg);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  return (
    <div className="w-full h-full" style={{ perspective: 1000 }}>
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
        animate={{
          y: [0, -6, 0],
        }}
        transition={{
          y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
        }}
        className="relative w-full h-full rounded-2xl overflow-hidden"
      >
        {/* Transparent glass background */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(240,248,240,0.12) 100%)",
            backdropFilter: "blur(8px)",
            borderRadius: "inherit",
          }}
        />

        {/* Glow that intensifies on hover */}
        <motion.div
          className="absolute inset-0"
          animate={{
            background: isHovered
              ? "radial-gradient(65% 65% at 50% 65%, rgba(232,160,32,0.28) 0%, transparent 70%)"
              : "radial-gradient(50% 50% at 50% 65%, rgba(232,160,32,0.14) 0%, transparent 70%)",
          }}
          transition={{ duration: 0.5 }}
        />

        {/* Product image with 3D depth offset */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center p-6"
          style={{ translateZ: 30, transformStyle: "preserve-3d" }}
        >
          <div className="relative w-full h-full">
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              className="object-contain"
              priority
              style={{
                filter: isHovered
                  ? "drop-shadow(0 30px 60px rgba(0,0,0,0.35)) drop-shadow(0 6px 16px rgba(232,160,32,0.25))"
                  : "drop-shadow(0 16px 32px rgba(0,0,0,0.22)) drop-shadow(0 2px 8px rgba(0,0,0,0.12))",
                transition: "filter 0.4s ease",
              }}
            />
          </div>
        </motion.div>

        {/* Surface glare */}
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-2xl"
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.22) 0%, transparent 50%)",
          }}
        />
      </motion.div>
    </div>
  );
}
