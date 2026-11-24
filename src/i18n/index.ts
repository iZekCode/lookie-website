import { id, type Copy } from './id';
import { en } from './en';

export type Lang = 'id' | 'en';
export const languages: Lang[] = ['id', 'en'];
export const defaultLang: Lang = 'id';

const dictionaries: Record<Lang, Copy> = { id, en };

export function useCopy(lang: Lang): Copy {
  return dictionaries[lang];
}

export function otherLang(lang: Lang): Lang {
  return lang === 'id' ? 'en' : 'id';
}

// Indonesian pages live at the root, English ones under /en.
export function localePath(lang: Lang, path = ''): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const clean = path.replace(/^\/|\/$/g, '');
  const prefix = lang === 'en' ? '/en' : '';
  const tail = clean ? `/${clean}` : '';
  return `${base}${prefix}${tail}/` || '/';
}

export function assetUrl(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}/${path.replace(/^\//, '')}`;
}
