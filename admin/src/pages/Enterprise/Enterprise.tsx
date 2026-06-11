import {useTypedSelector} from "../../shared/hooks/useTypedSelector.ts";
import {useActions} from "../../shared/hooks/useActions.ts";
import {useEffect, useState} from "react";
import {Button, Card, Empty, Table} from "antd";
import {txts} from "../../shared/core/i18ngen.ts";
import {ColumnsType} from "antd/es/table";
import {Enterprise as EnterpriseModel} from "../../domain/enterprise/enterprise.ts";
import {Link, useNavigate} from "react-router-dom";
import {RouteNames} from "../index.tsx";
import {translate} from "../../shared/translate/translate.ts";
import Input from "antd/es/input/Input";

export default function Enterprise() {
    const navigate = useNavigate();
    const {lang} = useTypedSelector(state => state.system);
    const {enterprises, count, isLoading} = useTypedSelector(state => state.enterprise);
    const {getEnterprises} = useActions();
    const [pagination, setPagination] = useState({
        pagination: {
            current: 1,
            pageSize: 25,
            total: count,
        }
    });
    const [search, setSearch] = useState("");

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
            key: "documentUrl",
            title: translate("enterprise_passport", lang),
            dataIndex: "documentUrl",
            render: (_, record) => (
                <div>
                    <a href={`${import.meta.env.VITE_SPACE_HOST}/enterprise-passport/${record.documentUrl}`} target={"_blank"} rel="noreferrer">
                        {txts.link[lang]}
                    </a>
                </div>
            ),
        },
        {
            key: "name",
            title: translate("name", lang),
            dataIndex: "name",
        },
        {
            key: "implementationForm",
            title: translate("implementation_form", lang),
            dataIndex: "implementationForm",
        },
        {
            key: "salesRecommendations",
            title: translate("sales_recommendations", lang),
            dataIndex: "salesRecommendations",
        },
        {
            key: "location",
            title: translate("location", lang),
            dataIndex: "location",
        },
    ];

    const data: EnterpriseModel[] = enterprises?.map(enterprise => {
        return {
            id: enterprise.id,
            name: enterprise.name,
            implementationForm: enterprise.implementationForm,
            salesRecommendations: enterprise.salesRecommendations,
            location: enterprise.location,
            documentUrl: enterprise.documentUrl,
        } as any;
    });

    useEffect(() => {
        const controller = new AbortController();
        getEnterprises(controller, {
            offset: (pagination.pagination.current - 1) * pagination.pagination.pageSize,
            limit: pagination.pagination.pageSize,
            search: search,
        });
        return () => controller.abort();
    }, [pagination]);

    useEffect(() => {
        setPagination({
            ...pagination,
            pagination: {
                ...pagination.pagination,
                total: count,
            }
        });
    }, [count]);

    return (
        <Card styles={{body: {padding: "10px"}}}>
            <div style={{width: "100%", display: "flex", justifyContent: "space-between", gap: "10px"}}>
                <Input
                    placeholder={translate("search", lang)}
                    style={{marginBottom: "20px"}}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && setPagination({
                        ...pagination,
                        pagination: {...pagination.pagination, current: 1}
                    })}
                />
                <Button
                    type={"primary"}
                    style={{marginBottom: "20px"}}
                    onClick={() => setPagination({
                        ...pagination,
                        pagination: {...pagination.pagination, current: 1}
                    })}
                >
                    {translate("search", lang)}
                </Button>
                <Button
                    type={"primary"}
                    style={{marginBottom: "20px"}}
                    onClick={() => navigate(RouteNames.ENTERPRISE_CREATE)}
                >
                    {translate("add", lang)}
                </Button>
            </div>
            <p style={{marginBottom: "20px", color: "gray"}}>{`${translate("quantity", lang)}: ${count}`}</p>
            <Table
                locale={{emptyText: <Empty description={translate("no_data", lang)}/>}}
                rowKey={"id"}
                dataSource={data}
                columns={columns}
                bordered={true}
                pagination={{
                    ...pagination.pagination,
                    onChange: (page) => setPagination({
                        ...pagination,
                        pagination: {...pagination.pagination, current: page}
                    }),
                }}
                scroll={{x: 500}}
                loading={isLoading}
            />
        </Card>
    )
}
