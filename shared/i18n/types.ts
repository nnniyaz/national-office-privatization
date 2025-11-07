export type Lang = 'kz' | 'ru' | 'en';

export type MlString = {
  kz?: string;
  ru?: string;
  en?: string;
};

export function tPick(value?: MlString, lang: Lang = 'en'): string {
  if (!value) {
    return '';
  }

  const order: Lang[] = [lang, 'kz', 'ru', 'en'];

  for (const current of order) {
    const candidate = value[current];
    if (candidate && candidate.trim()) {
      return candidate;
    }
  }

  return '';
}

