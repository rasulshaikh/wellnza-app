import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl">
          <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            About Well NZ Nutrition
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            We are a New Zealand-based sports nutrition company dedicated to helping athletes and fitness enthusiasts achieve their peak performance through science-backed supplements.
          </p>

          <div className="mt-12 space-y-8">
            <div>
              <h2 className="font-heading text-2xl font-bold text-foreground">Our Mission</h2>
              <p className="mt-3 text-muted-foreground">
                At Well NZ Nutrition, we believe that proper nutrition is the foundation of athletic success. Our products are formulated with the highest quality ingredients, rigorously tested, and designed to help you push beyond your limits.
              </p>
            </div>

            <div>
              <h2 className="font-heading text-2xl font-bold text-foreground">Why Choose Us</h2>
              <ul className="mt-4 space-y-3">
                {[
                  "FSSAI Certified — meets highest safety standards",
                  "Science-backed formulations with transparent labeling",
                  "No artificial colors, flavors, or preservatives",
                  "Tested for banned substances",
                  "Proudly made in New Zealand",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-muted-foreground">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="font-heading text-2xl font-bold text-foreground">Contact Us</h2>
              <p className="mt-3 text-muted-foreground">
                Have questions? We&apos;d love to hear from you. Reach out to us at{" "}
                <a href="mailto:support@wellnznutrition.com" className="text-primary hover:underline">
                  support@wellnznutrition.com
                </a>
              </p>
            </div>

            <div className="pt-4">
              <Link href="/products">
              <Button>Shop Now</Button>
            </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}