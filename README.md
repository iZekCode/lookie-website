# Lookie website

The marketing site and legal pages for [Lookie](https://github.com/iZekCode/Lookie), the painting-in-the-air iPad app for children. It replaces the old `lookie-site` repo, which only held the privacy policy, terms and support pages.

Built with Astro. Everything is static HTML, with a little TypeScript for the motion.

## Run it

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # writes dist/
```

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
- `src/assets/critters/`: the four animals from Figma. The Figma export has a white box behind each one, so `scripts/cutout.mjs` turns it transparent (already done; run it again only for new exports).
- `src/assets/logo/`: the app's own letter SVGs. The eyes in the hero are real paths, so the pupils can follow the pointer.
- `docs/design-source/`: the original Figma marketing frames, kept for reference only.

## Deploy

`.github/workflows/deploy.yml` builds and publishes to GitHub Pages on every push to `main`. It reads the base path from the repo name, so renaming the repo is enough to move the site's URL.

Optional: set `PUBLIC_TESTFLIGHT_URL` at build time to show a TestFlight button in the last section. Without it the button stays hidden.
