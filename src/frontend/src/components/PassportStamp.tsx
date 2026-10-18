
import { cn } from "@/lib/utils";
import type { Food } from "@/types/lasa";
import { Check } from "lucide-react";

interface PassportStampProps {
  food: Food;
  isCollected: boolean;
  onCollect: (foodId: number) => void;
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
        isCollected
          ? `Uncollect ${food.name} stamp`
          : `Collect ${food.name} stamp`
      }
      onClick={() => onCollect(food.id)}
      className={cn(
        "group flex flex-col items-center gap-2 rounded-[var(--radius)] p-3 text-center transition-spring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        isCollected
          ? "cursor-pointer hover:-translate-y-1"
          : "cursor-pointer hover:-translate-y-1",
        className,
      )}
    >
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

        {isCollected && (
          <span className="absolute -bottom-1 -right-1 grid h-7 w-7 place-items-center rounded-full border-2 border-background bg-success text-success-foreground">
            <Check className="h-4 w-4" aria-hidden="true" />
          </span>
        )}
      </span>

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
          {isCollected ? "Collected · Tap to remove" : "Not yet explored"}
        </span>
      </span>
    </button>
  );
}
