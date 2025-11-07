export enum Langs {
    key = "key",
    KZ = "KZ",
    RU = "RU",
    EN = "EN",
}

export type MlString = Record<Langs, string>

// Re-export from shared for compatibility
export type { Lang, MlString as MlStringNew } from '../../shared/i18n/types';
export { tPick } from '../../shared/i18n/types';
