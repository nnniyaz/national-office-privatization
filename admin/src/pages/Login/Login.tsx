import classes from "./Login.module.scss";
import {Button, Card, Form, Input} from "antd";
import {txts} from "../../shared/core/i18ngen.ts";
import {useTypedSelector} from "../../shared/hooks/useTypedSelector.ts";
import {rules} from "../../shared/form-rules/rules.ts";
import {useActions} from "../../shared/hooks/useActions.ts";
import {useNavigate} from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();
    const {lang} = useTypedSelector(state => state.system);
    const {login} = useActions();
    const [form] = Form.useForm();
    const onFinish = () => {
        login(form.getFieldsValue(), {navigate});
    }

    return (
        <div className={classes.main}>
            <Card style={{width: "300px"}}>
                <Form
                    form={form}
                    layout={"vertical"}
                    onFinish={onFinish}
                >
                    <Form.Item
                        name={"login"}
                        label={txts.login[lang]}
                        rules={[rules.required(txts.please_enter_login[lang])]}
                    >
                        <Input placeholder={txts.enter_login[lang]}/>
                    </Form.Item>
                    <Form.Item
                        name={"password"}
                        label={txts.password[lang]}
                        rules={[rules.required(txts.please_enter_password[lang])]}
                    >
                        <Input.Password placeholder={txts.enter_password[lang]}/>
                    </Form.Item>
                    <Form.Item style={{marginBottom: "0"}}>
                        <Button
                            type={"primary"}
                            htmlType={"submit"}
                            style={{width: "100%"}}
                        >
                            {txts.enter[lang]}
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    )
}
