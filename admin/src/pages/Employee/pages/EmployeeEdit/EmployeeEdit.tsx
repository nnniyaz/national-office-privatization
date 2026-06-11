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

const FORM_ID = "employee-edit-form";

export default function EmployeeEdit() {
    const {id} = useParams();
    const navigate = useNavigate();
    const {lang} = useTypedSelector(state => state.system);
    const {isLoading, employee} = useTypedSelector(state => state.employee);
    const {
        getOneEmployeeById,
        updateEmployee,
        deleteEmployee,
    } = useActions();

    const [form] = Form.useForm();

    const onFinish = () => {
        if (!id) return;
        updateEmployee({
            id: id,
            ...form.getFieldsValue()
        }, id, {navigate});
    }

    const onFinishDelete = () => {
        if (!id) return;
        deleteEmployee(id, {navigate});
    }

    useEffect(() => {
        if (!id) return;
        getOneEmployeeById(id, {navigate});
    }, [id]);

    useEffect(() => {
        if (!employee) return;
        form.setFieldsValue({
            name: employee.name,
            group: employee.group,
        });
    }, [employee]);

    return (
        <FormShell
            entityLabel={txts.employee_module[lang]}
            title={tPick(employee?.name, lang) || txts.editing[lang]}
            id={employee?.id}
            formId={FORM_ID}
            saving={isLoading}
            onDelete={onFinishDelete}
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
                        label={translate("group", lang)}
                        name={"group"}
                        rules={[{required: true, message: translate("please_enter_group", lang)}]}
                    >
                        <Input placeholder={translate("enter_group", lang)}/>
                    </Form.Item>
                </FormSection>
            </Form>
        </FormShell>
    )
}
