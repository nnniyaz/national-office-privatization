'use client'

import React, {useEffect, useState} from "react";
import Image from "next/image";
import {tPick, type Lang, MlString} from "@/domain/base/mlString/mlString";
import classes from "./Media.module.scss";
import {translate} from "@/pkg/translate/translate";
import {News as NewsDomain} from "@domain/news/news";
import {Event as EventDomain} from "@domain/event/event";
import {Document as DocumentDomain} from "@domain/document/document";
import DocSVG from "@assets/document-text.svg";

export default function Media({lang}: { lang: Lang }) {
    const [isMounted, setMounted] = useState(false);
    const [currentTab, setCurrentTab] = useState("news");
    const [currentSubTab, setCurrentSubTab] = useState(1);
    const sideTabs: { [key: string]: string } = {
        "news": translate("news", lang),
        "meetings": translate("events", lang),
        "documents": translate("reports_and_documents", lang)
    }

    const [news, setNews] = useState<NewsDomain[]>([]);
    const [events, setEvents] = useState<EventDomain[]>([]);
    const [documents, setDocuments] = useState<DocumentDomain[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (currentTab !== "news") {
            return;
        }
        const fetchNews = async () => {
            setLoading(true);
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/news`);
            const data = await res.json();
            if (data.success) {
                setNews(data.data.news || []);
            }
            setLoading(false);
        }
        fetchNews();
    }, [currentTab]);

    useEffect(() => {
        if (currentTab !== "meetings") {
            return;
        }
        const fetchEvents = async () => {
            setLoading(true);
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/event`);
            const data = await res.json();
            if (data.success) {
                setEvents(data.data.events || []);
            }
            setLoading(false);
        }
        fetchEvents();
    }, [currentTab]);

    useEffect(() => {
        if (currentTab !== "documents") {
            return;
        }
        const fetchDocuments = async () => {
            setLoading(true);
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/document`);
            const data = await res.json();
            if (data.success) {
                setDocuments(data.data.documents || []);
            }
            setLoading(false);
        }
        fetchDocuments();
    }, [currentTab]);

    useEffect(() => {
        if (isMounted) {
            setCurrentTab(window?.location?.hash?.replace("#", "") || "news");
        } else {
            setMounted(true);
        }
    }, [isMounted])

    return (
        <div className={classes.main}>
            <h2 className={classes.title}>
                {translate("media_space", lang)}
            </h2>
            <div className={classes.container}>
                <div className={classes.sidebar}>
                    {
                        Object.keys(sideTabs).map(key => (
                            <a
                                key={key}
                                className={currentTab === key ? classes.sidebar__item__active : classes.sidebar__item}
                                href={`#${key}`}
                                onClick={() => {
                                    setCurrentTab(key);
                                }}
                            >
                                {sideTabs[key]}
                            </a>
                        ))
                    }
                </div>

                {
                    isMounted ? (
                        <div className={classes.content}>
                            {currentTab === "news" && (
                                loading ? (
                                    <div className={"loader_wrapper"}>
                                        <div className={"loader"}></div>
                                    </div>
                                ) : (
                                    <>
                                        <h2 className={classes.content__title}>
                                            {translate("news", lang)}
                                        </h2>
                                        <div className={classes.list}>
                                            {
                                                news.map((news, index) => (
                                                    <News
                                                        key={index}
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
                                                ))
                                            }
                                        </div>
                                    </>
                                )
                            )}
                            {currentTab === "meetings" && (
                                loading ? (
                                    <div className={"loader_wrapper"}>
                                        <div className={"loader"}></div>
                                    </div>
                                ) : (
                                    <>
                                        <h2 className={classes.content__title}>
                                            {translate("events", lang)}
                                        </h2>
                                        <div className={classes.list}>
                                            {
                                                events.length > 0 ? (
                                                    events.map((event, index) => (
                                                        <Event
                                                            key={index}
                                                            cover={`${process.env.NEXT_PUBLIC_SPACE_HOST}/event/${event?.imgUrl}`}
                                                            date={
                                                                new Date(event.createdAt).toLocaleDateString(lang, {
                                                                    year: 'numeric',
                                                                    month: 'numeric',
                                                                    day: 'numeric',
                                                                    hour: 'numeric',
                                                                    minute: 'numeric'
                                                                })
                                                            }
                                                            plannedAt={
                                                                new Date(event.plannedAt).toLocaleDateString(lang, {
                                                                    year: 'numeric',
                                                                    month: 'numeric',
                                                                    day: 'numeric',
                                                                    hour: 'numeric',
                                                                    minute: 'numeric'
                                                                })
                                                            }
                                                            title={translate(event.name as MlString, lang)}
                                                            link={`/${lang.toLowerCase()}/news?id=${event.id}`}
                                                            lang={lang}
                                                        />
                                                    ))
                                                ) : (
                                                    <h3 style={{marginTop: "30px"}}>
                                                        {translate("events_not_found", lang)}
                                                    </h3>
                                                )
                                            }
                                        </div>
                                    </>
                                )
                            )}
                            {currentTab === "documents" && (
                                <>
                                    <h2 className={classes.content__title}>
                                        {translate("reports_and_documents", lang)}
                                    </h2>
                                    {
                                        loading ? (
                                            <div className={"loader_wrapper"}>
                                                <div className={"loader"}></div>
                                            </div>
                                        ) : (
                                            documents.length > 0 ? (
                                                documents.map((item, index) => (
                                                    <div className={classes.doc} key={index}>
                                                        <div className={classes.doc__group}>
                                                            <DocSVG className={classes.doc__symbol}/>
                                                            <div className={classes.doc__title} style={{width: "fit-content"}}>
                                                                {translate(item.title as MlString, lang)}
                                                            </div>
                                                        </div>
                                                        <a
                                                            className={classes.doc__download}
                                                            href={`${process.env.NEXT_PUBLIC_SPACE_HOST}/npa/${item?.filename}`}
                                                            target={"_blank"}
                                                        >
                                                            {translate("download", lang)}
                                                        </a>
                                                    </div>
                                                ))
                                            ) : (
                                                <h3 style={{marginTop: "30px"}}>
                                                    {translate("documents_not_found", lang)}
                                                </h3>
                                            )
                                        )
                                    }
                                </>
                            )}
                        </div>
                    ) : (
                        <div className={classes.content}></div>
                    )
                }
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

interface EventProps {
    cover: string,
    date: string,
    plannedAt: string,
    title: string,
    link: string,
    lang: Lang
}

function Event({cover, date, plannedAt, title, link, lang}: EventProps) {
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
            <div className={classes.news__date}>
                <p>{`${translate("planned_at", lang)}: ${plannedAt}`}</p>
            </div>
            <div className={classes.news__title}>
                <p>{title}</p>
            </div>
        </a>
    )
}
