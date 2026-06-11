import {useNavigate, useParams} from "react-router-dom";
import {useTypedSelector} from "../../../../shared/hooks/useTypedSelector.ts";
import {useActions} from "../../../../shared/hooks/useActions.ts";
import {Form} from "antd";
import {translate} from "../../../../shared/translate/translate.ts";
import {useEffect} from "react";
import UploadField from "../../../../shared/ui/Upload/UploadField.tsx";
import {useWatch} from "antd/es/form/Form";
import MlStringInput from "../../../../shared/ui/MlStringInput/MlStringInput.tsx";
import FormShell from "../../../../shared/ui/FormShell/FormShell.tsx";
import FormSection from "../../../../shared/ui/FormShell/FormSection.tsx";
import {txts} from "../../../../shared/core/i18ngen.ts";
import {tPick, type MlString} from "../../../../shared/i18n/types.ts";

const FORM_ID = "npa-edit-form";

export default function NpaEdit() {
    const {id} = useParams();
    const navigate = useNavigate();
    const {lang} = useTypedSelector(state => state.system);
    const {isLoading, npa} = useTypedSelector(state => state.npa);
    const uploadState = useTypedSelector(state => state.upload);
    const {
        getOneNpaById,
        updateNpa,
        deleteNpa,
        uploadNpa,
    } = useActions();

    const [form] = Form.useForm();

    // @ts-ignore
    const values = useWatch([], form);

    const onFinish = () => {
        if (!id) return;
        updateNpa({
            id: id,
            ...form.getFieldsValue()
        }, id, {navigate});
    }

    const onFinishDelete = () => {
        if (!id) return;
        deleteNpa(id, {navigate});
    }

    const upload = async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        const filename: any = await uploadNpa(formData);
        if (filename) {
            form.setFieldValue("filename", filename);
        }
    }

    useEffect(() => {
        if (!id) return;
        getOneNpaById(id, {navigate});
    }, [id]);

    useEffect(() => {
        if (!npa) return;
        form.setFieldsValue({
            title: npa.title,
            filename: npa.filename,
        });
    }, [npa]);

    return (
        <FormShell
            entityLabel={txts.npa_module[lang]}
            title={tPick(npa?.title, lang) || txts.editing[lang]}
            id={npa?.id}
            meta={[
                ...(npa?.createdAt ? [{
                    label: txts.created_at[lang],
                    value: new Date(npa.createdAt).toLocaleString(),
                }] : []),
                ...(npa?.updatedAt ? [{
                    label: txts.updated_at[lang],
                    value: new Date(npa.updatedAt).toLocaleString(),
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
