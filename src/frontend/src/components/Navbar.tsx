
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { MusicToggle } from "@/components/MusicToggle";
import { TAGLINE } from "@/data/sections";
import { cn } from "@/lib/utils";

export type SiteTab =
  | "Home"
  | "Local Flavors"
  | "International Flavors"
  | "Food Videos"
  | "Flavor Passport"
  | "About Us"
  | "FAQ"
  | "Reviews"
  | "Comments"
  | "Suggestions Box"
  | "Contact Us"
  | "Follow Us";

const NAV_ITEMS: SiteTab[] = [
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
];

type NavbarProps = {
  onNavigate: (tab: SiteTab) => void;
};

export function Navbar({ onNavigate }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = (tab: SiteTab) => {
    setMenuOpen(false);
    onNavigate(tab);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/90 text-foreground shadow-sm backdrop-blur-xl">
      <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between gap-3 px-4 py-2 sm:px-6">
        <button
          type="button"
          onClick={() => navigate("Home")}
          aria-label="Go to LASA home"
          className="group flex min-w-0 items-center gap-2.5 rounded-lg text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-gradient-primary font-display text-xl font-bold text-primary-foreground shadow-subtle transition-transform group-hover:scale-105">
            L
          </span>
          <span className="flex min-w-0 flex-col leading-none">
            <span className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              LASA
            </span>
            <span className="hidden max-w-48 truncate pt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground sm:block">
              {TAGLINE}
            </span>
          </span>
        </button>

        <div className="flex shrink-0 items-center gap-2">
          <MusicToggle />
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={menuOpen}
            aria-controls="site-navigation"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-border bg-card px-3 text-sm font-semibold text-card-foreground transition-colors hover:border-primary hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Menu className="size-5" aria-hidden="true" />
            <span>Menu</span>
          </button>
        </div>
      </div>

      <div
        className={cn(
          "fixed inset-0 z-[60] transition",
          menuOpen
            ? "pointer-events-auto visible"
            : "pointer-events-none invisible"
        )}
        aria-hidden={!menuOpen}
      >
        <button
          type="button"
          tabIndex={menuOpen ? 0 : -1}
          aria-label="Close navigation menu"
          onClick={() => setMenuOpen(false)}
          className={cn(
            "absolute inset-0 bg-foreground/40 backdrop-blur-sm transition-opacity duration-300",
            menuOpen ? "opacity-100" : "opacity-0"
          )}
        />

        <aside
          id="site-navigation"
          aria-label="Website navigation"
          className={cn(
            "absolute right-0 top-0 flex h-full w-[88%] max-w-sm flex-col overflow-hidden border-l border-border bg-background text-foreground shadow-elevated transition-transform duration-300 ease-out",
            menuOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="flex shrink-0 items-center justify-between border-b border-border px-5 py-4">
            <div>
              <p className="font-display text-xl font-bold">LASA Menu</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Explore every flavor
              </p>
            </div>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Close navigation menu"
              className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-card text-card-foreground transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          </div>

          <nav
            aria-label="Website sections"
            className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto p-4"
          >
            {NAV_ITEMS.map((tab, index) => (
              <button
                key={tab}
                type="button"
                onClick={() => navigate(tab)}
                className="w-full shrink-0 rounded-xl border border-border bg-card px-4 py-3 text-left text-sm font-semibold text-card-foreground transition-colors hover:border-primary hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {tab}
              </button>
            ))}
          </nav>
        </aside>
      </div>
    </header>
  );
}
