import {useTypedSelector} from "../../shared/hooks/useTypedSelector.ts";
import {useActions} from "../../shared/hooks/useActions.ts";
import {useEffect} from "react";
import {Button, Card, Empty, Row, Table} from "antd";
import {txts} from "../../shared/core/i18ngen.ts";
import {ColumnsType} from "antd/es/table";
import {Npa as NPAModel} from "../../domain/npa/npa.ts";
import {Link, useNavigate} from "react-router-dom";
import {RouteNames} from "../index.tsx";
import {translate} from "../../shared/translate/translate.ts";

export default function NPA() {
    const navigate = useNavigate();
    const {lang} = useTypedSelector(state => state.system);
    const {npas, isLoading} = useTypedSelector(state => state.npa);
    const {getNpas} = useActions();

    const columns: ColumnsType<NPAModel> = [
        {
            key: "action",
            title: translate("action", lang),
            dataIndex: "action",
            render: (_, record) => (
                <div>
                    <Link to={RouteNames.NPA_EDIT.replace(":id", record.id)}>
                        {txts.edit[lang]}
                    </Link>
                </div>
            ),
        },
        {
            key: "title",
            title: translate("title", lang),
            dataIndex: "title",
        },
        {
            key: "file",
            title: translate("file", lang),
            dataIndex: "filename",
            render: (filename: string) => (
                <a href={`${import.meta.env.VITE_SPACE_HOST}/npa/${filename}`} target={"_blank"}>
                    {translate("view_file", lang)}
                </a>
            ),
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

    const data: NPAModel[] = npas?.map(npa => {
        return {
            id: npa.id,
            title: npa.title,
            filename: npa.filename,
            createdAt: npa.createdAt,
            updatedAt: npa.updatedAt,
        };
    });

    useEffect(() => {
        const controller = new AbortController();
        getNpas(controller);
        return () => controller.abort();
    }, []);

    return (
        <Card bodyStyle={{padding: "10px"}}>
            <Row justify={"end"}>
                <Button
                    type={"primary"}
                    style={{marginBottom: "20px"}}
                    onClick={() => navigate(RouteNames.NPA_CREATE)}
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
