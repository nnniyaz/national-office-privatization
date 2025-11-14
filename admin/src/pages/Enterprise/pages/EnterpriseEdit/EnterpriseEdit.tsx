import {useNavigate, useParams} from "react-router-dom";
import {useTypedSelector} from "../../../../shared/hooks/useTypedSelector.ts";
import {useActions} from "../../../../shared/hooks/useActions.ts";
import {Button, Card, Divider, Form, Input} from "antd";
import {translate} from "../../../../shared/translate/translate.ts";
import {useEffect, useMemo} from "react";
import {Upload} from "../../../../shared/ui/Upload/Upload.tsx";
import {useWatch} from "antd/es/form/Form";

export default function EnterpriseEdit() {
    const {id} = useParams();
    const navigate = useNavigate();
    const {lang} = useTypedSelector(state => state.system);
    const {isLoading, enterprise} = useTypedSelector(state => state.enterprise);
    const uploadState = useTypedSelector(state => state.upload);
    const {
        getOneEnterpriseById,
        updateEnterprise,
        deleteEnterprise,
        uploadEnterprisePassport,
    } = useActions();

    const [form] = Form.useForm();

    // @ts-ignore
    const values = useWatch([], form);

    const data: {[key: string]: {label: string, value: any}} = useMemo(() => {
        if (!enterprise) return {} as {[key: string]: {label: string, value: any}};
        return {
            name: {
                label: translate("name", lang),
                value: enterprise?.name || "-"
            },
            implementationForm: {
                label: translate("implementation_form", lang),
                value: enterprise?.implementationForm || "-"
            },
            salesRecommendations: {
                label: translate("sales_recommendations", lang),
                value: enterprise?.salesRecommendations || "-"
            },
            location: {
                label: translate("location", lang),
                value: enterprise?.location || "-"
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
            salesRecommendations: formValues.salesRecommendations || "",
            implementationForm: formValues.implementationForm || "",
            industry: formValues.industry || "",
            governmentShare: formValues.governmentShare || 0,
            documentUrl: formValues.documentUrl || "",
            juridicalForm: "",
            year: 0,
            owner: "",
            mainActivity: "",
            authorizedCapital: 0.0,
            authorizedCapitalComment: "",
            assets: 0.0,
            assetsComment: "",
            equity: 0.0,
            equityComment: "",
            income: 0.0,
            incomeComment: "",
            netProfit: 0.0,
            netProfitComment: "",
            numberOfEmployees: 0,
            numberOfEmployeesComment: "",
            totalLiabilities: 0.0,
            totalLiabilitiesComment: "",
            propertyComplex: "",
            additionalInfo: "",
            salePurpose: "",
            keyTerms: "",
            additionalTerms: "",
        };
        updateEnterprise(request, id, {navigate});
    }

    const upload = async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        const filename: any = await uploadEnterprisePassport(formData);
        if (filename) {
            form.setFieldValue("documentUrl", filename);
        }
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
            implementationForm: enterprise.implementationForm,
            salesRecommendations: enterprise.salesRecommendations,
            documentUrl: enterprise.documentUrl,
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
                >
                    <Input placeholder={translate("enter_industry", lang)}/>
                </Form.Item>
                <Form.Item
                    label={translate("government_share", lang)}
                    name={"governmentShare"}
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
                <Form.Item
                    label={translate("implementation_form", lang)}
                    name={"implementationForm"}
                >
                    <Input placeholder={translate("enter_implementation_form", lang)}/>
                </Form.Item>
                <Form.Item
                    label={translate("sales_recommendations", lang)}
                    name={"salesRecommendations"}
                >
                    <Input placeholder={translate("enter_sales_recommendations", lang)}/>
                </Form.Item>
                <Form.Item
                    label={translate("enterprise_passport", lang)}
                    name={"documentUrl"}
                >
                    {!!form.getFieldValue("documentUrl") && (
                        <Button style={{marginBottom: "20px"}} onClick={() => form.setFieldValue("documentUrl", "")}>
                            {translate("remove", lang)}
                        </Button>
                    )}
                    <Upload
                        imgSrc={form.getFieldValue("documentUrl") || ""}
                        onUpload={upload}
                        loading={uploadState.isLoading}
                        isDocument={true}
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
