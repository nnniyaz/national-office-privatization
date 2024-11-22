import {Langs} from "../../domain/base/mlString.ts";
import {translate} from "../translate/translate.ts";

export const getRegion = (region: string, lang: Langs) => {
    const regions = [
        {value: "", label: translate("select_region".toLowerCase(), lang)},
        {value: "Almaty_city", label: translate("Almaty_city".toLowerCase(), lang)},
        {value: "Astana_city", label: translate("Astana_city".toLowerCase(), lang)},
        {value: "Shymkent_city", label: translate("Shymkent_city".toLowerCase(), lang)},
        {value: "Abai", label: translate("Abai".toLowerCase(), lang)},
        {value: "Aqmola", label: translate("Aqmola".toLowerCase(), lang)},
        {value: "Aqtobe", label: translate("Aqtobe".toLowerCase(), lang)},
        {value: "Almaty", label: translate("Almaty".toLowerCase(), lang)},
        {value: "Atyrau", label: translate("Atyrau".toLowerCase(), lang)},
        {value: "BQO", label: translate("BQO".toLowerCase(), lang)},
        {value: "Jambyl", label: translate("Jambyl".toLowerCase(), lang)},
        {value: "Jetisu", label: translate("Jetisu".toLowerCase(), lang)},
        {value: "Qaragandy", label: translate("Qaragandy".toLowerCase(), lang)},
        {value: "Qostanai", label: translate("Qostanai".toLowerCase(), lang)},
        {value: "Qyzylorda", label: translate("Qyzylorda".toLowerCase(), lang)},
        {value: "Mangystau", label: translate("Mangystau".toLowerCase(), lang)},
        {value: "Pavlodar", label: translate("Pavlodar".toLowerCase(), lang)},
        {value: "SQO", label: translate("SQO".toLowerCase(), lang)},
        {value: "Turkistan", label: translate("Turkistan".toLowerCase(), lang)},
        {value: "Ulytau", label: translate("Ulytau".toLowerCase(), lang)},
        {value: "ShQO", label: translate("ShQO".toLowerCase(), lang)},
    ]
    return regions.find(reg => reg.value === region)?.label || "";
}
