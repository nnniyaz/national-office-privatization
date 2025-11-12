import {Langs, type Lang, MlString, tPick} from "@domain/base/mlString/mlString";
import {txts} from "@/pkg/core/txts";

export function translate(word: string | MlString, lang: Langs | Lang | string): string {
    // Нормализуем язык к lowercase для внутренней работы
    let normalizedLang = typeof lang === 'string' ? lang.toLowerCase() : lang;
    
    // Проверяем валидность
    const validLangs = ['kz', 'ru', 'en'];
    if (!validLangs.includes(normalizedLang)) {
        return "Wrong language code";
    }
    
    if (typeof word === 'string') {
        if (txts?.[word]) {
            // txts использует uppercase ключи (KZ, RU, EN), конвертируем
            const upperLang = normalizedLang.toUpperCase();
            return txts[word]?.[upperLang] ?? "Not translated";
        }
        return "Word not found";
    } else {
        // Для MlString используем tPick с lowercase
        return tPick(word, normalizedLang as Lang);
    }
}
