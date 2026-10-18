
import { useState } from "react";
import { Menu, X } from "lucide-react";

import { MusicToggle } from "@/components/MusicToggle";
import { SECTIONS, TAGLINE } from "@/data/sections";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { cn } from "@/lib/utils";

const SECTION_IDS = SECTIONS.map((section) => section.id);

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const activeId = useScrollSpy(SECTION_IDS);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 glass">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <a
          href="#home"
          onClick={closeMenu}
          data-ocid="nav.home_link"
          className="group flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span className="grid size-11 place-items-center rounded-xl bg-gradient-primary font-display text-xl font-bold text-primary-foreground shadow-subtle transition-smooth group-hover:scale-105">
            L
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              LASA
            </span>
            <span className="hidden text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground sm:block">
              {TAGLINE}
            </span>
          </span>
        </a>

        <div className="flex items-center gap-2">
          <MusicToggle />
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            data-ocid="nav.menu_button"
            className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-card/70 text-foreground transition-smooth hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:hidden"
          >
            <Menu className="size-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div
        className={cn(
          "fixed inset-0 z-[60] lg:hidden",
          menuOpen ? "pointer-events-auto" : "pointer-events-none"
        )}
        aria-hidden={!menuOpen}
      >
        <button
          type="button"
          tabIndex={menuOpen ? 0 : -1}
          aria-label="Close navigation menu"
          onClick={closeMenu}
          className={cn(
            "absolute inset-0 bg-foreground/40 backdrop-blur-sm transition-opacity duration-300",
            menuOpen ? "opacity-100" : "opacity-0"
          )}
        />

        <aside
          id="mobile-navigation"
          data-ocid="nav.mobile_panel"
          className={cn(
            "absolute right-0 top-0 flex h-full w-[82%] max-w-xs flex-col overflow-hidden bg-white text-black shadow-elevated transition-transform duration-300 ease-out",
            menuOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="flex shrink-0 items-center justify-between border-b border-gray-200 px-5 py-4">
            <span className="font-display text-lg font-bold text-black">
              Menu
            </span>
            <button
              type="button"
              onClick={closeMenu}
              aria-label="Close navigation menu"
              data-ocid="nav.close_button"
              className="inline-flex size-9 items-center justify-center rounded-full border border-gray-300 text-black transition-smooth hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          </div>

          <nav
            aria-label="Mobile"
            className="relative z-10 flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto bg-white p-4"
          >
            {SECTIONS.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                onClick={closeMenu}
                data-ocid={`nav.mobile.${section.id}_link`}
                aria-current={activeId === section.id ? "page" : undefined}
                className={cn(
                  "block shrink-0 rounded-xl border border-gray-200 px-4 py-3 text-base font-medium text-black transition-smooth hover:bg-yellow-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  activeId === section.id
                    ? "bg-yellow-200 text-black"
                    : "bg-white text-black"
                )}
              >
                {section.label}
              </a>
            ))}
          </nav>
        </aside>
      </div>
    </header>
  );
}
