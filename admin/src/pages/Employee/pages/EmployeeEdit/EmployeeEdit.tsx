import {useNavigate, useParams} from "react-router-dom";
import {useTypedSelector} from "../../../../shared/hooks/useTypedSelector.ts";
import {useActions} from "../../../../shared/hooks/useActions.ts";
import {Button, Card, Divider, Form, Input} from "antd";
import {translate} from "../../../../shared/translate/translate.ts";
import {useEffect} from "react";

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
            <p>{`${translate("name", lang)}: `}<i>{employee?.name}</i></p>
            <p>{`${translate("group", lang)}: `}<i>{employee?.group}</i></p>

            <Divider/>

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
