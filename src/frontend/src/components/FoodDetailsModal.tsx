/**
 * FoodDetailsModal — the full story for one dish.
 *
 * Shows the photo plus every detail field from the shared `Food` type:
 * country/region, origin, history, ingredients, preparation, cultural
 * significance, and fun facts.
 *
 * Closing works three ways: the close button, the Escape key, and clicking the
 * backdrop. Focus is moved into the dialog on open and restored on close.
 */
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Food } from "@/types/lasa";
import { Heart, MapPin, Sparkles, X } from "lucide-react";
import { useEffect, useRef } from "react";

interface FoodDetailsModalProps {
  /** The dish to show, or null when the modal is closed. */
  food: Food | null;
  /** Whether the shown dish is favorited. */
  isFavorite: boolean;
  /** Toggle the favorite state for the shown dish. */
  onToggleFavorite: (foodId: number) => void;
  /** Close the modal. */
  onClose: () => void;
}

export function FoodDetailsModal({
  food,
  isFavorite,
  onToggleFavorite,
  onClose,
}: FoodDetailsModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Escape closes the modal, and the page behind it stops scrolling while open.
  useEffect(() => {
    if (!food) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [food, onClose]);

  if (!food) return null;

  return (
    <div
      data-ocid="food.details.modal"
      className="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto p-0 sm:items-center sm:p-6"
    >
      {/* Backdrop: a real button so click-to-close works for mouse and keyboard. */}
      <button
        type="button"
        aria-label="Close food details"
        data-ocid="food.details.backdrop"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default bg-foreground/40 backdrop-blur-sm"
      />

      <dialog
        open
        aria-labelledby="food-details-title"
        className="relative m-0 w-full max-w-3xl overflow-hidden rounded-t-[var(--radius)] border border-border bg-card p-0 text-card-foreground shadow-elevated sm:rounded-[var(--radius)]"
      >
        {/* Hero photo with the close button overlaid. */}
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
          <img
            src={food.image}
            alt={`${food.name} — ${food.origin}`}
            className="h-full w-full object-cover"
          />
          <button
            ref={closeButtonRef}
            type="button"
            data-ocid="food.details.close_button"
            aria-label="Close food details"
            onClick={onClose}
            className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full border border-border/60 bg-card/85 text-foreground backdrop-blur transition-spring hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto p-6 sm:p-8">
          {/* Title block: name, origin, and the favorite toggle. */}
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <Badge
                variant="secondary"
                className="mb-2 rounded-full font-mono text-[0.65rem] uppercase tracking-wider"
              >
                {food.category === "local" ? "Local Flavor" : "Global Flavor"}
              </Badge>
              <h2
                id="food-details-title"
                className="font-display text-3xl font-semibold leading-tight text-card-foreground"
              >
                {food.emoji} {food.name}
              </h2>
              <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>
                  {food.country} · {food.origin}
                </span>
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              data-ocid="food.details.favorite_button"
              aria-pressed={isFavorite}
              onClick={() => onToggleFavorite(food.id)}
              className="shrink-0 rounded-full"
            >
              <Heart
                className={isFavorite ? "fill-current text-accent" : ""}
                aria-hidden="true"
              />
              {isFavorite ? "Favorited" : "Favorite"}
            </Button>
          </div>

          <p className="mt-5 text-base leading-relaxed text-muted-foreground">
            {food.tagline}
          </p>

          {/* History and cultural significance read as short editorial blocks. */}
          <div className="mt-6 space-y-6">
            <section>
              <h3 className="font-display text-lg font-semibold text-card-foreground">
                History
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {food.history}
              </p>
            </section>

            <section>
              <h3 className="font-display text-lg font-semibold text-card-foreground">
                Ingredients
              </h3>
              <ul className="mt-2 grid gap-2 sm:grid-cols-2">
                {food.ingredients.map((ingredient) => (
                  <li
                    key={ingredient}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <span
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
                      aria-hidden="true"
                    />
                    {ingredient}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h3 className="font-display text-lg font-semibold text-card-foreground">
                Preparation
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {food.preparation}
              </p>
            </section>

            <section>
              <h3 className="font-display text-lg font-semibold text-card-foreground">
                Cultural Significance
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {food.culturalSignificance}
              </p>
            </section>

            <section className="rounded-[var(--radius)] border border-border bg-secondary/50 p-5">
              <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-card-foreground">
                <Sparkles className="h-4 w-4 text-accent" aria-hidden="true" />
                Interesting Facts
              </h3>
              <ul className="mt-3 space-y-2">
                {food.funFacts.map((fact) => (
                  <li
                    key={fact}
                    className="flex items-start gap-2 text-sm leading-relaxed text-muted-foreground"
                  >
                    <span
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                      aria-hidden="true"
                    />
                    {fact}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </dialog>
    </div>
  );
}
