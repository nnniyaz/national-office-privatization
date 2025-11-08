import {Button, Card, Form, Input} from "antd";
import {useTypedSelector} from "../../../../shared/hooks/useTypedSelector.ts";
import {useActions} from "../../../../shared/hooks/useActions.ts";
import {useNavigate} from "react-router-dom";
import {translate} from "../../../../shared/translate/translate.ts";
import MlStringInput from "../../../../shared/ui/MlStringInput/MlStringInput.tsx";
import type {MlString} from "../../../../shared/i18n/types.ts";

export default function PartnerCreate() {
    const navigate = useNavigate();
    const {lang} = useTypedSelector(state => state.system);
    const {isLoading} = useTypedSelector(state => state.partner);
    const {createPartner} = useActions();

    const [form] = Form.useForm();

    const onFinish = () => {
        createPartner({...form.getFieldsValue()}, {navigate});
    }

    return (
        <Card bodyStyle={{padding: "10px"}} style={{maxWidth: "500px"}} loading={isLoading}>
            <Form
                form={form}
                layout={"vertical"}
                onFinish={onFinish}
            >
                <Form.Item
                    label=""
                    name={"name"}
                    rules={[{
                        required: true,
                        validator: (_, value: MlString) => {
                            if (!value || (!value.kz && !value.ru && !value.en)) {
                                return Promise.reject(translate("please_enter_name", lang));
                            }
                            return Promise.resolve();
                        }
                    }]}
                >
                    <MlStringInput
                        label={translate("name", lang)}
                        value={form.getFieldValue("name") || {}}
                        onChange={(v) => form.setFieldValue("name", v)}
                        required
                        rows={2}
                    />
                </Form.Item>
                <Form.Item
                    label={translate("link", lang)}
                    name={"link"}
                    rules={[{required: true, message: translate("please_enter_link", lang)}]}
                >
                    <Input placeholder={translate("enter_link", lang)}/>
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
