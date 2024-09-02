import {useTypedSelector} from "../../shared/hooks/useTypedSelector.ts";
import {useActions} from "../../shared/hooks/useActions.ts";
import {useEffect} from "react";
import {Button, Card, Empty, Row, Table} from "antd";
import {txts} from "../../shared/core/i18ngen.ts";
import {ColumnsType} from "antd/es/table";
import {News as NewsModel} from "../../domain/news/news.ts";
import {Link, useNavigate} from "react-router-dom";
import {RouteNames} from "../index.tsx";
import {translate} from "../../shared/translate/translate.ts";

export default function News() {
    const navigate = useNavigate();
    const {lang} = useTypedSelector(state => state.system);
    const {newsList, isLoading} = useTypedSelector(state => state.news);
    const {getNews} = useActions();

    const columns: ColumnsType<NewsModel> = [
        {
            key: "action",
            title: translate("action", lang),
            dataIndex: "action",
            render: (_, record) => (
                <div>
                    <Link to={RouteNames.NEWS_EDIT.replace(":id", record.id)}>
                        {txts.edit[lang]}
                    </Link>
                </div>
            ),
        },
        {
            key: "id",
            title: "ID",
            dataIndex: "id",
        },
        {
            key: "title",
            title: translate("title", lang),
            dataIndex: "title",
        },
        {
            key: "content",
            title: translate("content", lang),
            dataIndex: "content",
        },
        {
            key: "imgUrl",
            title: translate("img_url", lang),
            dataIndex: "imgUrl",
        },
        {
            key: "createdAt",
            title: translate("created_at", lang),
            dataIndex: "createdAt",
            render: (updatedAt: string) => new Date(updatedAt).toLocaleString(),
        },
    ];

    const data: NewsModel[] = newsList?.map(news => {
        return {
            id: news.id,
            title: news.title,
            content: news.content,
            imgUrl: news.imgUrl,
            createdAt: news.createdAt,
        };
    });

    useEffect(() => {
        const controller = new AbortController();
        getNews(controller);
        return () => controller.abort();
    }, []);

    return (
        <Card bodyStyle={{padding: "10px"}}>
            <Row justify={"end"}>
                <Button
                    type={"primary"}
                    style={{marginBottom: "20px"}}
                    onClick={() => navigate(RouteNames.NEWS_CREATE)}
                >
                    {txts.add[lang]}
                </Button>
            </Row>
            <Table
                locale={{emptyText: <Empty description={txts.no_data[lang]}/>}}
                dataSource={data}
                columns={columns}
                bordered={true}
                scroll={{x: 500}}
                loading={isLoading}
            />
        </Card>
    )
}
