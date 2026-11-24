// The opening and the scroll story.
// Opening: two big eyes look around, blink twice and slide onto a ladybug's face while the ladybug is drawn around them.
// Scroll: the pair of eyes multiplies into four pairs, and each pair grows its own animal around it. The animals then settle around the headline.
const html = document.documentElement;

const clamp = (n: number, a = 0, b = 1) => Math.min(b, Math.max(a, n));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const sleep = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms));

// Where each animal's two eyes sit in its 556px picture (centre and size).
interface EyeBox {
  x: number;
  y: number;
  w: number;
  h: number;
}
const ANIMAL_EYES: Array<{ l: EyeBox; r: EyeBox }> = [
  { l: { x: 271.5, y: 322, w: 93, h: 106 }, r: { x: 364.5, y: 321, w: 85, h: 102 } },
  { l: { x: 250.5, y: 232.5, w: 53, h: 63 }, r: { x: 307.5, y: 232.5, w: 53, h: 63 } },
  { l: { x: 234, y: 234.5, w: 88, h: 101 }, r: { x: 325, y: 234.5, w: 86, h: 101 } },
  { l: { x: 132, y: 237, w: 66, h: 79 }, r: { x: 198, y: 237, w: 66, h: 79 } },
];
const PIC = 556;
// The logo eye file is a little bigger than the white inside it, and the new eye should hide the painted one completely.
const SCLERA = { w: 0.894, h: 0.939 };
const COVER = 1.16;
// The size the eye elements have in CSS; everything else is a scale of this.
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
  rot: number;
}

export function initStory() {
  const root = document.querySelector<HTMLElement>('[data-story]');
  if (!root || !html.classList.contains('story-js')) return;
  const stage = root.querySelector<HTMLElement>('.stage')!;
  const pals = [...root.querySelectorAll<HTMLElement>('[data-pal]')];
  const eyeEls = [...root.querySelectorAll<HTMLElement>('[data-eye]')];
  const copy = root.querySelector<HTMLElement>('[data-copy]')!;
  const hint = root.querySelector<HTMLElement>('[data-hint]')!;

  let W = 0;
  let H = 0;
  let B = 0;
  let soloEye: Slot;
  let soloCenter: Slot;
  // 1 while the opening lines the ladybug's eyes up with the big eyes, then eases to 0 as it settles in the middle.
  let shift = html.classList.contains('opening') ? 1 : 0;
  let cluster: Slot[] = [];
  let corners: Slot[] = [];
  let target = 0;
  let current = 0;
  let raf = 0;
  let inView = true;
  let pointer: { x: number; y: number } | null = null;
  let eyeCenters: Array<{ x: number; y: number; opacity: number }> = eyeEls.map(() => ({ x: 0, y: 0, opacity: 0 }));

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

    const sc = Math.min(H * 0.4, W * 0.5);
    const d = sc / 2;
    cluster = [
      { x: cx - d, y: cy - d, size: sc, rot: -6 },
      { x: cx + d, y: cy - d, size: sc, rot: 5 },
      { x: cx - d, y: cy + d, size: sc, rot: 6 },
      { x: cx + d, y: cy + d, size: sc, rot: -5 },
    ];

    const portrait = W < H * 0.95;
    const sk = portrait ? Math.min(W * 0.34, H * 0.2) : Math.min(H * 0.3, W * 0.2);
    const xs = portrait ? [0.2, 0.8] : [0.13, 0.87];
    const ys = portrait ? [0.11, 0.89] : [0.24, 0.76];
    corners = [
      { x: W * xs[0], y: H * ys[0], size: sk, rot: -8 },
      { x: W * xs[1], y: H * ys[0], size: sk, rot: 7 },
      { x: W * xs[0], y: H * ys[1], size: sk, rot: 6 },
      { x: W * xs[1], y: H * ys[1], size: sk, rot: -6 },
    ];
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

  // Where an animal's eye lands on screen once the animal sits in a slot.
  function eyeOn(slot: Slot, box: EyeBox): Eye {
    const dx = (box.x / PIC - 0.5) * slot.size;
    const dy = (box.y / PIC - 0.5) * slot.size;
    const a = (slot.rot * Math.PI) / 180;
    return {
      cx: slot.x + dx * Math.cos(a) - dy * Math.sin(a),
      cy: slot.y + dx * Math.sin(a) + dy * Math.cos(a),
      w: ((box.w / PIC) * slot.size * COVER) / SCLERA.w,
      h: ((box.h / PIC) * slot.size * COVER) / SCLERA.h,
      rot: slot.rot,
    };
  }

  const eyeMatrix = (e: Eye) =>
    `translate(${e.cx - EYE_W / 2}px, ${e.cy - EYE_H / 2}px) rotate(${e.rot}deg) scale(${e.w / EYE_W}, ${e.h / EYE_H})`;

  function render(raw: number, now = 0) {
    // The last stretch of scroll just holds the finished picture.
    const p = clamp(raw / 0.9);
    const s = clamp((p - 0.05) / 0.38);
    const gather = ease(clamp((p - 0.52) / 0.3));
    const bgT = ease(clamp((p - 0.48) / 0.3));
    const fade = ease(clamp((p - 0.84) / 0.16));
    const textT = ease(clamp((p - 0.62) / 0.24));
    const calm = clamp((p - 0.86) / 0.08);
    const opening = html.classList.contains('opening');
    const solo = mix(soloCenter, soloEye, shift);

    const slots: Slot[] = [];
    const reveal: number[] = [];
    pals.forEach((_, i) => {
      const dir = i % 2 ? 1 : -1;
      let slot: Slot;
      if (i === 0) {
        const a = mix(solo, cluster[0], ease(s));
        slot = mix(a, corners[0], gather);
        slot.rot += Math.sin(Math.PI * ease(s)) * 14 * dir;
      } else {
        slot = mix(cluster[i], corners[i], gather);
      }
      // A little idle sway once everything has settled.
      if (calm > 0 && now) {
        slot.y += Math.sin(now / 650 + i * 1.7) * 6 * calm;
        slot.rot += Math.sin(now / 820 + i * 2.3) * 2.2 * calm;
      }
      const rev = i === 0 ? 1 : ease(clamp((s - 0.38 - 0.06 * (i - 1)) / 0.5));
      reveal.push(rev);
      if (i > 0) slot.size *= lerp(0.8, 1, rev);
      slots.push(slot);
    });

    pals.forEach((pal, i) => {
      const slot = slots[i];
      pal.style.transform = `translate(${slot.x - B / 2}px, ${slot.y - B / 2}px) rotate(${slot.rot}deg) scale(${slot.size / B})`;
      if (i > 0 && !opening) {
        const mid = eyeMid(i);
        pal.style.clipPath = reveal[i] >= 1 ? 'none' : `circle(${reveal[i] * 95}% at ${(mid.x / PIC) * 100}% ${(mid.y / PIC) * 100}%)`;
      }
    });

    // The eyes: pair 0 stays on the ladybug. The other pairs start there, then travel to their own animal.
    if (!opening) {
      const lady = [eyeOn(slots[0], ANIMAL_EYES[0].l), eyeOn(slots[0], ANIMAL_EYES[0].r)];
      pals.forEach((_, i) => {
        const pair = [eyeOn(slots[i], ANIMAL_EYES[i].l), eyeOn(slots[i], ANIMAL_EYES[i].r)];
        const travel = i === 0 ? 1 : ease(clamp((s - 0.06 * (i - 1)) / 0.5));
        [0, 1].forEach((side) => {
          const from = lady[side];
          const to = pair[side];
          const e: Eye = {
            cx: lerp(from.cx, to.cx, travel),
            cy: lerp(from.cy, to.cy, travel) - Math.sin(Math.PI * travel) * (i === 0 ? 0 : H * 0.05),
            w: lerp(from.w, to.w, travel),
            h: lerp(from.h, to.h, travel),
            rot: lerp(from.rot, to.rot, travel),
          };
          const el = eyeEls[i * 2 + side];
          const opacity = i === 0 ? 1 : clamp(s * 12) ;
          el.style.opacity = String(opacity);
          el.style.transform = eyeMatrix(e);
          eyeCenters[i * 2 + side] = { x: e.cx, y: e.cy, opacity };
        });
      });
    }

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
  interface Pupil {
    el: SVGGraphicsElement;
    nx: number;
    ny: number;
    lx: number;
    ly: number;
  }
  function pupilOf(eye: HTMLElement): Pupil | null {
    const svg = eye.querySelector<SVGSVGElement>('svg');
    const el = eye.querySelector<SVGGraphicsElement>('.pupil');
    const sclera = svg?.querySelector<SVGGraphicsElement>('path');
    if (!svg || !el || !sclera) return null;
    const s = sclera.getBBox();
    const p = el.getBBox();
    return {
      el,
      nx: p.x + p.width / 2 - (s.x + s.width / 2),
      ny: p.y + p.height / 2 - (s.y + s.height / 2),
      lx: ((s.width - p.width) / 2) * 0.8,
      ly: ((s.height - p.height) / 2) * 0.8,
    };
  }
  const pupils = eyeEls.map(pupilOf);
  const look = (i: number, ux: number, uy: number) => {
    const p = pupils[i];
    if (p) p.el.style.transform = `translate(${ux * p.lx - p.nx}px, ${uy * p.ly - p.ny}px)`;
  };
  pupils.forEach((_, i) => look(i, 0, 0.2));

  // After the opening the pupils follow the pointer.
  let lookQueued = false;
  window.addEventListener(
    'pointermove',
    (event) => {
      pointer = { x: event.clientX, y: event.clientY };
      if (lookQueued || html.classList.contains('opening')) return;
      lookQueued = true;
      requestAnimationFrame(() => {
        lookQueued = false;
        if (!pointer || !inView) return;
        const box = stage.getBoundingClientRect();
        eyeCenters.forEach((c, i) => {
          if (c.opacity < 0.5) return;
          const dx = pointer!.x - (box.left + c.x);
          const dy = pointer!.y - (box.top + c.y);
          const dist = Math.hypot(dx, dy) || 1;
          const k = Math.min(1, dist / 220);
          look(i, (dx / dist) * k, (dy / dist) * k);
        });
      });
    },
    { passive: true },
  );

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

    const [el, er] = eyeEls;
    const lids = [el.querySelector('.lid')!, er.querySelector('.lid')!];
    // Two big eyes side by side, touching a little like the "oo" in the logo.
    const ew = Math.min(W * 0.5, H * 0.68 * 0.77);
    const eh = ew / 0.77;
    const gap = ew * 0.9;
    const at = (side: number, scale: number): Eye => ({ cx: W / 2 + (side ? gap / 2 : -gap / 2), cy: H / 2, w: ew * scale, h: eh * scale, rot: 0 });
    const L = eyeOn(soloEye, ANIMAL_EYES[0].l);
    const R = eyeOn(soloEye, ANIMAL_EYES[0].r);

    await sleep(350);
    if (stopped) return;
    // 1. the eyes pop in and look around
    [el, er].forEach((e, side) =>
      run(e, [{ opacity: 0, transform: eyeMatrix(at(side, 0.2)) }, { opacity: 1, transform: eyeMatrix(at(side, 1)) }], { duration: 750, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }),
    );
    await sleep(900);
    if (stopped) return;
    const gaze = (ux: number, uy: number) => {
      look(0, ux, uy);
      look(1, ux, uy);
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
    [el, er].forEach((e, side) => run(e, [{ opacity: 1, transform: eyeMatrix(at(side, 1)) }, { opacity: 1, transform: eyeMatrix(side ? R : L) }], { duration: 850, easing: moveEase }));
    await sleep(620);
    if (stopped) return;

    // 4. the body grows out from between the eyes
    const pal0 = pals[0];
    run(pal0, [{ clipPath: 'circle(0% at 57.2% 57.8%)' }, { clipPath: 'circle(88% at 57.2% 57.8%)' }], { duration: 1050, easing: 'cubic-bezier(0.3, 0.7, 0.2, 1)' });
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
