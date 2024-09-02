import {useNavigate, useParams} from "react-router-dom";
import {useTypedSelector} from "../../../../shared/hooks/useTypedSelector.ts";
import {useActions} from "../../../../shared/hooks/useActions.ts";
import {Button, Card, Divider, Form, Input} from "antd";
import {translate} from "../../../../shared/translate/translate.ts";
import {useEffect} from "react";

export default function ApplicationEdit() {
    const {id} = useParams();
    const navigate = useNavigate();
    const {lang} = useTypedSelector(state => state.system);
    const {isLoading, application} = useTypedSelector(state => state.application);
    const {
        getOneApplicationById,
        updateApplication,
        deleteApplication
    } = useActions();

    const [form] = Form.useForm();

    const onFinishCredentials = () => {
        if (!id) return;
        updateApplication({
            id: id,
            ...form.getFieldsValue()
        }, id, {navigate});
    }

    const onFinishDelete = () => {
        if (!id) return;
        deleteApplication(id, {navigate});
    }

    useEffect(() => {
        if (!id) return;
        getOneApplicationById(id, {navigate});
    }, [id]);

    useEffect(() => {
        if (!application) return;
        form.setFieldsValue({
            enterpriseId: application.enterpriseId,
            fio: application.fio,
            bin: application.bin,
            contact: application.contact,
            message: application.message,
        });
    }, [application]);

    return (
        <Card bodyStyle={{padding: "10px"}} style={{maxWidth: "500px"}} loading={isLoading}>
            <h2>{application?.id}</h2>
            <p>{`${translate("enterprise", lang)}: `}<i>{application?.enterpriseId}</i></p>
            <p>{`${translate("fio", lang)}: `}<i>{application?.fio}</i></p>
            <p>{`${translate("bin", lang)}: `}<i>{application?.bin}</i></p>
            <p>{`${translate("contact", lang)}: `}<i>{application?.contact}</i></p>
            <p>{`${translate("message", lang)}: `}<i>{application?.message}</i></p>
            <p>{`${translate("created_at", lang)}: `}<i>{new Date(application?.createdAt || "").toLocaleString()}</i></p>
            <p>{`${translate("updated_at", lang)}: `}<i>{new Date(application?.updatedAt || "").toLocaleString()}</i></p>

            <Divider/>

            <h3 style={{marginBottom: "10px"}}>{translate("general_information", lang)}</h3>
            <Form
                form={form}
                layout={"vertical"}
                onFinish={onFinishCredentials}
            >
                <Form.Item
                    label={translate("enterprise", lang)}
                    name={"enterpriseId"}
                    rules={[{required: true, message: translate("please_enter_enterpriseId", lang)}]}
                >
                    <Input placeholder={translate("enter_enterpriseId", lang)}/>
                </Form.Item>
                <Form.Item
                    label={translate("fio", lang)}
                    name={"fio"}
                    rules={[{required: true, message: translate("please_enter_fio", lang)}]}
                >
                    <Input placeholder={translate("enter_fio", lang)}/>
                </Form.Item>
                <Form.Item
                    label={translate("bin", lang)}
                    name={"bin"}
                    rules={[{required: true, message: translate("please_enter_bin", lang)}]}
                >
                    <Input placeholder={translate("enter_bin", lang)}/>
                </Form.Item>
                <Form.Item
                    label={translate("contact", lang)}
                    name={"contact"}
                    rules={[{required: true, message: translate("please_enter_contact", lang)}]}
                >
                    <Input placeholder={translate("enter_contact", lang)}/>
                </Form.Item>
                <Form.Item
                    label={translate("message", lang)}
                    name={"message"}
                    rules={[{required: true, message: translate("please_enter_message", lang)}]}
                >
                    <Input placeholder={translate("enter_message", lang)}/>
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
