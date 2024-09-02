import {useTypedSelector} from "../../shared/hooks/useTypedSelector.ts";
import {useActions} from "../../shared/hooks/useActions.ts";
import {useEffect} from "react";
import {Card, Empty, Table} from "antd";
import {txts} from "../../shared/core/i18ngen.ts";
import {ColumnsType} from "antd/es/table";
import {Application as ApplicationModel} from "../../domain/application/application.ts";
import {Link} from "react-router-dom";
import {RouteNames} from "../index.tsx";
import {translate} from "../../shared/translate/translate.ts";

export default function Application() {
    const {lang} = useTypedSelector(state => state.system);
    const {applications, isLoading} = useTypedSelector(state => state.application);
    const {getApplications} = useActions();

    const columns: ColumnsType<ApplicationModel> = [
        {
            key: "action",
            title: translate("action", lang),
            dataIndex: "action",
            render: (_, record) => (
                <div>
                    <Link to={RouteNames.APPLICATION_EDIT.replace(":id", record.id)}>
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
            key: "firstName",
            title: txts.first_name[lang],
            dataIndex: "firstName",
        },
        {
            key: "lastName",
            title: txts.last_name[lang],
            dataIndex: "lastName",
        },
        {
            key: "login",
            title: txts.login[lang],
            dataIndex: "login",
        },
        {
            key: "role",
            title: txts.role[lang],
            dataIndex: "role",
        },
        {
            key: "disabled",
            title: txts.disabled[lang],
            dataIndex: "disabled",
            render: (disabled: boolean) => disabled ? txts.yes[lang] : txts.no[lang],
        },
        {
            key: "created_at",
            title: txts.created_at[lang],
            dataIndex: "createdAt",
            render: (createdAt: string) => new Date(createdAt).toLocaleString(),
        },
        {
            key: "updated_at",
            title: txts.updated_at[lang],
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
            contact: application.contact,
            message: application.message,
            createdAt: application.createdAt,
            updatedAt: application.updatedAt,
        };
    });

    useEffect(() => {
        const controller = new AbortController();
        getApplications(controller);
        return () => controller.abort();
    }, []);

    return (
        <Card bodyStyle={{padding: "10px"}}>
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
