import {Form} from "antd";
import {useTypedSelector} from "../../../../shared/hooks/useTypedSelector.ts";
import {useActions} from "../../../../shared/hooks/useActions.ts";
import {useNavigate} from "react-router-dom";
import {translate} from "../../../../shared/translate/translate.ts";
import {useEffect} from "react";
import MlStringInput from "../../../../shared/ui/MlStringInput/MlStringInput.tsx";
import FormShell from "../../../../shared/ui/FormShell/FormShell.tsx";
import FormSection from "../../../../shared/ui/FormShell/FormSection.tsx";
import {txts} from "../../../../shared/core/i18ngen.ts";
import type {MlString} from "../../../../shared/i18n/types.ts";

const FORM_ID = "mission-edit-form";

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
        <FormShell
            entityLabel={txts.mission_module[lang]}
            title={txts.editing[lang]}
            id={mission?.id}
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
                </FormSection>
            </Form>
        </FormShell>
    )
}
