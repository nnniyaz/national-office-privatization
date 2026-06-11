'use client'

import classes from "./News.module.scss";
import React, {useEffect} from "react";
import {useSearchParams, useRouter} from "next/navigation";
import {News as NewsDomain} from "@domain/news/news";
import {tPick, type Lang, MlString} from "@/domain/base/mlString/mlString";
import {translate} from "@/pkg/translate/translate";
import {useLang} from "@/pkg/lang/useLang";

export default function News() {
    const router = useRouter();
    const lang = useLang();
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const [news, setNews] = React.useState<NewsDomain | null>(null);
    const [loading, setLoading] = React.useState<boolean>(true);

    useEffect(() => {
        // страница новости без id не имеет смысла — уводим к списку новостей
        if (!id) {
            router.replace(`/${lang}/media`);
            return;
        }
        const fetchNews = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/news/${id}`);
                const data = await res.json();
                if (data.success) {
                    setNews(data.data);
                }
            } catch {
                // новость не загрузилась — ниже уйдём на список
            }
            setLoading(false);
        }
        fetchNews();
    }, [id]);

    useEffect(() => {
        if (!loading && !news) {
            router.replace(`/${lang}/media`);
        }
    }, [loading, news]);

    if (loading || !news) {
        return (
            <div className={"loader_wrapper"}>
                <div className={"loader"}></div>
            </div>
        )
    }

    return (
        <div className={classes.main}>
            <h2 className={classes.title}>
                {translate(news?.title as MlString, lang)}
            </h2>

            <NewsItem news={news} lang={lang}/>
        </div>
    )
}

const NewsItem = ({news, lang}: {news: NewsDomain | null, lang: Lang}) => {
    const content = translate(news?.content as MlString, lang);
    const title = translate(news?.title as MlString, lang);
    
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
