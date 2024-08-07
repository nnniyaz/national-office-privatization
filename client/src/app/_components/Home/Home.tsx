import Block from "@components/ui/Block/Block";
import Button from "@components/ui/Button/Button";
import CarouselNews from "@components/ui/CarouselNews/CarouselNews";
import {translate} from "@/pkg/translate/translate";
import {Langs} from "@domain/mlString/mlString";
import PlaySVG from "@assets/play.svg";
import KzSVG from "@assets/kz.svg";
import classes from "./Home.module.scss";

export default function Home({lang}: { lang: Langs }) {
    return (
        <div className={classes.home}>
            <div className={classes.welcome_block}>
                <div className={classes.welcome_block__statement}>
                    <div className={classes.welcome_block__statement__group}>
                        <h2>{translate("welcome_text", lang)}</h2>
                        <Button label={translate("submit_application", lang)}/>
                    </div>
                    <div className={classes.welcome_block__statement__group}>
                        <div className={classes.welcome_block__statement__group__player}>
                            <img
                                className={classes.welcome_block__statement__group__player__cover}
                                src={"./player-cover.png"}
                                alt={"Video player cover"}
                            />
                            <div className={classes.welcome_block__statement__group__player__btn__container}>
                                <PlaySVG className={classes.welcome_block__statement__group__player__btn}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Block title={translate("news", lang)}>
                <CarouselNews/>
            </Block>
            <Block title={translate("office_mission", lang)}>
                <div className={classes.mission}>
                    <div className={classes.mission__group}>
                        <p className={classes.mission__group__text}>
                            Текст о миссии НОП с <strong>выделением важных моментов</strong>. Текст о миссии НОП с выделением важных
                            моментов. Текст о миссии НОП с выделением важных моментов. Текст о миссии НОП с выделением
                            важных моментов. Текст о миссии НОП с выделением важных моментов.
                        </p>
                        <p className={classes.mission__group__text}>
                            Текст о миссии НОП с выделением важных моментов. Текст о миссии НОП с выделением важных
                            моментов. Текст о миссии НОП с <strong>выделением важных моментов</strong>. Текст о миссии НОП с выделением
                            важных моментов. Текст о миссии НОП с выделением важных моментов. Текст о миссии НОП с
                            выделением важных моментов. Текст о миссии НОП с выделением важных моментов. Текст о миссии
                            НОП с выделением важных моментов. Текст о миссии НОП с <strong>выделением важных моментов</strong>. Текст о
                            миссии НОП с выделением важных моментов. Текст о миссии НОП с выделением важных моментов.
                        </p>
                        <p className={classes.mission__group__text}>
                            Текст о миссии НОП с выделением важных моментов. Текст о миссии НОП с выделением важных
                            моментов. Текст о миссии НОП с выделением важных моментов.
                        </p>
                    </div>
                    <div className={classes.mission__group}>
                        <div className={classes.step}>
                            <div className={classes.step__point}></div>
                            <div className={classes.step__route}></div>
                            <div className={classes.step__point}></div>
                            <div className={classes.step__route} style={{height: "142.5px"}}></div>
                            <div className={classes.step__point}></div>
                        </div>
                    </div>
                </div>
            </Block>
            <Block title={translate("enterprises_by_regions", lang)}>
                <div className={classes.enterprises}>
                    
                </div>
            </Block>
            <Block>
                <></>
            </Block>
        </div>
    )
}
