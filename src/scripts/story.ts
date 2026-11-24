// The opening and the scroll story. Part 1 plays by itself: an eye blinks twice and becomes a ladybug's eyes.
// Part 2 follows the scroll: the ladybug splits into four animals, which settle around the headline.
const html = document.documentElement;

const clamp = (n: number, a = 0, b = 1) => Math.min(b, Math.max(a, n));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const smooth = (t: number) => t * t * (3 - 2 * t);
const sleep = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms));

// Where the ladybug's two eyes sit in its picture, as fractions of the picture.
const LADY = {
  left: { x: 271.5 / 556, y: 322 / 555, w: 93 / 556, h: 106 / 555 },
  right: { x: 364.5 / 556, y: 321 / 555, w: 85 / 556, h: 102 / 555 },
};
// The logo eye file is a little bigger than the white of the eye inside it.
const SCLERA = { w: 0.894, h: 0.939 };
const MID = { x: (LADY.left.x + LADY.right.x) / 2, y: (LADY.left.y + LADY.right.y) / 2 };

interface Slot {
  x: number;
  y: number;
  size: number;
  rot: number;
}

export function initStory() {
  const root = document.querySelector<HTMLElement>('[data-story]');
  if (!root || !html.classList.contains('story-js')) return;
  const stage = root.querySelector<HTMLElement>('.stage')!;
  const pals = [...root.querySelectorAll<HTMLElement>('[data-pal]')];
  const eyes = [...root.querySelectorAll<HTMLElement>('[data-eye]')];
  const copy = root.querySelector<HTMLElement>('[data-copy]')!;
  const hint = root.querySelector<HTMLElement>('[data-hint]')!;

  let W = 0;
  let H = 0;
  let B = 0;
  let soloEye: Slot;
  let soloCenter: Slot;
  // 1 while the opening lines the ladybug's eyes up with the logo eye, then eases to 0 as it settles in the middle.
  let shift = html.classList.contains('opening') ? 1 : 0;
  let cluster: Slot[] = [];
  let corners: Slot[] = [];
  let target = 0;
  let current = 0;
  let raf = 0;

  function measure() {
    W = stage.clientWidth;
    H = stage.clientHeight;
    const cx = W / 2;
    const cy = H / 2;
    B = Math.min(W * 0.86, H * 0.74);
    stage.style.setProperty('--pal', `${B}px`);
    // The ladybug starts so that the middle of its eyes is the middle of the screen.
    soloEye = { x: cx - (MID.x - 0.5) * B, y: cy - (MID.y - 0.5) * B, size: B, rot: 0 };
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

  function render(raw: number) {
    // The last stretch of scroll just holds the finished picture.
    const p = clamp(raw / 0.9);
    const solo = mix(soloCenter, soloEye, shift);
    const split = ease(clamp((p - 0.05) / 0.38));
    const gather = ease(clamp((p - 0.52) / 0.3));
    const bgT = ease(clamp((p - 0.48) / 0.3));
    const fade = ease(clamp((p - 0.84) / 0.16));
    const textT = ease(clamp((p - 0.62) / 0.24));

    pals.forEach((pal, i) => {
      const dir = i % 2 ? 1 : -1;
      const a = mix(solo, cluster[i], split);
      const slot = mix(a, corners[i], gather);
      const inFlight = Math.sin(Math.PI * split) * 14 * dir;
      let pulse = 1;
      let appear = 1;
      if (i > 0) {
        appear = clamp(split * 7);
        const swap = smooth(clamp((p - (0.15 + i * 0.05)) / 0.16));
        pulse = 1 + 0.14 * Math.sin(Math.PI * swap);
        const swapImg = pal.querySelector<HTMLElement>('.swap');
        const baseImg = pal.querySelector<HTMLElement>('.base');
        if (swapImg) swapImg.style.opacity = String(swap);
        if (baseImg) baseImg.style.opacity = String(1 - smooth(clamp((swap - 0.15) / 0.7)));
      }
      const scale = (slot.size / B) * pulse * lerp(0.7, 1, appear);
      pal.style.opacity = String(appear);
      pal.style.transform = `translate(${slot.x - B / 2}px, ${slot.y - B / 2}px) rotate(${slot.rot + inFlight}deg) scale(${scale})`;
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

    if (!html.classList.contains('opening')) hint.style.opacity = String(1 - clamp(p / 0.06));
    root.classList.toggle('settled', p > 0.9);
  }

  function readScroll() {
    const total = root!.offsetHeight - H;
    target = clamp(-root!.getBoundingClientRect().top / total);
    if (!raf) raf = requestAnimationFrame(tick);
  }

  function tick() {
    raf = 0;
    current += (target - current) * 0.12;
    if (Math.abs(target - current) < 0.0003) current = target;
    render(current);
    if (current !== target) raf = requestAnimationFrame(tick);
  }

  window.addEventListener('scroll', readScroll, { passive: true });
  window.addEventListener('resize', () => {
    measure();
    readScroll();
  });
  measure();
  current = target = clamp(-root.getBoundingClientRect().top / (root.offsetHeight - H));
  render(current);

  if (html.classList.contains('opening')) playOpening();
  else hint.style.opacity = '1';

  // ---------- the opening ----------
  function pupilLook(eye: HTMLElement, ux: number, uy: number) {
    const svg = eye.querySelector<SVGSVGElement>('svg');
    const pupil = eye.querySelector<SVGGraphicsElement>('.pupil');
    const sclera = svg?.querySelector<SVGGraphicsElement>('path');
    if (!svg || !pupil || !sclera) return;
    const s = sclera.getBBox();
    const p = pupil.getBBox();
    const nx = p.x + p.width / 2 - (s.x + s.width / 2);
    const ny = p.y + p.height / 2 - (s.y + s.height / 2);
    const lx = ((s.width - p.width) / 2) * 0.8;
    const ly = ((s.height - p.height) / 2) * 0.8;
    pupil.style.transform = `translate(${ux * lx - nx}px, ${uy * ly - ny}px)`;
  }

  function eyeBox(which: 'left' | 'right') {
    const e = LADY[which];
    const tlx = soloEye.x - B / 2;
    const tly = soloEye.y - B / 2;
    return {
      x: tlx + e.x * B,
      y: tly + e.y * B,
      w: (e.w * B) / SCLERA.w,
      h: (e.h * B) / SCLERA.h,
    };
  }

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
      eyes.forEach((e) => (e.style.opacity = '0'));
      html.classList.remove('opening');
      if (immediate) shift = 0;
      try {
        sessionStorage.setItem('lookie-opened', '1');
      } catch {
        // Fine without storage: the opening just plays again next visit.
      }
      hint.style.transition = 'opacity 0.6s';
      render(current);
    };

    // Any scroll, tap or key during the opening skips straight to the end.
    const skip = () => {
      cleanup();
      finish();
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

    const [e1, e2] = eyes;
    const eh0 = Math.min(H * 0.5, W * 0.82);
    const ew0 = eh0 * 0.77;
    for (const e of eyes) {
      e.style.setProperty('--ew', `${ew0}px`);
      e.style.setProperty('--eh', `${eh0}px`);
    }
    const start = (s: number) => `translate(0px, 0px) scale(${s})`;
    const toBox = (box: { x: number; y: number; w: number; h: number }) =>
      `translate(${box.x - W / 2}px, ${box.y - H / 2}px) scale(${box.w / ew0}, ${box.h / eh0})`;

    await sleep(350);
    if (stopped) return;
    // 1. the eye pops in and looks around
    run(e1, [{ opacity: 0, transform: start(0.2) }, { opacity: 1, transform: start(1) }], { duration: 750, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' });
    await sleep(900);
    if (stopped) return;
    pupilLook(e1, -1, -0.2);
    await sleep(520);
    pupilLook(e1, 1, 0.1);
    await sleep(520);
    pupilLook(e1, 0, 0.35);
    await sleep(380);
    if (stopped) return;

    // 2. two blinks
    const lid = e1.querySelector('.lid')!;
    for (let i = 0; i < 2; i++) {
      await run(lid, [{ transform: 'scaleY(1)' }, { transform: 'scaleY(0.05)', offset: 0.45 }, { transform: 'scaleY(1)' }], { duration: 300, easing: 'ease-in-out' });
      if (stopped) return;
      await sleep(i === 0 ? 320 : 260);
      if (stopped) return;
    }

    // 3. the eye splits in two and each half slides into a ladybug eye
    const L = eyeBox('left');
    const R = eyeBox('right');
    const moveEase = 'cubic-bezier(0.55, 0, 0.2, 1)';
    pupilLook(e1, 0, 0);
    const second = e2;
    second.style.opacity = '0';
    run(e1, [{ opacity: 1, transform: start(1) }, { opacity: 1, transform: toBox(L) }], { duration: 850, easing: moveEase });
    run(second, [{ opacity: 0, transform: start(0.85), offset: 0 }, { opacity: 1, transform: start(0.85), offset: 0.12 }, { opacity: 1, transform: toBox(R) }], { duration: 850, easing: moveEase });
    pupilLook(second, 0, 0);
    await sleep(620);
    if (stopped) return;

    // 4. the body grows out from between the eyes
    const pal0 = pals[0];
    const pop = pal0.querySelector('.bob')!;
    run(pal0, [{ clipPath: 'circle(0% at 57.2% 57.9%)' }, { clipPath: 'circle(88% at 57.2% 57.9%)' }], { duration: 1050, easing: 'cubic-bezier(0.3, 0.7, 0.2, 1)' });
    run(pop, [{ transform: 'scale(0.7)' }, { transform: 'scale(1.05)', offset: 0.7 }, { transform: 'scale(1)' }], { duration: 1050, easing: 'ease-out' });
    await sleep(1000);
    if (stopped) return;

    // 5. the logo eyes give way to the ladybug's own
    await Promise.all([run(e1, [{ opacity: 1 }, { opacity: 0 }], { duration: 320 }), run(second, [{ opacity: 1 }, { opacity: 0 }], { duration: 320 })]);
    if (stopped) return;
    cleanup();
    finish(false);
    hint.style.opacity = '1';
    // Slide the ladybug to the middle of the screen.
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
