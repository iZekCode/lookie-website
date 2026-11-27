// Works out where the booth page should be at each moment: wait, flow down, rest, glide up, repeat.
export type BoothState = {
  phase: 'quiet' | 'down' | 'bottom' | 'glide' | 'top';
  since: number;
  last: number;
  y: number;
};

const QUIET_MS = 30000;
const PIXELS_PER_SECOND = 60;
const BOTTOM_MS = 4000;
const GLIDE_MS = 2500;
const TOP_MS = 3000;
const MAX_STEP_MS = 100;
const FLAG = 'booth';

export function quiet(now: number): BoothState {
  return { phase: 'quiet', since: now, last: now, y: 0 };
}

export function step(state: BoothState, now: number, y: number, maxY: number): BoothState {
  if (maxY <= 0) return quiet(now);
  const waited = now - state.since;
  const next = { ...state, last: now, y: Math.min(state.y, maxY) };
  const enter = (phase: BoothState['phase'], at: number): BoothState => ({ phase, since: now, last: now, y: at });

  switch (state.phase) {
    case 'quiet':
      return waited >= QUIET_MS ? enter('down', Math.min(y, maxY)) : { ...state, last: now };
    case 'down': {
      const moved = (PIXELS_PER_SECOND * Math.min(now - state.last, MAX_STEP_MS)) / 1000;
      const at = Math.min(state.y + moved, maxY);
      return at >= maxY ? enter('bottom', maxY) : { ...next, y: at };
    }
    case 'bottom':
      return waited >= BOTTOM_MS ? enter('glide', maxY) : { ...next, y: maxY };
    case 'glide': {
      const t = Math.min(waited / GLIDE_MS, 1);
      if (t === 1) return enter('top', 0);
      // Slow start and slow end.
      const eased = (1 - Math.cos(Math.PI * t)) / 2;
      return { ...state, last: now, y: maxY * (1 - eased) };
    }
    case 'top':
      return waited >= TOP_MS ? enter('down', 0) : next;
  }
}

export function isBooth(search: string): boolean {
  return new URLSearchParams(search).has(FLAG);
}

export function withBooth(href: string): string {
  const url = new URL(href);
  url.searchParams.set(FLAG, '');
  return url.href;
}
