import {useNavigate, useParams} from "react-router-dom";
import {useTypedSelector} from "../../../../shared/hooks/useTypedSelector.ts";
import {useActions} from "../../../../shared/hooks/useActions.ts";
import {Button, Card, Divider, Form, Input} from "antd";
import {translate} from "../../../../shared/translate/translate.ts";
import {useEffect} from "react";
import TextArea from "antd/es/input/TextArea";
import {Upload} from "../../../../shared/ui/Upload/Upload.tsx";
import {useWatch} from "antd/es/form/Form";

export default function NewsEdit() {
    const {id} = useParams();
    const navigate = useNavigate();
    const {lang} = useTypedSelector(state => state.system);
    const {isLoading, news} = useTypedSelector(state => state.news);
    const uploadState = useTypedSelector(state => state.upload);
    const {
        getOneNewsById,
        updateNews,
        deleteNews,
        uploadNewsImage
    } = useActions();

    const [form] = Form.useForm();

    // @ts-ignore
    const values = useWatch([], form);

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

    const upload = async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        const filename: any = await uploadNewsImage(formData);
        if (filename) {
            form.setFieldValue("imgUrl", filename);
        }
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
            <p style={{marginBottom: "5px"}}><b>{`${translate("title", lang)}: `}</b><i>{news?.title}</i></p>
            <p style={{marginBottom: "5px"}}><b>{`${translate("created_at", lang)}: `}</b><i>{new Date(news?.createdAt || "").toLocaleString()}</i></p>
            <p style={{marginBottom: "5px"}}><b>{`${translate("content", lang)}: `}</b></p>
            <p><i>{news?.content}</i></p>

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
                    label={translate("file", lang)}
                    name={"imgUrl"}
                    rules={[{required: true, message: translate("please_upload_image", lang)}]}
                >
                    {!!form.getFieldValue("imgUrl") && (
                        <Button style={{marginBottom: "20px"}} onClick={() => form.setFieldValue("imgUrl", "")}>
                            {translate("remove", lang)}
                        </Button>
                    )}
                    <Upload
                        imgSrc={
                            form.getFieldValue("imgUrl") ?
                                `${import.meta.env.VITE_SPACE_HOST}/news/${form.getFieldValue("imgUrl")}`
                                : ""
                        }
                        onUpload={upload}
                        loading={uploadState.isLoading}
                    />
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
