
import { MusicToggle } from "@/components/MusicToggle";
import { TAGLINE } from "@/data/sections";

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

const NAV_ITEMS: { label: string; tab: SiteTab }[] = [
  { label: "Home", tab: "Home" },
  { label: "Local", tab: "Local Flavors" },
  { label: "Global", tab: "International Flavors" },
  { label: "Videos", tab: "Food Videos" },
  { label: "Passport", tab: "Flavor Passport" },
  { label: "About", tab: "About Us" },
  { label: "FAQ", tab: "FAQ" },
  { label: "Reviews", tab: "Reviews" },
  { label: "Comments", tab: "Comments" },
  { label: "Suggest", tab: "Suggestions Box" },
  { label: "Contact", tab: "Contact Us" },
  { label: "Follow Us", tab: "Follow Us" },
];

type NavbarProps = {
  onNavigate: (tab: SiteTab) => void;
};

export function Navbar({ onNavigate }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-background/95 text-foreground shadow-sm backdrop-blur-xl">
      {/* Logo and music control */}
      <div className="mx-auto flex min-h-[72px] max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <button
          type="button"
          onClick={() => onNavigate("Home")}
          aria-label="Go to LASA home"
          className="group flex min-w-0 shrink-0 items-center gap-2.5 rounded-lg text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-gradient-primary font-display text-xl font-bold text-primary-foreground shadow-subtle transition-transform group-hover:scale-105">
            L
          </span>

          <span className="flex min-w-0 flex-col leading-tight">
            <span className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              LASA
            </span>
            <span className="mt-1 hidden max-w-56 text-[9px] uppercase tracking-[0.12em] text-muted-foreground sm:block">
              {TAGLINE}
            </span>
          </span>
        </button>

        <MusicToggle />
      </div>

      {/* Always-visible navigation */}
      <nav
        aria-label="Main navigation"
        className="mx-auto flex w-full max-w-7xl gap-1 overflow-x-auto overscroll-x-contain border-t border-border/50 px-3 py-2 [scrollbar-width:thin] sm:px-6"
      >
        {NAV_ITEMS.map(({ label, tab }) => (
          <button
            key={tab}
            type="button"
            onClick={() => onNavigate(tab)}
            className="shrink-0 rounded-full px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-secondary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:px-4"
          >
            {label}
          </button>
        ))}
      </nav>
    </header>
  );
}
