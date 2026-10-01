/**
 * Shared section registry.
 *
 * Every page section registers its anchor id here so the navbar, footer, and
 * scroll-spy hook all agree on the same list. Page tasks mount their section
 * bodies into these ids.
 */
import type { SectionDefinition, SocialLink } from "@/types/lasa";

export const SECTIONS: SectionDefinition[] = [
  { id: "home", label: "Home", shortLabel: "Home" },
  { id: "local-flavors", label: "Local Flavors", shortLabel: "Local" },
  {
    id: "international-flavors",
    label: "International Flavors",
    shortLabel: "Global",
  },
  { id: "food-videos", label: "Food Videos", shortLabel: "Videos" },
  { id: "flavor-passport", label: "Flavor Passport", shortLabel: "Passport" },
  { id: "about", label: "About Us", shortLabel: "About" },
  { id: "faq", label: "FAQ", shortLabel: "FAQ" },
  { id: "reviews", label: "Reviews", shortLabel: "Reviews" },
  { id: "suggestions", label: "Suggestions", shortLabel: "Suggest" },
  { id: "contact", label: "Contact", shortLabel: "Contact" },
];

/** The site tagline, kept in one place so it never drifts. */
export const TAGLINE = "A Journey Through Local and Global Flavors";

/**
 * Footer social links. Replace the `href` values with the group's real pages
 * when they are ready — nothing else needs to change.
 */
export const SOCIAL_LINKS: SocialLink[] = [
  { label: "Facebook", href: "https://facebook.com", icon: "facebook" },
  { label: "Instagram", href: "https://instagram.com", icon: "instagram" },
  { label: "TikTok", href: "https://tiktok.com", icon: "tiktok" },
  { label: "YouTube", href: "https://youtube.com", icon: "youtube" },
];
