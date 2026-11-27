// Checks that booth mode keeps visitors on the landing page, with a stand-in browser.
import { test } from 'node:test';
import assert from 'node:assert/strict';

const listeners = new Map<string, (event: unknown) => void>();
const dataset: Record<string, string> = { home: 'true' };
Object.assign(globalThis, {
  location: { search: '?booth' },
  window: { addEventListener() {} },
  document: {
    documentElement: { dataset },
    visibilityState: 'hidden',
    addEventListener: (name: string, run: (event: unknown) => void) => listeners.set(name, run),
  },
  requestAnimationFrame() {},
});

const { initBooth } = await import('../src/scripts/booth.ts');
initBooth();

// Sends one event on a link and says whether booth mode stopped it.
function stopped(name: string, href: string, inToggle = false): boolean {
  let prevented = false;
  const link = { closest: () => (inToggle ? {} : null), getAttribute: () => href };
  listeners.get(name)?.({ target: { closest: () => link }, preventDefault: () => (prevented = true) });
  return prevented;
}

for (const name of ['click', 'auxclick', 'contextmenu']) {
  test(`${name} cannot leave the page`, () => {
    assert.equal(stopped(name, 'https://apps.apple.com/id/app/'), true);
    assert.equal(stopped(name, '#cara-main'), false);
    assert.equal(stopped(name, '/en/', true), false);
  });
}

test('marks the page so the long press menu can be turned off', () => {
  assert.equal(dataset.booth, 'true');
});
