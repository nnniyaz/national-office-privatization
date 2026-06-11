import {useTypedSelector} from "../../shared/hooks/useTypedSelector.ts";
import {useActions} from "../../shared/hooks/useActions.ts";
import {useEffect} from "react";
import {Button, Card, Empty, Row, Table} from "antd";
import {txts} from "../../shared/core/i18ngen.ts";
import {ColumnsType} from "antd/es/table";
import {User as UserModel} from "../../domain/user/user.ts";
import {Link, useNavigate} from "react-router-dom";
import {RouteNames} from "../index.tsx";
import {translate} from "../../shared/translate/translate.ts";

export default function User() {
    const navigate = useNavigate();
    const {lang} = useTypedSelector(state => state.system);
    const {users, isLoading} = useTypedSelector(state => state.user);
    const {getUsers} = useActions();

    const columns: ColumnsType<UserModel> = [
        {
            key: "action",
            title: translate("action", lang),
            dataIndex: "action",
            render: (_, record) => (
                <div>
                    <Link to={RouteNames.USER_EDIT.replace(":id", record.id)}>
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

    const data: UserModel[] = users?.map(user => {
        return {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            login: user.login,
            role: user.role,
            disabled: user.disabled,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    });

    useEffect(() => {
        const controller = new AbortController();
        getUsers(controller);
        return () => controller.abort();
    }, []);

    return (
        <Card styles={{body: {padding: "10px"}}}>
            <Row justify={"end"}>
                <Button
                    type={"primary"}
                    style={{marginBottom: "20px"}}
                    onClick={() => navigate(RouteNames.USER_CREATE)}
                >
                    {txts.add[lang]}
                </Button>
            </Row>
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
