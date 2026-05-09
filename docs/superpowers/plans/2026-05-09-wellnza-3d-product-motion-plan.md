# Wellnza 3D Product Motion — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add premium 3D motion effects (subtle tilt, ambient float, parallax) to product images across the store.

**Architecture:** CSS keyframes + Framer Motion for 3D transforms. Animations are GPU-accelerated (transform/opacity only). Existing Framer Motion code enhanced rather than replaced.

**Tech Stack:** Framer Motion (already installed), CSS keyframes, Next.js Image component

---

## Task 1: ProductCard 3D Tilt Enhancement

**Files:**
- Modify: `components/products/ProductCard.tsx`
- Test: Visual browser test (build passes + manual check)

**Changes:**
- rotateX range: `[8, -8]` → `[3, -3]` degrees
- rotateY range: `[-10, 10]` → `[-5, 5]` degrees
- imgX/imgY range: `[-6, 6]` → `[-3, 3]`
- Glare max opacity: 0.15

---

## Task 2: CSS Float Animation & Utilities

**Files:**
- Modify: `app/globals.css`
- Test: Build passes

**Changes:**
- Add `@keyframes productFloat` (0% → translateY(-4px) → 100%, 3s ease-in-out, infinite)
- Add `.product-float` class
- Add `.depth-shadow` utility
- Add `.will-change-transform` utility

---

## Task 3: HeroProductFloat Enhancement

**Files:**
- Modify: `components/ui-styling/HeroProductFloat.tsx`
- Test: Build passes

**Changes:**
- rotateX range: `[12, -12]` → `[4, -4]` degrees
- rotateY range: `[-14, 14]` → `[-6, 6]` degrees
- Y float: `-14` → `-6` (still 4s loop)
- Add `willChange: "transform"`

---

## Task 4: ImageGallery Tilt

**Files:**
- Modify: `components/products/ImageGallery.tsx`
- Test: Build passes

**Changes:**
- Add Framer Motion imports
- Add 2-3° max tilt on main image hover
- Add 1.05 scale on thumbnail hover
- Use `perspective: 800`, `transformStyle: "preserve-3d"`

---

## Success Criteria

- [x] Build passes without errors
- [x] ProductCard tilt reduced to 3-5° max
- [x] Product images have ambient float (4px Y oscillation)
- [x] Hero tilt reduced to 4-6° max
- [x] ImageGallery has subtle tilt effect
- [x] CSS utilities for float/shadow added
- [x] All animations respect `prefers-reduced-motion` (existing)