import {Button, Card, Form, Input} from "antd";
import {useTypedSelector} from "../../../../shared/hooks/useTypedSelector.ts";
import {useActions} from "../../../../shared/hooks/useActions.ts";
import {useNavigate} from "react-router-dom";
import {translate} from "../../../../shared/translate/translate.ts";

export default function EnterpriseCreate() {
    const navigate = useNavigate();
    const {lang} = useTypedSelector(state => state.system);
    const {isLoading} = useTypedSelector(state => state.enterprise);
    const {createEnterprise} = useActions();

    const [form] = Form.useForm();

    const onFinish = () => {
        const formValues = form.getFieldsValue();
        const request = {
            name: formValues.name || "",
            location: formValues.location || "",
            industry: formValues.industry || "",
            governmentShare: formValues.governmentShare || 0,
        };
        createEnterprise(request, {navigate});
    }

    return (
        <Card bodyStyle={{padding: "10px"}} style={{maxWidth: "500px"}} loading={isLoading}>
            <Form
                form={form}
                layout={"vertical"}
                onFinish={onFinish}
            >
                <Form.Item
                    label={translate("name", lang)}
                    name={"name"}
                    rules={[{required: true, message: translate("please_enter_name", lang)}]}
                >
                    <Input placeholder={translate("enter_name", lang)}/>
                </Form.Item>
                <Form.Item
                    label={translate("location", lang)}
                    name={"location"}
                >
                    <Input placeholder={translate("enter_location", lang)}/>
                </Form.Item>
                <Form.Item
                    label={translate("industry", lang)}
                    name={"industry"}
                >
                    <Input placeholder={translate("enter_industry", lang)}/>
                </Form.Item>
                <Form.Item
                    label={translate("government_share", lang)}
                    name={"governmentShare"}
                >
                    <Input
                        placeholder={translate("enter_government_share", lang)}
                        type={"number"}
                        value={form.getFieldValue("governmentShare")}
                        onChange={(e) => {
                            if (isNaN(Number(e.target.value))) return;
                            form.setFieldsValue({governmentShare: Number(e.target.value)});
                        }}
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
                        {translate("save", lang)}
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    )
}
