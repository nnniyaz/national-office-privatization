import {Langs, MlString} from "@/domain/mlString/mlString";
import {txts} from "@/pkg/core/txts";

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
