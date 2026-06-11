import {SystemAction, SystemActionEnum, SystemState} from "./types.ts";
import {Langs} from "../../../../domain/base/mlString.ts";

const LANG_STORAGE_KEY = "nop-admin-lang";

// восстанавливаем выбранный язык; по умолчанию — казахский
const storedLang = ((): Langs => {
    const v = localStorage.getItem(LANG_STORAGE_KEY);
    return Object.values(Langs).includes(v as Langs) ? (v as Langs) : Langs.KZ;
})();

const initialState: SystemState = {
    lang: storedLang,
    notificationApi: null,
    breadcrumbs: [],
};

export default function systemReducer(state = initialState, action: SystemAction): SystemState {
    switch (action.type) {
        case SystemActionEnum.SET_LANG:
            localStorage.setItem(LANG_STORAGE_KEY, action.payload);
            return {...state, lang: action.payload};
        case SystemActionEnum.SET_NOTIFICATION_API:
            return {...state, notificationApi: action.payload};
        case SystemActionEnum.SET_BREADCRUMBS:
            return {...state, breadcrumbs: action.payload};
        default:
            return state;
    }
}
