import {Button, Card, Row} from "antd";
import {RouteNames} from "../index.tsx";
import {translate} from "../../shared/translate/translate.ts";
import {useTypedSelector} from "../../shared/hooks/useTypedSelector.ts";
import {useNavigate} from "react-router-dom";
import {useActions} from "../../shared/hooks/useActions.ts";
import {useEffect} from "react";

export default function Contacts() {
    const navigate = useNavigate();
    const {lang} = useTypedSelector(state => state.system);
    const {contacts} = useTypedSelector(state => state.contacts);
    const {getContacts} = useActions();

    useEffect(() => {
        getContacts();
    }, [])

    return (
        <Card bodyStyle={{padding: "10px"}}>
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
            <div style={{padding: "10px"}}>
                <p style={{marginBottom: "5px"}}>
                    {translate("primary_contact_person", lang)}: <i>{contacts?.primaryContactPerson}</i>
                </p>
                <p style={{marginBottom: "5px"}}>
                    {translate("primary_contact", lang)}: <i>{contacts?.primaryContact}</i>
                </p>
                <p style={{marginBottom: "5px"}}>
                    {translate("secondary_contact_person", lang)}: <i>{contacts?.secondaryContactPerson}</i>
                </p>
                <p style={{marginBottom: "5px"}}>
                    {translate("secondary_contact", lang)}: <i>{contacts?.secondaryContact}</i>
                </p>
                <p style={{marginBottom: "5px"}}>
                    {translate("email", lang)}: <i>{contacts?.email}</i>
                </p>
            </div>
        </Card>
    )
}
