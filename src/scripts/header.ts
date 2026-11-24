// Gives the sticky header a paper background once the page has scrolled a little.
export function initHeader() {
  const bar = document.querySelector<HTMLElement>('[data-header]');
  if (!bar) return;
  const update = () => bar.classList.toggle('scrolled', window.scrollY > 16);
  update();
  window.addEventListener('scroll', update, { passive: true });
}
