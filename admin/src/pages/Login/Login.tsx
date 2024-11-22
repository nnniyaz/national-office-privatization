import classes from "./Login.module.scss";
import {Button, Card, Form, Input, Row, Select} from "antd";
import {txts} from "../../shared/core/i18ngen.ts";
import {useTypedSelector} from "../../shared/hooks/useTypedSelector.ts";
import {rules} from "../../shared/form-rules/rules.ts";
import {useActions} from "../../shared/hooks/useActions.ts";
import {useNavigate} from "react-router-dom";
import {Langs} from "../../domain/base/mlString.ts";

export default function Login() {
    const navigate = useNavigate();
    const {lang} = useTypedSelector(state => state.system);
    const {isLoading} = useTypedSelector(state => state.auth);
    const {login, setLang} = useActions();
    const [form] = Form.useForm();
    const onFinish = () => {
        login(form.getFieldsValue(), {navigate});
    }

    return (
        <div className={classes.main}>
            <Card style={{maxWidth: "400px", width: "100%", margin: "0 10px"}}>
                <Row style={{marginBottom: "20px"}} justify={"space-between"}>
                    <h2>{txts.authorization[lang]}</h2>
                    <Select
                        value={lang}
                        onChange={(value) => setLang(value)}
                        options={[
                            {label: "KZ", value: Langs.KZ},
                            {label: "RU", value: Langs.RU},
                            {label: "EN", value: Langs.EN},
                        ]}
                    />
                </Row>
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
                        rules={[
                            rules.required(txts.please_enter_password[lang]),
                        ]}
                    >
                        <Input.Password placeholder={txts.enter_password[lang]}/>
                    </Form.Item>
                    <Form.Item style={{marginBottom: "0"}}>
                        <Button
                            type={"primary"}
                            htmlType={"submit"}
                            style={{width: "100%"}}
                            loading={isLoading}
                        >
                            {txts.enter[lang]}
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    )
}
