'use client'

import {useEffect, useState} from "react";
import {translate} from "@/pkg/translate/translate";
import {Langs} from "@domain/base/mlString/mlString";
import ArrowDownSVG from "@assets/chevron-down.svg";
import classes from "@components/Header/Header.module.scss";

export default function NavBar({lang}: {lang: Langs}) {
    const [positionY, setPositionY] = useState(0);

    useEffect(() => {
        window.addEventListener('scroll', () => {
            setPositionY(window.scrollY);
        })
    }, []);

    return (
        <div
            className={classes.header__lower_layer}
            style={{boxShadow: positionY > 100 ? "rgb(0 0 0 / 10%) 0px 4px 8px 0px" : "rgb(0 0 0 / 0%) 0px 2px 4px 0px"}}
        >
            <nav className={classes.header__lower_layer__navigation}>
                <ul className={classes.header__lower_layer__navigation__list}>
                    <li className={classes.header__lower_layer__navigation__list__item}>
                        <PageLink
                            label={translate("main", lang)}
                            link={`/${lang.toLowerCase()}`}
                        />
                    </li>
                    <li className={classes.header__lower_layer__navigation__list__item}>
                        <PageLink
                            label={translate("about_us", lang)}
                            link={`/${lang.toLowerCase()}` + "/about"}
                        />
                    </li>
                    <li className={classes.header__lower_layer__navigation__list__item}>
                        <PageLink
                            label={translate("catalog_of_enterprises", lang)}
                            link={`/${lang.toLowerCase()}` + "/catalog"}
                        />
                    </li>
                    <li className={classes.header__lower_layer__navigation__list__item}>
                        <PageLink
                            label={translate("media_space", lang)}
                            link={`/${lang.toLowerCase()}` + "/media"}
                        />
                    </li>
                </ul>
            </nav>
        </div>
    )
}

function PageLink({label, link}: { label: string, link: string }) {
    return (
        <a href={link} className={classes.header__lower_layer__navigation__list__item__link}>
            <p>{label}</p>
            <ArrowDownSVG className={classes.header__lower_layer__navigation__list__item__link__icon}/>
        </a>
    )
}
