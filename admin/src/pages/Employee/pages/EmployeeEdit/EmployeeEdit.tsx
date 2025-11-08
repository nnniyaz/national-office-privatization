import {useNavigate, useParams} from "react-router-dom";
import {useTypedSelector} from "../../../../shared/hooks/useTypedSelector.ts";
import {useActions} from "../../../../shared/hooks/useActions.ts";
import {Button, Card, Divider, Form, Input} from "antd";
import {translate} from "../../../../shared/translate/translate.ts";
import {useEffect} from "react";
import MlStringInput from "../../../../shared/ui/MlStringInput/MlStringInput.tsx";
import type {MlString} from "../../../../shared/i18n/types.ts";

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
        <Card bodyStyle={{padding: "10px"}} style={{maxWidth: "500px"}} loading={isLoading}>
            <h2>{employee?.id}</h2>
            <p>{`${translate("name", lang)}: `}<i>{employee?.name?.[lang] || employee?.name?.kz || employee?.name?.ru || employee?.name?.en || '-'}</i></p>
            <p>{`${translate("group", lang)}: `}<i>{employee?.group}</i></p>

            <Divider/>

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
                    label={translate("group", lang)}
                    name={"group"}
                    rules={[{required: true, message: translate("please_enter_group", lang)}]}
                >
                    <Input placeholder={translate("enter_group", lang)}/>
                </Form.Item>
                <Form.Item style={{
                    marginBottom: "0",
                    display: "flex",
                    justifyContent: "flex-end"
                }}>
                    <div style={{
                        display: "flex",
                        gap: "10px"
                    }}>
                        <Button
                            onClick={onFinishDelete}
                            danger={true}
                            type={"primary"}
                            loading={isLoading}
                            disabled={isLoading}
                        >
                            {translate("delete", lang)}
                        </Button>
                        <Button
                            htmlType={"submit"}
                            type={"primary"}
                            loading={isLoading}
                            disabled={isLoading}
                        >
                            {translate("save", lang)}
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </Card>
    )
}
