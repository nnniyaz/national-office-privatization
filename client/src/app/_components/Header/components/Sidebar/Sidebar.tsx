'use client'

import parentClasses from "../../Header.module.scss";
import classes from "./Sidebar.module.scss";
import {useEffect, useState} from "react";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {translate} from "@/pkg/translate/translate";
import {Langs} from "@domain/mlString/mlString";
import MenuSVG from "@assets/menu.svg";
import {Transition} from "react-transition-group";
import LangsBar from "@components/Header/components/LangsBar/LangsBar";

export default function Sidebar({lang}: {lang: Langs}) {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

    const transitionClasses = {
        entering: classes.sidebar__container__enter__active,
        entered: classes.sidebar__container__enter__done,
        exiting: classes.sidebar__container__exit__active,
        exited: classes.sidebar__container__exit__done,
        unmounted: classes.sidebar__container__exit__done,
    }

    const closeMenu = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        setIsMenuOpen(false);
    }

    const handleSidebarClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation();
    }

    const currentPath = (lang: Langs) => {
        return pathname.split("/")?.length > 2
            ? `/${lang.toLowerCase()}/${pathname.split("/")[1]}`
            : `/${lang.toLowerCase()}`
    }

    useEffect(() => {
        setIsMenuOpen(false);
    }, [pathname]);

    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
    }, [isMenuOpen]);

    return (
        <>
            <MenuSVG
                onClick={() => setIsMenuOpen(true)}
                className={parentClasses.header__upper_layer__group__menu}
            />
            <Transition in={isMenuOpen} timeout={300} mountOnEnter unmountOnExit>
                {state => (
                    <div className={`${classes.sidebar__container} ${transitionClasses[state]}`} onClick={closeMenu}>
                        <section className={classes.sidebar} onClick={handleSidebarClick}>
                            <header className={classes.sidebar__header}>
                                <MenuSVG
                                    className={classes.sidebar__header__item}
                                    onClick={() => setIsMenuOpen(false)}
                                />
                                <div className={classes.header__upper_layer__group__langs}>
                                    <div className={classes.header__upper_layer__group__langs__list}>
                                        <div
                                            className={
                                                lang === Langs.KZ
                                                    ? classes.header__upper_layer__group__langs__list__item__active
                                                    : classes.header__upper_layer__group__langs__list__item
                                            }
                                        >
                                            <a href={currentPath(Langs.KZ)} style={{textDecoration: "none"}}>
                                                <p>Қаз</p>
                                            </a>
                                        </div>
                                        <div
                                            className={
                                                lang === Langs.RU
                                                    ? classes.header__upper_layer__group__langs__list__item__active
                                                    : classes.header__upper_layer__group__langs__list__item
                                            }
                                        >
                                            <a href={currentPath(Langs.RU)} style={{textDecoration: "none"}}>
                                                <p>Рус</p>
                                            </a>
                                        </div>
                                        <div
                                            className={
                                                lang === Langs.EN
                                                    ? classes.header__upper_layer__group__langs__list__item__active
                                                    : classes.header__upper_layer__group__langs__list__item
                                            }
                                        >
                                            <a href={currentPath(Langs.EN)} style={{textDecoration: "none"}}>
                                                <p>Eng</p>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </header>
                            <ul>
                                <li>
                                    <Link
                                        className={pathname === `/${lang.toLowerCase()}` ? classes.sidebar__item__active : classes.sidebar__item}
                                        href={`/${lang.toLowerCase()}`}
                                    >
                                        <p className={classes.sidebar__item__text}>
                                            {translate("main", lang)}
                                        </p>
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        className={pathname === `/${lang.toLowerCase()}` + "/about" ? classes.sidebar__item__active : classes.sidebar__item}
                                        href={`/${lang.toLowerCase()}` + "/about"}
                                    >
                                        <p className={classes.sidebar__item__text}>
                                            {translate("about_us", lang)}
                                        </p>
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        className={pathname === `/${lang.toLowerCase()}` + "/catalog" ? classes.sidebar__item__active : classes.sidebar__item}
                                        href={`/${lang.toLowerCase()}` + "/catalog"}
                                    >
                                        <p className={classes.sidebar__item__text}>
                                            {translate("catalog_of_enterprises", lang)}
                                        </p>
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        className={pathname === `/${lang.toLowerCase()}` + "/media" ? classes.sidebar__item__active : classes.sidebar__item}
                                        href={`/${lang.toLowerCase()}` + "/media"}
                                    >
                                        <p className={classes.sidebar__item__text}>
                                            {translate("media_space", lang)}
                                        </p>
                                    </Link>
                                </li>
                            </ul>
                        </section>
                    </div>
                )}
            </Transition>
        </>
    )
}
