
/**
 * AboutUs — introduces LASA, its creators, and the visitor journey.
 */
import { Section } from "@/components/Section";
import {
  BookOpen,
  Compass,
  Heart,
  MessageCircle,
  Play,
  Star,
  Users,
  Crown,
} from "lucide-react";

interface JourneyStep {
  emoji: string;
  title: string;
  description: string;
  Icon: typeof Compass;
}

interface TeamMember {
  name: string;
  role: string;
  leader: boolean;
  image?: string;
}

const TEAM_MEMBERS: TeamMember[] = [
  {
    name: "Trisha Mae Rañosa",
    role: "Team Leader",
    leader: true,
    image: "trisha.png",
  },
  {
    name: "Ralph Martin Bentillo",
    role: "Team Member",
    leader: false,
  },
  {
    name: "Nathaniel Agpoon",
    role: "Team Member",
    leader: false,
    image: "nathaniel.png",
  },
  {
    name: "Giordani Alvarado",
    role: "Team Member",
    leader: false,
  },
  {
    name: "James Arguelles",
    role: "Team Member",
    leader: false,
  },
];

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
      "Share your own take, tips, or memories in our community sections.",
    Icon: MessageCircle,
  },
  {
    emoji: "💡",
    title: "Suggest",
    description:
      "Recommend a dish we are missing and help our food collection grow.",
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
        {/* About LASA */}
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
            Our goal is to make food culture welcoming and fun, and to give
            everyone a place to discover dishes and share what they taste.
          </p>
        </div>

        {/* Meet the creators */}
        <div className="mt-16">
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary">
              The People Behind LASA
            </p>

            <h3 className="mt-3 font-display text-3xl font-bold text-foreground sm:text-4xl">
              Meet Our Creators
            </h3>

            <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
              We are the student team behind LASA: A Journey Through Local and
              Global Flavors. Together, we created this website to celebrate
              Filipino cuisine and explore delicious dishes from around the
              world.
            </p>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {TEAM_MEMBERS.map((member, index) => (
              <div
                key={member.name}
                data-ocid={`about.creator.${index + 1}`}
                className={`relative flex flex-col items-center rounded-[var(--radius)] border p-6 text-center shadow-subtle transition-smooth hover:-translate-y-1 hover:shadow-elevated ${
                  member.leader
                    ? "border-primary/50 bg-primary/10 sm:col-span-2 lg:col-span-1"
                    : "border-border bg-card"
                }`}
              >
                {member.image ? (
                  <img
                    src={`${import.meta.env.BASE_URL}images/${member.image}`}
                    alt={`Portrait of ${member.name}`}
                    className="h-28 w-28 rounded-full border-4 border-primary/20 object-cover shadow-subtle"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                    {member.leader ? (
                      <Crown className="h-8 w-8" aria-hidden="true" />
                    ) : (
                      <Users className="h-8 w-8" aria-hidden="true" />
                    )}
                  </div>
                )}

                <h4 className="mt-4 font-display text-lg font-semibold text-foreground">
                  {member.name}
                </h4>

                <span
                  className={`mt-2 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                    member.leader
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  {member.leader && (
                    <Crown className="h-3 w-3" aria-hidden="true" />
                  )}
                  {member.role}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* LASA Journey */}
        <div className="mt-16">
          <h3 className="text-center font-display text-2xl font-semibold text-foreground sm:text-3xl">
            Your LASA Journey
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
