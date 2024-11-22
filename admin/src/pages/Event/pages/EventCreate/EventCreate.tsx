import {Button, Card, Form, Input} from "antd";
import {useTypedSelector} from "../../../../shared/hooks/useTypedSelector.ts";
import {useActions} from "../../../../shared/hooks/useActions.ts";
import {useNavigate} from "react-router-dom";
import {translate} from "../../../../shared/translate/translate.ts";
import {Upload} from "../../../../shared/ui/Upload/Upload.tsx";
import {useWatch} from "antd/es/form/Form";

export default function EventCreate() {
    const navigate = useNavigate();
    const {lang} = useTypedSelector(state => state.system);
    const {isLoading} = useTypedSelector(state => state.event);
    const uploadState = useTypedSelector(state => state.upload);
    const {createEvent, uploadEventImage} = useActions();

    const [form] = Form.useForm();

    // @ts-ignore
    const values = useWatch([], form);

    const onFinish = () => {
        createEvent({
            ...form.getFieldsValue(),
            plannedAt: new Date(form.getFieldValue("plannedAt")).toISOString()
        }, {navigate});
    }

    const upload = async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        const filename: any = await uploadEventImage(formData);
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
                    label={translate("name", lang)}
                    name={"name"}
                    rules={[{required: true, message: translate("please_enter_name", lang)}]}
                >
                    <Input placeholder={translate("enter_name", lang)}/>
                </Form.Item>
                <Form.Item
                    label={translate("desc", lang)}
                    name={"desc"}
                    rules={[{required: true, message: translate("please_enter_desc", lang)}]}
                >
                    <Input placeholder={translate("enter_desc", lang)}/>
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
                                `${import.meta.env.VITE_SPACE_HOST}/event/${form.getFieldValue("imgUrl")}`
                                : ""
                        }
                        onUpload={upload}
                        loading={uploadState.isLoading}
                    />
                </Form.Item>
                <Form.Item
                    label={translate("planned_at", lang)}
                    name={"plannedAt"}
                    rules={[{required: true, message: translate("please_enter_planned_at", lang)}]}
                >
                    <Input type={"datetime-local"} placeholder={translate("enter_planned_at", lang)}/>
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
