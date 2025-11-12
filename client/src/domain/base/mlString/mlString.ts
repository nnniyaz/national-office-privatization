export type Lang = 'kz' | 'ru' | 'en';

export type MlString = {
    kz?: string;
    ru?: string;
    en?: string;
};

// Backward compatibility with old enum
export enum Langs {
    KZ = "kz",
    RU = "ru",
    EN = "en"
}

export function tPick(v?: MlString, lang: Lang = 'en'): string {
    if (!v) return '';
    const order: Lang[] = [lang, 'kz', 'ru', 'en'];
    for (const l of order) {
        const val = v[l];
        if (val && val.trim()) return val;
    }
    return '';
}
