import {useTypedSelector} from "../../shared/hooks/useTypedSelector.ts";
import {useActions} from "../../shared/hooks/useActions.ts";
import {useEffect} from "react";
import {Button, Card, Empty, Row, Table} from "antd";
import {txts} from "../../shared/core/i18ngen.ts";
import {ColumnsType} from "antd/es/table";
import {Enterprise as EnterpriseModel} from "../../domain/enterprise/enterprise.ts";
import {Link, useNavigate} from "react-router-dom";
import {RouteNames} from "../index.tsx";
import {translate} from "../../shared/translate/translate.ts";

export default function Enterprise() {
    const navigate = useNavigate();
    const {lang} = useTypedSelector(state => state.system);
    const {enterprises, isLoading} = useTypedSelector(state => state.enterprise);
    const {getEnterprises} = useActions();

    const columns: ColumnsType<EnterpriseModel> = [
        {
            key: "action",
            title: translate("action", lang),
            dataIndex: "action",
            render: (_, record) => (
                <div>
                    <Link to={RouteNames.ENTERPRISE_EDIT.replace(":id", record.id)}>
                        {txts.edit[lang]}
                    </Link>
                </div>
            ),
        },
        {
            key: "id",
            title: "ID",
            dataIndex: "id",
        },
        {
            key: "name",
            title: translate("name", lang),
            dataIndex: "name",
        },
        {
            key: "location",
            title: translate("location", lang),
            dataIndex: "location",
        },
        {
            key: "industry",
            title: translate("industry", lang),
            dataIndex: "industry",
        },
        {
            key: "governmentShare",
            title: translate("government_share", lang),
            dataIndex: "governmentShare",
            render: (governmentShare: number) => governmentShare + "%",
        },
        {
            key: "createdAt",
            title: translate("created_at", lang),
            dataIndex: "createdAt",
            render: (createdAt: string) => new Date(createdAt).toLocaleString(),
        },
        {
            key: "updatedAt",
            title: translate("updated_at", lang),
            dataIndex: "updatedAt",
            render: (createdAt: string) => new Date(createdAt).toLocaleString(),
        },
    ];

    const data: EnterpriseModel[] = enterprises?.map(enterprise => {
        return {
            id: enterprise.id,
            name: enterprise.name,
            location: enterprise.location,
            industry: enterprise.industry,
            governmentShare: enterprise.governmentShare,
            createdAt: enterprise.createdAt,
            updatedAt: enterprise.updatedAt,
        };
    });

    useEffect(() => {
        const controller = new AbortController();
        getEnterprises(controller);
        return () => controller.abort();
    }, []);

    return (
        <Card bodyStyle={{padding: "10px"}}>
            <Row justify={"end"}>
                <Button
                    type={"primary"}
                    style={{marginBottom: "20px"}}
                    onClick={() => navigate(RouteNames.ENTERPRISE_CREATE)}
                >
                    {translate("add", lang)}
                </Button>
            </Row>
            <Table
                locale={{emptyText: <Empty description={translate("no_data", lang)}/>}}
                dataSource={data}
                columns={columns}
                bordered={true}
                scroll={{x: 500}}
                loading={isLoading}
            />
        </Card>
    )
}
