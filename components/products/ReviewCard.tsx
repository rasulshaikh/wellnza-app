"use client";

import { Star } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";

interface ReviewCardProps {
  review: {
    id: string;
    user: { name: string | null };
    rating: number;
    title: string | null;
    body: string;
    isVerifiedPurchase: boolean;
    helpfulCount: number;
    createdAt: Date | string;
  };
}

export function ReviewCard({ review }: ReviewCardProps) {
  const firstName = review.user.name?.split(" ")[0] ?? "Anonymous";

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          {/* Stars */}
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn("size-3.5", i < review.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30")}
              />
            ))}
          </div>
          {/* User + date */}
          <span className="text-xs text-muted-foreground">
            {firstName} · {formatDate(review.createdAt)}
          </span>
        </div>
        {review.isVerifiedPurchase && (
          <span className="rounded bg-green-100 px-2 py-0.5 text-[10px] font-medium text-green-700">
            Verified Purchase
          </span>
        )}
      </div>

      {/* Title */}
      {review.title && (
        <p className="text-sm font-semibold text-foreground">{review.title}</p>
      )}

      {/* Body */}
      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{review.body}</p>

      {/* Footer */}
      {review.helpfulCount > 0 && (
        <p className="text-xs text-muted-foreground">
          {review.helpfulCount} people found this helpful
        </p>
      )}
    </div>
  );
}