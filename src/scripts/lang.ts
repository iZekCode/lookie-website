// Remembers the language a visitor picked, and animates the ID/EN switch before moving to the other page.
const KEY = 'lookie-lang';

function read(): string | null {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

function write(value: string) {
  try {
    localStorage.setItem(KEY, value);
  } catch {
    // Private mode can block storage. The switch still works without it.
  }
}

export function initLang() {
  const toggle = document.querySelector<HTMLElement>('[data-lang-toggle]');
  if (!toggle) return;
  const current = toggle.dataset.current;

  // Only the two home pages follow the saved choice. Policy links always open the page they point to.
  if (document.documentElement.dataset.home === 'true') {
    const saved = read();
    if (saved && saved !== current) {
      const target = toggle.querySelector<HTMLAnchorElement>(`a[data-lang="${saved}"]`);
      if (target) {
        window.location.replace(target.href);
        return;
      }
    }
  }

  toggle.querySelectorAll<HTMLAnchorElement>('a[data-lang]').forEach((link) => {
    link.addEventListener('click', (event) => {
      write(link.dataset.lang ?? '');
      if (link.dataset.lang === current) {
        event.preventDefault();
        return;
      }
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
      event.preventDefault();
      toggle.classList.add('flip');
      window.setTimeout(() => {
        window.location.href = link.href;
      }, 260);
    });
  });
}
