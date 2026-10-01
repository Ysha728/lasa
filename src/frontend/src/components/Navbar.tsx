import { MusicToggle } from "@/components/MusicToggle";
import { SECTIONS, TAGLINE } from "@/data/sections";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
/**
 * Navbar — sticky glass header with the LASA wordmark, section links, and the
 * Music toggle. On mobile the links collapse into a hamburger that opens a
 * slide-in panel; tapping a link closes the panel.
 */
import { useState } from "react";

const SECTION_IDS = SECTIONS.map((section) => section.id);

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const activeId = useScrollSpy(SECTION_IDS);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 glass">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        {/* Wordmark */}
        <a
          href="#home"
          data-ocid="nav.home_link"
          className="group flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span className="grid size-9 place-items-center rounded-xl bg-gradient-primary font-display text-lg font-bold text-primary-foreground shadow-subtle transition-smooth group-hover:scale-105">
            L
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-xl font-bold tracking-tight text-foreground">
              LASA
            </span>
            <span className="hidden text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground sm:block">
              {TAGLINE}
            </span>
          </span>
        </a>

        {/* Desktop navigation */}
        <nav
          aria-label="Primary"
          className="hidden items-center gap-0.5 lg:flex"
        >
          {SECTIONS.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              data-ocid={`nav.${section.id}_link`}
              aria-current={activeId === section.id ? "true" : undefined}
              className={cn(
                "rounded-full px-3 py-2 text-sm font-medium transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                activeId === section.id
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
            >
              {section.shortLabel}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <MusicToggle />
          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={menuOpen}
            data-ocid="nav.menu_button"
            className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-card/70 text-foreground transition-smooth hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:hidden"
          >
            <Menu className="size-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Mobile slide-in panel */}
      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden",
          menuOpen ? "pointer-events-auto" : "pointer-events-none",
        )}
        aria-hidden={!menuOpen}
      >
        {/* Backdrop */}
        <button
          type="button"
          tabIndex={menuOpen ? 0 : -1}
          aria-label="Close navigation menu"
          onClick={closeMenu}
          className={cn(
            "absolute inset-0 bg-foreground/40 backdrop-blur-sm transition-opacity duration-300",
            menuOpen ? "opacity-100" : "opacity-0",
          )}
        />
        {/* Panel */}
        <div
          data-ocid="nav.mobile_panel"
          className={cn(
            "absolute right-0 top-0 flex h-full w-[82%] max-w-xs flex-col bg-card shadow-elevated transition-transform duration-300 ease-out",
            menuOpen ? "translate-x-0" : "translate-x-full",
          )}
        >
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <span className="font-display text-lg font-bold text-foreground">
              Menu
            </span>
            <button
              type="button"
              onClick={closeMenu}
              aria-label="Close navigation menu"
              data-ocid="nav.close_button"
              className="inline-flex size-9 items-center justify-center rounded-full border border-border text-foreground transition-smooth hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          </div>
          <nav
            aria-label="Mobile"
            className="flex flex-col gap-1 overflow-y-auto p-4"
          >
            {SECTIONS.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                onClick={closeMenu}
                data-ocid={`nav.mobile.${section.id}_link`}
                className={cn(
                  "rounded-xl px-4 py-3 text-base font-medium transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  activeId === section.id
                    ? "bg-primary/10 text-primary"
                    : "text-foreground hover:bg-secondary",
                )}
              >
                {section.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
