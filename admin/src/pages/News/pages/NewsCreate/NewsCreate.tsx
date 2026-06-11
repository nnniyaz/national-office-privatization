import {Form} from "antd";
import {useTypedSelector} from "../../../../shared/hooks/useTypedSelector.ts";
import {useActions} from "../../../../shared/hooks/useActions.ts";
import {useNavigate} from "react-router-dom";
import {translate} from "../../../../shared/translate/translate.ts";
import {useWatch} from "antd/es/form/Form";
import UploadField from "../../../../shared/ui/Upload/UploadField.tsx";
import MlStringInput from "../../../../shared/ui/MlStringInput/MlStringInput.tsx";
import FormShell from "../../../../shared/ui/FormShell/FormShell.tsx";
import FormSection from "../../../../shared/ui/FormShell/FormSection.tsx";
import {txts} from "../../../../shared/core/i18ngen.ts";
import type {MlString} from "../../../../shared/i18n/types.ts";

const FORM_ID = "news-create-form";

export default function NewsCreate() {
    const navigate = useNavigate();
    const {lang} = useTypedSelector(state => state.system);
    const {isLoading} = useTypedSelector(state => state.news);
    const uploadState = useTypedSelector(state => state.upload);
    const {createNews, uploadNewsImage} = useActions();

    const [form] = Form.useForm();

    // @ts-ignore
    const values = useWatch([], form);

    const onFinish = () => {
        createNews({...form.getFieldsValue()}, {navigate});
    }

    const upload = async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        const filename: any = await uploadNewsImage(formData);
        if (filename) {
            form.setFieldValue("imgUrl", filename);
        }
    }

    return (
        <FormShell
            entityLabel={txts.news_module[lang]}
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
                    <Form.Item
                        label=""
                        name={"content"}
                        rules={[{
                            required: true,
                            validator: (_, value: MlString) => {
                                if (!value || (!value.kz && !value.ru && !value.en)) {
                                    return Promise.reject(translate("please_enter_content", lang));
                                }
                                return Promise.resolve();
                            }
                        }]}
                    >
                        <MlStringInput
                            label={translate("content", lang)}
                            value={form.getFieldValue("content") || {}}
                            onChange={(v) => form.setFieldValue("content", v)}
                            required
                            rows={10}
                        />
                    </Form.Item>
                </FormSection>

                <FormSection index={2} title={txts.file_upload[lang]}>
                    <Form.Item
                        label={translate("file", lang)}
                        name={"imgUrl"}
                        rules={[{required: true, message: translate("please_upload_image", lang)}]}
                    >
                        <UploadField
                            onUpload={upload}
                            uploading={uploadState.isLoading}
                            preview={(f) => `${import.meta.env.VITE_SPACE_HOST}/news/${f}`}
                        />
                    </Form.Item>
                </FormSection>
            </Form>
        </FormShell>
    )
}
