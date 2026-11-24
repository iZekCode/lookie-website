import { reducedMotion } from './motion';

// The big canvas section: every layer moves at its own speed as you scroll past, and the paint strokes draw themselves.
const clamp = (n: number, a = 0, b = 1) => Math.min(b, Math.max(a, n));
const smooth = (t: number) => t * t * (3 - 2 * t);

export function initCanvas() {
  const paper = document.querySelector<HTMLElement>('[data-pc]');
  if (!paper || reducedMotion) return;
  const items = [...paper.querySelectorAll<HTMLElement>('[data-s]')];
  const strokes = [...paper.querySelectorAll<SVGPathElement>('[data-draw]')];
  paper.classList.add('live');
  let raf = 0;
  let current = NaN;

  function render() {
    raf = 0;
    const vh = window.innerHeight;
    const rect = paper!.getBoundingClientRect();
    // q is 1 when the canvas is one screen below centre, and -1 when it is one screen above.
    const q = (rect.top + rect.height / 2 - vh / 2) / vh;
    if (q === current) return;
    current = q;
    const narrow = window.innerWidth < 760 ? 0.6 : 1;
    for (const el of items) {
      const s = Number(el.dataset.s);
      const x = Number(el.dataset.x ?? 0);
      const r = Number(el.dataset.r ?? 0);
      el.style.transform = `translate3d(${q * x * 60 * narrow}px, ${q * s * vh * 0.5 * narrow}px, 0) rotate(${q * r * 6}deg)`;
    }
    const journey = clamp((0.9 - q) / 1.8);
    for (const path of strokes) {
      const [from, to] = (path.dataset.draw ?? '0 1').split(' ').map(Number);
      path.style.strokeDashoffset = String(1 - smooth(clamp((journey - from) / (to - from))));
    }
    // The canvas leans in as it arrives.
    const arrive = 1 - clamp(q / 1.1);
    paper!.style.setProperty('--arrive', String(arrive));
  }
  const queue = () => {
    if (!raf) raf = requestAnimationFrame(render);
  };
  window.addEventListener('scroll', queue, { passive: true });
  window.addEventListener('resize', queue);
  render();
}
