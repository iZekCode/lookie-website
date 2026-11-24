# Lookie website

The marketing site and legal pages for [Lookie](https://github.com/iZekCode/Lookie), the painting-in-the-air iPad app for children. It replaces the old `lookie-site` repo, which only held the privacy policy, terms and support pages.

Built with Astro. Everything is static HTML, with a little TypeScript for the motion.

## Run it

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # writes dist/
```

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

- `public/clips/`: four short, silent screen recordings (pick a picture, painting, gallery, report) used in the "How to play" section, each with a still poster. They were cut from a screen recording of the app and encoded as 960x720 H.264. See the README section on clips to redo them.
- `src/assets/critters/`: renders of the app's own 3D animals (from `animal_idle.usdz`). To redo them, build `scripts/render-critters.swift` (see the comment at its top), then run `node scripts/finish-critters.mjs <folder>`; it crops each animal into a square PNG. The old flat Figma art is in `docs/design-source/critters-2d/`.
- `src/assets/logo/`: the app's own letter SVGs. The eyes in the hero are real paths, so the pupils can follow the pointer.
- `docs/design-source/`: the original Figma marketing frames, kept for reference only.

## Clips

The four videos in `public/clips/` come from one screen recording of the app (`lookie_demo.mov`, about two minutes). Each was cut at a screen change, with no sound:

| Clip | Part of the recording | What it shows |
| --- | --- | --- |
| `pick` | 0:03.1 to 0:11.3 | Home screen, choose a mode, choose Template, pick the octagon |
| `paint` | 0:26.5 to 0:42.0 | Hands and arms painting red and blue strokes |
| `gallery` | 1:41.0 to 1:46.2 | Swiping through the gallery wall |
| `report` | 1:49.1 to 2:03.0 | The per-painting report, then the overall report |

To cut one again (needs `ffmpeg`):

```bash
ffmpeg -ss 0:26.5 -to 0:42.0 -i lookie_demo.mov -an \
  -vf "fps=30,scale=960:720:flags=lanczos,format=yuv420p" \
  -c:v libx264 -preset slow -crf 27 -movflags +faststart public/clips/paint.mp4
```

Each clip also has a `.jpg` poster, shown before the video loads and when the visitor prefers reduced motion. Videos play only while they are on screen (`src/scripts/clips.ts`).

## Deploy

`.github/workflows/deploy.yml` builds and publishes to GitHub Pages on every push to `main`. It reads the base path from the repo name, so renaming the repo is enough to move the site's URL.

The last section links to the public TestFlight invite (`src/lib/links.ts`) and shows a QR code of the same link, drawn at build time. Set `PUBLIC_TESTFLIGHT_URL` to use a different invite. The App Store button is a placeholder until the app is released.
