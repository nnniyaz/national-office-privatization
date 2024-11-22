import {useNavigate, useParams} from "react-router-dom";
import {useTypedSelector} from "../../../../shared/hooks/useTypedSelector.ts";
import {useActions} from "../../../../shared/hooks/useActions.ts";
import {Button, Card, Divider, Form, Input} from "antd";
import {translate} from "../../../../shared/translate/translate.ts";
import {useEffect, useMemo, useState} from "react";

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

    const data: {[key: string]: {label: string, value: any}} = useMemo(() => {
        if (!application) return {} as {[key: string]: {label: string, value: any}};
        return {
            enterpriseId: {
                label: translate("enterprise", lang),
                value: application.enterpriseId
            },
            fio: {
                label: translate("fio", lang),
                value: application.fio
            },
            bin: {
                label: translate("bin", lang),
                value: application.bin
            },
            phone: {
                label: translate("phone", lang),
                value: application.phone
            },
            email: {
                label: translate("email", lang),
                value: application.email
            },
            message: {
                label: translate("message", lang),
                value: application.message
            },
            createdAt: {
                label: translate("created_at", lang),
                value: new Date(application.createdAt || "").toLocaleString()
            },
            updatedAt: {
                label: translate("updated_at", lang),
                value: new Date(application.updatedAt || "").toLocaleString()
            },
        }
    }, [application]);

    const [editMode, setEditMode] = useState(false);

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
            phone: application.phone,
            email: application.email,
            message: application.message,
        });
    }, [application]);

    return (
        <Card bodyStyle={{padding: "10px"}} style={{maxWidth: "500px"}} loading={isLoading}>
            <h2>{`${translate("application_id", lang)}:`}</h2>
            <h2 style={{marginBottom: "20px"}}>{application?.id}</h2>

            <div
                style={{
                    border: "1px solid rgb(240, 240, 240)",
                    borderRadius: "5px",
                    marginBottom: "20px"
                }}
            >
                {
                    Object.keys(data).map((key, index) => (
                        <div
                            key={index}
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                borderBottom: Object.keys(data).length - 1 === index ? "" : "1px solid rgb(240, 240, 240)",
                            }}
                        >
                            <div style={{
                                width: "30%",
                                padding: "10px",
                                borderRight: "1px solid rgb(240, 240, 240)",
                                backgroundColor: "#fafafa",
                                borderTopLeftRadius: index === 0 ? "4px" : "",
                                borderBottomLeftRadius: Object.keys(data).length - 1 === index ? "4px" : "",
                            }}>
                                {data[key].label}
                            </div>
                            <div style={{
                                width: "70%",
                                padding: "10px",
                            }}>
                                {data[key].value}
                            </div>
                        </div>
                    ))
                }
            </div>

    {
        !editMode ? (
            <div style={{width: "100%", display: "flex", justifyContent: "end"}}>
                <Button
                    onClick={() => setEditMode(true)}
                    type={"primary"}
                    style={{marginTop: "10px"}}
                >
                    {translate("edit", lang)}
                </Button>
            </div>
        ) : (
            <>
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
                        label={translate("phone", lang)}
                        name={"phone"}
                        rules={[{required: true, message: translate("please_enter_phone", lang)}]}
                    >
                        <Input placeholder={translate("enter_phone", lang)}/>
                    </Form.Item>
                    <Form.Item
                        label={translate("email", lang)}
                        name={"email"}
                        rules={[{required: true, message: translate("please_enter_email", lang)}]}
                    >
                        <Input placeholder={translate("enter_email", lang)}/>
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
                            <Button onClick={() => setEditMode(false)}>
                                {translate("cancel", lang)}
                            </Button>
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
            </>
        )
    }
</Card>
)
}
