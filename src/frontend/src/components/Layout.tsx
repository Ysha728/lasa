
import type { ReactNode } from "react";
import { BackToTop } from "@/components/BackToTop";
import { Footer } from "@/components/Footer";
import { Navbar, type SiteTab } from "@/components/Navbar";

type LayoutProps = {
  children: ReactNode;
  onNavigate: (tab: SiteTab) => void;
};

export function Layout({ children, onNavigate }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-transparent text-foreground">
      <Navbar onNavigate={onNavigate} />
      <main id="main-content" className="w-full flex-1">
        {children}
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}
