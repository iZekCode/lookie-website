import { reducedMotion } from './motion';

// Counts the example report numbers up from zero when the card scrolls into view.
export function initCounters() {
  const card = document.querySelector<HTMLElement>('[data-report]');
  if (!card || reducedMotion || !('IntersectionObserver' in window)) return;
  const numbers = card.querySelectorAll<HTMLElement>('[data-count]');
  numbers.forEach((n) => (n.textContent = '0'));
  const io = new IntersectionObserver(
    (entries) => {
      if (!entries[0].isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const duration = 1300;
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        numbers.forEach((n) => (n.textContent = String(Math.round(Number(n.dataset.count) * eased))));
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    },
    { threshold: 0.4 },
  );
  io.observe(card);
}
