import {headers} from "next/headers";
import GerbSVG from "@assets/gerb.svg";
import {lang} from "@/pkg/lang/lang";
import {translate} from "@/pkg/translate/translate";
import classes from "./Footer.module.scss";

export default function Footer() {
    const headersList = headers();
    const langRetrieve = () => lang(headersList)
    return (
        <footer className={classes.footer}>
            <div className={classes.footer__upper_layer}>
                <div className={classes.footer__upper_layer__group}>
                    <div className={classes.footer__upper_layer__group__logo_block}>
                        <div className={classes.footer__upper_layer__group__logo_block__gov_logo}>
                            <a className={classes.footer__upper_layer__group__logo_block__gov_logo__link}>
                                <GerbSVG/>
                            </a>
                        </div>
                        <div className={classes.footer__upper_layer__group__logo_block__nop_logo}>
                            <a className={classes.footer__upper_layer__group__logo_block__nop_logo__link}>
                                <h2>Ұлттық жекешелендіру кеңсесі</h2>
                                <h2>Национальный офис приватизации</h2>
                                <h2>National Office of Privatization</h2>
                            </a>
                        </div>
                    </div>
                </div>
                <div className={classes.footer__upper_layer__group}>
                    <ul className={classes.footer__upper_layer__group__links_list}>
                        <li className={classes.footer__upper_layer__group__links_list__item}>
                            <PageLink
                                label={translate("main", langRetrieve())}
                                link={`/${langRetrieve().toLowerCase()}`}
                            />
                        </li>
                        <li className={classes.footer__upper_layer__group__links_list__item}>
                            <PageLink
                                label={translate("about_us", langRetrieve())}
                                link={`/${langRetrieve().toLowerCase()}` + "/about"}
                            />
                        </li>
                        <li className={classes.footer__upper_layer__group__links_list__item}>
                            <PageLink
                                label={translate("catalog_of_enterprises", langRetrieve())}
                                link={`/${langRetrieve().toLowerCase()}` + "/catalog"}
                            />
                        </li>
                        <li className={classes.footer__upper_layer__group__links_list__item}>
                            <PageLink
                                label={translate("media_space", langRetrieve())}
                                link={`/${langRetrieve().toLowerCase()}` + "/media"}
                            />
                        </li>
                    </ul>
                </div>
                <div className={classes.footer__upper_layer__group}>
                    <ul className={classes.footer__upper_layer__group__contacts_list}>
                        <li className={classes.footer__upper_layer__group__contacts_list__item}>
                            <a
                                href={"tel:+77771234567"}
                                className={classes.footer__upper_layer__group__contacts_list__item__link}
                            >
                                <p>{`${translate("phone_number", langRetrieve())}: +7 747 451 9942`}</p>
                            </a>
                        </li>
                        <li className={classes.footer__upper_layer__group__contacts_list__item}>
                            <a
                                href={"mailto:example@mail.kz"}
                                className={classes.footer__upper_layer__group__contacts_list__item__link}
                            >
                                <p>{`${translate("email", langRetrieve())}: example@mail.kz`}</p>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            <div className={classes.footer__lower_layer}>
                <p>{`© 2024 "${translate("nop", langRetrieve())}"`}</p>
            </div>
        </footer>
    )
}

function PageLink({label, link}: { label: string, link: string }) {
    return (
        <a href={link} className={classes.footer__upper_layer__group__links_list__item__link}>
            <p>{label}</p>
        </a>
    )
}
