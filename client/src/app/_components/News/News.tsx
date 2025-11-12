'use client'

import classes from "./News.module.scss";
import React, {useEffect} from "react";
import {useSearchParams, useParams} from "next/navigation";
import {News as NewsDomain} from "@domain/news/news";
import {tPick, type Lang} from "@/domain/base/mlString/mlString";

export default function News() {
    const routeParams = useParams();
    const lang = (routeParams.lang || 'en') as Lang;
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const [news, setNews] = React.useState<NewsDomain | null>(null);
    const [loading, setLoading] = React.useState<boolean>(true);

    useEffect(() => {
        const fetchNews = async () => {
            setLoading(true);
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/news/${id}`);
            const data = await res.json();
            if (data.success) {
                setNews(data.data);
            }
            setLoading(false);
        }
        fetchNews();
    }, []);

    if (loading) {
        return (
            <div className={"loader_wrapper"}>
                <div className={"loader"}></div>
            </div>
        )
    }

    return (
        <div className={classes.main}>
            <h2 className={classes.title}>
                {tPick(news?.title, lang)}
            </h2>

            <NewsItem news={news} lang={lang}/>
        </div>
    )
}

const NewsItem = ({news, lang}: {news: NewsDomain | null, lang: Lang}) => {
    const content = tPick(news?.content, lang);
    const title = tPick(news?.title, lang);
    
    return (
        <>
            <img
                className={classes.news__img}
                src={`${process.env.NEXT_PUBLIC_SPACE_HOST}/news/${news?.imgUrl}`}
                alt={title}
            />
            <p dangerouslySetInnerHTML={{__html: content.replace(/(\r\n|\r|\n)/g, '<br>')}}/>
        </>
    )
}
