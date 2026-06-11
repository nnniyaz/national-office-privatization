export enum Langs {
    KZ = "kz",
    RU = "ru",
    EN = "en",
}

export type MlString = {
    key?: string;
    kz: string;
    ru: string;
    en: string;
}

// Re-export from shared for compatibility
export type { Lang, MlString as MlStringNew } from '../../shared/i18n/types';
export { tPick } from '../../shared/i18n/types';
