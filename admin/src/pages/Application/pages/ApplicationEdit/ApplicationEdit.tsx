import {useNavigate, useParams} from "react-router-dom";
import {useTypedSelector} from "../../../../shared/hooks/useTypedSelector.ts";
import {useActions} from "../../../../shared/hooks/useActions.ts";
import {Col, Form, Input, Row} from "antd";
import {translate} from "../../../../shared/translate/translate.ts";
import {useEffect} from "react";
import FormShell from "../../../../shared/ui/FormShell/FormShell.tsx";
import FormSection from "../../../../shared/ui/FormShell/FormSection.tsx";
import {txts} from "../../../../shared/core/i18ngen.ts";

const FORM_ID = "application-edit-form";

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
            phone: application.phone,
            email: application.email,
            message: application.message,
        });
    }, [application]);

    return (
        <FormShell
            entityLabel={txts.applications[lang]}
            title={application?.fio || txts.editing[lang]}
            id={application?.id}
            meta={[
                ...(application?.createdAt ? [{
                    label: txts.created_at[lang],
                    value: new Date(application.createdAt).toLocaleString(),
                }] : []),
                ...(application?.updatedAt ? [{
                    label: txts.updated_at[lang],
                    value: new Date(application.updatedAt).toLocaleString(),
                }] : []),
            ]}
            formId={FORM_ID}
            saving={isLoading}
            onDelete={onFinishDelete}
        >
            <Form
                id={FORM_ID}
                form={form}
                layout={"vertical"}
                onFinish={onFinishCredentials}
            >
                <FormSection index={1} title={txts.general_information[lang]}>
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
                    <Row gutter={16}>
                        <Col xs={24} md={12}>
                            <Form.Item
                                label={translate("bin", lang)}
                                name={"bin"}
                                rules={[{required: true, message: translate("please_enter_bin", lang)}]}
                            >
                                <Input placeholder={translate("enter_bin", lang)}/>
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item
                                label={translate("phone", lang)}
                                name={"phone"}
                                rules={[{required: true, message: translate("please_enter_phone", lang)}]}
                            >
                                <Input placeholder={translate("enter_phone", lang)}/>
                            </Form.Item>
                        </Col>
                    </Row>
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
                </FormSection>
            </Form>
        </FormShell>
    )
}
