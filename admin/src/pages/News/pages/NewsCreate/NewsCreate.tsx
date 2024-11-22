import {Button, Card, Form, Input} from "antd";
import {useTypedSelector} from "../../../../shared/hooks/useTypedSelector.ts";
import {useActions} from "../../../../shared/hooks/useActions.ts";
import {useNavigate} from "react-router-dom";
import {translate} from "../../../../shared/translate/translate.ts";
import TextArea from "antd/es/input/TextArea";
import {useWatch} from "antd/es/form/Form";
import {Upload} from "../../../../shared/ui/Upload/Upload.tsx";

export default function NewsCreate() {
    const navigate = useNavigate();
    const {lang} = useTypedSelector(state => state.system);
    const {isLoading} = useTypedSelector(state => state.news);
    const uploadState = useTypedSelector(state => state.upload);
    const {createNews, uploadNewsImage} = useActions();

    const [form] = Form.useForm();

    // @ts-ignore
    const values = useWatch([], form);

    const onFinish = () => {
        createNews({...form.getFieldsValue()}, {navigate});
    }

    const upload = async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        const filename: any = await uploadNewsImage(formData);
        if (filename) {
            form.setFieldValue("imgUrl", filename);
        }
    }

    return (
        <Card bodyStyle={{padding: "10px"}} style={{maxWidth: "500px"}} loading={isLoading}>
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
                    <Button
                        htmlType={"submit"}
                        type={"primary"}
                        loading={isLoading}
                        disabled={isLoading}
                    >
                        {translate("add", lang)}
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    )
}
