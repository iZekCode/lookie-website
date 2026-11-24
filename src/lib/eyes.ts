// The logo's two eye files, ready to be drawn big: no fixed size, and the pupil grouped so it can move.
import EyeLeft from '../assets/logo/lookieEyeLeft.svg?raw';
import EyeRight from '../assets/logo/lookieEyeRight.svg?raw';

const prep = (svg: string) =>
  svg
    .replace(/ width="[^"]*"/, '')
    .replace(/ height="[^"]*"/, '')
    .replace('<svg ', '<svg class="eye-svg" ')
    .replace(/(<path id="Vector_2"[\s\S]*?\/>\s*<path id="Vector_3"[\s\S]*?\/>)/, '<g class="pupil">$1</g>');

export const eyeLeftSvg = prep(EyeLeft);
export const eyeRightSvg = prep(EyeRight);
