/**
 * FollowUs — the "Follow Our Food Journey" call to action.
 *
 * The social buttons are generated from the shared `SOCIAL_LINKS` export in
 * `@/data/sections`. To point them at the group's real pages later, edit only
 * the `href` values there — this component needs no changes.
 */
import { Section } from "@/components/Section";
import { SOCIAL_LINKS } from "@/data/sections";
import type { SocialLink } from "@/types/lasa";
import { ArrowUpRight } from "lucide-react";
import type { IconType } from "react-icons";
import { SiFacebook, SiInstagram, SiTiktok, SiYoutube } from "react-icons/si";

/** Map the icon name stored in SOCIAL_LINKS to its brand icon component. */
const SOCIAL_ICONS: Record<SocialLink["icon"], IconType> = {
  facebook: SiFacebook,
  instagram: SiInstagram,
  tiktok: SiTiktok,
  youtube: SiYoutube,
};

export function FollowUs() {
  return (
    <Section id="follow" label="Follow Our Food Journey">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-[var(--radius)] border border-border bg-gradient-primary px-6 py-14 text-center shadow-elevated sm:px-12">
          {/* Decorative orbs for the playful editorial feel. */}
          <div
            className="orb -left-10 -top-10 h-48 w-48 bg-accent/40"
            aria-hidden="true"
          />
          <div
            className="orb -bottom-16 -right-10 h-56 w-56 bg-primary/40"
            aria-hidden="true"
          />

          <div className="relative">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary-foreground/80">
              Stay in the loop
            </p>
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-primary-foreground sm:text-5xl">
              Follow Our Food Journey
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-primary-foreground/90">
              New dishes, behind-the-scenes videos, and student stories land on
              our social pages first. Pick your favorite platform and come along
              for the ride.
            </p>

            {/* Social buttons generated from the shared SOCIAL_LINKS data. */}
            <ul className="mt-9 flex flex-wrap items-center justify-center gap-3">
              {SOCIAL_LINKS.map((link, index) => {
                const Icon = SOCIAL_ICONS[link.icon];
                return (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-ocid={`follow.link.${index + 1}`}
                      aria-label={`Follow LASA on ${link.label}`}
                      className="group inline-flex min-h-11 items-center gap-2 rounded-full border border-primary-foreground/25 bg-primary-foreground/10 px-5 py-2.5 text-sm font-medium text-primary-foreground backdrop-blur transition-smooth hover:bg-primary-foreground hover:text-primary"
                    >
                      <Icon className="h-4 w-4" aria-hidden="true" />
                      {link.label}
                      <ArrowUpRight
                        className="h-3.5 w-3.5 opacity-70 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        aria-hidden="true"
                      />
                    </a>
                  </li>
                );
              })}
            </ul>

            <p className="mt-6 font-mono text-xs text-primary-foreground/70">
              Links are placeholders — swap them for our real pages anytime.
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}
