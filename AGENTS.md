# Project Guidance

## User Preferences

- Purple/lavender modern creative aesthetic theme
- Lively, fun, unique, student-friendly feel
- Fully responsive for mobile, tablet, and desktop
- Smooth scrolling and simple animations
- Attractive food cards with images
- Simple, easy-to-understand navigation
- No horizontal scrolling on mobile
- Clean, organized layout
- Music must not auto-play with sound; visible Music On/Off button
- Video placeholders clearly labeled and easy to replace later
- Social links easy to replace with the group's actual pages later
- Keep the original LASA identity and title unchanged

## Verified Commands

- **typecheck**: `pnpm typecheck`
- **fix**: `pnpm fix`
- **build**: `pnpm build`

## Learnings

- LASA is a single-page React app with anchor-based sections; App.tsx mounts all 12 sections and each section component owns its own Section wrapper with the matching id (e.g. HomeSection renders id='home').
- Biome rejects role="dialog"/"group"/"radio" on divs and buttons; use native <dialog>, <fieldset>, and <input type="radio"> for modals, filter groups, and star ratings.
- Manual OQL entities for per-caller Map<Principal, Map<Nat, T>> storage must promote the outer map key into an explicit .payload("owner", ...) column plus .ownedBy("owner"), or the canister traps at install with 'OQL: owner field is not a field of <entity>'.
- With [canisters.backend.migrations] check-limit=1 only one pending migration may exist; fold the superseded baseline away and match the remaining migration's OldActor to the deployed .old signature.
- mo:core/Time.now() returns Int, so Nat timestamp fields need Int.abs(Time.now()).
- This moc (1.16.0) does not accept triple-quoted multi-line Text literals; author long static docs as a single-line literal with \n escapes and no trailing ';' after the literal.
- Tester-authored tests live under src/frontend/src/**/*.test.tsx and test/pocketic/; production workers must not edit them.
