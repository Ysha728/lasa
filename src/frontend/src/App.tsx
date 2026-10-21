
import { useState } from "react";
import { Layout } from "@/components/Layout";
import type { SiteTab } from "@/components/Navbar";
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
  const [activeTab, setActiveTab] = useState<SiteTab>("Home");

  const navigateTo = (tab: SiteTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  return (
    <Layout onNavigate={navigateTo}>
      {activeTab === "Home" && (
        <HomeSection onNavigate={navigateTo} />
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
    </Layout>
  );
}
