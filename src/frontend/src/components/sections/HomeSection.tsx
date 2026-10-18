
/**
 * HomeSection — composes the Home page from its three parts.
 *
 * Hero → Featured Foods → What is LASA.
 * Handles favorites, food details, and hero button navigation.
 */
import { FoodDetailsModal } from "@/components/FoodDetailsModal";
import { Section } from "@/components/Section";
import { AboutLasa } from "@/components/sections/AboutLasa";
import { FeaturedFoods } from "@/components/sections/FeaturedFoods";
import { HeroSection } from "@/components/sections/HeroSection";
import { useFavorites } from "@/hooks/useFavorites";
import type { Food } from "@/types/lasa";
import { useCallback, useState } from "react";

type HomeSectionProps = {
  onNavigate: (tab: "Local Flavors" | "About Us") => void;
};

export function HomeSection({ onNavigate }: HomeSectionProps) {
  // Shared favorites state for the featured foods and details modal.
  const { favoriteIds, toggle } = useFavorites();

  // The food currently displayed in the details modal.
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);

  const openDetails = useCallback(
    (food: Food) => setSelectedFood(food),
    [],
  );

  const closeDetails = useCallback(
    () => setSelectedFood(null),
    [],
  );

  return (
    <Section id="home" label="Home" className="py-0 md:py-0">
      <HeroSection
        onExplore={() => onNavigate("Local Flavors")}
        onAbout={() => onNavigate("About Us")}
      />

      {/* Featured foods */}
      <div className="bg-secondary/40 py-16 md:py-24">
        <FeaturedFoods
          favoriteIds={favoriteIds}
          onToggleFavorite={toggle}
          onExplore={openDetails}
        />
      </div>

      {/* What is LASA information */}
      <div className="py-16 md:py-24">
        <AboutLasa />
      </div>

      {/* Food details modal */}
      <FoodDetailsModal
        food={selectedFood}
        isFavorite={
          selectedFood ? favoriteIds.has(selectedFood.id) : false
        }
        onToggleFavorite={toggle}
        onClose={closeDetails}
      />
    </Section>
  );
}
