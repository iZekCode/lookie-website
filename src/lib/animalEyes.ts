// Where each animal's two eyes sit in its 1024px picture (centre and size, in picture pixels).
// The pictures are renders of the app's 3D animals (scripts/render-critters.swift); these numbers were read off them.
// The cute eye is laid over the painted eye and is a little bigger, so the painted one is hidden.
export interface EyeBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

export const PIC = 1024;
export const COVER = 1.1;
// The white of the cute eye fills this much of its drawing.
export const SCLERA = { w: 0.96, h: 0.969 };

export const ANIMAL_EYES: Array<{ l: EyeBox; r: EyeBox }> = [
  { l: { x: 366, y: 525, w: 210, h: 205 }, r: { x: 660, y: 522, w: 210, h: 208 } },
  { l: { x: 452, y: 365, w: 135, h: 142 }, r: { x: 606, y: 338, w: 132, h: 138 } },
  { l: { x: 402, y: 410, w: 182, h: 192 }, r: { x: 630, y: 404, w: 190, h: 200 } },
  { l: { x: 727, y: 380, w: 166, h: 192 }, r: { x: 893, y: 392, w: 140, h: 196 } },
];

// Where the middle of an animal's eyes is, as percentages of its box (the opening grows the body out from there).
export function eyeMidPercent(index: number): string {
  const e = ANIMAL_EYES[index];
  return `${(((e.l.x + e.r.x) / 2 / PIC) * 100).toFixed(1)}% ${(((e.l.y + e.r.y) / 2 / PIC) * 100).toFixed(1)}%`;
}

// The same numbers as percentages of the animal's box, for CSS.
export function eyeStyle(box: EyeBox): string {
  const w = ((box.w * COVER) / SCLERA.w / PIC) * 100;
  const h = ((box.h * COVER) / SCLERA.h / PIC) * 100;
  return `left:${(box.x / PIC) * 100}%;top:${(box.y / PIC) * 100}%;width:${w}%;height:${h}%`;
}
