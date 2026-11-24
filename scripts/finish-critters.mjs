// Takes the renders from render-critters.swift, crops each animal to a square with a little room around it,
// writes it to src/assets/critters, and prints where each animal's eyes are so animalEyes.ts can be updated.
//   node scripts/finish-critters.mjs /tmp/critters
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

const dir = process.argv[2];
const OUT = 'src/assets/critters';
const SIZE = 1024;
const MARGIN = 0.06;
// Where to look for the eyes, as a share of the animal's height from its top.
const BAND = { kepik: [0.25, 0.85], kupu: [0, 0.5], lebah: [0, 0.55], siput: [0.05, 0.85] };

await mkdir(OUT, { recursive: true });
const report = {};

for (const name of Object.keys(BAND)) {
  const source = sharp(`${dir}/${name}.png`).ensureAlpha();
  const raw = await source.raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = raw.info;
  const px = raw.data;
  let x0 = w, y0 = h, x1 = 0, y1 = 0;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    if (px[(y * w + x) * 4 + 3] > 24) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
  }
  const side = Math.max(x1 - x0, y1 - y0) * (1 + MARGIN * 2);
  const left = Math.round((x0 + x1) / 2 - side / 2);
  const top = Math.round((y0 + y1) / 2 - side / 2);
  const square = Math.round(side);
  // Pad with transparency first so the crop can reach past the edge of the render.
  const padded = await sharp({ create: { width: w * 3, height: h * 3, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: await source.png().toBuffer(), left: w, top: h }]).png().toBuffer();
  const final = await sharp(padded).extract({ left: left + w, top: top + h, width: square, height: square }).resize(SIZE, SIZE).png().toBuffer();
  await sharp(final).toFile(`${OUT}/${name}.png`);

  // Eyes: the big near-white patches in the face.
  const f = await sharp(final).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const d = f.data;
  let fy0 = SIZE, fy1 = 0;
  for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) if (d[(y * SIZE + x) * 4 + 3] > 24) { fy0 = Math.min(fy0, y); fy1 = Math.max(fy1, y); }
  const [b0, b1] = BAND[name];
  const ymin = fy0 + (fy1 - fy0) * b0;
  const ymax = fy0 + (fy1 - fy0) * b1;
  const ok = (i) => d[i * 4 + 3] > 200 && Math.min(d[i * 4], d[i * 4 + 1], d[i * 4 + 2]) >= 238;
  const seen = new Uint8Array(SIZE * SIZE);
  const comps = [];
  for (let s = 0; s < SIZE * SIZE; s++) {
    const sy = (s / SIZE) | 0;
    if (seen[s] || !ok(s) || sy < ymin || sy > ymax) continue;
    const stack = [s]; seen[s] = 1; const pts = [];
    while (stack.length) {
      const i = stack.pop(); pts.push(i);
      for (const j of [i + 1, i - 1, i + SIZE, i - SIZE]) if (j >= 0 && j < SIZE * SIZE && !seen[j] && ok(j)) { seen[j] = 1; stack.push(j); }
    }
    if (pts.length > 700) comps.push(pts);
  }
  comps.sort((a, b) => b.length - a.length);
  let groups = comps.slice(0, 2);
  if (groups.length < 2) {
    // Two eyes that touch come out as one patch: split it in two by position.
    const pts = comps[0];
    let c = [pts[0], pts[pts.length - 1]].map((i) => [i % SIZE, (i / SIZE) | 0]);
    let g = [[], []];
    for (let round = 0; round < 8; round++) {
      g = [[], []];
      for (const i of pts) { const x = i % SIZE, y = (i / SIZE) | 0; (Math.hypot(x - c[0][0], y - c[0][1]) < Math.hypot(x - c[1][0], y - c[1][1]) ? g[0] : g[1]).push(i); }
      c = g.map((arr) => [arr.reduce((s, i) => s + (i % SIZE), 0) / arr.length, arr.reduce((s, i) => s + ((i / SIZE) | 0), 0) / arr.length]);
    }
    groups = g;
  }
  const boxes = groups.map((pts) => {
    let a = SIZE, b = SIZE, c = 0, e = 0;
    for (const i of pts) { const x = i % SIZE, y = (i / SIZE) | 0; a = Math.min(a, x); c = Math.max(c, x); b = Math.min(b, y); e = Math.max(e, y); }
    return { x: Math.round((a + c) / 2), y: Math.round((b + e) / 2), w: c - a, h: e - b };
  }).sort((p, q) => p.x - q.x);
  report[name] = { l: boxes[0], r: boxes[1] };
  console.log(name, JSON.stringify(report[name]));
}
