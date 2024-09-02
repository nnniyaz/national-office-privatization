import {Card, Select} from "antd";
import {translate} from "../../shared/translate/translate.ts";
import {useTypedSelector} from "../../shared/hooks/useTypedSelector.ts";
import {useActions} from "../../shared/hooks/useActions.ts";
import {Langs} from "../../domain/base/mlString.ts";

export default function Settings() {
    const {lang} = useTypedSelector(state => state.system);
    const {setLang} = useActions();
    return (
        <Card style={{maxWidth: "500px"}}>
            <h2 style={{marginBottom: "20px"}}>{translate("language_settings", lang)}</h2>
            <Select
                value={lang}
                onChange={(value) => setLang(value)}
                options={[
                    {label: translate("KZ", lang), value: Langs.KZ},
                    {label: translate("RU", lang), value: Langs.RU},
                    {label: translate("EN", lang), value: Langs.EN},
                ]}
            />
        </Card>
    )
}
