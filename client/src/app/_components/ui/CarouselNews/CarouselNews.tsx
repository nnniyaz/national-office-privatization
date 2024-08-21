'use client'

import {useEffect, useState} from "react";
import Image from "next/image";
import {Swiper} from "swiper";
import {Swiper as SwiperComponent, SwiperSlide} from 'swiper/react';
import ArrowLeft from "@assets/chevron-left.svg";
import ArrowRight from "@assets/chevron-right.svg";
import 'swiper/css';
import {Autoplay} from 'swiper/modules';
import classes from "./CarouselNews.module.scss";
import {Langs} from "@domain/mlString/mlString";

function getWindowDimensions() {
    const {innerWidth: width} = window;
    return width;
}

export default function CarouselNews({lang}: { lang: Langs }) {
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
                    <News
                        cover={"https://www.gov.kz/uploads/2024/6/28/5c5b866ca9b640b71ab5521a702b11ad_1280x720.jpg"}
                        date={"28.06.2024"}
                        title={"Национальный офис по приватизации анонсировал передачу ряда государственных предприятий в частные руки"}
                        link={`/${lang.toLowerCase()}/news?id=${1}`}
                    />
                </SwiperSlide>
                <SwiperSlide>
                    <News
                        cover={"https://www.gov.kz/uploads/2024/6/28/822dbb80c2969229f2c902c73c73458f_1280x720.jpg"}
                        date={"28.06.2024"}
                        title={"Факт создания субъекта рынка с государственным участием будет означать обязательное включение его в список приватизации"}
                        link={`/${lang.toLowerCase()}/news?id=${2}`}
                    />
                </SwiperSlide>
                <SwiperSlide>
                    <News
                        cover={"https://www.gov.kz/uploads/2024/6/27/29576b60ea92a41aff65d9861a750aa6_1280x720.JPG"}
                        date={"27.06.2024"}
                        title={"В Астане прошло первое заседание национального офиса по приватизации"}
                        link={`/${lang.toLowerCase()}/news?id=${3}`}
                    />
                </SwiperSlide>
                <SwiperSlide>
                    <News
                        cover={"https://www.gov.kz/uploads/2024/6/28/59fbf6046b66c62b5173cbc7afc0417d_1280x720.jpg"}
                        date={"28.06.2024"}
                        title={"Национальный офис по приватизации анонсировал передачу ряда государственных предприятий в частные руки"}
                        link={`/${lang.toLowerCase()}/news?id=${1}`}
                    />
                </SwiperSlide>
                <SwiperSlide>
                    <News
                        cover={"https://www.gov.kz/uploads/2024/6/28/822dbb80c2969229f2c902c73c73458f_1280x720.jpg"}
                        date={"28.06.2024"}
                        title={"Факт создания субъекта рынка с государственным участием будет означать обязательное включение его в список приватизации"}
                        link={`/${lang.toLowerCase()}/news?id=${2}`}
                    />
                </SwiperSlide>
                <SwiperSlide>
                    <News
                        cover={"https://www.gov.kz/uploads/2024/6/27/29576b60ea92a41aff65d9861a750aa6_1280x720.JPG"}
                        date={"27.06.2024"}
                        title={"В Астане прошло первое заседание национального офиса по приватизации"}
                        link={`/${lang.toLowerCase()}/news?id=${3}`}
                    />
                </SwiperSlide>
            </SwiperComponent>

            <div className={classes.news_list}>
                <News
                    primary={true}
                    cover={"https://www.gov.kz/uploads/2024/6/28/5c5b866ca9b640b71ab5521a702b11ad_1280x720.jpg"}
                    date={"28.06.2024"}
                    title={"Национальный офис по приватизации анонсировал передачу ряда государственных предприятий в частные руки"}
                    link={`/${lang.toLowerCase()}/news?id=${1}`}
                />
                <News
                    cover={"https://www.gov.kz/uploads/2024/6/28/822dbb80c2969229f2c902c73c73458f_1280x720.jpg"}
                    date={"28.06.2024"}
                    title={"Факт создания субъекта рынка с государственным участием будет означать обязательное включение его в список приватизации"}
                    link={`/${lang.toLowerCase()}/news?id=${2}`}
                />
                <News
                    cover={"https://www.gov.kz/uploads/2024/6/27/29576b60ea92a41aff65d9861a750aa6_1280x720.JPG"}
                    date={"27.06.2024"}
                    title={"В Астане прошло первое заседание национального офиса по приватизации"}
                    link={`/${lang.toLowerCase()}/news?id=${3}`}
                />
            </div>
        </>
    )
}

interface NewsProps {
    primary?: boolean,
    cover: string,
    date: string,
    title: string
    link: string,
}

function News({primary, cover, date, title, link}: NewsProps) {
    if (primary) {
        return (
            <a className={classes.primary_news} href={link}>
                <div className={classes.news__cover}></div>
                <Image
                    src={cover}
                    alt={title}
                    width={0}
                    height={0}
                    className={classes.news__cover__img}
                    placeholder={"empty"}
                    unoptimized={true}
                />
                <div className={classes.news__text}>
                    <div className={classes.news__date}>
                        <p>{date}</p>
                    </div>
                    <div className={classes.news__title}>
                        <p>{title}</p>
                    </div>
                </div>
            </a>
        )
    }

    return (
        <a className={classes.news} href={link}>
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
        </a>
    )
}
