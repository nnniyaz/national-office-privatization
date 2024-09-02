import {SystemAction, SystemActionEnum, SystemState} from "./types.ts";
import {Langs} from "../../../../domain/base/mlString.ts";

const initialState: SystemState = {
    lang: Langs.RU,
    notificationApi: null,
    breadcrumbs: [],
};

export default function systemReducer(state = initialState, action: SystemAction): SystemState {
    switch (action.type) {
        case SystemActionEnum.SET_LANG:
            return {...state, lang: action.payload};
        case SystemActionEnum.SET_NOTIFICATION_API:
            return {...state, notificationApi: action.payload};
        case SystemActionEnum.SET_BREADCRUMBS:
            return {...state, breadcrumbs: action.payload};
        default:
            return state;
    }
}
