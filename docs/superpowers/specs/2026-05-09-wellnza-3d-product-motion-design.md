# Wellnza 3D Product Motion — Design Spec

**Date:** 2026-05-09
**Status:** Approved (Option A — Subtle & Premium)
**Project:** well-nz-nutrition

---

## 1. Overview

Add premium 3D motion effects to product images using existing Framer Motion + CSS transforms. Target: subtle, luxury feel with soft parallax, gentle float, and minimal 3D tilt.

**Selected Style — Subtle & Premium:**
- 5-10% scale on scroll parallax
- 3D card tilt (3-5° max)
- Ambient product float (2px oscillation)
- 0.3s ease transitions

---

## 2. Animation System

### 2.1 Ambient Product Float
- **Target:** Product images on homepage hero, product cards, and detail page
- **Effect:** Continuous subtle Y-axis oscillation (2px, 3s loop)
- **Implementation:** CSS keyframes + Framer Motion `animate`

```css
@keyframes productFloat {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-4px); }
}
```

### 2.2 Scroll Parallax
- **Target:** Hero section product images, category section images
- **Effect:** 5-10% vertical parallax on scroll (image moves slower than viewport)
- **Implementation:** Framer Motion `useScroll` + `useTransform`

### 2.3 3D Card Tilt
- **Target:** Product cards on listing page
- **Effect:** 3-5° rotation on mouse move (X and Y axes)
- **Existing Code:** ProductCard.tsx already has Framer Motion tilt — enhance with:
  - Reduced rotation range (currently 8-10°, tighten to 3-5°)
  - Add `translateZ(20px)` for depth
  - Smooth spring physics (stiffness: 300, damping: 30)

### 2.4 Hover Depth Shadow
- **Target:** Product cards
- **Effect:** Shadow intensifies + slight Y lift on hover
- **Values:** shadowBlur 40→12, shadowY 20→4, 0.3s transition

### 2.5 Glare Reflection
- **Target:** Product card images
- **Effect:** Radial gradient follows mouse position (already partially implemented)
- **Enhancement:** Smooth transition, opacity 0→0.15 on hover

---

## 3. Component Changes

### 3.1 ProductCard.tsx
**File:** `components/products/ProductCard.tsx`
**Changes:**
- Tighten rotateX/rotateY range: `[-0.5, 0.5] → [3, -3]` degrees
- Reduce imgX/imgY parallax range: `[-6, 6] → [-3, 3]`
- Add ambient float animation to product image container
- Enhance glare effect opacity

### 3.2 globals.css
**File:** `app/globals.css`
**Changes:**
- Add `product-float` keyframe animation
- Add `parallax-container` utility class
- Add `depth-shadow` utility for hover states

### 3.3 Homepage Hero (page.tsx)
**File:** `app/(store)/page.tsx`
**Changes:**
- Add scroll-linked parallax to hero product float
- Enhance HeroProductFloat component with ambient animation

### 3.4 ImageGallery.tsx
**File:** `components/products/ImageGallery.tsx`
**Changes:**
- Add subtle 3D tilt on main image hover
- Add micro-parallax on thumbnail hover

---

## 4. Performance Considerations

- All animations use `transform` and `opacity` only (GPU-accelerated)
- No layout thrashing
- `will-change: transform` on animated elements
- Respect `prefers-reduced-motion` media query (already in globals.css)
- Animations are subtle to minimize CPU/GPU impact

---

## 5. Files to Modify

| File | Change |
|------|--------|
| `components/products/ProductCard.tsx` | Enhance 3D tilt, tighten ranges, add float |
| `app/globals.css` | Add float animation, utility classes |
| `app/(store)/page.tsx` | Add scroll parallax to hero |
| `components/products/ImageGallery.tsx` | Add tilt to gallery images |

---

## 6. Success Criteria

- [ ] Product cards have subtle 3D tilt (3-5° max) on hover
- [ ] Product images have ambient float animation (2px oscillation)
- [ ] Hero section has gentle scroll parallax
- [ ] Shadows deepen smoothly on card hover
- [ ] Glare effect follows mouse smoothly
- [ ] All transitions are 0.3s ease
- [ ] `prefers-reduced-motion` is respected
- [ ] Build passes without errors