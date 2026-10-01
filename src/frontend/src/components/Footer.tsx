import { SECTIONS, SOCIAL_LINKS, TAGLINE } from "@/data/sections";
import type { SocialLink } from "@/types/lasa";
/**
 * Footer — LASA tagline, quick links, Follow Us social icons, and the
 * caffeine.ai attribution. Social hrefs come from SOCIAL_LINKS so they are
 * easy to replace later.
 */
import { Facebook, Instagram, Music2, Youtube } from "lucide-react";

const SOCIAL_ICONS: Record<SocialLink["icon"], typeof Facebook> = {
  facebook: Facebook,
  instagram: Instagram,
  tiktok: Music2,
  youtube: Youtube,
};

export function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window === "undefined" ? "" : window.location.hostname;

  return (
    <footer className="border-t border-border bg-muted/50">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          {/* Brand + tagline */}
          <div>
            <div className="flex items-center gap-2.5">
              <span className="grid size-9 place-items-center rounded-xl bg-gradient-primary font-display text-lg font-bold text-primary-foreground">
                L
              </span>
              <span className="font-display text-2xl font-bold tracking-tight text-foreground">
                LASA
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {TAGLINE}. A student-made food journal celebrating Filipino and
              global dishes, one story at a time.
            </p>
          </div>

          {/* Quick links */}
          <nav aria-label="Footer quick links">
            <h2 className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Quick Links
            </h2>
            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2">
              {SECTIONS.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    data-ocid={`footer.${section.id}_link`}
                    className="text-sm text-foreground/80 transition-smooth hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {section.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Follow us */}
          <div>
            <h2 className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Follow Us
            </h2>
            <ul className="mt-4 flex flex-wrap gap-3">
              {SOCIAL_LINKS.map((social) => {
                const Icon = SOCIAL_ICONS[social.icon];
                return (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      data-ocid={`footer.social.${social.icon}_link`}
                      className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition-smooth hover:-translate-y-0.5 hover:border-primary hover:text-primary hover:shadow-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <Icon className="size-4" aria-hidden="true" />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-dashed border-border pt-6 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-muted-foreground">
            © {year} LASA. All rights reserved.
          </p>
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted-foreground transition-smooth hover:text-primary"
          >
            © {year}. Built with love using caffeine.ai
          </a>
        </div>
      </div>
    </footer>
  );
}
