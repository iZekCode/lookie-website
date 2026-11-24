import { finePointer, reducedMotion } from './motion';

// Floating animals around a screenshot lean a little away from the pointer.
export function initParallax() {
  if (!finePointer || reducedMotion) return;
  document.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
    window.addEventListener(
      'pointermove',
      (event) => {
        const rect = el.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) return;
        el.style.setProperty('--px', String((event.clientX / window.innerWidth - 0.5) * 2));
        el.style.setProperty('--py', String((event.clientY / window.innerHeight - 0.5) * 2));
      },
      { passive: true },
    );
  });
}
