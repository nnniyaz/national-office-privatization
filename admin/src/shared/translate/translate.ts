import {Langs, MlString} from "../../domain/base/mlString.ts";
import {tPick} from "../i18n/types.ts";
import {txts} from "../core/i18ngen.ts";

export function translate(word: string | MlString, lang: Langs): string {
    if (!Object.values(Langs).includes(lang)) {
        return "Wrong language code";
    }
    if (typeof word === 'string') {
        if (txts?.[word]) {
            return txts[word]?.[lang] ?? "Not translated";
        }
        return "Word not found";
    } else {
        // Контент из API: выбранный язык с фоллбеком kz -> ru -> en
        return tPick(word, lang) || "Not translated";
    }
}
