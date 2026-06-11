import {useNavigate, useParams} from "react-router-dom";
import {useTypedSelector} from "../../../../shared/hooks/useTypedSelector.ts";
import {useActions} from "../../../../shared/hooks/useActions.ts";
import {Button, Col, Form, Input, Row, Select} from "antd";
import {translate} from "../../../../shared/translate/translate.ts";
import {useEffect} from "react";
import FormShell from "../../../../shared/ui/FormShell/FormShell.tsx";
import FormSection from "../../../../shared/ui/FormShell/FormSection.tsx";
import {txts} from "../../../../shared/core/i18ngen.ts";

const FORM_ID = "user-edit-form";

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
        <FormShell
            entityLabel={txts.user_module[lang]}
            title={user ? `${user.firstName} ${user.lastName}` : txts.editing[lang]}
            id={user?.id}
            meta={[
                ...(user?.createdAt ? [{
                    label: txts.created_at[lang],
                    value: new Date(user.createdAt).toLocaleString(),
                }] : []),
                ...(user?.updatedAt ? [{
                    label: txts.updated_at[lang],
                    value: new Date(user.updatedAt).toLocaleString(),
                }] : []),
            ]}
            formId={FORM_ID}
            saving={isLoading}
        >
            <Form
                id={FORM_ID}
                form={formGeneral}
                layout={"vertical"}
                onFinish={onFinishCredentials}
            >
                <FormSection index={1} title={txts.general_information[lang]}>
                    <Row gutter={16}>
                        <Col xs={24} md={12}>
                            <Form.Item
                                label={translate("first_name", lang)}
                                name={"firstName"}
                                rules={[{required: true, message: translate("please_enter_first_name", lang)}]}
                            >
                                <Input placeholder={translate("enter_first_name", lang)}/>
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item
                                label={translate("last_name", lang)}
                                name={"lastName"}
                                rules={[{required: true, message: translate("please_enter_last_name", lang)}]}
                            >
                                <Input placeholder={translate("enter_last_name", lang)}/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item
                        label={translate("role", lang)}
                        name={"role"}
                        initialValue={"user"}
                        rules={[{required: true, message: translate("please_enter_role", lang)}]}
                    >
                        <Select
                            placeholder={translate("enter_role", lang)}
                            options={[
                                {label: "Admin", value: "admin"},
                                {label: "User", value: "user"}
                            ]}
                        />
                    </Form.Item>
                    <div style={{display: "flex", justifyContent: "flex-end"}}>
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
                    </div>
                </FormSection>
            </Form>

            <Form
                form={formPassword}
                layout={"vertical"}
                onFinish={onFinishPassword}
            >
                <FormSection index={2} title={translate("password", lang)}>
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
                </FormSection>
            </Form>
        </FormShell>
    )
}
