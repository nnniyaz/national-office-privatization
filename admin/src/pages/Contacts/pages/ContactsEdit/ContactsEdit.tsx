import {Col, Form, Row} from "antd";
import {useTypedSelector} from "../../../../shared/hooks/useTypedSelector.ts";
import {useActions} from "../../../../shared/hooks/useActions.ts";
import {useNavigate} from "react-router-dom";
import {translate} from "../../../../shared/translate/translate.ts";
import {useEffect} from "react";
import Input from "antd/es/input/Input";
import FormShell from "../../../../shared/ui/FormShell/FormShell.tsx";
import FormSection from "../../../../shared/ui/FormShell/FormSection.tsx";
import {txts} from "../../../../shared/core/i18ngen.ts";

const FORM_ID = "contacts-edit-form";

export default function ContactsEdit() {
    const navigate = useNavigate();
    const {lang} = useTypedSelector(state => state.system);
    const {contacts, isLoading} = useTypedSelector(state => state.contacts);
    const {updateContacts, getContacts} = useActions();

    const [form] = Form.useForm();

    const onFinish = () => {
        updateContacts({
            id: contacts?.id,
            ...form.getFieldsValue()
        }, {navigate});
    }

    useEffect(() => {
        getContacts();
    }, []);

    useEffect(() => {
        form.setFieldsValue({
            primaryContactPerson: contacts?.primaryContactPerson,
            primaryContact: contacts?.primaryContact,
            secondaryContactPerson: contacts?.secondaryContactPerson,
            secondaryContact: contacts?.secondaryContact,
            email: contacts?.email,
        });
    }, [contacts]);

    return (
        <FormShell
            entityLabel={txts.contacts_module[lang]}
            title={contacts?.primaryContactPerson || txts.editing[lang]}
            id={contacts?.id}
            formId={FORM_ID}
            saving={isLoading}
        >
            <Form
                id={FORM_ID}
                form={form}
                layout={"vertical"}
                onFinish={onFinish}
            >
                <FormSection index={1} title={txts.general_information[lang]}>
                    <Row gutter={16}>
                        <Col xs={24} md={12}>
                            <Form.Item
                                label={translate("primary_contact_person", lang)}
                                name={"primaryContactPerson"}
                            >
                                <Input placeholder={translate("enter_primary_contact_person", lang)}/>
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item
                                label={translate("primary_contact", lang)}
                                name={"primaryContact"}
                                rules={[{required: true, message: translate("please_enter_primary_contact", lang)}]}
                            >
                                <Input placeholder={translate("enter_primary_contact", lang)}/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col xs={24} md={12}>
                            <Form.Item
                                label={translate("secondary_contact_person", lang)}
                                name={"secondaryContactPerson"}
                                rules={[{required: true, message: translate("please_enter_secondary_contact_person", lang)}]}
                            >
                                <Input placeholder={translate("enter_secondary_contact_person", lang)}/>
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item
                                label={translate("secondary_contact", lang)}
                                name={"secondaryContact"}
                                rules={[{required: true, message: translate("please_enter_secondary_contact", lang)}]}
                            >
                                <Input placeholder={translate("enter_secondary_contact", lang)}/>
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
                </FormSection>
            </Form>
        </FormShell>
    )
}
