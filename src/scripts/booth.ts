// Booth mode (?booth): the landing page scrolls by itself while nobody is touching it.
import { isBooth, quiet, step } from './booth-loop.ts';

const INPUTS = ['pointerdown', 'pointerup', 'pointermove', 'touchstart', 'touchmove', 'touchend', 'wheel', 'keydown'];

export function initBooth() {
  if (!isBooth(location.search) || document.documentElement.dataset.home !== 'true') return;

  let state = quiet(performance.now());
  let pointer = '';

  const touched = (event: Event) => {
    if (event.type === 'pointermove') {
      // Some browsers report a move when the page slides under a resting mouse.
      const { screenX, screenY } = event as PointerEvent;
      const at = `${screenX},${screenY}`;
      if (at === pointer) return;
      pointer = at;
    }
    state = quiet(performance.now());
  };
  INPUTS.forEach((name) => window.addEventListener(name, touched, { passive: true }));

  // Keeps visitors on the landing page: no tap, middle click or long press menu on links that leave it.
  const stay = (event: Event) => {
    const link = (event.target as Element).closest('a[href]');
    if (!link || link.closest('[data-lang-toggle]') || link.getAttribute('href')?.startsWith('#')) return;
    event.preventDefault();
  };
  ['click', 'auxclick', 'contextmenu'].forEach((name) => document.addEventListener(name, stay, true));
  // Lets the CSS switch off the iPad's long press preview.
  document.documentElement.dataset.booth = 'true';

  const stayAwake = () => {
    if (document.visibilityState === 'visible') navigator.wakeLock?.request('screen').catch(() => {});
  };
  document.addEventListener('visibilitychange', stayAwake);
  stayAwake();

  const frame = () => {
    const maxY = document.documentElement.scrollHeight - window.innerHeight;
    state = step(state, performance.now(), window.scrollY, maxY);
    // "instant" skips the smooth scrolling set in the CSS.
    if (state.phase !== 'quiet') window.scrollTo({ top: state.y, behavior: 'instant' });
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}
