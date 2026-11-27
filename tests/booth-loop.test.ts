// Checks where the booth loop puts the page over time.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isBooth, quiet, step, withBooth, type BoothState } from '../src/scripts/booth-loop.ts';

// Calls step every 100 ms from `from` up to and including `to`.
function run(state: BoothState, from: number, to: number, maxY: number, y = 0): BoothState {
  for (let now = from; now <= to; now += 100) state = step(state, now, y, maxY);
  return state;
}

test('stays quiet for 30 seconds, then starts from where the visitor left', () => {
  let s = step(quiet(0), 29999, 500, 1000);
  assert.equal(s.phase, 'quiet');
  s = step(s, 30000, 500, 1000);
  assert.equal(s.phase, 'down');
  assert.equal(s.y, 500);
});

test('scrolls 60 px per second', () => {
  const s = run(step(quiet(0), 30000, 0, 1000), 30100, 31000, 1000);
  assert.ok(Math.abs(s.y - 60) < 0.001);
});

test('a long gap does not jump', () => {
  const s = step(step(quiet(0), 30000, 0, 1000), 90000, 0, 1000);
  assert.ok(Math.abs(s.y - 6) < 0.001);
});

test('waits at the bottom, glides up, waits, goes again', () => {
  let s = run(step(quiet(0), 30000, 0, 60), 30100, 31100, 60);
  assert.equal(s.phase, 'bottom');
  assert.equal(s.y, 60);
  const bottom = s.since;
  s = step(s, bottom + 4000, 60, 60);
  assert.equal(s.phase, 'glide');
  s = step(s, bottom + 4000 + 1250, 60, 60);
  assert.ok(s.y > 0 && s.y < 60);
  s = step(s, bottom + 4000 + 2500, 60, 60);
  assert.equal(s.phase, 'top');
  assert.equal(s.y, 0);
  s = step(s, s.since + 3000, 0, 60);
  assert.equal(s.phase, 'down');
});

test('a shorter page after rotating keeps the position inside it', () => {
  const down = step(quiet(0), 30000, 900, 1000);
  const s = step(down, 30100, 900, 400);
  assert.equal(s.y, 400);
});

test('a page that does not scroll stays quiet', () => {
  assert.equal(step(quiet(0), 60000, 0, 0).phase, 'quiet');
});

test('reads and adds the booth flag', () => {
  assert.equal(isBooth('?booth'), true);
  assert.equal(isBooth(''), false);
  assert.equal(isBooth('?boothx=1'), false);
  const url = new URL(withBooth('https://example.com/en/#cara-main'));
  assert.equal(url.pathname, '/en/');
  assert.equal(url.hash, '#cara-main');
  assert.equal(isBooth(url.search), true);
});
