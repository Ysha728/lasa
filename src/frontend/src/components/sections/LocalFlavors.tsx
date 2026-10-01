/**
 * LocalFlavors — the Filipino dishes section.
 *
 * Renders the "local" half of the catalog as a responsive grid of FoodCards.
 * The parent (FoodCatalog) owns the favorites state and the details modal, so
 * this component just receives the already-filtered list plus the two handlers
 * and passes them straight through to each card.
 */
import { FoodCard } from "@/components/FoodCard";
import { Section } from "@/components/Section";
import type { Food } from "@/types/lasa";

interface LocalFlavorsProps {
  /** The local dishes to show (already filtered by the parent). */
  foods: Food[];
  /** Whether a given dish id is currently favorited. */
  isFavorite: (foodId: number) => boolean;
  /** Toggle the favorite state for a dish. */
  onToggleFavorite: (foodId: number) => void;
  /** Open the details modal for a dish. */
  onExplore: (food: Food) => void;
}

export function LocalFlavors({
  foods,
  isFavorite,
  onToggleFavorite,
  onExplore,
}: LocalFlavorsProps) {
  return (
    <Section id="local-flavors" label="Local Flavors" className="bg-background">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Section heading: small eyebrow label + big serif title. */}
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
            From the Philippines
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
            Local Flavors
          </h2>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
            Homegrown dishes that carry the warmth of Filipino kitchens — smoky
            grills, creamy coconut, and slow-simmered comfort.
          </p>
        </div>

        {/* Responsive card grid: 1 column on phones, 2 on tablets, 3 on desktop. */}
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {foods.map((food) => (
            <FoodCard
              key={food.id}
              food={food}
              isFavorite={isFavorite(food.id)}
              onToggleFavorite={onToggleFavorite}
              onExplore={onExplore}
            />
          ))}
        </div>
      </div>
    </Section>
  );
}
