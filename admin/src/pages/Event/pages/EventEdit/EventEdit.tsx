import {useNavigate, useParams} from "react-router-dom";
import {useTypedSelector} from "../../../../shared/hooks/useTypedSelector.ts";
import {useActions} from "../../../../shared/hooks/useActions.ts";
import {Button, Card, Divider, Form, Input} from "antd";
import {translate} from "../../../../shared/translate/translate.ts";
import {useEffect} from "react";
import {Upload} from "../../../../shared/ui/Upload/Upload.tsx";
import {useWatch} from "antd/es/form/Form";

export default function EventEdit() {
    const {id} = useParams();
    const navigate = useNavigate();
    const {lang} = useTypedSelector(state => state.system);
    const {isLoading, event} = useTypedSelector(state => state.event);
    const uploadState = useTypedSelector(state => state.upload);
    const {
        getOneEventById,
        updateEvent,
        deleteEvent,
        uploadEventImage
    } = useActions();

    const [form] = Form.useForm();

    // @ts-ignore
    const values = useWatch([], form);

    const onFinish = () => {
        if (!id) return;
        updateEvent({
            id: id,
            ...form.getFieldsValue()
        }, id, {navigate});
    }

    const onFinishDelete = () => {
        if (!id) return;
        deleteEvent(id, {navigate});
    }

    const upload = async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        const filename: any = await uploadEventImage(formData);
        if (filename) {
            form.setFieldValue("imgUrl", filename);
        }
    }

    useEffect(() => {
        if (!id) return;
        getOneEventById(id, {navigate});
    }, [id]);

    useEffect(() => {
        if (!event) return;
        form.setFieldsValue({
            name: event.name,
            desc: event.desc,
            imgUrl: event.imgUrl,
            plannedAt: event.plannedAt,
        });
    }, [event]);

    return (
        <Card bodyStyle={{padding: "10px"}} style={{maxWidth: "500px"}} loading={isLoading}>
            <h2>{event?.id}</h2>
            <p style={{marginBottom: "5px"}}><b>{`${translate("name", lang)}: `}</b><i>{event?.name}</i></p>
            <p style={{marginBottom: "5px"}}><b>{`${translate("planned_at", lang)}: `}</b><i>{new Date(event?.plannedAt || "").toLocaleString()}</i></p>
            <p style={{marginBottom: "5px"}}><b>{`${translate("created_at", lang)}: `}</b><i>{new Date(event?.createdAt || "").toLocaleString()}</i></p>
            <p style={{marginBottom: "5px"}}><b>{`${translate("updated_at", lang)}: `}</b><i>{new Date(event?.updatedAt || "").toLocaleString()}</i></p>
            <p style={{marginBottom: "5px"}}><b>{`${translate("desc", lang)}: `}</b></p>
            <p><i>{event?.desc}</i></p>

            <Divider/>

            <h3 style={{marginBottom: "10px"}}>{translate("general_information", lang)}</h3>
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
                    <Input placeholder={translate("enter_planned_at", lang)}/>
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
