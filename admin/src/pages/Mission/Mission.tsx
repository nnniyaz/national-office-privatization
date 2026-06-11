import {Button, Card, Row} from "antd";
import {RouteNames} from "../index.tsx";
import {translate} from "../../shared/translate/translate.ts";
import {useTypedSelector} from "../../shared/hooks/useTypedSelector.ts";
import {useNavigate} from "react-router-dom";
import {useActions} from "../../shared/hooks/useActions.ts";
import {useEffect} from "react";

export default function Mission() {
    const navigate = useNavigate();
    const {lang} = useTypedSelector(state => state.system);
    const {mission, isLoading} = useTypedSelector(state => state.mission);
    const {getMission} = useActions();

    useEffect(() => {
        getMission();
    }, [])

    return (
        <Card styles={{body: {padding: "10px"}}} style={{maxWidth: "500px"}} loading={isLoading}>
            <Row justify={"end"}>
                {
                    !!mission
                        ?
                        <Button
                            type={"primary"}
                            style={{marginBottom: "20px"}}
                            onClick={() => navigate(RouteNames.MISSION_EDIT.replace(":id", mission.id))}
                        >
                            {translate("edit", lang)}
                        </Button>
                        :
                        <Button
                            type={"primary"}
                            style={{marginBottom: "20px"}}
                            onClick={() => navigate(RouteNames.MISSION_CREATE)}
                        >
                            {translate("add", lang)}
                        </Button>
                }
            </Row>
            <p
                style={{padding: "10px"}}
                dangerouslySetInnerHTML={{__html: !!mission ? (mission.text?.[lang] || mission.text?.kz || mission.text?.ru || mission.text?.en || '').replace(/\n/g, "<br/>") : translate("mission_is_not_set", lang)}}
            ></p>
        </Card>
    )
}
