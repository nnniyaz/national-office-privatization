import {Button, Col, Form, Input, Row} from "antd";
import {useTypedSelector} from "../../../../shared/hooks/useTypedSelector.ts";
import {useActions} from "../../../../shared/hooks/useActions.ts";
import {useNavigate} from "react-router-dom";
import {translate} from "../../../../shared/translate/translate.ts";
import {Upload} from "../../../../shared/ui/Upload/Upload.tsx";
import {useWatch} from "antd/es/form/Form";
import FormShell from "../../../../shared/ui/FormShell/FormShell.tsx";
import FormSection from "../../../../shared/ui/FormShell/FormSection.tsx";
import {txts} from "../../../../shared/core/i18ngen.ts";

const FORM_ID = "enterprise-create-form";

export default function EnterpriseCreate() {
    const navigate = useNavigate();
    const {lang} = useTypedSelector(state => state.system);
    const {isLoading} = useTypedSelector(state => state.enterprise);
    const uploadState = useTypedSelector(state => state.upload);
    const {createEnterprise, uploadEnterprisePassport} = useActions();

    const [form] = Form.useForm();

    // @ts-ignore
    const values = useWatch([], form);

    const onFinish = () => {
        const formValues = form.getFieldsValue();
        const request = {
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
        createEnterprise(request, {navigate});
    }

    const upload = async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        const filename: any = await uploadEnterprisePassport(formData);
        if (filename) {
            form.setFieldValue("documentUrl", filename);
        }
    }

    return (
        <FormShell
            entityLabel={txts.enterprise_module[lang]}
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
                        label={translate("name", lang)}
                        name={"name"}
                        rules={[{required: true, message: translate("please_enter_name", lang)}]}
                    >
                        <Input placeholder={translate("enter_name", lang)}/>
                    </Form.Item>
                    <Row gutter={16}>
                        <Col xs={24} md={12}>
                            <Form.Item
                                label={translate("location", lang)}
                                name={"location"}
                                rules={[{required: true, message: translate("please_enter_location", lang)}]}
                            >
                                <Input placeholder={translate("enter_location", lang)}/>
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item
                                label={translate("industry", lang)}
                                name={"industry"}
                            >
                                <Input placeholder={translate("enter_industry", lang)}/>
                            </Form.Item>
                        </Col>
                    </Row>
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
                </FormSection>

                <FormSection index={2} title={txts.sale_details[lang]}>
                    <Row gutter={16}>
                        <Col xs={24} md={12}>
                            <Form.Item
                                label={translate("implementation_form", lang)}
                                name={"implementationForm"}
                            >
                                <Input placeholder={translate("enter_implementation_form", lang)}/>
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item
                                label={translate("sales_recommendations", lang)}
                                name={"salesRecommendations"}
                            >
                                <Input placeholder={translate("enter_sales_recommendations", lang)}/>
                            </Form.Item>
                        </Col>
                    </Row>
                </FormSection>

                <FormSection index={3} title={translate("enterprise_passport", lang)}>
                    <Form.Item
                        label=""
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
                </FormSection>
            </Form>
        </FormShell>
    )
}
