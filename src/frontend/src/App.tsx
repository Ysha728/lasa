
/**
 * App — the LASA single-page application root.
 *
 * Manages navigation between website sections and renders
 * the selected section.
 */
import { useState } from "react";
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

const tabs = [
  "Home",
  "Local Flavors",
  "International Flavors",
  "Food Videos",
  "Flavor Passport",
  "About Us",
  "FAQ",
  "Reviews",
  "Comments",
  "Suggestions Box",
  "Contact Us",
  "Follow Us",
] as const;

type Tab = (typeof tabs)[number];

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("Home");

  const navigateTo = (tab: Tab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Layout>
      <nav
        aria-label="Website sections"
        className="sticky top-16 z-40 border-b border-border bg-background/95 p-2 backdrop-blur"
      >
        <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => navigateTo(tab)}
              aria-current={activeTab === tab ? "page" : undefined}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-foreground hover:border-primary"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </nav>

      <main>
        {activeTab === "Home" && (
          <HomeSection
            onNavigate={(tab) => navigateTo(tab)}
          />
        )}

        {(activeTab === "Local Flavors" ||
          activeTab === "International Flavors") && (
          <FoodCatalog
            key={activeTab}
            initialCategory={
              activeTab === "Local Flavors" ? "local" : "international"
            }
          />
        )}

        {activeTab === "Food Videos" && <FoodVideos />}
        {activeTab === "Flavor Passport" && <FlavorPassport />}
        {activeTab === "About Us" && <AboutUs />}
        {activeTab === "FAQ" && <Faq />}
        {activeTab === "Reviews" && <Reviews />}
        {activeTab === "Comments" && <Comments />}
        {activeTab === "Suggestions Box" && <SuggestionsBox />}
        {activeTab === "Contact Us" && <ContactUs />}
        {activeTab === "Follow Us" && <FollowUs />}
      </main>
    </Layout>
  );
}
