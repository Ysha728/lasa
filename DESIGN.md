# Design Brief

## Direction

**LASA Lavender Harvest** — a playful editorial food-journal where Filipino and global dishes are presented like collectible magazine features.

## Tone

Warm maximalist-but-organized: generous lavender canvas, expressive serif headlines, and candy-bright accent pops that feel student-made and joyful, never corporate.

## Differentiation

A "flavor passport" stamp motif — dotted-rule dividers, mono uppercase labels, and lime stamp badges — turns browsing food into collecting a journey.

## Color Palette

| Token      | OKLCH         | Role                                     |
| ---------- | ------------- | ---------------------------------------- |
| background | 0.975 0.014 300 | Lavender-tinted canvas (light primary) |
| foreground | 0.22 0.055 300  | Deep violet ink for text                 |
| card       | 1.0 0.004 300   | Near-white food card surface             |
| primary    | 0.52 0.235 300  | Vivid violet — CTAs, active nav, links   |
| accent     | 0.72 0.17 330   | Warm pink-lavender — hearts, highlights  |
| muted      | 0.94 0.022 300  | Section alternation + input fills        |
| success    | 0.68 0.16 145   | Lime stamp badges, collected passport    |
| warning    | 0.78 0.15 85    | Rating stars                             |

## Typography

- Display: **Fraunces** (variable serif) — hero, section headings, food names; `font-display font-bold tracking-tight`
- Body: **Figtree** — paragraphs, nav, buttons, card meta; `font-body`
- Mono: **JetBrains Mono** — uppercase eyebrow labels, region tags, passport counts
- Scale: hero `text-5xl md:text-7xl font-bold tracking-tight`, h2 `text-3xl md:text-5xl font-bold tracking-tight`, label `text-xs md:text-sm font-mono font-semibold tracking-[0.2em] uppercase`, body `text-base md:text-lg`

## Elevation & Depth

Layered lavender depth: flat `bg-background` canvas, `bg-card` surfaces lifted with `shadow-subtle`, hover raises to `shadow-elevated`; hero uses blurred gradient orbs and a `glass` sticky header rather than flat color.

## Structural Zones

| Zone    | Background            | Border        | Notes                                                        |
| ------- | --------------------- | ------------- | ------------------------------------------------------------ |
| Header  | `glass` over lavender | `border-b`    | Sticky, blurred, violet logo; pill Music toggle on the right |
| Content | `bg-background`       | —             | Alternate `bg-muted/40` + `bg-gradient-subtle` per section   |
| Cards   | `bg-card`             | `border`      | Rounded 20px, soft shadow, image top + content body          |
| Footer  | `bg-muted/50`         | `border-t`    | Dotted-rule top, tagline, quick links, social icon row       |

## Spacing & Rhythm

Sections use `py-16 md:py-24` with `max-w-6xl` containers and `gap-6 md:gap-8` grids; micro-spacing is 4/8/12/16px inside cards, 24px section-heading to content.

## Component Patterns

- Buttons: pill (`rounded-full`), `bg-primary` solid for primary CTA with `shadow-glow` on hover; outline variant uses `border-primary text-primary`; hover lifts `-translate-y-0.5`
- Cards: `rounded-[20px] bg-card border shadow-subtle`, image `aspect-[4/3] object-cover`, hover `shadow-elevated -translate-y-1`; heart button is a white circular overlay top-right
- Badges: pill `rounded-full` — region tags `bg-secondary text-secondary-foreground font-mono text-xs`; passport stamps `bg-success/15 text-success border-success/40`
- Modals: `rounded-3xl bg-popover shadow-elevated`, backdrop `bg-foreground/40 backdrop-blur-sm`, `animate-pop`
- Accordions: `rounded-2xl border bg-card`, trigger `font-display font-semibold`, chevron rotates, content uses `animate-accordion-down`

## Motion

- Entrance: `animate-fade-up` on scroll-visible sections, staggered 60–120ms; hero orbs `animate-float`
- Hover: cards lift + shadow deepen, buttons `-translate-y-0.5`, all via `transition-smooth` (0.3s)
- Decorative: `animate-pop` for modal/stamp reveal, `animate-shimmer` for video placeholders, `animate-pulse-soft` for music indicator

## Constraints

- Light theme is primary; `.dark` is a coherent violet-charcoal variant, not an inversion
- No horizontal scroll: `overflow-x-hidden` on body, single-column mobile grids, `flex-wrap` nav
- All colors via semantic OKLCH tokens; no hex/rgb/arbitrary color classes in components
- Respect `prefers-reduced-motion` by keeping animations subtle and non-blocking

## Signature Detail

The **passport stamp system** — mono uppercase eyebrow labels on dotted-rule dividers with lime "collected" stamp badges — makes exploring food feel like filling a travel passport.
