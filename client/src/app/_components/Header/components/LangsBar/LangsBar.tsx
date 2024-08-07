'use client'

import {Langs} from "@domain/mlString/mlString";
import {usePathname} from "next/navigation";
import classes from "@components/Header/Header.module.scss";

export default function LangsBar({lang}: { lang: Langs }) {
    const pathname = usePathname();

    const currentPath = (lang: Langs) => {
        return pathname.split("/")?.length > 2
            ? `/${lang.toLowerCase()}/${pathname.split("/")[1]}`
            : `/${lang.toLowerCase()}`
    }

    return (
        <div className={classes.header__upper_layer__group__langs}>
            <ul className={classes.header__upper_layer__group__langs__list}>
                <li
                    className={
                        lang === Langs.KZ
                            ? classes.header__upper_layer__group__langs__list__item__active
                            : classes.header__upper_layer__group__langs__list__item
                    }
                >
                    <a href={currentPath(Langs.KZ)} style={{textDecoration: "none"}}>
                        <p>Қаз</p>
                    </a>
                </li>
                <li
                    className={
                        lang === Langs.RU
                            ? classes.header__upper_layer__group__langs__list__item__active
                            : classes.header__upper_layer__group__langs__list__item
                    }
                >
                    <a href={currentPath(Langs.RU)} style={{textDecoration: "none"}}>
                        <p>Рус</p>
                    </a>
                </li>
                <li
                    className={
                        lang === Langs.EN
                            ? classes.header__upper_layer__group__langs__list__item__active
                            : classes.header__upper_layer__group__langs__list__item
                    }
                >
                    <a href={currentPath(Langs.EN)} style={{textDecoration: "none"}}>
                        <p>Eng</p>
                    </a>
                </li>
            </ul>
        </div>
    )
}
