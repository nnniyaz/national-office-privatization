import {useTypedSelector} from "../../shared/hooks/useTypedSelector.ts";
import {useActions} from "../../shared/hooks/useActions.ts";
import {useEffect, useState} from "react";
import {Button, Card, DatePicker, Empty, Table} from "antd";
import {DownloadOutlined} from "@ant-design/icons";
import type {Dayjs} from "dayjs";
import {txts} from "../../shared/core/i18ngen.ts";
import {ColumnsType} from "antd/es/table";
import {Application as ApplicationModel} from "../../domain/application/application.ts";
import {Link} from "react-router-dom";
import {RouteNames} from "../index.tsx";
import {translate} from "../../shared/translate/translate.ts";

export default function Application() {
    const {lang} = useTypedSelector(state => state.system);
    const {applications, isLoading} = useTypedSelector(state => state.application);
    const {getApplications, exportApplications} = useActions();
    const [exportPeriod, setExportPeriod] = useState<[Dayjs | null, Dayjs | null] | null>(null);
    const [isExporting, setIsExporting] = useState(false);

    const columns: ColumnsType<ApplicationModel> = [
        {
            key: "action",
            title: translate("action", lang),
            dataIndex: "action",
            render: (_, record) => (
                <div>
                    <Link to={RouteNames.APPLICATION_EDIT.replace(":id", record.id)}>
                        {translate("details", lang)}
                    </Link>
                </div>
            ),
        },
        {
            key: "fio",
            title: translate("fio", lang),
            dataIndex: "fio",
        },
        {
            key: "bin",
            title: translate("bin", lang),
            dataIndex: "bin",
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

    const data: ApplicationModel[] = applications?.map(application => {
        return {
            id: application.id,
            enterpriseId: application.enterpriseId,
            fio: application.fio,
            bin: application.bin,
            phone: application.phone,
            email: application.email,
            message: application.message,
            createdAt: application.createdAt,
            updatedAt: application.updatedAt,
        };
    });

    const handleExport = async () => {
        // границы периода включительно: от начала первого дня до конца последнего
        const from = exportPeriod?.[0]?.startOf("day").toISOString();
        const to = exportPeriod?.[1]?.endOf("day").toISOString();
        setIsExporting(true);
        try {
            await exportApplications(from, to);
        } finally {
            setIsExporting(false);
        }
    };

    useEffect(() => {
        const controller = new AbortController();
        getApplications(controller);
        return () => controller.abort();
    }, []);

    return (
        <Card styles={{body: {padding: "10px"}}}>
            <div style={{width: "100%", display: "flex", justifyContent: "flex-end", gap: "10px", marginBottom: "10px"}}>
                <DatePicker.RangePicker
                    placeholder={[translate("export_period", lang), translate("export_period", lang)]}
                    value={exportPeriod}
                    onChange={(dates) => setExportPeriod(dates)}
                    allowEmpty={[true, true]}
                />
                <Button
                    type={"primary"}
                    icon={<DownloadOutlined/>}
                    loading={isExporting}
                    onClick={handleExport}
                >
                    {translate("export_to_excel", lang)}
                </Button>
            </div>
            <Table
                locale={{emptyText: <Empty description={txts.no_data[lang]}/>}}
                rowKey={"id"}
                dataSource={data}
                columns={columns}
                bordered={true}
                scroll={{x: 500}}
                loading={isLoading}
            />
        </Card>
    )
}
