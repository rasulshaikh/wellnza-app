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
    <div className="flex flex-col gap-3 rounded-xl border p-4" style={{ borderColor: "rgba(46,125,50,0.15)", background: "#fff" }}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          {/* Stars */}
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className="size-3.5"
                style={{ fill: i < review.rating ? "#C9A227" : "none", color: i < review.rating ? "#C9A227" : "#7B9E6B" }}
              />
            ))}
          </div>
          {/* User + date */}
          <span className="text-xs" style={{ color: "#7B9E6B" }}>
            {firstName} · {formatDate(review.createdAt)}
          </span>
        </div>
        {review.isVerifiedPurchase && (
          <span className="rounded px-2 py-0.5 text-[10px] font-medium" style={{ background: "rgba(46,125,50,0.1)", color: "#2E7D32" }}>
            Verified Purchase
          </span>
        )}
      </div>

      {/* Title */}
      {review.title && (
        <p className="text-sm font-semibold" style={{ color: "#1a1a1a" }}>{review.title}</p>
      )}

      {/* Body */}
      <p className="text-sm leading-relaxed line-clamp-3" style={{ color: "#7B9E6B" }}>{review.body}</p>

      {/* Footer */}
      {review.helpfulCount > 0 && (
        <p className="text-xs" style={{ color: "#7B9E6B" }}>
          {review.helpfulCount} people found this helpful
        </p>
      )}
    </div>
  );
}