// Poking an animal makes it hop and say something short.
export function initCritters() {
  document.querySelectorAll<HTMLButtonElement>('[data-critter]').forEach((pet) => {
    const lines: string[] = JSON.parse(pet.dataset.lines ?? '[]');
    const bubble = pet.querySelector<HTMLElement>('.bubble');
    if (!bubble || !lines.length) return;
    let last = -1;
    let hideTimer = 0;
    pet.addEventListener('click', () => {
      let next = Math.floor(Math.random() * lines.length);
      if (next === last) next = (next + 1) % lines.length;
      last = next;
      bubble.textContent = lines[next];
      pet.classList.remove('hop');
      void pet.offsetWidth;
      pet.classList.add('hop', 'talk');
      window.clearTimeout(hideTimer);
      hideTimer = window.setTimeout(() => pet.classList.remove('talk', 'hop'), 1900);
    });
  });
}
