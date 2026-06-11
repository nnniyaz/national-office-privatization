import {Form} from "antd";
import {useTypedSelector} from "../../../../shared/hooks/useTypedSelector.ts";
import {useActions} from "../../../../shared/hooks/useActions.ts";
import {useNavigate} from "react-router-dom";
import {translate} from "../../../../shared/translate/translate.ts";
import UploadField from "../../../../shared/ui/Upload/UploadField.tsx";
import {useWatch} from "antd/es/form/Form";
import MlStringInput from "../../../../shared/ui/MlStringInput/MlStringInput.tsx";
import FormShell from "../../../../shared/ui/FormShell/FormShell.tsx";
import FormSection from "../../../../shared/ui/FormShell/FormSection.tsx";
import {txts} from "../../../../shared/core/i18ngen.ts";
import type {MlString} from "../../../../shared/i18n/types.ts";

const FORM_ID = "document-create-form";

export default function DocumentCreate() {
    const navigate = useNavigate();
    const {lang} = useTypedSelector(state => state.system);
    const {isLoading} = useTypedSelector(state => state.document);
    const uploadState = useTypedSelector(state => state.upload);
    const {createDocument, uploadDocument} = useActions();

    const [form] = Form.useForm();

    // @ts-ignore
    const values = useWatch([], form);

    const onFinish = () => {
        createDocument({...form.getFieldsValue()}, {navigate});
    }

    const upload = async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        const filename: any = await uploadDocument(formData);
        if (filename) {
            form.setFieldValue("filename", filename);
        }
    }

    return (
        <FormShell
            entityLabel={txts.document_module[lang]}
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
                <FormSection index={1} title={txts.content_section[lang]}>
                    <Form.Item
                        label=""
                        name={"title"}
                        rules={[{
                            required: true,
                            validator: (_,  value: MlString) => {
                                if (!value || (!value.kz && !value.ru && !value.en)) {
                                    return Promise.reject(translate("please_enter_title", lang));
                                }
                                return Promise.resolve();
                            }
                        }]}
                    >
                        <MlStringInput
                            label={translate("title", lang)}
                            value={form.getFieldValue("title") || {}}
                            onChange={(v) => form.setFieldValue("title", v)}
                            required
                            rows={2}
                        />
                    </Form.Item>
                </FormSection>

                <FormSection index={2} title={txts.file_upload[lang]}>
                    <Form.Item
                        label={translate("file", lang)}
                        name={"filename"}
                        rules={[{required: true, message: translate("please_upload_document", lang)}]}
                    >
                        <UploadField
                            onUpload={upload}
                            uploading={uploadState.isLoading}
                            isDocument={true}
                        />
                    </Form.Item>
                </FormSection>
            </Form>
        </FormShell>
    )
}
