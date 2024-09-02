import {Langs, MlString} from "../../domain/base/mlString.ts";
import {txts} from "../core/i18ngen.ts";

export function translate(word: string | MlString, lang: Langs): string {
    if (!(lang in Langs)) {
        return "Wrong language code";
    }
    if (typeof word === 'string') {
        if (txts?.[word]) {
            return txts[word]?.[lang] ?? "Not translated";
        }
        return "Word not found";
    } else {
        return word?.[lang] ?? "Not translated";
    }
}
