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
import {tPick, type Lang, type MlString} from "@/domain/base/mlString/mlString";
import {News as NewsDomain} from "@domain/news/news";
import {translate} from "@/pkg/translate/translate";

function getWindowDimensions() {
    const {innerWidth: width} = window;
    return width;
}

export default function CarouselNews({lang}: { lang: Lang }) {
    const [swiper, setSwiper] = useState<Swiper | null>(null);
    const [news, setNews] = useState<NewsDomain[]>([]);

    useEffect(() => {
        const fetchNews = async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/news`);
            const data = await res.json();
            if (data.success) {
                setNews(data.data.news);
            }
        }
        fetchNews();
    }, []);

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
                slidesPerView={3}
                loop={true}
                autoplay={{
                    delay: 2000,
                    disableOnInteraction: false,
                }}
                centeredSlides={true}
                onSwiper={(swiper) => setSwiper(swiper)}
                className={classes.swiper}
                modules={[Autoplay]}
            >
                {
                    news.map((news, index) => (
                        <SwiperSlide key={index}>
                            <News
                                cover={`${process.env.NEXT_PUBLIC_SPACE_HOST}/news/${news?.imgUrl}`}
                                date={
                                    new Date(news.createdAt).toLocaleDateString(lang, {
                                        year: 'numeric',
                                        month: 'numeric',
                                        day: 'numeric',
                                        hour: 'numeric',
                                        minute: 'numeric'
                                    })
                                }
                                title={translate(news.title as MlString, lang)}
                                link={`/${lang.toLowerCase()}/news?id=${news.id}`}
                            />
                        </SwiperSlide>
                    ))
                }
            </SwiperComponent>

            <div className={classes.news_list}>
                {
                    news.map((news, index) => (
                        <News
                            cover={`${process.env.NEXT_PUBLIC_SPACE_HOST}/news/${news?.imgUrl}`}
                            date={
                                new Date(news.createdAt).toLocaleDateString(lang, {
                                    year: 'numeric',
                                    month: 'numeric',
                                    day: 'numeric',
                                    hour: 'numeric',
                                    minute: 'numeric'
                                })
                            }
                            title={translate(news.title as MlString, lang)}
                            link={`/${lang.toLowerCase()}/news?id=${news.id}`}
                            key={index}
                        />
                    ))
                }
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
