# Booth auto scroll: short design

## Intent

At an exhibition booth, the landing page moves by itself when nobody is touching it, so it keeps showing Lookie and catches the eye of people walking past.

## Goals, non-goals, anti-goals

- Goal: after a quiet spell, the page scrolls from top to bottom and starts again, for as long as the booth is open.
- Non-goals: offline support, a separate booth page, new content.
- Anti-goal: an ordinary visitor ever seeing the page move on its own.

## Approaches

- **A. Flow slowly (picked).** Continuous scroll to the bottom, a short stop, glide back to the top, repeat. Draws the eye and is the simplest. Text is read while it moves.
- **B. Section by section.** Stop on each section, then jump to the next. Easier to read, but sections taller than the screen need extra rules.
- **C. Endless loop.** The hero follows the last section with no return. Smoothest, but the page has to be duplicated.

## Behaviour

Decided by the owner:

- For a booth. Scrolls automatically when nobody touches it. Motion A.

Proposed defaults (change any of them):

- Booth mode is on only when the address has `?booth`, on the Indonesian and English landing pages.
- Scrolling starts after 30 seconds without input, at about 60 pixels per second.
- It stops 4 seconds at the bottom, glides back to the top, stops 3 seconds, and goes again.
- Touch, click, mouse movement, wheel or a key stops it at once and restarts the 30 second count. It resumes from where the visitor left the page.
- The screen is kept awake where the browser allows it. Auto-Lock should still be turned off on the device.
- Links that leave the landing page (App Store, privacy, terms, support) do nothing when tapped. The QR code stays visible for scanning. Links that jump within the page still work.
- The ID/EN switch still works and keeps `?booth`, including the automatic redirect to the saved language.
- Booth mode scrolls even if the device asks for reduced motion, because turning it on is deliberate.

## Constraints

- Static Astro site, TypeScript for motion, no new dependency.
- Without `?booth`, nothing changes.
- A push to `main` deploys to playwithlookie.com.
- `html` has `scroll-behavior: smooth`, which must not interfere with the frame by frame scroll.

## Left to the builder

- Where the code lives (expected: `src/scripts/booth.ts`, started from `src/scripts/site.ts`, with a small change in `src/scripts/lang.ts`).
- Easing of the glide back to the top.

## Check

`npm run build` passes. In a browser: with `?booth` the page starts after the quiet spell, stops on input, loops, and keeps `?booth` across the language switch; without it the page never moves.
