import {useNavigate, useParams} from "react-router-dom";
import {useTypedSelector} from "../../../../shared/hooks/useTypedSelector.ts";
import {useActions} from "../../../../shared/hooks/useActions.ts";
import {Button, Card, Divider, Form, Input, Select} from "antd";
import {translate} from "../../../../shared/translate/translate.ts";
import {useEffect} from "react";

export default function UserEdit() {
    const {id} = useParams();
    const navigate = useNavigate();
    const {lang} = useTypedSelector(state => state.system);
    const {isLoading, user} = useTypedSelector(state => state.user);
    const {
        getOneUserById,
        updateUser,
        updateUserPassword,
        deleteUser,
        recoverUser
    } = useActions();

    const [formGeneral] = Form.useForm();
    const [formPassword] = Form.useForm();

    const onFinishCredentials = () => {
        if (!id) return;
        updateUser({
            id: id,
            ...formGeneral.getFieldsValue()
        }, id, {navigate});
    }

    const onFinishPassword = async () => {
        if (!id) return;
        await updateUserPassword({
            id: id,
            ...formPassword.getFieldsValue()
        }, id, {navigate});
        formPassword.resetFields();
    }

    const onFinishDelete = () => {
        if (!id) return;
        deleteUser(id, {navigate});
    }

    const onFinishRecover = () => {
        if (!id) return;
        recoverUser(id, {navigate});
    }

    useEffect(() => {
        if (!id) return;
        getOneUserById(id, {navigate});
    }, [id]);

    useEffect(() => {
        if (!user) return;
        formGeneral.setFieldsValue({
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role
        });
    }, [user]);

    return (
        <Card bodyStyle={{padding: "10px"}} style={{maxWidth: "500px"}} loading={isLoading}>
            <h2>{user?.id}</h2>
            <p>{`${translate("first_name", lang)}: `}<i>{user?.firstName}</i></p>
            <p>{`${translate("last_name", lang)}: `}<i>{user?.lastName}</i></p>
            <p>{`${translate("login", lang)}: `}<i>{user?.login}</i></p>
            <p>{`${translate("disabled", lang)}: `}<i>{user?.disabled ? translate("yes", lang) : translate("no", lang)}</i></p>
            <p>{`${translate("role", lang)}: `}<i>{user?.role}</i></p>
            <p>{`${translate("created_at", lang)}: `}<i>{new Date(user?.createdAt || "").toLocaleString()}</i></p>
            <p>{`${translate("updated_at", lang)}: `}<i>{new Date(user?.updatedAt || "").toLocaleString()}</i></p>

            <Divider/>

            <h3 style={{marginBottom: "10px"}}>{translate("password", lang)}</h3>
            <Form
                form={formPassword}
                layout={"vertical"}
                onFinish={onFinishPassword}
            >
                <Form.Item
                    label={translate("password", lang)}
                    name={"password"}
                    rules={[{required: true, message: translate("please_enter_password", lang)}]}
                >
                    <Input.Password placeholder={translate("enter_password", lang)}/>
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

            <Divider/>

            <h3 style={{marginBottom: "10px"}}>{translate("general_information", lang)}</h3>
            <Form
                form={formGeneral}
                layout={"vertical"}
                onFinish={onFinishCredentials}
            >
                <Form.Item
                    label={translate("first_name", lang)}
                    name={"firstName"}
                    rules={[{required: true, message: translate("please_enter_first_name", lang)}]}
                >
                    <Input placeholder={translate("enter_first_name", lang)}/>
                </Form.Item>
                <Form.Item
                    label={translate("last_name", lang)}
                    name={"lastName"}
                    rules={[{required: true, message: translate("please_enter_last_name", lang)}]}
                >
                    <Input placeholder={translate("enter_last_name", lang)}/>
                </Form.Item>
                <Form.Item
                    label={translate("role", lang)}
                    name={"role"}
                    rules={[{required: true, message: translate("please_enter_role", lang)}]}
                >
                    <Select
                        placeholder={translate("enter_role", lang)}
                        defaultValue={"user"}
                        options={[
                            {label: "Admin", value: "admin"},
                            {label: "User", value: "user"}
                        ]}
                    />
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
                        {
                            !!user && user.disabled ?
                                <Button
                                    onClick={onFinishRecover}
                                    loading={isLoading}
                                    disabled={isLoading}
                                >
                                    {translate("recover", lang)}
                                </Button>
                                :
                                <Button
                                    onClick={onFinishDelete}
                                    danger={true}
                                    type={"primary"}
                                    loading={isLoading}
                                    disabled={isLoading}
                                >
                                    {translate("disable", lang)}
                                </Button>
                        }
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
