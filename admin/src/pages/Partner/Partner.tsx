import {useTypedSelector} from "../../shared/hooks/useTypedSelector.ts";
import {useActions} from "../../shared/hooks/useActions.ts";
import {useEffect} from "react";
import {Button, Card, Row, Table} from "antd";
import {txts} from "../../shared/core/i18ngen.ts";
import {ColumnsType} from "antd/es/table";
import {Partner as PartnerModel} from "../../domain/partner/partner.ts";
import {Link, useNavigate} from "react-router-dom";
import {RouteNames} from "../index.tsx";
import { Empty } from 'antd';
import {translate} from "../../shared/translate/translate.ts";

export default function Partner() {
    const navigate = useNavigate();
    const {lang} = useTypedSelector(state => state.system);
    const {partners, isLoading} = useTypedSelector(state => state.partner);
    const {getPartners} = useActions();

    const columns: ColumnsType<PartnerModel> = [
        {
            key: "action",
            title: translate("action", lang),
            dataIndex: "action",
            render: (_, record) => (
                <div>
                    <Link to={RouteNames.PARTNER_EDIT.replace(":id", record.id)}>
                        {txts.edit[lang]}
                    </Link>
                </div>
            ),
        },
        {
            key: "name",
            title: txts.name[lang],
            dataIndex: "name",
            render: (name) => name?.[lang] || name?.kz || name?.ru || name?.en || '-',
        },
        {
            key: "link",
            title: txts.link[lang],
            dataIndex: "link",
            render: (link: string) => (
                <a href={link} target="_blank">{link}</a>
            )
        },
    ];

    const data: PartnerModel[] = partners?.map(partner => {
        return {
            id: partner.id,
            name: partner.name,
            link: partner.link,
        };
    });

    useEffect(() => {
        const controller = new AbortController();
        getPartners(controller);
        return () => controller.abort();
    }, []);

    return (
        <Card bodyStyle={{padding: "10px"}}>
            <Row justify={"end"}>
                <Button
                    type={"primary"}
                    style={{marginBottom: "20px"}}
                    onClick={() => navigate(RouteNames.PARTNER_CREATE)}
                >
                    {txts.add[lang]}
                </Button>
            </Row>
            <Table
                locale={{emptyText: <Empty description={txts.no_data[lang]}/>}}
                dataSource={data}
                columns={columns}
                bordered={true}
                scroll={{x: 500}}
                loading={isLoading}
            />
        </Card>
    )
}
