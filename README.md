# Lookie website

The marketing site and legal pages for [Lookie](https://github.com/iZekCode/Lookie), the painting-in-the-air iPad app for children. It replaces the old `lookie-site` repo, which only held the privacy policy, terms and support pages.

Built with Astro. Everything is static HTML, with a little TypeScript for the motion.

## Run it

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # writes dist/
```

## The opening and scroll story

The top of the landing page is one pinned story (`Story.astro`, `src/scripts/story.ts`):

1. A full-screen blue page with two big cute eyes. They look left and right, blink twice and slide onto a ladybug's face while the ladybug is drawn around them. Any scroll, tap or key skips it, and it plays once per browser session.
2. Scrolling slides the butterfly, bee and snail out from behind the ladybug until the four stand in a row. The row then drops to the bottom while the headline fades in and the blue turns to cream.
   Every animal wears the same cute eyes (`src/lib/eyes.ts`) on top of its own 3D eyes, slightly larger so they hide them. The pupils follow the pointer. Eye positions inside each picture are in `src/lib/animalEyes.ts`; update them if a critter picture changes.
3. `ParallaxCanvas.astro` (`src/scripts/canvas.ts`) is a big canvas that the page scrolls through, with layers at different speeds and paint strokes that draw themselves.

With reduced motion enabled, or without scripting, none of this runs: the hero is a plain static layout with the four animals in the corners.

## Look

Soft 3D: puffy surfaces lit from the top left (the `.puffy` class in `src/styles/global.css`, tinted with `--tint`), glossy buttons like the logo's letters, and cloudy section edges (`.sheet::before`). No outlines and no hard shadows. A section sets `--bg` to its own colour so the cloud edge matches it.

## Pages

| Indonesian | English | What |
|---|---|---|
| `/` | `/en/` | Landing page |
| `/privacy/` | `/en/privacy/` | Privacy policy |
| `/terms/` | `/en/terms/` | Terms of use |
| `/support/` | `/en/support/` | Support and FAQ |

The old site used the same paths, so links already inside the app (`LegalLinks.swift`) keep working if the repo is published under the same name.

## Language

Indonesian is the default and English lives under `/en`. The ID/EN switch in the header jumps to the same page in the other language and remembers the choice for the landing page.

- Site copy: `src/i18n/id.ts` and `src/i18n/en.ts`. Both have the same shape, so a missing key is a type error.
- Legal text: `src/content/legal/<page>.<lang>.md`. When the privacy policy or terms change in substance, raise `ConsentPolicy.currentVersion` in the app too.

## Pictures

- `src/assets/app/`: simulator screenshots (cropped to the app's own landscape frame) and the hand images from the app's asset catalog.
- `src/assets/critters/`: renders of the app's own 3D animals (from `animal_idle.usdz`). To redo them, build `scripts/render-critters.swift` (see the comment at its top), then run `node scripts/finish-critters.mjs <folder>`; it crops each animal and prints where the eyes are, which go into `src/lib/animalEyes.ts`. The old flat Figma art is in `docs/design-source/critters-2d/`.
- `src/assets/logo/`: the app's own letter SVGs. The eyes in the hero are real paths, so the pupils can follow the pointer.
- `docs/design-source/`: the original Figma marketing frames, kept for reference only.

## Deploy

`.github/workflows/deploy.yml` builds and publishes to GitHub Pages on every push to `main`. It reads the base path from the repo name, so renaming the repo is enough to move the site's URL.

Optional: set `PUBLIC_TESTFLIGHT_URL` at build time to show a TestFlight button in the last section. Without it the button stays hidden.
