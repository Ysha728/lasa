/**
 * App — the LASA single-page application root.
 *
 * This file is intentionally thin: it wires the shared Layout shell and mounts
 * every page section in the order the navbar links expect. Each section owns
 * its own anchor id (via the shared `Section` wrapper), so the navbar, footer,
 * and scroll-spy all resolve to the right place.
 *
 * Section order (matches `@/data/sections`):
 *   Home → Local Flavors → International Flavors → Food Videos →
 *   Flavor Passport → About Us → FAQ → Reviews → Comments →
 *   Suggestions Box → Contact Us → Follow Us
 */
import { Layout } from "@/components/Layout";
import { AboutUs } from "@/components/sections/AboutUs";
import { Comments } from "@/components/sections/Comments";
import { ContactUs } from "@/components/sections/ContactUs";
import { Faq } from "@/components/sections/Faq";
import { FlavorPassport } from "@/components/sections/FlavorPassport";
import { FollowUs } from "@/components/sections/FollowUs";
import { FoodCatalog } from "@/components/sections/FoodCatalog";
import { FoodVideos } from "@/components/sections/FoodVideos";
import { HomeSection } from "@/components/sections/HomeSection";
import { Reviews } from "@/components/sections/Reviews";
import { SuggestionsBox } from "@/components/sections/SuggestionsBox";

export default function App() {
  return (
    <Layout>
      {/* 1. Home — hero, featured foods, and the "What is LASA" intro. */}
      <HomeSection />

      {/*
        2 & 3. Local Flavors + International Flavors.
        FoodCatalog owns the All / Local / International filter and the shared
        details modal, then renders both flavor sections beneath the controls.
      */}
      <FoodCatalog />

      {/* 4. Food Videos — responsive video cards with placeholder clips. */}
      <FoodVideos />

      {/* 5. Flavor Passport — collect a stamp for each explored dish. */}
      <FlavorPassport />

      {/* 6. About Us — the student project story and the LASA journey steps. */}
      <AboutUs />

      {/* 7. FAQ — expandable questions and answers. */}
      <Faq />

      {/* 8. Reviews & Ratings — star rating form plus the average summary. */}
      <Reviews />

      {/* 9. Comments — food-related comments and reactions. */}
      <Comments />

      {/* 10. Suggestions Box — suggest a food, topic, or improvement. */}
      <SuggestionsBox />

      {/* 11. Contact Us — contact details and a simple message form. */}
      <ContactUs />

      {/* 12. Follow Us — social buttons for the LASA food journey. */}
      <FollowUs />
    </Layout>
  );
}
