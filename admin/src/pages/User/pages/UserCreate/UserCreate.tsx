import {Col, Form, Input, Row, Select} from "antd";
import {useTypedSelector} from "../../../../shared/hooks/useTypedSelector.ts";
import {useActions} from "../../../../shared/hooks/useActions.ts";
import {useNavigate} from "react-router-dom";
import {translate} from "../../../../shared/translate/translate.ts";
import FormShell from "../../../../shared/ui/FormShell/FormShell.tsx";
import FormSection from "../../../../shared/ui/FormShell/FormSection.tsx";
import {txts} from "../../../../shared/core/i18ngen.ts";

const FORM_ID = "user-create-form";

export default function UserCreate() {
    const navigate = useNavigate();
    const {lang} = useTypedSelector(state => state.system);
    const {isLoading} = useTypedSelector(state => state.user);
    const {createUser} = useActions();

    const [form] = Form.useForm();

    const onFinish = () => {
        createUser({...form.getFieldsValue()}, {navigate});
    }

    return (
        <FormShell
            entityLabel={txts.user_module[lang]}
            title={txts.new_record[lang]}
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
                                label={translate("first_name", lang)}
                                name={"firstName"}
                                rules={[{required: true, message: translate("please_enter_first_name", lang)}]}
                            >
                                <Input placeholder={translate("enter_first_name", lang)}/>
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item
                                label={translate("last_name", lang)}
                                name={"lastName"}
                                rules={[{required: true, message: translate("please_enter_last_name", lang)}]}
                            >
                                <Input placeholder={translate("enter_last_name", lang)}/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col xs={24} md={12}>
                            <Form.Item
                                label={translate("login", lang)}
                                name={"login"}
                                rules={[{required: true, message: translate("please_enter_login", lang)}]}
                            >
                                <Input placeholder={translate("enter_login", lang)}/>
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item
                                label={translate("password", lang)}
                                name={"password"}
                                rules={[{required: true, message: translate("please_enter_password", lang)}]}
                            >
                                <Input.Password placeholder={translate("enter_password", lang)}/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item
                        label={translate("role", lang)}
                        name={"role"}
                        rules={[{required: true, message: translate("please_enter_role", lang)}]}
                    >
                        <Select
                            placeholder={translate("enter_role", lang)}
                            defaultValue={"user"}
                            options={[
                                {label: "Admin", value: "admin"},
                                {label: "User", value: "user"}
                            ]}
                        />
                    </Form.Item>
                </FormSection>
            </Form>
        </FormShell>
    )
}
