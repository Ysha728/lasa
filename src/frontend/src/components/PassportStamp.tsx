/**
 * PassportStamp — a single stamp/badge in the Flavor Passport.
 *
 * Renders one dish in either the "collected" state (a filled, tilted stamp with
 * a check) or the "not yet explored" state (a dashed, faded outline). The whole
 * stamp is a button so visitors can tap a dish to collect it.
 */
import { cn } from "@/lib/utils";
import type { Food } from "@/types/lasa";
import { Check } from "lucide-react";

interface PassportStampProps {
  food: Food;
  /** Whether the visitor has already collected this dish. */
  isCollected: boolean;
  /** Collect this dish when the visitor taps an uncollected stamp. */
  onCollect: (foodId: number) => void;
  /** Optional extra classes for layout tweaks at the call site. */
  className?: string;
}

export function PassportStamp({
  food,
  isCollected,
  onCollect,
  className,
}: PassportStampProps) {
  return (
    <button
      type="button"
      data-ocid={`passport.stamp.${food.id}`}
      aria-pressed={isCollected}
      aria-label={
        isCollected ? `${food.name} collected` : `Collect ${food.name} stamp`
      }
      onClick={() => onCollect(food.id)}
      disabled={isCollected}
      className={cn(
        "group flex flex-col items-center gap-2 rounded-[var(--radius)] p-3 text-center transition-spring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        isCollected ? "cursor-default" : "cursor-pointer hover:-translate-y-1",
        className,
      )}
    >
      {/* The circular stamp itself. */}
      <span
        className={cn(
          "relative grid h-20 w-20 place-items-center rounded-full border-2 transition-spring sm:h-24 sm:w-24",
          isCollected
            ? "-rotate-6 border-success bg-success/15 text-success shadow-subtle"
            : "border-dashed border-border bg-muted/40 text-muted-foreground group-hover:border-primary/60 group-hover:text-primary",
        )}
      >
        <span aria-hidden="true" className="text-3xl sm:text-4xl">
          {food.emoji}
        </span>

        {/* Collected stamps get a small check badge in the corner. */}
        {isCollected && (
          <span className="absolute -bottom-1 -right-1 grid h-7 w-7 place-items-center rounded-full border-2 border-background bg-success text-success-foreground">
            <Check className="h-4 w-4" aria-hidden="true" />
          </span>
        )}
      </span>

      {/* Dish name + state label. */}
      <span className="min-w-0">
        <span
          className={cn(
            "block truncate font-display text-sm font-semibold",
            isCollected ? "text-foreground" : "text-muted-foreground",
          )}
        >
          {food.name}
        </span>
        <span className="mt-0.5 block font-mono text-[0.6rem] uppercase tracking-wider text-muted-foreground">
          {isCollected ? "Collected" : "Not yet explored"}
        </span>
      </span>
    </button>
  );
}
