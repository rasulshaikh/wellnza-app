import Link from "next/link";
import { cn } from "@/lib/utils";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-4xl md:text-6xl font-bold mb-6">
        Precision Fuel for Performance
      </h1>
      <p className="text-lg text-muted-foreground mb-8 max-w-xl">
        Premium sports nutrition with transparent ingredients. No proprietary blends.
      </p>
      <div className="flex gap-4">
        <Link
          href="/products"
          className="inline-flex h-9 items-center justify-center gap-1.5 px-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50"
        >
          Shop Products
        </Link>
        <Link
          href="/about"
          className="inline-flex h-9 items-center justify-center gap-1.5 px-2.5 rounded-lg border border-border bg-background hover:bg-muted hover:text-foreground text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50"
        >
          Learn More
        </Link>
      </div>
    </div>
  );
}
