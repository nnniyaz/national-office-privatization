import {Button, Card, Row} from "antd";
import {RouteNames} from "../index.tsx";
import {translate} from "../../shared/translate/translate.ts";
import {useTypedSelector} from "../../shared/hooks/useTypedSelector.ts";
import {useNavigate} from "react-router-dom";
import {useActions} from "../../shared/hooks/useActions.ts";
import {useEffect, useMemo} from "react";

export default function Contacts() {
    const navigate = useNavigate();
    const {lang} = useTypedSelector(state => state.system);
    const {contacts, isLoading} = useTypedSelector(state => state.contacts);
    const {getContacts} = useActions();

    const data: {[key: string]: {label: string, value: any}} = useMemo(() => {
        if (!contacts) return {} as {[key: string]: {label: string, value: any}};
        return {
            enterpriseId: {
                label: translate("primary_contact_person", lang),
                value: contacts?.primaryContactPerson || "-"
            },
            fio: {
                label: translate("primary_contact", lang),
                value: contacts?.primaryContact || "-"
            },
            bin: {
                label: translate("secondary_contact_person", lang),
                value: contacts?.secondaryContactPerson || "-"
            },
            phone: {
                label: translate("secondary_contact", lang),
                value: contacts?.secondaryContact || "-"
            },
            email: {
                label: translate("email", lang),
                value: contacts?.email || "-"
            },
        }
    }, [contacts]);

    useEffect(() => {
        getContacts();
    }, [])

    return (
        <Card styles={{body: {padding: "10px"}}} style={{maxWidth: "500px"}} loading={isLoading}>
            <Row justify={"end"}>
                {
                    !!contacts
                        ?
                        <Button
                            type={"primary"}
                            style={{marginBottom: "20px"}}
                            onClick={() => navigate(RouteNames.CONTACTS_EDIT.replace(":id", contacts.id))}
                        >
                            {translate("edit", lang)}
                        </Button>
                        :
                        <Button
                            type={"primary"}
                            style={{marginBottom: "20px"}}
                            onClick={() => navigate(RouteNames.CONTACTS_CREATE)}
                        >
                            {translate("add", lang)}
                        </Button>
                }
            </Row>

            <div
                style={{
                    border: "1px solid rgb(240, 240, 240)",
                    borderRadius: "5px",
                    marginBottom: "20px"
                }}
            >
                {
                    Object.keys(data).map((key, index) => (
                        <div
                            key={index}
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                borderBottom: Object.keys(data).length - 1 === index ? "" : "1px solid rgb(240, 240, 240)",
                            }}
                        >
                            <div style={{
                                width: "30%",
                                padding: "10px",
                                borderRight: "1px solid rgb(240, 240, 240)",
                                backgroundColor: "#fafafa",
                                borderTopLeftRadius: index === 0 ? "4px" : "",
                                borderBottomLeftRadius: Object.keys(data).length - 1 === index ? "4px" : "",
                            }}>
                                {data[key].label}
                            </div>
                            <div style={{
                                width: "70%",
                                padding: "10px",
                            }}>
                                {data[key].value}
                            </div>
                        </div>
                    ))
                }
            </div>
        </Card>
    )
}
