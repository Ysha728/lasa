/**
 * FeaturedFoods — the preview strip of all six dishes.
 *
 * Renders the shared `FOODS` catalog through the reusable `FoodCard`, so the
 * Home page and the catalog sections always show the same cards. Clicking a
 * card opens the details modal owned by `HomeSection`.
 */
import { FoodCard } from "@/components/FoodCard";
import { FOODS } from "@/data/foods";
import type { Food } from "@/types/lasa";

interface FeaturedFoodsProps {
  /** Set of favorited food ids from the shared favorites hook. */
  favoriteIds: Set<number>;
  /** Toggle a favorite by food id. */
  onToggleFavorite: (foodId: number) => void;
  /** Open the details modal for a dish. */
  onExplore: (food: Food) => void;
}

export function FeaturedFoods({
  favoriteIds,
  onToggleFavorite,
  onExplore,
}: FeaturedFoodsProps) {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
            Featured Dishes
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-foreground sm:text-4xl">
            Six flavors to start your journey
          </h2>
        </div>
        <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
          Tap the heart to save a dish, or open its story to learn where it
          comes from and how it is made.
        </p>
      </div>

      {/* Responsive grid: 1 column on phones, 2 on tablets, 3 on desktop. */}
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {FOODS.map((food) => (
          <FoodCard
            key={food.id}
            food={food}
            isFavorite={favoriteIds.has(food.id)}
            onToggleFavorite={onToggleFavorite}
            onExplore={onExplore}
          />
        ))}
      </div>
    </div>
  );
}
