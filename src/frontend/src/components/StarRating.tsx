/**
 * StarRating — a small, reusable 1–5 star control.
 *
 * It works in two modes:
 *  - Interactive (default): the stars are native radio inputs the visitor can
 *    click or navigate with the keyboard (arrow keys / Home / End) to pick a
 *    rating. Using real radios means screen readers announce "3 of 5 stars"
 *    and keyboard behavior comes for free.
 *  - Read-only: pass `readOnly` to render a static display of a rating, used
 *    inside review cards and the average-rating summary.
 */
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";
import { useId } from "react";

interface StarRatingProps {
  /** Current rating from 0 (none) to 5. */
  value: number;
  /** Called with the new rating when the visitor picks a star. */
  onChange?: (value: number) => void;
  /** Render a static display instead of an interactive control. */
  readOnly?: boolean;
  /** Star size in pixels; defaults to 28 for the form, 16 for cards. */
  size?: number;
  /** Optional extra classes for layout tweaks at the call site. */
  className?: string;
  /** Accessible label for the interactive group. */
  label?: string;
}

const STARS = [1, 2, 3, 4, 5];

export function StarRating({
  value,
  onChange,
  readOnly = false,
  size = 28,
  className,
  label = "Rating",
}: StarRatingProps) {
  const groupName = useId();

  // Read-only display: just show filled vs. empty stars.
  if (readOnly) {
    return (
      <div
        className={cn("flex items-center gap-0.5", className)}
        aria-label={`${value} out of 5 stars`}
      >
        {STARS.map((star) => (
          <Star
            key={star}
            style={{ width: size, height: size }}
            className={cn(
              "shrink-0",
              star <= value
                ? "fill-warning text-warning"
                : "fill-transparent text-muted-foreground/40",
            )}
            aria-hidden="true"
          />
        ))}
      </div>
    );
  }

  // Interactive control: native radios styled as stars.
  return (
    <fieldset
      className={cn("flex items-center gap-1 border-0 p-0", className)}
      aria-label={label}
    >
      <legend className="sr-only">{label}</legend>
      {STARS.map((star) => {
        const selected = star <= value;
        return (
          <label
            key={star}
            className={cn(
              "grid cursor-pointer place-items-center rounded-full p-1 transition-spring hover:scale-110 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-card",
              selected ? "text-warning" : "text-muted-foreground/50",
            )}
          >
            <input
              type="radio"
              name={groupName}
              value={star}
              checked={value === star}
              onChange={() => onChange?.(star)}
              aria-label={`${star} star${star > 1 ? "s" : ""}`}
              data-ocid={`review.rating.${star}`}
              className="sr-only"
            />
            <Star
              style={{ width: size, height: size }}
              className={cn(
                "shrink-0",
                selected ? "fill-warning" : "fill-transparent",
              )}
              aria-hidden="true"
            />
          </label>
        );
      })}
      <span className="sr-only" aria-live="polite">
        {value > 0 ? `${value} of 5 stars selected` : "No rating selected"}
      </span>
    </fieldset>
  );
}
