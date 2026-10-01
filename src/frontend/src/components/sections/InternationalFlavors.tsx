/**
 * InternationalFlavors — the global dishes section.
 *
 * The mirror of LocalFlavors: it renders the "international" half of the
 * catalog as a responsive grid of FoodCards. Favorites state and the details
 * modal live in the parent (FoodCatalog) and are passed down as props.
 */
import { FoodCard } from "@/components/FoodCard";
import { Section } from "@/components/Section";
import type { Food } from "@/types/lasa";

interface InternationalFlavorsProps {
  /** The international dishes to show (already filtered by the parent). */
  foods: Food[];
  /** Whether a given dish id is currently favorited. */
  isFavorite: (foodId: number) => boolean;
  /** Toggle the favorite state for a dish. */
  onToggleFavorite: (foodId: number) => void;
  /** Open the details modal for a dish. */
  onExplore: (food: Food) => void;
}

export function InternationalFlavors({
  foods,
  isFavorite,
  onToggleFavorite,
  onExplore,
}: InternationalFlavorsProps) {
  return (
    <Section
      id="international-flavors"
      label="International Flavors"
      className="bg-secondary/40"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Section heading: small eyebrow label + big serif title. */}
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
            Around the World
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
            International Flavors
          </h2>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
            Beloved dishes from across the globe — wood-fired, saffron-scented,
            and stacked high — each with a story worth tasting.
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
