// Turns the white square behind each animal picture into real transparency.
// The Figma export is opaque, so we flood-fill white from the edges inwards (eyes stay white).
import sharp from 'sharp';

const files = process.argv.slice(2);
for (const file of files) {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  const seen = new Uint8Array(w * h);
  const stack = [];
  const whiteness = (i) => Math.min(data[i * 4], data[i * 4 + 1], data[i * 4 + 2]);
  const push = (x, y) => {
    const i = y * w + x;
    if (x < 0 || y < 0 || x >= w || y >= h || seen[i] || whiteness(i) < 215) return;
    seen[i] = 1;
    stack.push(i);
  };
  for (let x = 0; x < w; x++) { push(x, 0); push(x, h - 1); }
  for (let y = 0; y < h; y++) { push(0, y); push(w - 1, y); }
  while (stack.length) {
    const i = stack.pop();
    const x = i % w, y = (i / w) | 0;
    push(x + 1, y); push(x - 1, y); push(x, y + 1); push(x, y - 1);
  }
  for (let i = 0; i < w * h; i++) {
    if (!seen[i]) continue;
    const wh = whiteness(i);
    data[i * 4 + 3] = wh >= 250 ? 0 : Math.round(((250 - wh) / 35) * 255);
  }
  await sharp(data, { raw: { width: w, height: h, channels: 4 } }).png().toFile(file + '.tmp');
  const { rename } = await import('node:fs/promises');
  await rename(file + '.tmp', file);
  console.log('cut', file);
}
