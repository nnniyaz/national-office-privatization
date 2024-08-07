import {headers} from "next/headers";
import GerbSVG from "@assets/gerb.svg";
import MailSVG from "@assets/mail.svg";
import PhoneSVG from "@assets/phone.svg";
import ArrowDownSVG from "@assets/chevron-down.svg";
import LangsBar from "@components/Header/components/LangsBar/LangsBar";
import {lang} from "@/pkg/lang/lang";
import {translate} from "@/pkg/translate/translate";
import classes from "./Header.module.scss";

export default function Header() {
    const headersList = headers();
    const langRetrieve = () => lang(headersList);
    return (
        <header className={classes.header}>
            <div className={classes.header__upper_layer}>
                <div className={classes.header__upper_layer__group}>
                    <div className={classes.header__upper_layer__group__logo_block}>
                        <div className={classes.header__upper_layer__group__logo_block__gov_logo}>
                            <a className={classes.header__upper_layer__group__logo_block__gov_logo__link}>
                                <GerbSVG/>
                            </a>
                        </div>
                        <div className={classes.header__upper_layer__group__logo_block__nop_logo}>
                            <a className={classes.header__upper_layer__group__logo_block__nop_logo__link}>
                                <h1>Жекешелендірудің ұлттық басқармасы</h1>
                                <h2>Национальный офис приватизации</h2>
                                <h2>National Privatization Office</h2>
                            </a>
                        </div>
                    </div>
                    <div className={classes.header__upper_layer__group__contacts}>
                        <ul className={classes.header__upper_layer__group__contacts__list}>
                            <li className={classes.header__upper_layer__group__contacts__list__item}>
                                <Contact
                                    type={"phone"}
                                    value={`+7 777 123 45 67`}
                                    link={"tel:+77771234567"}
                                />
                            </li>
                            <li className={classes.header__upper_layer__group__contacts__list__item}>
                                <Contact
                                    type={"email"}
                                    value={`example@mail.kz`}
                                    link={"mailto:example@mail.kz"}
                                />
                            </li>
                        </ul>
                    </div>
                </div>
                <div className={classes.header__upper_layer__group}>
                    <LangsBar lang={langRetrieve()}/>
                </div>
            </div>
            <div className={classes.header__lower_layer}>
                <nav className={classes.header__lower_layer__navigation}>
                    <ul className={classes.header__lower_layer__navigation__list}>
                        <li className={classes.header__lower_layer__navigation__list__item}>
                            <PageLink
                                label={translate("main", langRetrieve())}
                                link={`/${langRetrieve().toLowerCase()}`}
                            />
                        </li>
                        <li className={classes.header__lower_layer__navigation__list__item}>
                            <PageLink
                                label={translate("about_us", langRetrieve())}
                                link={`/${langRetrieve().toLowerCase()}` + "/about"}
                            />
                        </li>
                        <li className={classes.header__lower_layer__navigation__list__item}>
                            <PageLink
                                label={translate("catalog_of_enterprises", langRetrieve())}
                                link={`/${langRetrieve().toLowerCase()}` + "/catalog"}
                            />
                        </li>
                        <li className={classes.header__lower_layer__navigation__list__item}>
                            <PageLink
                                label={translate("media_space", langRetrieve())}
                                link={`/${langRetrieve().toLowerCase()}` + "/media"}
                            />
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
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

function Contact({type, value, link}: { type: "phone" | "email", value: string, link: string }) {
    return (
        <a className={classes.header__upper_layer__group__contacts__list__item__link} href={link}>
            {type === "phone" && (
                <PhoneSVG className={classes.header__upper_layer__group__contacts__list__item__link__icon}/>
            )}
            {type === "email" && (
                <MailSVG className={classes.header__upper_layer__group__contacts__list__item__link__icon}/>
            )}
            <p>{value}</p>
        </a>
    )
}
