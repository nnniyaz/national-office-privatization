import {ApplicationAction, ApplicationActionEnum, ApplicationState} from "./types.ts";

const initialState: ApplicationState = {
    applications: [],
    application: null,
    isLoading: false,
    error: null,
};

export default function applicationReducer(state = initialState, action: ApplicationAction): ApplicationState {
    switch (action.type) {
        case ApplicationActionEnum.SET_APPLICATIONS:
            return {...state, applications: action.payload};
        case ApplicationActionEnum.SET_APPLICATION:
            return {...state, application: action.payload};
        case ApplicationActionEnum.SET_LOADING_APPLICATIONS:
            return {...state, isLoading: action.payload};
        case ApplicationActionEnum.SET_ERROR_APPLICATIONS:
            return {...state, error: action.payload};
        default:
            return state;
    }
}

