import {useNavigate, useParams} from "react-router-dom";
import {useTypedSelector} from "../../../../shared/hooks/useTypedSelector.ts";
import {useActions} from "../../../../shared/hooks/useActions.ts";
import {Button, Card, Divider, Form} from "antd";
import {translate} from "../../../../shared/translate/translate.ts";
import {useEffect} from "react";
import {Upload} from "../../../../shared/ui/Upload/Upload.tsx";
import {useWatch} from "antd/es/form/Form";
import MlStringInput from "../../../../shared/ui/MlStringInput/MlStringInput.tsx";
import type {MlString} from "../../../../shared/i18n/types.ts";

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
        <Card bodyStyle={{padding: "10px"}} style={{maxWidth: "500px"}} loading={isLoading}>
            <h2>{npa?.id}</h2>
            <p>{`${translate("title", lang)}: `}<i>{npa?.title?.[lang] || npa?.title?.kz || npa?.title?.ru || npa?.title?.en || '-'}</i></p>
            <p>{`${translate("created_at", lang)}: `}<i>{new Date(npa?.createdAt || "").toLocaleString()}</i></p>
            <p>{`${translate("updated_at", lang)}: `}<i>{new Date(npa?.updatedAt || "").toLocaleString()}</i></p>

            <Divider/>

            <Form
                form={form}
                layout={"vertical"}
                onFinish={onFinish}
            >
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
                <Form.Item style={{
                    marginBottom: "0",
                    display: "flex",
                    justifyContent: "flex-end"
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
