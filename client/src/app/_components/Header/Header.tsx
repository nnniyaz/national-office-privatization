import {headers} from "next/headers";
import GerbSVG from "@assets/gerb.svg";
import MailSVG from "@assets/mail.svg";
import PhoneSVG from "@assets/phone.svg";
import MenuSVG from "@assets/menu.svg";
import NavBar from "@components/Header/components/NavBar/NavBar";
import LangsBar from "@components/Header/components/LangsBar/LangsBar";
import {lang} from "@/pkg/lang/lang";
import classes from "./Header.module.scss";
import Sidebar from "@components/Header/components/Sidebar/Sidebar";

export default function Header() {
    const headersList = headers();
    const langRetrieve = () => lang(headersList);

    return (
        <>
            <header className={classes.header}>
                <div className={classes.header__upper_layer}>
                    <div className={classes.header__upper_layer__group}>
                        <div className={classes.header__upper_layer__group__logo_block}>
                            <div className={classes.header__upper_layer__group__logo_block__gov_logo}>
                                <a className={classes.header__upper_layer__group__logo_block__gov_logo__link} href={"/"}>
                                    <GerbSVG/>
                                </a>
                            </div>
                            <div className={classes.header__upper_layer__group__logo_block__nop_logo}>
                                <a className={classes.header__upper_layer__group__logo_block__nop_logo__link} href={"/"}>
                                    <h1>Ұлттық жекешелендіру кеңсесі</h1>
                                    <h2>Национальный офис приватизации</h2>
                                    <h2>National Office of Privatization</h2>
                                </a>
                            </div>
                        </div>
                        <div className={classes.header__upper_layer__group__contacts}>
                            <ul className={classes.header__upper_layer__group__contacts__list}>
                                <li className={classes.header__upper_layer__group__contacts__list__item}>
                                    <Contact
                                        type={"phone"}
                                        value={`+7 747 451 9942`}
                                        link={"tel:+77474519942"}
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
                        <Sidebar lang={langRetrieve()}/>
                    </div>
                </div>
                <NavBar lang={langRetrieve()}/>
            </header>
        </>
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
