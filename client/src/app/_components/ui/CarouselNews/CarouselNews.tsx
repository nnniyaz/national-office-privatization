'use client'

import {useState} from "react";
import Image from "next/image";
import {Swiper} from "swiper";
import {Swiper as SwiperComponent, SwiperSlide} from 'swiper/react';
import ArrowLeft from "@assets/chevron-left.svg";
import ArrowRight from "@assets/chevron-right.svg";
import 'swiper/css';
import classes from "./CarouselNews.module.scss";

export default function CarouselNews() {
    const [swiper, setSwiper] = useState<Swiper | null>(null);
    return (
        <>
            <div className={classes.swiper_navigation}>
                <ArrowLeft
                    className={classes.swiper_navigation__item}
                    onClick={() => swiper?.slidePrev()}
                />
                <ArrowRight
                    className={classes.swiper_navigation__item}
                    onClick={() => swiper?.slideNext()}
                />
            </div>
            <SwiperComponent
                spaceBetween={10}
                slidesPerView={4}
                loop={true}
                autoplay={true}
                centeredSlides={true}
                initialSlide={2}
                onSwiper={(swiper) => setSwiper(swiper)}
            >
                <SwiperSlide>
                    <News
                        cover={"/placeholder.png"}
                        date={"08.05.2024"}
                        title={"Текст о данной новости про Нациоанальный Офис Приватизации."}
                    />
                </SwiperSlide>
                <SwiperSlide>
                    <News
                        cover={"/placeholder.png"}
                        date={"08.05.2024"}
                        title={"Текст о данной новости про Нациоанальный Офис Приватизации."}
                    />
                </SwiperSlide>
                <SwiperSlide>
                    <News
                        cover={"/placeholder.png"}
                        date={"08.05.2024"}
                        title={"Текст о данной новости про Нациоанальный Офис Приватизации."}
                    />
                </SwiperSlide>
                <SwiperSlide>
                    <News
                        cover={"/placeholder.png"}
                        date={"08.05.2024"}
                        title={"Текст о данной новости про Нациоанальный Офис Приватизации."}
                    />
                </SwiperSlide>
                <SwiperSlide>
                    <News
                        cover={"/placeholder.png"}
                        date={"08.05.2024"}
                        title={"Текст о данной новости про Нациоанальный Офис Приватизации."}
                    />
                </SwiperSlide>
                <SwiperSlide>
                    <News
                        cover={"/placeholder.png"}
                        date={"08.05.2024"}
                        title={"Текст о данной новости про Нациоанальный Офис Приватизации."}
                    />
                </SwiperSlide>
                <SwiperSlide>
                    <News
                        cover={"/placeholder.png"}
                        date={"08.05.2024"}
                        title={"Текст о данной новости про Нациоанальный Офис Приватизации."}
                    />
                </SwiperSlide>
            </SwiperComponent>
        </>
    )
}

interface NewsProps {
    cover: string,
    date: string,
    title: string
}

function News({cover, date, title}: NewsProps) {
    return (
        <div className={classes.news}>
            <div className={classes.news__cover}>
                <Image
                    src={cover}
                    alt={title}
                    width={0}
                    height={0}
                    className={classes.news__cover__img}
                    placeholder={"empty"}
                    unoptimized={true}
                />
            </div>
            <div className={classes.news__date}>
                <p>{date}</p>
            </div>
            <div className={classes.news__title}>
                <p>{title}</p>
            </div>
        </div>
    )
}
