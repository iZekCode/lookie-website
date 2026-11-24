// The opening and the scroll story.
// Opening: two big eyes look around, blink twice and slide onto a ladybug's face while the ladybug is drawn around them.
// Scroll: three more animals slide out from behind the ladybug and line up with it in a row. The row drops to the bottom while the headline comes in.
// Every animal wears cute eyes that follow the pointer.
import { ANIMAL_EYES, COVER, PIC, SCLERA, type EyeBox } from '../lib/animalEyes';

const html = document.documentElement;

const clamp = (n: number, a = 0, b = 1) => Math.min(b, Math.max(a, n));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const sleep = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms));

// The size the opening eye elements have in CSS; everything else is a scale of this.
const EYE_W = 200;
const EYE_H = 260;

interface Slot {
  x: number;
  y: number;
  size: number;
  rot: number;
}
interface Eye {
  cx: number;
  cy: number;
  w: number;
  h: number;
}

export function initStory() {
  const root = document.querySelector<HTMLElement>('[data-story]');
  if (!root || !html.classList.contains('story-js')) return;
  const stage = root.querySelector<HTMLElement>('.stage')!;
  const pals = [...root.querySelectorAll<HTMLElement>('[data-pal]')];
  const peyes = [...root.querySelectorAll<HTMLElement>('[data-peye]')];
  const openingEyes = [...root.querySelectorAll<HTMLElement>('[data-oeye]')];
  const copy = root.querySelector<HTMLElement>('[data-copy]')!;
  const hint = root.querySelector<HTMLElement>('[data-hint]')!;

  let W = 0;
  let H = 0;
  let B = 0;
  let soloEye: Slot;
  let soloCenter: Slot;
  // 1 while the opening lines the ladybug's eyes up with the big eyes, then eases to 0 as it settles in the middle.
  let shift = html.classList.contains('opening') ? 1 : 0;
  let rowMid: Slot[] = [];
  let rowEnd: Slot[] = [];
  let target = 0;
  let current = 0;
  let raf = 0;
  let inView = true;

  function measure() {
    W = stage.clientWidth;
    H = stage.clientHeight;
    const cx = W / 2;
    const cy = H / 2;
    B = Math.min(W * 0.86, H * 0.74);
    stage.style.setProperty('--pal', `${B}px`);
    const mid = eyeMid(0);
    soloEye = { x: cx - (mid.x / PIC - 0.5) * B, y: cy - (mid.y / PIC - 0.5) * B, size: B, rot: 0 };
    soloCenter = { x: cx, y: cy, size: B, rot: 0 };

    const portrait = W < H * 0.95;
    const rots = [-6, 5, -4, 6];
    // Four animals side by side, in the middle of the screen...
    const s1 = portrait ? Math.min(W * 0.34, H * 0.3) : Math.min(W * 0.25, H * 0.42);
    const g1 = portrait ? W * 0.235 : s1 * 0.92;
    rowMid = rots.map((rot, i) => ({ x: cx + (i - 1.5) * g1, y: cy, size: s1, rot }));
    // ...which then drop to the bottom and make room for the headline.
    const s2 = portrait ? Math.min(W * 0.3, H * 0.16) : Math.min(W * 0.22, H * 0.28);
    const g2 = portrait ? W * 0.235 : s2 * 0.95;
    const y2 = H * (portrait ? 0.88 : 0.8);
    rowEnd = rots.map((rot, i) => ({ x: cx + (i - 1.5) * g2, y: y2, size: s2, rot: rot * 0.7 }));
    render(current);
  }

  const mix = (a: Slot, b: Slot, t: number): Slot => ({
    x: lerp(a.x, b.x, t),
    y: lerp(a.y, b.y, t),
    size: lerp(a.size, b.size, t),
    rot: lerp(a.rot, b.rot, t),
  });

  function eyeMid(i: number) {
    const e = ANIMAL_EYES[i];
    return { x: (e.l.x + e.r.x) / 2, y: (e.l.y + e.r.y) / 2 };
  }

  // Where one of the ladybug's eyes lands on screen once it sits in a slot.
  function eyeOn(slot: Slot, box: EyeBox): Eye {
    const dx = (box.x / PIC - 0.5) * slot.size;
    const dy = (box.y / PIC - 0.5) * slot.size;
    const a = (slot.rot * Math.PI) / 180;
    return {
      cx: slot.x + dx * Math.cos(a) - dy * Math.sin(a),
      cy: slot.y + dx * Math.sin(a) + dy * Math.cos(a),
      w: ((box.w / PIC) * slot.size * COVER) / SCLERA.w,
      h: ((box.h / PIC) * slot.size * COVER) / SCLERA.h,
    };
  }

  const eyeMatrix = (e: Eye, scale = 1) =>
    `translate(${e.cx - EYE_W / 2}px, ${e.cy - EYE_H / 2}px) scale(${(e.w / EYE_W) * scale}, ${(e.h / EYE_H) * scale})`;

  function render(raw: number, now = 0) {
    // The last stretch of scroll just holds the finished picture.
    const p = clamp(raw / 0.9);
    const s = clamp((p - 0.05) / 0.4);
    const gather = ease(clamp((p - 0.54) / 0.28));
    const bgT = ease(clamp((p - 0.5) / 0.3));
    const fade = ease(clamp((p - 0.84) / 0.16));
    const textT = ease(clamp((p - 0.64) / 0.24));
    const calm = clamp((p - 0.86) / 0.08);
    const opening = html.classList.contains('opening');
    const solo = mix(soloCenter, soloEye, shift);

    pals.forEach((pal, i) => {
      const dir = i % 2 ? 1 : -1;
      // The ladybug walks to the left end of the row. The others start small, hidden behind it, and slide out.
      const own = i === 0 ? ease(s) : ease(clamp((s - 0.08 * (i - 1)) / (1 - 0.2)));
      const start: Slot = i === 0 ? solo : { x: solo.x, y: solo.y, size: B * 0.45, rot: 0 };
      const slot = mix(mix(start, rowMid[i], own), rowEnd[i], gather);
      slot.rot += Math.sin(Math.PI * own) * 12 * dir;
      // A little idle sway once everything has settled.
      if (calm > 0 && now) {
        slot.y += Math.sin(now / 650 + i * 1.7) * 6 * calm;
        slot.rot += Math.sin(now / 820 + i * 2.3) * 2.2 * calm;
      }
      pal.style.transform = `translate(${slot.x - B / 2}px, ${slot.y - B / 2}px) rotate(${slot.rot}deg) scale(${slot.size / B})`;
      if (i > 0) pal.style.opacity = String(clamp(s * 25));
    });

    // Blue turns to cream, then lets the page's own wallpaper show through.
    const r = Math.round(lerp(45, 255, bgT));
    const g = Math.round(lerp(125, 244, bgT));
    const b = Math.round(lerp(230, 220, bgT));
    stage.style.setProperty('--stage-bg', `rgb(${r} ${g} ${b} / ${1 - fade})`);

    copy.style.opacity = String(textT);
    copy.style.transform = `translateY(${(1 - textT) * 36}px) scale(${lerp(0.94, 1, textT)})`;
    copy.inert = textT < 0.5;
    copy.style.pointerEvents = textT < 0.5 ? 'none' : '';

    if (!opening) hint.style.opacity = String(1 - clamp(p / 0.06));
    root.classList.toggle('settled', calm > 0.5);
    return calm > 0;
  }

  function readScroll() {
    const total = root!.offsetHeight - H;
    target = clamp(-root!.getBoundingClientRect().top / total);
    if (!raf) raf = requestAnimationFrame(tick);
  }

  function tick(now: number) {
    raf = 0;
    current += (target - current) * 0.12;
    if (Math.abs(target - current) < 0.0003) current = target;
    const swaying = render(current, now);
    if (current !== target || (swaying && inView)) raf = requestAnimationFrame(tick);
  }

  window.addEventListener('scroll', readScroll, { passive: true });
  window.addEventListener('resize', () => {
    measure();
    readScroll();
  });
  new IntersectionObserver((entries) => {
    inView = entries[0].isIntersecting;
    if (inView && !raf) raf = requestAnimationFrame(tick);
  }).observe(stage);

  measure();
  current = target = clamp(-root.getBoundingClientRect().top / (root.offsetHeight - H));
  render(current);

  // ---------- pupils ----------
  // All eyes are drawn the same way, so the pupil's room to move is measured once.
  const sample = openingEyes[0].querySelector<SVGSVGElement>('svg')!;
  const sclera = sample.querySelector<SVGGraphicsElement>('.sclera')!.getBBox();
  const pupilBox = sample.querySelector<SVGGraphicsElement>('.pupil')!.getBBox();
  const room = {
    nx: pupilBox.x + pupilBox.width / 2 - (sclera.x + sclera.width / 2),
    ny: pupilBox.y + pupilBox.height / 2 - (sclera.y + sclera.height / 2),
    lx: ((sclera.width - pupilBox.width) / 2) * 0.9,
    ly: ((sclera.height - pupilBox.height) / 2) * 0.9,
  };
  const look = (eye: HTMLElement, ux: number, uy: number) => {
    const pupil = eye.querySelector<SVGGraphicsElement>('.pupil');
    if (pupil) pupil.style.transform = `translate(${ux * room.lx - room.nx}px, ${uy * room.ly - room.ny}px)`;
  };
  [...openingEyes, ...peyes].forEach((e) => look(e, 0, 0.1));

  // After the opening the pupils follow the pointer: up and to the right of an eye means the pupil goes up and to the right.
  let pointer: { x: number; y: number } | null = null;
  let lookQueued = false;
  let lastMove = 0;
  const lookAtPointer = () => {
    lookQueued = false;
    if (!pointer || !inView) return;
    for (const eye of peyes) {
      if (!eye.offsetParent) continue;
      const rect = eye.getBoundingClientRect();
      const dx = pointer.x - (rect.left + rect.width / 2);
      const dy = pointer.y - (rect.top + rect.height / 2);
      const dist = Math.hypot(dx, dy) || 1;
      const k = Math.min(1, dist / 110);
      look(eye, (dx / dist) * k, (dy / dist) * k);
    }
  };
  window.addEventListener(
    'pointermove',
    (event) => {
      pointer = { x: event.clientX, y: event.clientY };
      lastMove = performance.now();
      if (lookQueued || html.classList.contains('opening')) return;
      lookQueued = true;
      requestAnimationFrame(lookAtPointer);
    },
    { passive: true },
  );
  // With no pointer around (a phone), the eyes glance about now and then.
  window.setInterval(() => {
    if (html.classList.contains('opening') || !inView || performance.now() - lastMove < 3000) return;
    const ux = Math.random() * 2 - 1;
    const uy = Math.random() * 1.4 - 0.7;
    peyes.forEach((e, i) => i % 2 === 0 && look(e, ux, uy));
    peyes.forEach((e, i) => i % 2 === 1 && look(e, ux, uy));
  }, 2200);

  if (html.classList.contains('opening')) playOpening();
  else hint.style.opacity = '1';

  // ---------- the opening ----------
  async function playOpening() {
    let stopped = false;
    const anims: Animation[] = [];
    const run = (el: Element, frames: Keyframe[], options: KeyframeAnimationOptions) => {
      const a = el.animate(frames, { fill: 'forwards', ...options });
      anims.push(a);
      return a.finished.catch(() => undefined);
    };

    const finish = (immediate = true) => {
      if (stopped) return;
      stopped = true;
      anims.forEach((a) => a.cancel());
      // The ladybug's own cute eyes take over from the big ones, looking where they were looking.
      const pupilOf = (e: HTMLElement) => e.querySelector<SVGGraphicsElement>('.pupil')?.style.transform ?? '';
      pals[0].querySelectorAll<HTMLElement>('[data-peye]').forEach((e, i) => {
        const pupil = e.querySelector<SVGGraphicsElement>('.pupil');
        if (pupil) pupil.style.transform = pupilOf(openingEyes[i]);
      });
      html.classList.remove('opening');
      if (immediate) shift = 0;
      try {
        sessionStorage.setItem('lookie-opened', '1');
      } catch {
        // Fine without storage: the opening just plays again next visit.
      }
      pals[0].style.clipPath = 'none';
      render(current);
    };

    // Any scroll, tap or key during the opening skips straight to the end.
    const skip = () => {
      cleanup();
      finish();
      hint.style.opacity = '1';
    };
    const keys = (e: KeyboardEvent) => {
      if (['ArrowDown', ' ', 'PageDown', 'Enter', 'Escape'].includes(e.key)) skip();
    };
    const cleanup = () => {
      window.removeEventListener('wheel', skip);
      window.removeEventListener('touchstart', skip);
      window.removeEventListener('pointerdown', skip);
      window.removeEventListener('keydown', keys);
    };
    window.addEventListener('wheel', skip, { passive: true });
    window.addEventListener('touchstart', skip, { passive: true });
    window.addEventListener('pointerdown', skip);
    window.addEventListener('keydown', keys);

    const [el, er] = openingEyes;
    const lids = [el.querySelector('.lid')!, er.querySelector('.lid')!];
    // Two big eyes side by side, touching a little like the "oo" in the logo.
    const ew = Math.min(W * 0.5, H * 0.68 * 0.77);
    const eh = ew / 0.77;
    const gap = ew * 0.92;
    const at = (side: number): Eye => ({ cx: W / 2 + (side ? gap / 2 : -gap / 2), cy: H / 2, w: ew, h: eh });
    const L = eyeOn(soloEye, ANIMAL_EYES[0].l);
    const R = eyeOn(soloEye, ANIMAL_EYES[0].r);

    await sleep(350);
    if (stopped) return;
    // 1. the eyes pop in and look around
    [el, er].forEach((e, side) =>
      run(e, [{ opacity: 0, transform: eyeMatrix(at(side), 0.2) }, { opacity: 1, transform: eyeMatrix(at(side)) }], { duration: 750, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }),
    );
    await sleep(900);
    if (stopped) return;
    const gaze = (ux: number, uy: number) => {
      look(el, ux, uy);
      look(er, ux, uy);
    };
    gaze(-1, -0.2);
    await sleep(520);
    gaze(1, 0.1);
    await sleep(520);
    gaze(0, 0.35);
    await sleep(380);
    if (stopped) return;

    // 2. two blinks
    for (let i = 0; i < 2; i++) {
      await Promise.all(lids.map((lid) => run(lid, [{ transform: 'scaleY(1)' }, { transform: 'scaleY(0.05)', offset: 0.45 }, { transform: 'scaleY(1)' }], { duration: 300, easing: 'ease-in-out' })));
      if (stopped) return;
      await sleep(i === 0 ? 320 : 260);
      if (stopped) return;
    }

    // 3. the eyes slide onto the ladybug's face
    gaze(0, 0);
    const moveEase = 'cubic-bezier(0.55, 0, 0.2, 1)';
    [el, er].forEach((e, side) => run(e, [{ opacity: 1, transform: eyeMatrix(at(side)) }, { opacity: 1, transform: eyeMatrix(side ? R : L) }], { duration: 850, easing: moveEase }));
    await sleep(620);
    if (stopped) return;

    // 4. the body grows out from between the eyes
    run(pals[0], [{ clipPath: 'circle(0% at 57.2% 57.8%)' }, { clipPath: 'circle(88% at 57.2% 57.8%)' }], { duration: 1050, easing: 'cubic-bezier(0.3, 0.7, 0.2, 1)' });
    await sleep(1150);
    if (stopped) return;

    cleanup();
    finish(false);
    hint.style.opacity = '1';
    // Slide the ladybug, and its eyes, to the middle of the screen.
    const from = performance.now();
    const settle = (now: number) => {
      const t = clamp((now - from) / 700);
      shift = 1 - ease(t);
      render(current);
      if (t < 1) requestAnimationFrame(settle);
    };
    requestAnimationFrame(settle);
  }
}
