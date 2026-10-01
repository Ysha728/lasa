/**
 * Shared LASA types.
 *
 * These describe the food catalog and the small pieces of UI state that the
 * whole site shares (favorites, passport progress, music preference).
 * Backend-owned types (Review, Comment, Suggestion, ...) live in the generated
 * `@/backend` bindings and are re-exported here so pages have one import path.
 */

/** A food is either a Filipino "local" dish or an "international" one. */
export type FoodCategory = "local" | "international";

/** Full detail record for one dish shown across the catalog and detail views. */
export interface Food {
  /** Stable numeric id used by the backend (favorites, reviews, comments). */
  id: number;
  /** URL-friendly identifier used for anchors and deep links. */
  slug: string;
  name: string;
  category: FoodCategory;
  /** Country or region the dish belongs to, e.g. "Philippines". */
  country: string;
  /** Specific place of origin, e.g. "Bacolod City". */
  origin: string;
  /** One-line hook shown on cards. */
  tagline: string;
  /** Short history of the dish. */
  history: string;
  /** Key ingredients, one per line. */
  ingredients: string[];
  /** How the dish is prepared. */
  preparation: string;
  /** Why the dish matters to its culture. */
  culturalSignificance: string;
  /** Fun trivia shown in the detail view. */
  funFacts: string[];
  /** Path to the dish photo under /assets/images/. */
  image: string;
  /** Accent emoji used as a lightweight visual marker. */
  emoji: string;
}

/** A single entry in the site's section registry (used for nav + scroll spy). */
export interface SectionDefinition {
  /** DOM id of the section element. */
  id: string;
  /** Human label shown in the navbar and footer. */
  label: string;
  /** Short label used in compact navigation. */
  shortLabel: string;
}

/** A social link in the footer; hrefs are intentionally easy to replace. */
export interface SocialLink {
  label: string;
  href: string;
  icon: "facebook" | "instagram" | "tiktok" | "youtube";
}

// Re-export the generated backend types so pages import from one place.
export type {
  Comment,
  CommentInput,
  Review,
  ReviewInput,
  ReviewStats,
  Suggestion,
  SuggestionInput,
} from "@/backend";
export { SuggestionCategory } from "@/backend";
