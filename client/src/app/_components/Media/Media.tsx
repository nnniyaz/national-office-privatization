'use client'

import classes from "./Media.module.scss";
import {Langs} from "@domain/mlString/mlString";
import CogSVG from "@assets/cog.svg";
import Image from "next/image";
import React, {useState} from "react";
import DocSVG from "@assets/document-text.svg";

export default function Media({lang}: {lang: Langs}) {
    const [currentTab, setCurrentTab] = useState(1);
    const [currentSubTab, setCurrentSubTab] = useState(1);

    return (
        <div className={classes.main}>
            <h2 className={classes.title}>
                Медиа пространство
            </h2>
            <div className={classes.container}>
                <div className={classes.sidebar}>
                    <p
                        className={currentTab === 1 ? classes.sidebar__item__active : classes.sidebar__item}
                        onClick={() => setCurrentTab(1)}
                    >
                        Новости
                    </p>
                    <p
                        className={currentTab === 2 ? classes.sidebar__item__active : classes.sidebar__item}
                        onClick={() => setCurrentTab(2)}
                    >
                        Мероприятия
                    </p>
                    <p
                        className={currentTab === 3 ? classes.sidebar__item__active : classes.sidebar__item}
                        onClick={() => setCurrentTab(3)}
                    >
                        Отчеты и документы
                    </p>
                </div>

                {currentTab === 1 && (
                    <div className={classes.content}>
                        <h2 className={classes.content__title}>
                            Новости
                        </h2>
                        <div className={classes.list}>
                            <News
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
                    </div>
                )}

                {currentTab === 2 && (
                    <div className={classes.content}>
                        <h2 className={classes.content__title}>
                            Мероприятия
                        </h2>
                        <div className={classes.tab__bar}>
                            <div
                                className={currentSubTab === 1 ? classes.tab__active : classes.tab}
                                onClick={() => setCurrentSubTab(1)}
                            >
                                Предстоящие
                            </div>
                            <div
                                className={currentSubTab === 2 ? classes.tab__active : classes.tab}
                                onClick={() => setCurrentSubTab(2)}
                            >
                                Прошедшие
                            </div>
                            <div
                                className={currentSubTab === 3 ? classes.tab__active : classes.tab}
                                onClick={() => setCurrentSubTab(3)}
                            >
                                График мероприятий на предстоящий
                            </div>
                        </div>
                        <h3 style={{marginTop: "30px"}}>
                            Мероприятия еще не опубликованы
                        </h3>
                    </div>
                )}

                {currentTab === 3 && (
                    <div className={classes.content}>
                        <h2 className={classes.content__title}>
                            Отчеты и документы
                        </h2>
                        <h3 style={{marginTop: "30px"}}>
                            Документы еще не опубликованы
                        </h3>
                    </div>
                )}
            </div>
        </div>
    )
}

interface NewsProps {
    cover: string,
    date: string,
    title: string,
    link: string
}

function News({cover, date, title, link}: NewsProps) {
    return (
        <a className={classes.news} href={link} target={"_blank"}>
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
