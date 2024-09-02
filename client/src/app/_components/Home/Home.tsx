'use client'

import Block from "@components/ui/Block/Block";
import Button from "@components/ui/Button/Button";
import CarouselNews from "@components/ui/CarouselNews/CarouselNews";
import {translate} from "@/pkg/translate/translate";
import {Langs} from "@domain/base/mlString/mlString";
import classes from "./Home.module.scss";
import CarouselPartners from "@components/ui/CarouselPartners/CarouselPartners";
import Enterprises from "@components/ui/Enterprises/Enterprises";
import Player from "@components/ui/Player/Player";
import {useEffect, useState} from "react";
import {LoadingOutlined} from "@ant-design/icons";

export default function Home({lang}: { lang: Langs }) {
    const [mounted, setMounted] = useState<boolean>(false);

    useEffect(() => {
        setMounted(true);
    }, [mounted]);

    if (!mounted) {
        return (
            <div className={"loader_wrapper"}>
                <div className={"loader"}></div>
            </div>
        )
    }

    return (
        <div className={classes.home}>
            <div className={classes.welcome_block}>
                <div className={classes.welcome_block__statement}>
                    <div className={classes.welcome_block__statement__group}>
                        <h2>{translate("welcome_text", lang)}</h2>
                        <Button
                            label={translate("submit_application", lang)}
                            onClick={() => window.open(`/${lang.toLowerCase()}` + "/catalog", "_self")}
                        />
                    </div>
                    <div className={classes.welcome_block__statement__group}>
                        <Player/>
                    </div>
                </div>
            </div>
            <Block title={translate("news", lang)}>
                <CarouselNews lang={lang}/>
            </Block>
            <Block title={translate("office_mission", lang)}>
                <div className={classes.mission}>
                    <div className={classes.mission__group}>
                        <p className={classes.mission__group__text}>
                            В соответствии с Указом Национальный офис до 31 декабря 2024 года должен обеспечить:
                        </p>
                        <p className={classes.mission__group__text}>
                            - Выработку критериев к государственным объектам, подлежащим обязательной приватизации;
                        </p>
                        <p className={classes.mission__group__text}>
                            - Проведение анализа деятельности действующих государственных предприятий и юридических лиц,
                            более пятидесяти процентов акций (долей участия в уставном капитале) которых принадлежат
                            государству и аффилированным с ними лицам, на предмет возможности и целесообразности
                            передачи в
                            конкурентную среду непрофильных активов с учетом региональной специфики;
                        </p>
                        <p className={classes.mission__group__text}>
                            - Формирование перечня государственных активов, подлежащих приватизации (с определением по
                            каждому из них условий и методов реализации, включая проведение IPO, SPO, аукционов и
                            других),
                            утверждение и корректировка которого будут возможны только по решению Высшего совета при
                            Президенте Республики Казахстан по реформам;
                        </p>
                        <p className={classes.mission__group__text}>
                            - Предоставление возможности приватизации объектов по инициативе субъектов частного
                            предпринимательства путем формирования и внедрения заявочного перечня государственных
                            активов,
                            подлежащих приватизации;
                        </p>
                        <p className={classes.mission__group__text}>
                            - Мониторинг хода приватизации государственных активов.
                        </p>
                        <p className={classes.mission__group__text}>
                            Национальным офисом также будет осуществляться формирование условий и методов приватизации,
                            что
                            исключит факты необоснованного затягивания процедур, завышения требований к потенциальным
                            покупателям и
                        </p>
                    </div>
                    <div className={classes.mission__group}>
                        <div className={classes.step}>
                            <div className={classes.step__point}>
                                <div className={classes.step__point__right}>
                                    <div className={classes.step__point__right__date}>
                                        <p>08.05.2024</p>
                                    </div>
                                    <div className={classes.step__point__right__info}>
                                        <p>{translate("first_event", lang)}</p>
                                    </div>
                                </div>
                            </div>
                            <div className={classes.step__route}></div>
                            <div className={classes.step__point}>
                                <div className={classes.step__point__left}>
                                    <div className={classes.step__point__left__date}>
                                        <p>17.05.2024</p>
                                    </div>
                                    <div className={classes.step__point__left__info}>
                                        <p>{translate("second_event", lang)}</p>
                                    </div>
                                </div>
                            </div>
                            <div className={classes.step__route} style={{height: "142.5px"}}></div>
                            <div className={classes.step__point}>
                                <div className={classes.step__point__right}>
                                    <div className={classes.step__point__right__date}>
                                        <p>01.06.2024</p>
                                    </div>
                                    <div className={classes.step__point__right__info}>
                                        <p>{translate("third_event", lang)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Block>
            <Enterprises lang={lang}/>
            <Block>
                <CarouselPartners/>
            </Block>
        </div>
    )
}
