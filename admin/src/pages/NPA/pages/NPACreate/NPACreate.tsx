import {Button, Card, Form, Input} from "antd";
import {useTypedSelector} from "../../../../shared/hooks/useTypedSelector.ts";
import {useActions} from "../../../../shared/hooks/useActions.ts";
import {useNavigate} from "react-router-dom";
import {translate} from "../../../../shared/translate/translate.ts";
import {Upload} from "../../../../shared/ui/Upload/Upload.tsx";
import {useWatch} from "antd/es/form/Form";

export default function NpaCreate() {
    const navigate = useNavigate();
    const {lang} = useTypedSelector(state => state.system);
    const {isLoading} = useTypedSelector(state => state.npa);
    const uploadState = useTypedSelector(state => state.upload);
    const {createNpa, uploadNpa} = useActions();

    const [form] = Form.useForm();

    // @ts-ignore
    const values = useWatch([], form);

    const onFinish = () => {
        createNpa({...form.getFieldsValue()}, {navigate});
    }

    const upload = async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        const filename: any = await uploadNpa(formData);
        if (filename) {
            form.setFieldValue("filename", filename);
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
                    name={"filename"}
                    rules={[{required: true, message: translate("please_upload_document", lang)}]}
                >
                    {!!form.getFieldValue("filename") && (
                        <Button style={{marginBottom: "20px"}} onClick={() => form.setFieldValue("filename", "")}>
                            {translate("remove", lang)}
                        </Button>
                    )}
                    <Upload
                        imgSrc={form.getFieldValue("filename") || ""}
                        onUpload={upload}
                        loading={uploadState.isLoading}
                        isDocument={true}
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
