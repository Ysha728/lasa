/**
 * AboutUs — tells visitors what LASA is and how to use it.
 *
 * The section has two parts:
 *  1. A short story about the student project and why it exists.
 *  2. The "journey" steps (discover → watch → read → rate → comment →
 *     suggest → follow) shown as a numbered card grid.
 */
import { Section } from "@/components/Section";
import {
  BookOpen,
  Compass,
  Heart,
  MessageCircle,
  Play,
  Star,
} from "lucide-react";

/** One step in the LASA journey, rendered as a numbered card. */
interface JourneyStep {
  /** Emoji marker keeps the cards playful and easy to scan. */
  emoji: string;
  title: string;
  description: string;
  /** Lucide icon shown in the card corner. */
  Icon: typeof Compass;
}

/**
 * The seven-step journey. Defined as data so the grid stays tidy and each step
 * is easy to edit in one place.
 */
const JOURNEY_STEPS: JourneyStep[] = [
  {
    emoji: "🔍",
    title: "Discover",
    description:
      "Browse Filipino favorites and international dishes in one colorful catalog.",
    Icon: Compass,
  },
  {
    emoji: "🎬",
    title: "Watch",
    description:
      "See how each dish comes together in our short, student-made food videos.",
    Icon: Play,
  },
  {
    emoji: "📖",
    title: "Read",
    description:
      "Learn the history, ingredients, and cultural story behind every plate.",
    Icon: BookOpen,
  },
  {
    emoji: "⭐",
    title: "Rate",
    description:
      "Give each dish a star rating and help other students find the best bites.",
    Icon: Star,
  },
  {
    emoji: "💬",
    title: "Comment",
    description:
      "Share your own take, tips, or memories in the reviews section.",
    Icon: MessageCircle,
  },
  {
    emoji: "💡",
    title: "Suggest",
    description:
      "Recommend a dish we are missing and help the menu grow with the community.",
    Icon: Heart,
  },
  {
    emoji: "📣",
    title: "Follow",
    description:
      "Follow our food journey on social media so you never miss a new flavor.",
    Icon: Heart,
  },
];

export function AboutUs() {
  return (
    <Section id="about" label="About Us" className="bg-secondary/40">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Heading block */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary">
            About Us
          </p>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            A student project with a big appetite
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
            LASA began in a classroom with a simple question: why do some dishes
            feel like home while others feel like an adventure? We are a group
            of students who love food, so we built this journal to celebrate
            both — the Filipino flavors we grew up with and the international
            dishes we are still discovering.
          </p>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Every recipe here was researched, written, and photographed by
            students. Our goal is to make food culture feel welcoming and fun,
            and to give everyone a place to share what they taste.
          </p>
        </div>

        {/* Journey steps */}
        <div className="mt-14">
          <h3 className="text-center font-display text-2xl font-semibold text-foreground sm:text-3xl">
            Your LASA journey
          </h3>
          <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-muted-foreground sm:text-base">
            Seven simple steps take you from curious visitor to part of the
            community.
          </p>

          <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {JOURNEY_STEPS.map((step, index) => (
              <li
                key={step.title}
                data-ocid={`about.step.${index + 1}`}
                className="group relative flex flex-col rounded-[var(--radius)] border border-border bg-card p-6 shadow-subtle transition-smooth hover:-translate-y-1 hover:shadow-elevated"
              >
                {/* Step number badge */}
                <span className="absolute right-5 top-5 font-mono text-xs font-semibold text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-2xl"
                  aria-hidden="true"
                >
                  {step.emoji}
                </span>

                <h4 className="mt-4 flex items-center gap-2 font-display text-xl font-semibold text-foreground">
                  <step.Icon
                    className="h-4 w-4 text-primary"
                    aria-hidden="true"
                  />
                  {step.title}
                </h4>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Section>
  );
}
