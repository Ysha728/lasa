/**
 * HomeSection — composes the Home page from its three parts.
 *
 * Hero → Featured Foods → What is LASA. It also owns the shared favorites
 * state and the details modal, so the hero, the featured strip, and the modal
 * all read from one source of truth.
 *
 * This component owns the `home` Section wrapper so the navbar's Home link
 * resolves to a real anchor.
 */
import { FoodDetailsModal } from "@/components/FoodDetailsModal";
import { Section } from "@/components/Section";
import { AboutLasa } from "@/components/sections/AboutLasa";
import { FeaturedFoods } from "@/components/sections/FeaturedFoods";
import { HeroSection } from "@/components/sections/HeroSection";
import { useFavorites } from "@/hooks/useFavorites";
import type { Food } from "@/types/lasa";
import { useCallback, useState } from "react";

export function HomeSection() {
  // Shared favorites state — the heart buttons and the modal both use this.
  const { favoriteIds, toggle } = useFavorites();

  // The dish currently open in the details modal (null = closed).
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);

  const openDetails = useCallback((food: Food) => setSelectedFood(food), []);
  const closeDetails = useCallback(() => setSelectedFood(null), []);

  return (
    <Section id="home" label="Home" className="py-0 md:py-0">
      <HeroSection />

      {/* Featured strip sits on a soft lavender band to separate it from the hero. */}
      <div className="bg-secondary/40 py-16 md:py-24">
        <FeaturedFoods
          favoriteIds={favoriteIds}
          onToggleFavorite={toggle}
          onExplore={openDetails}
        />
      </div>

      <div className="py-16 md:py-24">
        <AboutLasa />
      </div>

      <FoodDetailsModal
        food={selectedFood}
        isFavorite={selectedFood ? favoriteIds.has(selectedFood.id) : false}
        onToggleFavorite={toggle}
        onClose={closeDetails}
      />
    </Section>
  );
}
