/**
 * AboutLasa — the short "What is LASA" intro block.
 *
 * Explains the seven-step journey visitors take through the site:
 * discover → watch → read → rate → comment → suggest → follow.
 */
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Heart,
  Lightbulb,
  MessageCircle,
  PlayCircle,
  Search,
  Star,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface JourneyStep {
  label: string;
  description: string;
  icon: LucideIcon;
}

/** The seven journey steps, in order. */
const JOURNEY: JourneyStep[] = [
  {
    label: "Discover",
    description: "Browse local and global dishes in the flavor catalog.",
    icon: Search,
  },
  {
    label: "Watch",
    description: "See how each dish is prepared in the food videos.",
    icon: PlayCircle,
  },
  {
    label: "Read",
    description: "Learn the history and culture behind every plate.",
    icon: BookOpen,
  },
  {
    label: "Rate",
    description: "Give dishes a star rating based on your own taste.",
    icon: Star,
  },
  {
    label: "Comment",
    description: "Share what you thought with the rest of the community.",
    icon: MessageCircle,
  },
  {
    label: "Suggest",
    description: "Recommend a dish you want the group to feature next.",
    icon: Lightbulb,
  },
  {
    label: "Follow",
    description: "Keep up with LASA on social media for new flavors.",
    icon: Heart,
  },
];

export function AboutLasa() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
          What is LASA?
        </p>
        <h2 className="mt-2 font-display text-3xl font-semibold text-foreground sm:text-4xl">
          A food journal built by students, for everyone
        </h2>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          LASA is a shared space to explore the flavors of the Philippines and
          the world. Every dish comes with its story, and every visitor can
          leave a rating, a comment, or a suggestion for what to feature next.
        </p>
      </div>

      {/* The seven-step journey rendered as a responsive card grid. */}
      <ol className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {JOURNEY.map((step, index) => {
          const Icon = step.icon;
          return (
            <li
              key={step.label}
              data-ocid={`about.step.${index + 1}`}
              className="flex flex-col gap-3 rounded-[var(--radius)] border border-border bg-card p-5 shadow-subtle transition-smooth hover:-translate-y-1 hover:shadow-elevated"
            >
              <span className="grid h-11 w-11 place-items-center rounded-full bg-secondary text-primary">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">
                  Step {index + 1}
                </p>
                <h3 className="mt-1 font-display text-lg font-semibold text-card-foreground">
                  {step.label}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </li>
          );
        })}

        {/* Closing call-to-action card fills the last grid slot. */}
        <li className="flex flex-col justify-center gap-3 rounded-[var(--radius)] border border-primary/30 bg-gradient-primary p-5 text-primary-foreground shadow-glow">
          <h3 className="font-display text-lg font-semibold">
            Ready to taste the world?
          </h3>
          <p className="text-sm leading-relaxed text-primary-foreground/90">
            Jump into the catalog and start collecting flavors in your passport.
          </p>
          <Button
            type="button"
            variant="secondary"
            data-ocid="about.catalog_button"
            onClick={() =>
              document
                .getElementById("local-flavors")
                ?.scrollIntoView({ behavior: "smooth", block: "start" })
            }
            className="mt-1 w-fit rounded-full"
          >
            Browse the catalog
          </Button>
        </li>
      </ol>
    </div>
  );
}
