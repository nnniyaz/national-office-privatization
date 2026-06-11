'use client'

import {useParams, usePathname} from "next/navigation";
import type {Lang} from "@/domain/base/mlString/mlString";

// Языковые маршруты статические (/kz, /ru, /en), поэтому useParams().lang пуст —
// язык надёжно определяется по первому сегменту pathname.
export function useLang(): Lang {
    const params = useParams();
    const pathname = usePathname();
    const pathLang = pathname?.split("/")[1] || "";
    const fromPath = ["kz", "ru", "en"].includes(pathLang) ? pathLang : "";
    return (((params.lang as string) || fromPath) || "kz") as Lang;
}
