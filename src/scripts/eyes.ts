import { reducedMotion } from './motion';

interface Eye {
  sclera: SVGGraphicsElement;
  pupil: SVGGraphicsElement;
  neutralX: number;
  neutralY: number;
  limitX: number;
  limitY: number;
}

// The pupils in the logo follow the pointer. When nobody is moving, they look around by themselves, and blink now and then.
export function initEyes() {
  document.querySelectorAll<SVGSVGElement>('svg[data-eyes]').forEach(setup);
}

function setup(svg: SVGSVGElement) {
  const eyes: Eye[] = [];
  svg.querySelectorAll<SVGGElement>('.wm-eye').forEach((group) => {
    const sclera = group.querySelector<SVGGraphicsElement>('path');
    const pupil = group.querySelector<SVGGraphicsElement>('.pupil');
    if (!sclera || !pupil) return;
    const s = sclera.getBBox();
    const p = pupil.getBBox();
    eyes.push({
      sclera,
      pupil,
      neutralX: p.x + p.width / 2 - (s.x + s.width / 2),
      neutralY: p.y + p.height / 2 - (s.y + s.height / 2),
      limitX: ((s.width - p.width) / 2) * 0.85,
      limitY: ((s.height - p.height) / 2) * 0.85,
    });
  });
  if (!eyes.length) return;

  const lookAt = (x: number, y: number) => {
    for (const eye of eyes) {
      const rect = eye.sclera.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.hypot(dx, dy) || 1;
      const strength = Math.min(1, dist / (rect.width * 1.1));
      const tx = (dx / dist) * eye.limitX * strength - eye.neutralX;
      const ty = (dy / dist) * eye.limitY * strength - eye.neutralY;
      eye.pupil.style.transform = `translate(${tx}px, ${ty}px)`;
    }
  };

  const rest = () => {
    for (const eye of eyes) eye.pupil.style.transform = `translate(${-eye.neutralX * 0.4}px, ${-eye.neutralY * 0.4}px)`;
  };
  rest();
  if (reducedMotion) return;

  let lastMove = 0;
  window.addEventListener(
    'pointermove',
    (event) => {
      lastMove = performance.now();
      lookAt(event.clientX, event.clientY);
    },
    { passive: true },
  );

  window.setInterval(() => {
    if (performance.now() - lastMove < 2600) return;
    const rect = svg.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) return;
    lookAt(rect.left + Math.random() * rect.width * 2 - rect.width * 0.5, rect.top + Math.random() * rect.height * 3 - rect.height);
  }, 1800);

  const blink = () => {
    svg.classList.add('blink');
    window.setTimeout(() => svg.classList.remove('blink'), 240);
    window.setTimeout(blink, 2600 + Math.random() * 3200);
  };
  window.setTimeout(blink, 2400);
}
