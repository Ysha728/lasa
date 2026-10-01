/**
 * FoodCatalog — the filterable food catalog.
 *
 * This is the "brain" of the catalog: it owns the active filter, reads the
 * shared favorites state, and controls the details modal. It then renders the
 * filter controls plus the Local and International sections, passing each one
 * only the dishes it should show.
 *
 * App.tsx mounts this component once; the two section components are purely
 * presentational and receive everything they need as props.
 */
import { FoodDetailsModal } from "@/components/FoodDetailsModal";
import { InternationalFlavors } from "@/components/sections/InternationalFlavors";
import { LocalFlavors } from "@/components/sections/LocalFlavors";
import { FOODS } from "@/data/foods";
import { useFavorites } from "@/hooks/useFavorites";
import { cn } from "@/lib/utils";
import type { Food, FoodCategory } from "@/types/lasa";
import { useState } from "react";

/** The three filter choices shown to the user. */
type FilterValue = FoodCategory | "all";

const FILTERS: { value: FilterValue; label: string }[] = [
  { value: "all", label: "All" },
  { value: "local", label: "Local" },
  { value: "international", label: "International" },
];

export function FoodCatalog() {
  // Which filter tab is active. "all" shows every dish.
  const [filter, setFilter] = useState<FilterValue>("all");
  // The dish whose details modal is open, or null when it is closed.
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);

  // Shared favorites state (backed by the backend via React Query).
  const { isFavorite, toggle } = useFavorites();

  // Split the catalog by category once, then decide what each section shows
  // based on the active filter. This keeps the two sections independent.
  const localFoods = FOODS.filter((food) => food.category === "local");
  const internationalFoods = FOODS.filter(
    (food) => food.category === "international",
  );

  const showLocal = filter === "all" || filter === "local";
  const showInternational = filter === "all" || filter === "international";

  return (
    <>
      {/* Filter controls sit above both sections so one choice drives them both. */}
      <div className="border-b border-border/60 bg-background">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
              Explore the Menu
            </p>
            <h2 className="mt-2 font-display text-2xl font-semibold text-foreground sm:text-3xl">
              Featured Flavors
            </h2>
          </div>

          {/* Segmented filter control. Each button is a real toggle. */}
          <fieldset
            data-ocid="food.filter.group"
            className="flex flex-wrap gap-2 border-0 p-0"
          >
            <legend className="sr-only">Filter foods by category</legend>
            {FILTERS.map((option) => {
              const active = filter === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  data-ocid={`food.filter.${option.value}_tab`}
                  aria-pressed={active}
                  onClick={() => setFilter(option.value)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm font-medium transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    active
                      ? "border-primary bg-primary text-primary-foreground shadow-subtle"
                      : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
                  )}
                >
                  {option.label}
                </button>
              );
            })}
          </fieldset>
        </div>
      </div>

      {/* Only render a section when the active filter includes it. */}
      {showLocal && (
        <LocalFlavors
          foods={localFoods}
          isFavorite={isFavorite}
          onToggleFavorite={toggle}
          onExplore={setSelectedFood}
        />
      )}

      {showInternational && (
        <InternationalFlavors
          foods={internationalFoods}
          isFavorite={isFavorite}
          onToggleFavorite={toggle}
          onExplore={setSelectedFood}
        />
      )}

      {/* One shared modal for whichever dish was opened. */}
      <FoodDetailsModal
        food={selectedFood}
        isFavorite={selectedFood ? isFavorite(selectedFood.id) : false}
        onToggleFavorite={toggle}
        onClose={() => setSelectedFood(null)}
      />
    </>
  );
}
