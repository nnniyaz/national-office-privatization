import {Button, Card, Form} from "antd";
import {useTypedSelector} from "../../../../shared/hooks/useTypedSelector.ts";
import {useActions} from "../../../../shared/hooks/useActions.ts";
import {useNavigate} from "react-router-dom";
import {translate} from "../../../../shared/translate/translate.ts";
import {useEffect} from "react";
import MlStringInput from "../../../../shared/ui/MlStringInput/MlStringInput.tsx";
import type {MlString} from "../../../../shared/i18n/types.ts";

export default function MissionEdit() {
    const navigate = useNavigate();
    const {lang} = useTypedSelector(state => state.system);
    const {mission, isLoading} = useTypedSelector(state => state.mission);
    const {updateMission, getMission} = useActions();

    const [form] = Form.useForm();

    const onFinish = () => {
        updateMission({...form.getFieldsValue()}, {navigate});
    }

    useEffect(() => {
        getMission();
    }, []);

    useEffect(() => {
        form.setFieldsValue({
            text: mission?.text
        });
    }, [mission]);

    return (
        <Card bodyStyle={{padding: "10px"}} style={{maxWidth: "500px"}} loading={isLoading}>
            <Form
                form={form}
                layout={"vertical"}
                onFinish={onFinish}
            >
                <Form.Item
                    label=""
                    name={"text"}
                    rules={[{
                        required: true,
                        validator: (_, value: MlString) => {
                            if (!value || (!value.kz && !value.ru && !value.en)) {
                                return Promise.reject(translate("please_enter_text", lang));
                            }
                            return Promise.resolve();
                        }
                    }]}
                >
                    <MlStringInput
                        label={translate("text", lang)}
                        value={form.getFieldValue("text") || {}}
                        onChange={(v) => form.setFieldValue("text", v)}
                        required
                        rows={10}
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
