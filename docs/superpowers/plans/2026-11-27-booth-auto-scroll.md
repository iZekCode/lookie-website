# Booth Auto Scroll Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** With `?booth` in the address, the landing page scrolls by itself in a loop whenever nobody is touching it.

**Architecture:** A pure state machine in `booth-loop.ts` decides where the page should be at each moment. `booth.ts` connects it to the window: animation frames, input events, wake lock and link blocking. `lang.ts` keeps the flag across the language switch.

**Tech Stack:** Astro, TypeScript, Node 24 built-in test runner (`node --test`, no new dependency).

**Spec:** `docs/superpowers/specs/2026-11-27-booth-auto-scroll-design.md`

## Global Constraints

- Without `?booth`, nothing changes.
- Quiet spell 30000 ms, speed 60 px per second, stop at bottom 4000 ms, glide to top 2500 ms, stop at top 3000 ms.
- Booth mode runs only on the two landing pages (`document.documentElement.dataset.home === 'true'`) and ignores reduced motion.
- No new dependency.
- Each file starts with a one-line `//` comment in everyday words, like the other files in `src/scripts/`.
- Work on branch `feat/booth-auto-scroll`. Never push: a push to `main` deploys.

## Review Focus

- A mouse resting on the screen: some browsers send move events while content scrolls under it. An unchanged pointer position must not count as input.
- The tab is hidden or the screen sleeps, then returns: the page continues from where it was, with no jump.
- Rotating or resizing during a scroll: the position stays inside the new page height.
- A page that does not scroll (height fits the window): nothing happens.
- The wake lock is refused or missing (low battery, older browser): scrolling still works.

---

### Task 1: The loop logic

**Files:**
- Create: `src/scripts/booth-loop.ts`
- Test: `tests/booth-loop.test.ts`
- Modify: `package.json` (add script `"test": "node --test tests/*.test.ts"`)

**Interfaces:**
- Produces:
  - `type BoothState = { phase: 'quiet' | 'down' | 'bottom' | 'glide' | 'top'; since: number; last: number; y: number }`
  - `quiet(now: number): BoothState` (used at start and after every input)
  - `step(state: BoothState, now: number, y: number, maxY: number): BoothState`
  - `isBooth(search: string): boolean`
  - `withBooth(href: string): string` (absolute URL in and out)

Rules for `step`: times are milliseconds. `y` is the real scroll position and is read only when leaving `quiet`; afterwards `state.y` is where the page should be, kept as a fraction. One call advances at most 100 ms of scrolling. `maxY <= 0` returns `quiet(now)`.

- [ ] **Step 1: Write the failing tests**

```ts
// Checks where the booth loop puts the page over time.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isBooth, quiet, step, withBooth, type BoothState } from '../src/scripts/booth-loop.ts';

// Calls step every 100 ms from `from` up to and including `to`.
function run(state: BoothState, from: number, to: number, maxY: number, y = 0): BoothState {
  for (let now = from; now <= to; now += 100) state = step(state, now, y, maxY);
  return state;
}

test('stays quiet for 30 seconds, then starts from where the visitor left', () => {
  let s = step(quiet(0), 29999, 500, 1000);
  assert.equal(s.phase, 'quiet');
  s = step(s, 30000, 500, 1000);
  assert.equal(s.phase, 'down');
  assert.equal(s.y, 500);
});

test('scrolls 60 px per second', () => {
  const s = run(step(quiet(0), 30000, 0, 1000), 30100, 31000, 1000);
  assert.ok(Math.abs(s.y - 60) < 0.001);
});

test('a long gap does not jump', () => {
  const s = step(step(quiet(0), 30000, 0, 1000), 90000, 0, 1000);
  assert.ok(Math.abs(s.y - 6) < 0.001);
});

test('waits at the bottom, glides up, waits, goes again', () => {
  let s = run(step(quiet(0), 30000, 0, 60), 30100, 31100, 60);
  assert.equal(s.phase, 'bottom');
  assert.equal(s.y, 60);
  const bottom = s.since;
  s = step(s, bottom + 4000, 60, 60);
  assert.equal(s.phase, 'glide');
  s = step(s, bottom + 4000 + 1250, 60, 60);
  assert.ok(s.y > 0 && s.y < 60);
  s = step(s, bottom + 4000 + 2500, 60, 60);
  assert.equal(s.phase, 'top');
  assert.equal(s.y, 0);
  s = step(s, s.since + 3000, 0, 60);
  assert.equal(s.phase, 'down');
});

test('a shorter page after rotating keeps the position inside it', () => {
  const down = step(quiet(0), 30000, 900, 1000);
  const s = step(down, 30100, 900, 400);
  assert.equal(s.y, 400);
});

test('a page that does not scroll stays quiet', () => {
  assert.equal(step(quiet(0), 60000, 0, 0).phase, 'quiet');
});

test('reads and adds the booth flag', () => {
  assert.equal(isBooth('?booth'), true);
  assert.equal(isBooth(''), false);
  assert.equal(isBooth('?boothx=1'), false);
  const url = new URL(withBooth('https://example.com/en/#cara-main'));
  assert.equal(url.pathname, '/en/');
  assert.equal(url.hash, '#cara-main');
  assert.equal(isBooth(url.search), true);
});
```

- [ ] **Step 2:** Run `npm test`. Expected: FAIL, `booth-loop.ts` not found.
- [ ] **Step 3:** Implement the interfaces above in `src/scripts/booth-loop.ts`, with no imports and no use of `window` or `document`. The glide eases in and out.
- [ ] **Step 4:** Run `npm test`. Expected: 7 tests pass.
- [ ] **Step 5:** Commit `package.json`, the two new files, the spec and this plan: `feat: loop logic for the booth auto scroll`.

### Task 2: Connect it to the page

**Files:**
- Create: `src/scripts/booth.ts`
- Modify: `src/scripts/site.ts` (import and call `initBooth()` after `initLang()`)
- Modify: `src/scripts/lang.ts` (both places that navigate)
- Modify: `README.md` (short "Booth mode" section: the address, what it does, turn off Auto-Lock, needs internet)

**Interfaces:**
- Consumes: everything Task 1 produces.
- Produces: `initBooth(): void`

`initBooth` does nothing unless `isBooth(location.search)` and the page is a landing page. When on:

- Every animation frame, call `step` with `performance.now()`, `window.scrollY` and `scrollHeight - innerHeight`. When the phase is not `quiet`, call `window.scrollTo({ top: state.y, behavior: 'instant' })`, so the smooth scrolling set in CSS does not interfere.
- `pointerdown`, `pointerup`, `pointermove`, `touchstart`, `touchmove`, `touchend`, `wheel` and `keydown` set the state to `quiet(now)`. Listeners are passive. A `pointermove` whose `screenX` and `screenY` equal the previous ones is ignored.
- A capturing `click` listener on `document` calls `preventDefault()` on any link whose `href` attribute does not start with `#`, except links inside `[data-lang-toggle]`.
- Ask for `navigator.wakeLock.request('screen')` at start and again on each `visibilitychange` to visible. Catch and ignore failure and absence.

In `lang.ts`, when `isBooth(location.search)`, the target of the saved language redirect and of the switch click goes through `withBooth(...)`.

- [ ] **Step 1:** Make the three code changes and the README section.
- [ ] **Step 2:** Run `npm test && npm run build`. Expected: 7 tests pass, build completes with no error.
- [ ] **Step 3:** Run `npm run dev` and check in a browser:
  - `/?booth`: after 30 s the page scrolls, stops at the bottom, glides up, starts again.
  - A click or wheel stops it at once; it resumes 30 s later from that spot.
  - The App Store badge and footer links do nothing; "how to play" in the header still jumps.
  - EN switch lands on `/en/?booth=`, and reloading `/?booth` with that saved choice keeps the flag.
  - Mouse resting over the page while it scrolls: it keeps scrolling.
  - `/` without the flag: no movement after 40 s, links work.
- [ ] **Step 4:** Commit: `feat: booth mode scrolls the landing page by itself`.

Not checked by this plan: a real booth device (iPad Safari wake lock, touch). Check that on the device after deploy.
