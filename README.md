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

- `public/badges/`: Apple's official "Download on the App Store" badge in Indonesian and English, from Apple Marketing Tools. Use them as they are; Apple does not allow changing the artwork.
- `public/clips/`: four short, silent screen recordings (pick a picture, painting, gallery, report) used in the "How to play" section, plus `highlights.mp4`, a 16-second montage used next to the headline at the top of the page. Each has a still poster. They were cut from a screen recording of the app and encoded as 960x720 H.264. See the README section on clips to redo them.
- `src/assets/critters/`: renders of the app's own 3D animals (from `animal_idle.usdz`). To redo them, build `scripts/render-critters.swift` (see the comment at its top), then run `node scripts/finish-critters.mjs <folder>`; it crops each animal into a square PNG. The old flat Figma art is in `docs/design-source/critters-2d/`.
- `src/assets/logo/`: the app's own letter SVGs. The hero logo is built from them as a still picture.
- `docs/design-source/`: the original Figma marketing frames, kept for reference only.

## Clips

The four videos in `public/clips/` come from one screen recording of the app (`lookie_demo.mov`, about two minutes). Each was cut at a screen change, with no sound:

| Clip | Part of the recording | What it shows |
| --- | --- | --- |
| `pick` | 0:04.85 to 0:11.3 | Choose a mode, choose Template, pick the octagon |
| `paint` | 0:26.5 to 0:42.0 | Hands and arms painting red and blue strokes |
| `gallery` | 1:41.0 to 1:46.2 | Swiping through the gallery wall |
| `report` | 1:49.1 to 2:03.0 | The per-painting report, then the overall report |

To cut one again (needs `ffmpeg`):

```bash
ffmpeg -ss 0:26.5 -to 0:42.0 -i lookie_demo.mov -an \
  -vf "fps=30,scale=960:720:flags=lanczos,format=yuv420p" \
  -c:v libx264 -preset slow -crf 27 -movflags +faststart public/clips/paint.mp4
```

`highlights.mp4` joins ten short cuts from the same recording, each at a screen change: home 0:03.1 to 0:04.2, mode 0:05.2 to 0:06.0, octagon 0:10.2 to 0:11.2, painting 0:30.0 to 0:32.5 and 0:44.5 to 0:46.5, the "Hore!" screen 0:49.5 to 0:51.0, a colourful painting 1:10.0 to 1:12.5, gallery 1:44.0 to 1:45.5, report 1:50.0 to 1:52.0 and its heatmap 1:55.0 to 1:56.5. Each cut is trimmed with `trim`, scaled to 960x720 and joined with the `concat` filter, with the same encoding settings as above.

Each clip also has a `.jpg` poster, shown before the video loads and when the visitor prefers reduced motion. Videos play only while they are on screen (`src/scripts/clips.ts`).

## Deploy

`.github/workflows/deploy.yml` builds and publishes to GitHub Pages on every push to `main`. The site is served from the custom domain `playwithlookie.com` (set in the repo's Settings, Pages, and in DNS at Hostinger), so the workflow builds with `SITE_URL=https://playwithlookie.com` and `SITE_BASE=/`. If the site ever moves back to a plain `github.io` project address, set `SITE_URL` to that address and `SITE_BASE` to `/` plus the repo name.

The last section links to the app's App Store page (`src/lib/links.ts`) and shows a QR code of the same link, drawn at build time. Set `PUBLIC_APPSTORE_URL` to use a different link.
