/**
 * FoodCard — the shared, reusable dish card.
 *
 * Used by the Home featured strip and by the Local / International catalog
 * sections, so it lives in `components/` rather than inside a section folder.
 *
 * It shows the dish photo, name, country/region, a heart favorite button wired
 * to the shared `useFavorites` hook, and an "Explore Story" button that opens
 * the details modal.
 */
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Food } from "@/types/lasa";
import { Heart, MapPin } from "lucide-react";

interface FoodCardProps {
  food: Food;
  /** Whether this dish is currently favorited. */
  isFavorite: boolean;
  /** Toggle the favorite state for this dish. */
  onToggleFavorite: (foodId: number) => void;
  /** Open the details modal for this dish. */
  onExplore: (food: Food) => void;
  /** Optional extra classes for layout tweaks at the call site. */
  className?: string;
}

export function FoodCard({
  food,
  isFavorite,
  onToggleFavorite,
  onExplore,
  className,
}: FoodCardProps) {
  return (
    <article
      data-ocid={`food.card.${food.id}`}
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-[var(--radius)] border border-border bg-card shadow-subtle transition-smooth hover:-translate-y-1 hover:shadow-elevated",
        className,
      )}
    >
      {/* Dish photo with the favorite heart floating on top. */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={food.image}
          alt={`${food.name} — ${food.origin}`}
          loading="lazy"
          className="h-full w-full object-cover transition-smooth group-hover:scale-105"
        />
        <button
          type="button"
          data-ocid={`food.favorite_button.${food.id}`}
          aria-label={
            isFavorite
              ? `Remove ${food.name} from favorites`
              : `Add ${food.name} to favorites`
          }
          aria-pressed={isFavorite}
          onClick={() => onToggleFavorite(food.id)}
          className={cn(
            "absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full border border-border/60 bg-card/85 backdrop-blur transition-spring hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card",
            isFavorite ? "text-accent" : "text-muted-foreground",
          )}
        >
          <Heart
            className={cn("h-5 w-5", isFavorite && "fill-current")}
            aria-hidden="true"
          />
        </button>

        {/* Category chip keeps local vs. global scannable at a glance. */}
        <Badge
          variant="secondary"
          className="absolute left-3 top-3 rounded-full border border-border/60 bg-card/85 font-mono text-[0.65rem] uppercase tracking-wider text-secondary-foreground backdrop-blur"
        >
          {food.category === "local" ? "Local" : "Global"}
        </Badge>
      </div>

      {/* Text body: name, origin, tagline, then the primary action. */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="min-w-0">
          <h3 className="font-display text-xl font-semibold leading-tight text-card-foreground">
            {food.name}
          </h3>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span className="truncate">{food.origin}</span>
          </p>
        </div>

        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {food.tagline}
        </p>

        <Button
          type="button"
          data-ocid={`food.explore_button.${food.id}`}
          onClick={() => onExplore(food)}
          className="mt-auto w-full rounded-full bg-primary text-primary-foreground transition-smooth hover:bg-primary/90"
        >
          Explore Story
        </Button>
      </div>
    </article>
  );
}
