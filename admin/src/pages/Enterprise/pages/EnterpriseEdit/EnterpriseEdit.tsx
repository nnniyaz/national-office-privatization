import {useNavigate, useParams} from "react-router-dom";
import {useTypedSelector} from "../../../../shared/hooks/useTypedSelector.ts";
import {useActions} from "../../../../shared/hooks/useActions.ts";
import {Button, Card, Divider, Form, Input} from "antd";
import {translate} from "../../../../shared/translate/translate.ts";
import {useEffect} from "react";

export default function EnterpriseEdit() {
    const {id} = useParams();
    const navigate = useNavigate();
    const {lang} = useTypedSelector(state => state.system);
    const {isLoading, enterprise} = useTypedSelector(state => state.enterprise);
    const {
        getOneEnterpriseById,
        updateEnterprise,
        deleteEnterprise,
    } = useActions();

    const [form] = Form.useForm();

    const onFinish = () => {
        if (!id) return;
        updateEnterprise({
            id: id,
            ...form.getFieldsValue()
        }, id, {navigate});
    }

    const onFinishDelete = () => {
        if (!id) return;
        deleteEnterprise(id, {navigate});
    }

    useEffect(() => {
        if (!id) return;
        getOneEnterpriseById(id, {navigate});
    }, [id]);

    useEffect(() => {
        if (!enterprise) return;
        form.setFieldsValue({
            name: enterprise.name,
            location: enterprise.location,
            industry: enterprise.industry,
            governmentShare: Number(enterprise.governmentShare),
            createdAt: enterprise.createdAt,
            updatedAt: enterprise.updatedAt,
        });
    }, [enterprise]);

    return (
        <Card bodyStyle={{padding: "10px"}} style={{maxWidth: "500px"}} loading={isLoading}>
            <h2>{enterprise?.id}</h2>
            <p>{`${translate("name", lang)}: `}<i>{enterprise?.name}</i></p>
            <p>{`${translate("location", lang)}: `}<i>{enterprise?.location}</i></p>
            <p>{`${translate("industry", lang)}: `}<i>{enterprise?.industry}</i></p>
            <p>{`${translate("government_share", lang)}: `}<i>{enterprise?.governmentShare}</i></p>
            <p>{`${translate("created_at", lang)}: `}<i>{new Date(enterprise?.createdAt || "").toLocaleString()}</i></p>
            <p>{`${translate("updated_at", lang)}: `}<i>{new Date(enterprise?.updatedAt || "").toLocaleString()}</i></p>

            <Divider/>

            <h3 style={{marginBottom: "10px"}}>{translate("password", lang)}</h3>
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
                    rules={[{required: true, message: translate("please_enter_location", lang)}]}
                >
                    <Input placeholder={translate("enter_location", lang)}/>
                </Form.Item>
                <Form.Item
                    label={translate("industry", lang)}
                    name={"industry"}
                    rules={[{required: true, message: translate("please_enter_industry", lang)}]}
                >
                    <Input placeholder={translate("enter_industry", lang)}/>
                </Form.Item>
                <Form.Item
                    label={translate("government_share", lang)}
                    name={"governmentShare"}
                    rules={[{required: true, message: translate("please_enter_government_share", lang)}]}
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
