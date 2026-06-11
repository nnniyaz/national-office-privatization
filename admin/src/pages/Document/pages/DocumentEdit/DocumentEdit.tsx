import {useNavigate, useParams} from "react-router-dom";
import {useTypedSelector} from "../../../../shared/hooks/useTypedSelector.ts";
import {useActions} from "../../../../shared/hooks/useActions.ts";
import {Button, Form} from "antd";
import {translate} from "../../../../shared/translate/translate.ts";
import {useEffect} from "react";
import {Upload} from "../../../../shared/ui/Upload/Upload.tsx";
import {useWatch} from "antd/es/form/Form";
import MlStringInput from "../../../../shared/ui/MlStringInput/MlStringInput.tsx";
import FormShell from "../../../../shared/ui/FormShell/FormShell.tsx";
import FormSection from "../../../../shared/ui/FormShell/FormSection.tsx";
import {txts} from "../../../../shared/core/i18ngen.ts";
import {tPick, type MlString} from "../../../../shared/i18n/types.ts";

const FORM_ID = "document-edit-form";

export default function DocumentEdit() {
    const {id} = useParams();
    const navigate = useNavigate();
    const {lang} = useTypedSelector(state => state.system);
    const {isLoading, document} = useTypedSelector(state => state.document);
    const uploadState = useTypedSelector(state => state.upload);
    const {
        getOneDocumentById,
        updateDocument,
        deleteDocument,
        uploadDocument,
    } = useActions();

    const [form] = Form.useForm();

    // @ts-ignore
    const values = useWatch([], form);

    const onFinish = () => {
        if (!id) return;
        updateDocument({
            id: id,
            ...form.getFieldsValue()
        }, id, {navigate});
    }

    const onFinishDelete = () => {
        if (!id) return;
        deleteDocument(id, {navigate});
    }

    const upload = async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        const filename: any = await uploadDocument(formData);
        if (filename) {
            form.setFieldValue("filename", filename);
        }
    }

    useEffect(() => {
        if (!id) return;
        getOneDocumentById(id, {navigate});
    }, [id]);

    useEffect(() => {
        if (!document) return;
        form.setFieldsValue({
            title: document.title,
            filename: document.filename,
        });
    }, [document]);

    return (
        <FormShell
            entityLabel={txts.document_module[lang]}
            title={tPick(document?.title, lang) || txts.editing[lang]}
            id={document?.id}
            meta={[
                ...(document?.createdAt ? [{
                    label: txts.created_at[lang],
                    value: new Date(document.createdAt).toLocaleString(),
                }] : []),
                ...(document?.updatedAt ? [{
                    label: txts.updated_at[lang],
                    value: new Date(document.updatedAt).toLocaleString(),
                }] : []),
            ]}
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
                <FormSection index={1} title={txts.content_section[lang]}>
                    <Form.Item
                        label=""
                        name={"title"}
                        rules={[{
                            required: true,
                            validator: (_, value: MlString) => {
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
                        {!!form.getFieldValue("filename") && (
                            <Button style={{marginBottom: "20px"}} onClick={() => form.setFieldValue("filename", "")}>
                                {translate("remove", lang)}
                            </Button>
                        )}
                        <Upload
                            imgSrc={form.getFieldValue("filename") || ""}
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
