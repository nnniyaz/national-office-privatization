import {useNavigate, useParams} from "react-router-dom";
import {useTypedSelector} from "../../../../shared/hooks/useTypedSelector.ts";
import {useActions} from "../../../../shared/hooks/useActions.ts";
import {Form, Input} from "antd";
import {translate} from "../../../../shared/translate/translate.ts";
import {useEffect} from "react";
import UploadField from "../../../../shared/ui/Upload/UploadField.tsx";
import {useWatch} from "antd/es/form/Form";
import MlStringInput from "../../../../shared/ui/MlStringInput/MlStringInput.tsx";
import FormShell from "../../../../shared/ui/FormShell/FormShell.tsx";
import FormSection from "../../../../shared/ui/FormShell/FormSection.tsx";
import {txts} from "../../../../shared/core/i18ngen.ts";
import {tPick, type MlString} from "../../../../shared/i18n/types.ts";

const FORM_ID = "event-edit-form";

export default function EventEdit() {
    const {id} = useParams();
    const navigate = useNavigate();
    const {lang} = useTypedSelector(state => state.system);
    const {isLoading, event} = useTypedSelector(state => state.event);
    const uploadState = useTypedSelector(state => state.upload);
    const {
        getOneEventById,
        updateEvent,
        deleteEvent,
        uploadEventImage
    } = useActions();

    const [form] = Form.useForm();

    // @ts-ignore
    const values = useWatch([], form);

    const onFinish = () => {
        if (!id) return;
        updateEvent({
            id: id,
            ...form.getFieldsValue()
        }, id, {navigate});
    }

    const onFinishDelete = () => {
        if (!id) return;
        deleteEvent(id, {navigate});
    }

    const upload = async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        const filename: any = await uploadEventImage(formData);
        if (filename) {
            form.setFieldValue("imgUrl", filename);
        }
    }

    useEffect(() => {
        if (!id) return;
        getOneEventById(id, {navigate});
    }, [id]);

    useEffect(() => {
        if (!event) return;
        form.setFieldsValue({
            name: event.name,
            desc: event.desc,
            imgUrl: event.imgUrl,
            plannedAt: event.plannedAt,
        });
    }, [event]);

    return (
        <FormShell
            entityLabel={txts.event_module[lang]}
            title={tPick(event?.name, lang) || txts.editing[lang]}
            id={event?.id}
            meta={[
                ...(event?.createdAt ? [{
                    label: txts.created_at[lang],
                    value: new Date(event.createdAt).toLocaleString(),
                }] : []),
                ...(event?.updatedAt ? [{
                    label: txts.updated_at[lang],
                    value: new Date(event.updatedAt).toLocaleString(),
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
                        name={"name"}
                        rules={[{
                            required: true,
                            validator: (_, value: MlString) => {
                                if (!value || (!value.kz && !value.ru && !value.en)) {
                                    return Promise.reject(translate("please_enter_name", lang));
                                }
                                return Promise.resolve();
                            }
                        }]}
                    >
                        <MlStringInput
                            label={translate("name", lang)}
                            value={form.getFieldValue("name") || {}}
                            onChange={(v) => form.setFieldValue("name", v)}
                            required
                            rows={2}
                        />
                    </Form.Item>
                    <Form.Item
                        label=""
                        name={"desc"}
                        rules={[{
                            required: true,
                            validator: (_, value: MlString) => {
                                if (!value || (!value.kz && !value.ru && !value.en)) {
                                    return Promise.reject(translate("please_enter_desc", lang));
                                }
                                return Promise.resolve();
                            }
                        }]}
                    >
                        <MlStringInput
                            label={translate("desc", lang)}
                            value={form.getFieldValue("desc") || {}}
                            onChange={(v) => form.setFieldValue("desc", v)}
                            required
                            rows={5}
                        />
                    </Form.Item>
                    <Form.Item
                        label={translate("planned_at", lang)}
                        name={"plannedAt"}
                        rules={[{required: true, message: translate("please_enter_planned_at", lang)}]}
                    >
                        <Input placeholder={translate("enter_planned_at", lang)}/>
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
                            preview={(f) => `${import.meta.env.VITE_SPACE_HOST}/event/${f}`}
                        />
                    </Form.Item>
                </FormSection>
            </Form>
        </FormShell>
    )
}
