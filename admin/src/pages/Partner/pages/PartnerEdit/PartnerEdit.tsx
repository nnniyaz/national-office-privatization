import {useNavigate, useParams} from "react-router-dom";
import {useTypedSelector} from "../../../../shared/hooks/useTypedSelector.ts";
import {useActions} from "../../../../shared/hooks/useActions.ts";
import {Form, Input} from "antd";
import {translate} from "../../../../shared/translate/translate.ts";
import {useEffect} from "react";
import MlStringInput from "../../../../shared/ui/MlStringInput/MlStringInput.tsx";
import FormShell from "../../../../shared/ui/FormShell/FormShell.tsx";
import FormSection from "../../../../shared/ui/FormShell/FormSection.tsx";
import {txts} from "../../../../shared/core/i18ngen.ts";
import {tPick, type MlString} from "../../../../shared/i18n/types.ts";

const FORM_ID = "partner-edit-form";

export default function PartnerEdit() {
    const {id} = useParams();
    const navigate = useNavigate();
    const {lang} = useTypedSelector(state => state.system);
    const {isLoading, partner} = useTypedSelector(state => state.partner);
    const {
        getOnePartnerById,
        updatePartner,
        deletePartner,
    } = useActions();

    const [formGeneral] = Form.useForm();

    const onFinish = () => {
        if (!id) return;
        updatePartner({
            id: id,
            ...formGeneral.getFieldsValue()
        }, id, {navigate});
    }

    const onFinishDelete = () => {
        if (!id) return;
        deletePartner(id, {navigate});
    }

    useEffect(() => {
        if (!id) return;
        getOnePartnerById(id, {navigate});
    }, [id]);

    useEffect(() => {
        if (!partner) return;
        formGeneral.setFieldsValue({
            name: partner.name,
            link: partner.link,
        });
    }, [partner]);

    return (
        <FormShell
            entityLabel={txts.partner_module[lang]}
            title={tPick(partner?.name, lang) || txts.editing[lang]}
            id={partner?.id}
            formId={FORM_ID}
            saving={isLoading}
            onDelete={onFinishDelete}
        >
            <Form
                id={FORM_ID}
                form={formGeneral}
                layout={"vertical"}
                onFinish={onFinish}
            >
                <FormSection index={1} title={txts.general_information[lang]}>
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
                            value={formGeneral.getFieldValue("name") || {}}
                            onChange={(v) => formGeneral.setFieldValue("name", v)}
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
                </FormSection>
            </Form>
        </FormShell>
    )
}
