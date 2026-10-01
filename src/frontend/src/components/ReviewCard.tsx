/**
 * ReviewCard — one submitted review shown as an attractive card.
 *
 * Shows the star rating, the review text, and the reviewer's name with the
 * date it was posted. The dish the review belongs to is shown as a small chip
 * when we can match the backend `foodId` to a dish in the catalog.
 */
import { StarRating } from "@/components/StarRating";
import { getFoodById } from "@/data/foods";
import { formatTimestamp } from "@/lib/backend";
import { cn } from "@/lib/utils";
import type { Review } from "@/types/lasa";
import { Quote } from "lucide-react";

interface ReviewCardProps {
  review: Review;
  /** Optional extra classes for layout tweaks at the call site. */
  className?: string;
}

export function ReviewCard({ review, className }: ReviewCardProps) {
  const rating = Number(review.rating);
  const food = getFoodById(Number(review.foodId));

  return (
    <article
      data-ocid={`review.card.${review.id}`}
      className={cn(
        "group relative flex h-full flex-col gap-3 overflow-hidden rounded-[var(--radius)] border border-border bg-card p-5 shadow-subtle transition-smooth hover:-translate-y-1 hover:shadow-elevated",
        className,
      )}
    >
      {/* Decorative quote mark in the corner. */}
      <Quote
        className="absolute -right-1 -top-1 h-12 w-12 text-primary/10"
        aria-hidden="true"
      />

      <div className="flex items-center justify-between gap-3">
        <StarRating value={rating} readOnly size={16} />
        {food ? (
          <span className="shrink-0 rounded-full bg-secondary px-2.5 py-0.5 font-mono text-[0.65rem] uppercase tracking-wider text-secondary-foreground">
            {food.emoji} {food.name}
          </span>
        ) : null}
      </div>

      <p className="relative z-10 flex-1 text-sm leading-relaxed text-card-foreground">
        {review.text}
      </p>

      <footer className="mt-auto flex items-center justify-between gap-2 border-t border-border pt-3">
        <span className="truncate font-display text-sm font-semibold text-card-foreground">
          {review.reviewerName}
        </span>
        <time className="shrink-0 font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground">
          {formatTimestamp(review.createdAt)}
        </time>
      </footer>
    </article>
  );
}
