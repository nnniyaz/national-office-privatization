'use client'

import classes from "./News.module.scss";
import React, {useEffect} from "react";
import {useSearchParams} from "next/navigation";
import {News as NewsDomain} from "@domain/news/news";

export default function News() {
    const params = useSearchParams();
    const id = params.get("id");
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
                {news?.title}
            </h2>

            <NewsItem news={news}/>
        </div>
    )
}

const NewsItem = ({news}: {news: NewsDomain | null}) => {
    return (
        <>
            <img
                className={classes.news__img}
                src={`${process.env.NEXT_PUBLIC_SPACE_HOST}/news/${news?.imgUrl}`}
                alt={news?.title}
            />
            <p dangerouslySetInnerHTML={{__html: `${news?.content.replace(/(\r\n|\r|\n)/g, '<br>')}`}}/>
        </>
    )
}
