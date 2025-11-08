import {useTypedSelector} from "../../shared/hooks/useTypedSelector.ts";
import {useActions} from "../../shared/hooks/useActions.ts";
import {useEffect} from "react";
import {Button, Card, Empty, Row, Table} from "antd";
import {txts} from "../../shared/core/i18ngen.ts";
import {ColumnsType} from "antd/es/table";
import {Event as EventModel} from "../../domain/event/event.ts";
import {Link, useNavigate} from "react-router-dom";
import {RouteNames} from "../index.tsx";
import {translate} from "../../shared/translate/translate.ts";

export default function Event() {
    const navigate = useNavigate();
    const {lang} = useTypedSelector(state => state.system);
    const {events, isLoading} = useTypedSelector(state => state.event);
    const {getEvents} = useActions();

    const columns: ColumnsType<EventModel> = [
        {
            key: "action",
            title: translate("action", lang),
            dataIndex: "action",
            render: (_, record) => (
                <div>
                    <Link to={RouteNames.EVENTS_EDIT.replace(":id", record.id)}>
                        {txts.edit[lang]}
                    </Link>
                </div>
            ),
        },
        {
            key: "name",
            title: translate("name", lang),
            dataIndex: "name",
            render: (name) => name?.[lang] || name?.kz || name?.ru || name?.en || '-',
        },
        {
            key: "plannedAt",
            title: translate("planned_at", lang),
            dataIndex: "plannedAt",
            render: (createdAt: string) => new Date(createdAt).toLocaleString(),
        },
        {
            key: "created_at",
            title: translate("created_at", lang),
            dataIndex: "createdAt",
            render: (createdAt: string) => new Date(createdAt).toLocaleString(),
        },
        {
            key: "updated_at",
            title: translate("updated_at", lang),
            dataIndex: "updatedAt",
            render: (updatedAt: string) => new Date(updatedAt).toLocaleString(),
        },
    ];

    const data: EventModel[] = events?.map(event => {
        return {
            id: event.id,
            name: event.name,
            desc: event.desc,
            imgUrl: event.imgUrl,
            plannedAt: event.plannedAt,
            createdAt: event.createdAt,
            updatedAt: event.updatedAt,
        };
    });

    useEffect(() => {
        const controller = new AbortController();
        getEvents(controller);
        return () => controller.abort();
    }, []);

    return (
        <Card bodyStyle={{padding: "10px"}}>
            <Row justify={"end"}>
                <Button
                    type={"primary"}
                    style={{marginBottom: "20px"}}
                    onClick={() => navigate(RouteNames.EVENTS_CREATE)}
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
