// Where each animal's two eyes sit in its 556px picture (centre and size, in picture pixels).
// The cute eye is laid over the painted eye and is a little bigger, so the painted one is hidden.
export interface EyeBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

export const PIC = 556;
export const COVER = 1.16;
// The white of the cute eye fills this much of its drawing.
export const SCLERA = { w: 0.96, h: 0.969 };

export const ANIMAL_EYES: Array<{ l: EyeBox; r: EyeBox }> = [
  { l: { x: 271.5, y: 322, w: 93, h: 106 }, r: { x: 364.5, y: 321, w: 85, h: 102 } },
  { l: { x: 250.5, y: 232.5, w: 53, h: 63 }, r: { x: 307.5, y: 232.5, w: 53, h: 63 } },
  { l: { x: 234, y: 234.5, w: 88, h: 101 }, r: { x: 325, y: 234.5, w: 86, h: 101 } },
  { l: { x: 132, y: 237, w: 66, h: 79 }, r: { x: 198, y: 237, w: 66, h: 79 } },
];

// The same numbers as percentages of the animal's box, for CSS.
export function eyeStyle(box: EyeBox): string {
  const w = ((box.w * COVER) / SCLERA.w / PIC) * 100;
  const h = ((box.h * COVER) / SCLERA.h / PIC) * 100;
  return `left:${(box.x / PIC) * 100}%;top:${(box.y / PIC) * 100}%;width:${w}%;height:${h}%`;
}
