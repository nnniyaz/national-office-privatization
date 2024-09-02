import {useNavigate, useParams} from "react-router-dom";
import {useTypedSelector} from "../../../../shared/hooks/useTypedSelector.ts";
import {useActions} from "../../../../shared/hooks/useActions.ts";
import {Button, Card, Divider, Form, Input} from "antd";
import {translate} from "../../../../shared/translate/translate.ts";
import {useEffect} from "react";

export default function EventEdit() {
    const {id} = useParams();
    const navigate = useNavigate();
    const {lang} = useTypedSelector(state => state.system);
    const {isLoading, event} = useTypedSelector(state => state.event);
    const {
        getOneEventById,
        updateEvent,
        deleteEvent,
    } = useActions();

    const [form] = Form.useForm();

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
            <p>{`${translate("name", lang)}: `}<i>{event?.name}</i></p>
            <p>{`${translate("desc", lang)}: `}<i>{event?.desc}</i></p>
            <p>{`${translate("img_url", lang)}: `}<i>{event?.imgUrl}</i></p>
            <p>{`${translate("planned_at", lang)}: `}<i>{event?.plannedAt}</i></p>
            <p>{`${translate("created_at", lang)}: `}<i>{new Date(event?.createdAt || "").toLocaleString()}</i></p>
            <p>{`${translate("updated_at", lang)}: `}<i>{new Date(event?.updatedAt || "").toLocaleString()}</i></p>

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
                    label={translate("img_url", lang)}
                    name={"imgUrl"}
                    rules={[{required: true, message: translate("please_enter_img_url", lang)}]}
                >
                    <Input placeholder={translate("enter_img_url", lang)}/>
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
