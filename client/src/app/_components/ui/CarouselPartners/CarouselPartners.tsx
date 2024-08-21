'use client'

import {useState} from "react";
import Image from "next/image";
import {Swiper} from "swiper";
import {Swiper as SwiperComponent, SwiperSlide} from 'swiper/react';
import GerbSVG from "@assets/gerb.svg";
import 'swiper/css';
import classes from "./CarouselPartners.module.scss";
import { Autoplay } from 'swiper/modules';

function getWindowDimensions() {
    const {innerWidth: width} = window;
    return width;
}

export default function CarouselPartners() {
    const [swiper, setSwiper] = useState<Swiper | null>(null);

    return (
        <>
            <SwiperComponent
                spaceBetween={125}
                slidesPerView={5}
                loop={true}
                autoplay={{
                    delay: 2000,
                    disableOnInteraction: false,
                }}
                centeredSlides={true}
                initialSlide={2}
                onSwiper={(swiper) => setSwiper(swiper)}
                className={classes.swiper}
                modules={[Autoplay]}
            >
                <SwiperSlide>
                    <Partner
                        title={"Министерство национальной экономики"}
                    />
                </SwiperSlide>
                <SwiperSlide>
                    <Partner
                        title={"Официальный сайт Президента Республики Казахстан"}
                    />
                </SwiperSlide>
                <SwiperSlide>
                    <Partner
                        title={"Официальный сайт аппарата правительства"}
                    />
                </SwiperSlide>
                <SwiperSlide>
                    <Partner
                        title={"Агентство по защите и развитию конкуренции"}
                    />
                </SwiperSlide>
                <SwiperSlide>
                    <Partner
                        title={"Министерство финансов"}
                    />
                </SwiperSlide>
                <SwiperSlide>
                    <Partner
                        title={"Национальная Палата Предпринимателей"}
                    />
                </SwiperSlide>
                <SwiperSlide>
                    <Partner
                        title={"Самрук-Қазына"}
                    />
                </SwiperSlide>
            </SwiperComponent>

            <div className={classes.partner_list}>
                <Partner
                    title={"Министерство национальной экономики"}
                />
                <Partner
                    title={"Официальный сайт Президента Республики Казахстан"}
                />
                <Partner
                    title={"Официальный сайт аппарата правительства"}
                />
                <Partner
                    title={"Агентство по защите и развитию конкуренции"}
                />
                <Partner
                    title={"Министерство финансов"}
                />
                <Partner
                    title={"Национальная Палата Предпринимателей"}
                />
                <Partner
                    title={"Самрук-Қазына"}
                />
            </div>
        </>
    )
}

interface PartnerProps {
    title: string
}

function Partner({title}: PartnerProps) {
    return (
        <div className={classes.partner}>
            <GerbSVG className={classes.partner__logo}/>
            <div className={classes.partner__title}>
                <p>{title}</p>
            </div>
        </div>
    )
}
