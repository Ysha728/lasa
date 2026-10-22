
/**
 * HeroSection — the first thing visitors see.
 * Includes the LASA introduction, navigation buttons, and food collage.
 */
import { Button } from "@/components/ui/button";
import { FOODS } from "@/data/foods";
import { TAGLINE } from "@/data/sections";
import { ArrowDown, UtensilsCrossed } from "lucide-react";

const HERO_DISHES = FOODS.slice(0, 3);

type HeroSectionProps = {
  onExplore: () => void;
  onAbout: () => void;
};

export function HeroSection({ onExplore, onAbout }: HeroSectionProps) {
  return (
    <div
  className="relative overflow-hidden bg-transparent"
  style={{
    backgroundImage: "url('/lasa/assets/images/lasa-background.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  }}
>
      {/* Decorative background orbs */}
      <div
        className="orb -left-24 top-0 h-72 w-72 bg-primary/40"
        aria-hidden="true"
      />
      <div
        className="orb -right-16 top-32 h-80 w-80 bg-accent/30"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid min-h-[calc(100svh-4rem)] max-w-6xl items-center gap-8 px-4 py-8 sm:px-6 sm:py-12 lg:grid-cols-2 lg:gap-12 lg:py-16">
        {/* Introduction and navigation buttons */}
        <div className="text-center lg:text-left">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-4 py-1.5 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground backdrop-blur">
            <UtensilsCrossed
              className="h-3.5 w-3.5"
              aria-hidden="true"
            />
            Student Food Journal
          </span>

          <h1 className="mt-5 font-display text-5xl font-bold leading-none tracking-tight text-gradient sm:text-7xl lg:text-8xl">
            LASA
          </h1>
          <p className="mx-auto mt-4 max-w-xl font-display text-xl font-semibold leading-snug text-foreground sm:text-3xl lg:mx-0">
            {TAGLINE}
          </p>

          <p className="mx-auto mt-4 max-w-lg text-base font-semibold leading-relaxed text-[#302044] lg:mx-0"
            Discover Filipino and international dishes, watch how they are
            made, read their stories, and share your own take — one delicious
            bite at a time.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <Button
              size="lg"
              onClick={onExplore}
              data-ocid="hero.explore_button"
              className="w-full rounded-full bg-primary px-8 text-primary-foreground shadow-glow transition-smooth hover:bg-primary/90 sm:w-auto"
            >
              Start Exploring
              <ArrowDown className="ml-1 h-4 w-4" aria-hidden="true" />
            </Button>

            <Button
              size="lg"
              variant="outline"
              onClick={onAbout}
              data-ocid="hero.about_button"
              className="w-full rounded-full border-border bg-card/70 px-8 backdrop-blur transition-smooth hover:bg-card sm:w-auto"
            >
              What is LASA?
            </Button>
          </div>
        </div>

        {/* Food image collage */}
        <div className="relative mx-auto grid w-full max-w-sm grid-cols-2 gap-3 sm:max-w-md sm:gap-4">
          {HERO_DISHES.map((food, index) => (
            <div
              key={food.id}
              className={
                index === 0
                  ? "col-span-2 overflow-hidden rounded-[var(--radius)] border border-border shadow-elevated"
                  : "overflow-hidden rounded-[var(--radius)] border border-border shadow-subtle"
              }
            >
              <img
                src={food.image}
                alt={`${food.name} from ${food.origin}`}
                className={
                  index === 0
                    ? "h-44 w-full object-cover sm:h-52"
                    : "h-32 w-full object-cover sm:h-36"
                }
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
