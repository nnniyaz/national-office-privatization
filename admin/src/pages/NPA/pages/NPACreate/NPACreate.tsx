import {Button, Card, Form, Input} from "antd";
import {useTypedSelector} from "../../../../shared/hooks/useTypedSelector.ts";
import {useActions} from "../../../../shared/hooks/useActions.ts";
import {useNavigate} from "react-router-dom";
import {translate} from "../../../../shared/translate/translate.ts";

export default function NpaCreate() {
    const navigate = useNavigate();
    const {lang} = useTypedSelector(state => state.system);
    const {isLoading} = useTypedSelector(state => state.npa);
    const {createNpa} = useActions();

    const [form] = Form.useForm();

    const onFinish = () => {
        createNpa({...form.getFieldsValue()}, {navigate});
    }

    return (
        <Card bodyStyle={{padding: "10px"}} style={{maxWidth: "500px"}} loading={isLoading}>
            <Form
                form={form}
                layout={"vertical"}
                onFinish={onFinish}
            >
                <Form.Item
                    label={translate("title", lang)}
                    name={"title"}
                    rules={[{required: true, message: translate("please_enter_title", lang)}]}
                >
                    <Input placeholder={translate("enter_title", lang)}/>
                </Form.Item>
                <Form.Item
                    label={translate("filename", lang)}
                    name={"filename"}
                    rules={[{required: true, message: translate("please_enter_filename", lang)}]}
                >
                    <Input placeholder={translate("enter_filename", lang)}/>
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
