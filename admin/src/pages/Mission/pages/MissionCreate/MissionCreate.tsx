import {Form} from "antd";
import {useTypedSelector} from "../../../../shared/hooks/useTypedSelector.ts";
import {useActions} from "../../../../shared/hooks/useActions.ts";
import {useNavigate} from "react-router-dom";
import {translate} from "../../../../shared/translate/translate.ts";
import MlStringInput from "../../../../shared/ui/MlStringInput/MlStringInput.tsx";
import FormShell from "../../../../shared/ui/FormShell/FormShell.tsx";
import FormSection from "../../../../shared/ui/FormShell/FormSection.tsx";
import {txts} from "../../../../shared/core/i18ngen.ts";
import type {MlString} from "../../../../shared/i18n/types.ts";

const FORM_ID = "mission-create-form";

export default function MissionCreate() {
    const navigate = useNavigate();
    const {lang} = useTypedSelector(state => state.system);
    const {isLoading} = useTypedSelector(state => state.mission);
    const {createMission} = useActions();

    const [form] = Form.useForm();

    const onFinish = () => {
        createMission({...form.getFieldsValue()}, {navigate});
    }

    return (
        <FormShell
            entityLabel={txts.mission_module[lang]}
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
