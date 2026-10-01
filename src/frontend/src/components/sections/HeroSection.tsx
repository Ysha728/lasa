/**
 * HeroSection — the first thing visitors see.
 *
 * Big LASA wordmark, the site tagline, and a call-to-action that smooth-scrolls
 * down to the food sections. Decorative blurred "orbs" and a floating food
 * collage give it the playful editorial feel without hurting readability.
 */
import { Button } from "@/components/ui/button";
import { FOODS } from "@/data/foods";
import { TAGLINE } from "@/data/sections";
import { ArrowDown, UtensilsCrossed } from "lucide-react";

/** The three dishes shown in the hero collage. */
const HERO_DISHES = FOODS.slice(0, 3);

export function HeroSection() {
  // Smooth-scroll to the first food section. `scroll-mt-20` on each Section
  // keeps the sticky header from covering the heading.
  const scrollToFlavors = () => {
    document
      .getElementById("local-flavors")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="relative overflow-hidden bg-gradient-subtle">
      {/* Decorative background orbs — purely visual, hidden from screen readers. */}
      <div
        className="orb -left-24 top-0 h-72 w-72 bg-primary/40"
        aria-hidden="true"
      />
      <div
        className="orb -right-16 top-32 h-80 w-80 bg-accent/30"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-2">
        {/* Left column: the message and the primary action. */}
        <div className="text-center lg:text-left">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-4 py-1.5 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground backdrop-blur">
            <UtensilsCrossed className="h-3.5 w-3.5" aria-hidden="true" />
            Student Food Journal
          </span>

          <h1 className="mt-6 font-display text-6xl font-bold leading-none tracking-tight text-gradient sm:text-7xl md:text-8xl">
            LASA
          </h1>

          <p className="mx-auto mt-5 max-w-xl font-display text-2xl font-medium leading-snug text-foreground sm:text-3xl lg:mx-0">
            {TAGLINE}
          </p>

          <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-muted-foreground lg:mx-0">
            Discover Filipino and international dishes, watch how they are made,
            read their stories, and share your own take — one delicious bite at
            a time.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <Button
              type="button"
              size="lg"
              data-ocid="hero.explore_button"
              onClick={scrollToFlavors}
              className="w-full rounded-full bg-primary px-8 text-primary-foreground shadow-glow transition-smooth hover:bg-primary/90 sm:w-auto"
            >
              Start Exploring
              <ArrowDown className="ml-1 h-4 w-4" aria-hidden="true" />
            </Button>
            <Button
              type="button"
              size="lg"
              variant="outline"
              data-ocid="hero.about_button"
              onClick={() =>
                document
                  .getElementById("about")
                  ?.scrollIntoView({ behavior: "smooth", block: "start" })
              }
              className="w-full rounded-full border-border bg-card/70 px-8 backdrop-blur transition-smooth hover:bg-card sm:w-auto"
            >
              What is LASA?
            </Button>
          </div>
        </div>

        {/* Right column: a playful collage of the first three dishes. */}
        <div className="relative mx-auto grid w-full max-w-md grid-cols-2 gap-4">
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
