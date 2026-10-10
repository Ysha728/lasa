import { BackToTop } from "@/components/BackToTop";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
/**
 * Layout — the shared site shell.
 *
 * Renders the sticky Navbar, the main content area (where page sections mount),
 * the Footer, and the floating BackToTop button. Page tasks render their
 * section bodies as children of this layout.
 */
import type { ReactNode } from "react";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}
