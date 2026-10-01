/**
 * FlavorPassport — the "Flavor Passport" section.
 *
 * Visitors collect a stamp for each dish they have explored. Progress is shown
 * as a count ("3 of 6 collected") plus a progress bar, and the stamps grid
 * shows every dish in either its collected or not-yet-explored state.
 *
 * State comes from the shared `usePassport` hook, so it persists while the
 * visitor browses the site.
 */
import { PassportStamp } from "@/components/PassportStamp";
import { Section } from "@/components/Section";
import { Progress } from "@/components/ui/progress";
import { FOODS } from "@/data/foods";
import { usePassport } from "@/hooks/usePassport";

export function FlavorPassport() {
  const { isExplored, markVisited, collected, total, progress, isLoading } =
    usePassport();

  return (
    <Section id="flavor-passport" label="Flavor Passport">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Section heading */}
        <header className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
            Collect Them All
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-foreground sm:text-4xl">
            Flavor Passport
          </h2>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
            Tap a dish to stamp your passport as you explore. Your stamps stay
            with you while you browse the site.
          </p>
        </header>

        {/* Progress card: count + bar. */}
        <div className="mx-auto mt-10 max-w-2xl rounded-[var(--radius)] border border-border bg-card p-6 shadow-subtle">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p
              data-ocid="passport.progress_count"
              className="font-display text-2xl font-semibold text-foreground"
            >
              {collected} of {total} collected
            </p>
            <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              {progress}% complete
            </p>
          </div>

          <Progress
            data-ocid="passport.progress_bar"
            value={progress}
            aria-label={`Flavor passport progress: ${collected} of ${total} dishes collected`}
            className="mt-4 h-2.5"
          />

          {collected === total && total > 0 && (
            <p
              data-ocid="passport.success_state"
              className="mt-4 rounded-full bg-success/15 px-4 py-2 text-center text-sm font-medium text-success"
            >
              🎉 Passport complete — you explored every flavor!
            </p>
          )}
        </div>

        {/* Stamps grid: 2 columns on mobile, up to 6 across on desktop. */}
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {FOODS.map((food) => (
            <PassportStamp
              key={food.id}
              food={food}
              isCollected={isExplored(food.id)}
              onCollect={markVisited}
            />
          ))}
        </div>

        {/* Loading hint while the backend state is being fetched. */}
        {isLoading && (
          <p
            data-ocid="passport.loading_state"
            className="mt-6 text-center font-mono text-xs text-muted-foreground"
          >
            Loading your passport…
          </p>
        )}
      </div>
    </Section>
  );
}
