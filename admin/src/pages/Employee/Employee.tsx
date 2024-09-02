import {useTypedSelector} from "../../shared/hooks/useTypedSelector.ts";
import {useActions} from "../../shared/hooks/useActions.ts";
import {useEffect} from "react";
import {Button, Card, Empty, Row, Table} from "antd";
import {txts} from "../../shared/core/i18ngen.ts";
import {ColumnsType} from "antd/es/table";
import {Employee as EmployeeModel} from "../../domain/employee/employee.ts";
import {Link, useNavigate} from "react-router-dom";
import {RouteNames} from "../index.tsx";
import {translate} from "../../shared/translate/translate.ts";

export default function Employee() {
    const navigate = useNavigate();
    const {lang} = useTypedSelector(state => state.system);
    const {employees, isLoading} = useTypedSelector(state => state.employee);
    const {getEmployees} = useActions();

    const columns: ColumnsType<EmployeeModel> = [
        {
            key: "action",
            title: translate("action", lang),
            dataIndex: "action",
            render: (_, record) => (
                <div>
                    <Link to={RouteNames.EMPLOYEE_EDIT.replace(":id", record.id)}>
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
            key: "group",
            title: translate("group", lang),
            dataIndex: "group",
        },
    ];

    const data: EmployeeModel[] = employees?.map(employee => {
        return {
            id: employee.id,
            name: employee.name,
            group: employee.group,
        };
    });

    useEffect(() => {
        const controller = new AbortController();
        getEmployees(controller);
        return () => controller.abort();
    }, []);

    return (
        <Card bodyStyle={{padding: "10px"}}>
            <Row justify={"end"}>
                <Button
                    type={"primary"}
                    style={{marginBottom: "20px"}}
                    onClick={() => navigate(RouteNames.EMPLOYEE_CREATE)}
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
