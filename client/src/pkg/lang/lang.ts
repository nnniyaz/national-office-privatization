import {ReadonlyHeaders} from "next/dist/server/web/spec-extension/adapters/headers";
import {Langs, type Lang} from "@domain/base/mlString/mlString";

export function lang(headers: ReadonlyHeaders): Langs {
    const pathLang = headers.get("x-pathname")?.split("/")?.[1];
    const validLangs: Lang[] = ['kz', 'ru', 'en'];
    
    if (pathLang && validLangs.includes(pathLang as Lang)) {
        // Возвращаем enum значение (kz, ru, en)
        return pathLang as Langs;
    }
    return Langs.RU;
}
