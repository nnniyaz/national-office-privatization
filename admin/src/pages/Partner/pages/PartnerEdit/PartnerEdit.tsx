import {useNavigate, useParams} from "react-router-dom";
import {useTypedSelector} from "../../../../shared/hooks/useTypedSelector.ts";
import {useActions} from "../../../../shared/hooks/useActions.ts";
import {Button, Card, Divider, Form, Input} from "antd";
import {translate} from "../../../../shared/translate/translate.ts";
import {useEffect} from "react";
import MlStringInput from "../../../../shared/ui/MlStringInput/MlStringInput.tsx";
import type {MlString} from "../../../../shared/i18n/types.ts";

export default function PartnerEdit() {
    const {id} = useParams();
    const navigate = useNavigate();
    const {lang} = useTypedSelector(state => state.system);
    const {isLoading, partner} = useTypedSelector(state => state.partner);
    const {
        getOnePartnerById,
        updatePartner,
        deletePartner,
    } = useActions();

    const [formGeneral] = Form.useForm();

    const onFinish = () => {
        if (!id) return;
        updatePartner({
            id: id,
            ...formGeneral.getFieldsValue()
        }, id, {navigate});
    }

    const onFinishDelete = () => {
        if (!id) return;
        deletePartner(id, {navigate});
    }

    useEffect(() => {
        if (!id) return;
        getOnePartnerById(id, {navigate});
    }, [id]);

    useEffect(() => {
        if (!partner) return;
        formGeneral.setFieldsValue({
            name: partner.name,
            link: partner.link,
        });
    }, [partner]);

    return (
        <Card bodyStyle={{padding: "10px"}} style={{maxWidth: "500px"}} loading={isLoading}>
            <h2>{partner?.id}</h2>
            <p>{`${translate("name", lang)}: `}<i>{partner?.name?.[lang] || partner?.name?.kz || partner?.name?.ru || partner?.name?.en || '-'}</i></p>
            <p>{`${translate("link", lang)}: `}<i>{partner?.link}</i></p>

            <Divider/>

            <Form
                form={formGeneral}
                layout={"vertical"}
                onFinish={onFinish}
            >
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
                        value={formGeneral.getFieldValue("name") || {}}
                        onChange={(v) => formGeneral.setFieldValue("name", v)}
                        required
                        rows={2}
                    />
                </Form.Item>
                <Form.Item
                    label={translate("link", lang)}
                    name={"link"}
                    rules={[{required: true, message: translate("please_enter_link", lang)}]}
                >
                    <Input placeholder={translate("enter_link", lang)}/>
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
