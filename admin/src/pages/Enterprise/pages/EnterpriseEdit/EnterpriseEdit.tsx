import {useNavigate, useParams} from "react-router-dom";
import {useTypedSelector} from "../../../../shared/hooks/useTypedSelector.ts";
import {useActions} from "../../../../shared/hooks/useActions.ts";
import {Button, Card, Divider, Form, Input} from "antd";
import {translate} from "../../../../shared/translate/translate.ts";
import {useEffect, useMemo} from "react";
import {getRegion} from "../../../../shared/utils/regions.ts";

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

    const data: {[key: string]: {label: string, value: any}} = useMemo(() => {
        if (!enterprise) return {} as {[key: string]: {label: string, value: any}};
        return {
            name: {
                label: translate("name", lang),
                value: enterprise?.name || "-"
            },
            location: {
                label: translate("location", lang),
                value: getRegion(enterprise?.location, lang) || "-"
            },
            industry: {
                label: translate("industry", lang),
                value: enterprise?.industry || "-"
            },
            governmentShare: {
                label: translate("government_share", lang),
                value: enterprise?.governmentShare || "-"
            },
            createdAt: {
                label: translate("created_at", lang),
                value: new Date(enterprise?.createdAt).toLocaleString() || "-"
            },
            updatedAt: {
                label: translate("updated_at", lang),
                value: new Date(enterprise?.updatedAt).toLocaleString() || "-"
            },
        }
    }, [enterprise]);

    const onFinish = () => {
        if (!id) return;
        const formValues = form.getFieldsValue();
        const request = {
            id: id,
            name: formValues.name || "",
            location: formValues.location || "",
            industry: formValues.industry || "",
            governmentShare: formValues.governmentShare || 0,
        };
        updateEnterprise(request, id, {navigate});
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
            <h2>{`${translate("enterprise_id", lang)}:`}</h2>
            <h2 style={{marginBottom: "20px"}}>{enterprise?.id}</h2>

            <div
                style={{
                    border: "1px solid rgb(240, 240, 240)",
                    borderRadius: "5px",
                    marginBottom: "20px"
                }}
            >
                {
                    Object.keys(data).map((key, index) => (
                        <div
                            key={index}
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                borderBottom: Object.keys(data).length - 1 === index ? "" : "1px solid rgb(240, 240, 240)",
                            }}
                        >
                            <div style={{
                                width: "30%",
                                padding: "10px",
                                borderRight: "1px solid rgb(240, 240, 240)",
                                backgroundColor: "#fafafa",
                                borderTopLeftRadius: index === 0 ? "4px" : "",
                                borderBottomLeftRadius: Object.keys(data).length - 1 === index ? "4px" : "",
                            }}>
                                {data[key].label}
                            </div>
                            <div style={{
                                width: "70%",
                                padding: "10px",
                            }}>
                                {data[key].value}
                            </div>
                        </div>
                    ))
                }
            </div>

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
