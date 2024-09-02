import {ReadonlyHeaders} from "next/dist/server/web/spec-extension/adapters/headers";
import {Langs} from "@domain/base/mlString/mlString";

export function lang(headers: ReadonlyHeaders) {
    let langFromThePath = headers.get("x-pathname")?.split("/")?.[1]?.toUpperCase() as Langs;
    if (!(langFromThePath in Langs)) {
        langFromThePath = Langs.RU;
    }
    return langFromThePath;
}
