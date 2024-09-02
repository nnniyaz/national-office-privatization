import {Button, Card, Form} from "antd";
import {useTypedSelector} from "../../../../shared/hooks/useTypedSelector.ts";
import {useActions} from "../../../../shared/hooks/useActions.ts";
import {useNavigate} from "react-router-dom";
import {translate} from "../../../../shared/translate/translate.ts";
import Input from "antd/es/input/Input";

export default function ContactsCreate() {
    const navigate = useNavigate();
    const {lang} = useTypedSelector(state => state.system);
    const {isLoading} = useTypedSelector(state => state.contacts);
    const {createContacts} = useActions();

    const [form] = Form.useForm();

    const onFinish = () => {
        createContacts({...form.getFieldsValue()}, {navigate});
    }

    return (
        <Card bodyStyle={{padding: "10px"}} style={{maxWidth: "500px"}} loading={isLoading}>
            <Form
                form={form}
                layout={"vertical"}
                onFinish={onFinish}
            >
                <Form.Item
                    label={translate("primary_contact_person", lang)}
                    name={"primaryContactPerson"}
                    rules={[{required: true, message: translate("please_enter_primary_contact_person", lang)}]}
                >
                    <Input placeholder={translate("enter_primary_contact_person", lang)}
                    />
                </Form.Item>
                <Form.Item
                    label={translate("primary_contact", lang)}
                    name={"primaryContact"}
                    rules={[{required: true, message: translate("please_enter_primary_contact", lang)}]}
                >
                    <Input placeholder={translate("enter_primary_contact", lang)}
                    />
                </Form.Item>
                <Form.Item
                    label={translate("secondary_contact_person", lang)}
                    name={"secondaryContactPerson"}
                    rules={[{required: true, message: translate("please_enter_secondary_contact_person", lang)}]}
                >
                    <Input placeholder={translate("enter_secondary_contact_person", lang)}
                    />
                </Form.Item>
                <Form.Item
                    label={translate("secondary_contact", lang)}
                    name={"secondaryContact"}
                    rules={[{required: true, message: translate("please_enter_secondary_contact", lang)}]}
                >
                    <Input placeholder={translate("enter_secondary_contact", lang)}
                    />
                </Form.Item>
                <Form.Item
                    label={translate("email", lang)}
                    name={"email"}
                    rules={[{required: true, message: translate("please_enter_email", lang)}]}
                >
                    <Input placeholder={translate("enter_email", lang)}
                    />
                </Form.Item>
                <Form.Item style={{
                    marginBottom: "0",
                    display: "flex",
                    justifyContent: "flex-end",
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
