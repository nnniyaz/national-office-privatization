import {useNavigate, useParams} from "react-router-dom";
import {useTypedSelector} from "../../../../shared/hooks/useTypedSelector.ts";
import {useActions} from "../../../../shared/hooks/useActions.ts";
import {Button, Card, Divider, Form, Input} from "antd";
import {translate} from "../../../../shared/translate/translate.ts";
import {useEffect} from "react";
import TextArea from "antd/es/input/TextArea";

export default function NewsEdit() {
    const {id} = useParams();
    const navigate = useNavigate();
    const {lang} = useTypedSelector(state => state.system);
    const {isLoading, news} = useTypedSelector(state => state.news);
    const {
        getOneNewsById,
        updateNews,
        deleteNews,
    } = useActions();

    const [form] = Form.useForm();

    const onFinish = () => {
        if (!id) return;
        updateNews({
            id: id,
            ...form.getFieldsValue()
        }, id, {navigate});
    }

    const onFinishDelete = () => {
        if (!id) return;
        deleteNews(id, {navigate});
    }

    useEffect(() => {
        if (!id) return;
        getOneNewsById(id, {navigate});
    }, [id]);

    useEffect(() => {
        if (!news) return;
        form.setFieldsValue({
            title: news.title,
            content: news.content,
            imgUrl: news.imgUrl,
        });
    }, [news]);

    return (
        <Card bodyStyle={{padding: "10px"}} style={{maxWidth: "500px"}} loading={isLoading}>
            <h2>{news?.id}</h2>
            <p>{`${translate("title", lang)}: `}<i>{news?.title}</i></p>
            <p>{`${translate("content", lang)}: `}<i>{news?.content}</i></p>
            <p>{`${translate("img_url", lang)}: `}<i>{news?.imgUrl}</i></p>
            <p>{`${translate("created_at", lang)}: `}<i>{new Date(news?.createdAt || "").toLocaleString()}</i></p>

            <Divider/>

            <h3 style={{marginBottom: "10px"}}>{translate("general_information", lang)}</h3>
            <Form
                form={form}
                layout={"vertical"}
                onFinish={onFinish}
            >
                <Form.Item
                    label={translate("title", lang)}
                    name={"title"}
                    rules={[{required: true, message: translate("please_enter_title", lang)}]}
                >
                    <Input placeholder={translate("enter_title", lang)}/>
                </Form.Item>
                <Form.Item
                    label={translate("img_url", lang)}
                    name={"imgUrl"}
                    rules={[{required: true, message: translate("please_enter_img_url", lang)}]}
                >
                    <Input placeholder={translate("enter_img_url", lang)}/>
                </Form.Item>
                <Form.Item
                    label={translate("content", lang)}
                    name={"content"}
                    rules={[{required: true, message: translate("please_enter_content", lang)}]}
                >
                    <TextArea
                        placeholder={translate("enter_content", lang)}
                        rows={10}
                    />
                </Form.Item>
                <Form.Item style={{
                    marginBottom: "0",
                    display: "flex",
                    justifyContent: "flex-end"
                }}>
                    <div style={{
                        display: "flex",
                        gap: "10px"
                    }}>
                        <Button
                            onClick={onFinishDelete}
                            danger={true}
                            type={"primary"}
                            loading={isLoading}
                            disabled={isLoading}
                        >
                            {translate("delete", lang)}
                        </Button>
                        <Button
                            htmlType={"submit"}
                            type={"primary"}
                            loading={isLoading}
                            disabled={isLoading}
                        >
                            {translate("save", lang)}
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </Card>
    )
}
