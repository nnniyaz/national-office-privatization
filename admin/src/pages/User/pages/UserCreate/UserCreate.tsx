import {Button, Card, Form, Input, Select} from "antd";
import {useTypedSelector} from "../../../../shared/hooks/useTypedSelector.ts";
import {useActions} from "../../../../shared/hooks/useActions.ts";
import {useNavigate} from "react-router-dom";
import {translate} from "../../../../shared/translate/translate.ts";

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
        <Card bodyStyle={{padding: "10px"}} style={{maxWidth: "500px"}} loading={isLoading}>
            <Form
                form={form}
                layout={"vertical"}
                onFinish={onFinish}
            >
                <Form.Item
                    label={translate("first_name", lang)}
                    name={"firstName"}
                    rules={[{required: true, message: translate("please_enter_first_name", lang)}]}
                >
                    <Input placeholder={translate("enter_first_name", lang)}/>
                </Form.Item>
                <Form.Item
                    label={translate("last_name", lang)}
                    name={"lastName"}
                    rules={[{required: true, message: translate("please_enter_last_name", lang)}]}
                >
                    <Input placeholder={translate("enter_last_name", lang)}/>
                </Form.Item>
                <Form.Item
                    label={translate("login", lang)}
                    name={"login"}
                    rules={[{required: true, message: translate("please_enter_login", lang)}]}
                >
                    <Input placeholder={translate("enter_login", lang)}/>
                </Form.Item>
                <Form.Item
                    label={translate("password", lang)}
                    name={"password"}
                    rules={[{required: true, message: translate("please_enter_password", lang)}]}
                >
                    <Input.Password placeholder={translate("enter_password", lang)}/>
                </Form.Item>
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
