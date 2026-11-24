// A little painting toy: the animal follows the pointer with a lag and leaves thick, streaky paint behind it.
type Point = { x: number; y: number };

const SHAPES: Array<(cx: number, cy: number, s: number) => Path2D> = [
  (cx, cy, s) => {
    const p = new Path2D();
    p.ellipse(cx, cy - s * 0.06, s * 0.3, s * 0.38, 0, 0, Math.PI * 2);
    p.moveTo(cx - s * 0.05, cy + s * 0.32);
    p.lineTo(cx - s * 0.09, cy + s * 0.41);
    p.lineTo(cx + s * 0.09, cy + s * 0.41);
    p.lineTo(cx + s * 0.05, cy + s * 0.32);
    return p;
  },
  (cx, cy, s) => {
    const p = new Path2D();
    const k = s / 36;
    for (let i = 0; i <= 60; i++) {
      const t = (i / 60) * Math.PI * 2;
      const x = 16 * Math.sin(t) ** 3;
      const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
      if (i === 0) p.moveTo(cx + x * k, cy + y * k);
      else p.lineTo(cx + x * k, cy + y * k);
    }
    p.closePath();
    return p;
  },
  (cx, cy, s) => {
    const p = new Path2D();
    for (let i = 0; i < 10; i++) {
      const r = i % 2 === 0 ? s * 0.42 : s * 0.18;
      const a = -Math.PI / 2 + (i * Math.PI) / 5;
      const x = cx + Math.cos(a) * r;
      const y = cy + Math.sin(a) * r;
      if (i === 0) p.moveTo(x, y);
      else p.lineTo(x, y);
    }
    p.closePath();
    return p;
  },
  (cx, cy, s) => {
    const p = new Path2D();
    for (let i = 0; i < 6; i++) {
      const a = (i * Math.PI) / 3;
      const px = cx + Math.cos(a) * s * 0.22;
      const py = cy + Math.sin(a) * s * 0.22;
      p.moveTo(px + s * 0.15, py);
      p.arc(px, py, s * 0.15, 0, Math.PI * 2);
    }
    p.moveTo(cx + s * 0.1, cy);
    p.arc(cx, cy, s * 0.1, 0, Math.PI * 2);
    return p;
  },
];

function shade(hex: string, amount: number): string {
  const n = parseInt(hex.slice(1), 16);
  const mix = (c: number) => Math.round(amount >= 0 ? c + (255 - c) * amount : c * (1 + amount));
  return `rgb(${mix((n >> 16) & 255)}, ${mix((n >> 8) & 255)}, ${mix(n & 255)})`;
}

export function initPaint() {
  const stage = document.querySelector<HTMLElement>('[data-paint]');
  if (!stage) return;
  const guide = stage.querySelector<HTMLCanvasElement>('.guide')!;
  const ink = stage.querySelector<HTMLCanvasElement>('.ink')!;
  const buddy = stage.querySelector<HTMLImageElement>('.buddy')!;
  const gctx = guide.getContext('2d')!;
  const ictx = ink.getContext('2d')!;
  const root = stage.parentElement!;

  let w = 0;
  let h = 0;
  let dpr = 1;
  let shapeIndex = 0;
  let color = root.querySelector<HTMLElement>('.swatch')?.dataset.color ?? '#E8281E';
  let drawing = false;
  let visible = false;
  let running = false;
  const target: Point = { x: 0, y: 0 };
  const pos: Point = { x: 0, y: 0 };
  let last: Point | null = null;

  function drawGuide() {
    gctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    gctx.clearRect(0, 0, w, h);
    gctx.lineWidth = 6;
    gctx.lineCap = 'round';
    gctx.lineJoin = 'round';
    gctx.setLineDash([16, 14]);
    gctx.strokeStyle = '#c4c0d4';
    gctx.stroke(SHAPES[shapeIndex](w / 2, h / 2, Math.min(w, h) * 0.9));
  }

  function resize() {
    const rect = stage.getBoundingClientRect();
    if (!rect.width) return;
    const snapshot = document.createElement('canvas');
    snapshot.width = ink.width;
    snapshot.height = ink.height;
    if (ink.width) snapshot.getContext('2d')!.drawImage(ink, 0, 0);
    dpr = Math.min(2, window.devicePixelRatio || 1);
    w = rect.width - 8;
    h = rect.height - 8;
    for (const c of [guide, ink]) {
      c.width = Math.round(w * dpr);
      c.height = Math.round(h * dpr);
    }
    ictx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (snapshot.width) ictx.drawImage(snapshot, 0, 0, w, h);
    drawGuide();
  }

  function local(event: PointerEvent): Point {
    const rect = ink.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }

  function segment(a: Point, b: Point) {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len = Math.hypot(dx, dy);
    if (len < 0.2) return;
    const width = Math.max(22, Math.min(40, w * 0.045));
    const nx = -dy / len;
    const ny = dx / len;
    ictx.lineCap = 'round';
    ictx.lineJoin = 'round';
    ictx.lineWidth = width;
    ictx.strokeStyle = color;
    ictx.beginPath();
    ictx.moveTo(a.x, a.y);
    ictx.lineTo(b.x, b.y);
    ictx.stroke();
    const streaks: Array<[number, number]> = [
      [-0.3, -0.28],
      [0, 0.32],
      [0.3, -0.22],
    ];
    ictx.lineWidth = width * 0.13;
    ictx.globalAlpha = 0.5;
    for (const [offset, tone] of streaks) {
      ictx.strokeStyle = shade(color, tone);
      ictx.beginPath();
      ictx.moveTo(a.x + nx * offset * width, a.y + ny * offset * width);
      ictx.lineTo(b.x + nx * offset * width, b.y + ny * offset * width);
      ictx.stroke();
    }
    ictx.globalAlpha = 1;
  }

  function frame() {
    if (!visible) {
      running = false;
      return;
    }
    const px = pos.x;
    pos.x += (target.x - pos.x) * 0.2;
    pos.y += (target.y - pos.y) * 0.2;
    if (drawing && last) {
      segment(last, pos);
      last = { x: pos.x, y: pos.y };
    }
    const lean = Math.max(-18, Math.min(18, (pos.x - px) * 2.4));
    buddy.style.transform = `translate(${pos.x - 48}px, ${pos.y - 62}px) rotate(${lean}deg) scale(${drawing ? 0.9 : 1})`;
    requestAnimationFrame(frame);
  }

  function start() {
    if (running) return;
    running = true;
    requestAnimationFrame(frame);
  }

  ink.addEventListener('pointerdown', (event) => {
    ink.setPointerCapture(event.pointerId);
    const p = local(event);
    target.x = p.x;
    target.y = p.y;
    if (!stage.classList.contains('live')) {
      pos.x = p.x;
      pos.y = p.y;
    }
    stage.classList.add('live', 'used');
    drawing = true;
    last = { x: pos.x, y: pos.y };
    start();
  });
  ink.addEventListener('pointermove', (event) => {
    const p = local(event);
    target.x = p.x;
    target.y = p.y;
    if (event.pointerType === 'mouse' && !stage.classList.contains('live')) {
      pos.x = p.x;
      pos.y = p.y;
      stage.classList.add('live');
      start();
    }
  });
  const stop = () => {
    drawing = false;
    last = null;
  };
  ink.addEventListener('pointerup', stop);
  ink.addEventListener('pointercancel', stop);
  ink.addEventListener('pointerleave', (event) => {
    if (event.pointerType === 'mouse') {
      stop();
      stage.classList.remove('live');
    }
  });

  root.querySelectorAll<HTMLButtonElement>('.swatch').forEach((btn) => {
    btn.addEventListener('click', () => {
      color = btn.dataset.color ?? color;
      root.querySelectorAll('.swatch').forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
    });
  });
  root.querySelectorAll<HTMLButtonElement>('.brush').forEach((btn) => {
    btn.addEventListener('click', () => {
      buddy.src = btn.dataset.brush ?? buddy.src;
      root.querySelectorAll('.brush').forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
    });
  });
  root.querySelector('[data-shape]')?.addEventListener('click', () => {
    shapeIndex = (shapeIndex + 1) % SHAPES.length;
    drawGuide();
  });
  root.querySelector('[data-clear]')?.addEventListener('click', () => {
    ictx.clearRect(0, 0, w, h);
  });

  new ResizeObserver(resize).observe(stage);
  resize();
  new IntersectionObserver((entries) => {
    visible = entries[0].isIntersecting;
    if (visible && stage.classList.contains('live')) start();
  }).observe(stage);
}
