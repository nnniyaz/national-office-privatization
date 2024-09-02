import {EnterpriseAction, EnterpriseActionEnum, EnterpriseState} from "./types.ts";

const initialState: EnterpriseState = {
    enterprises: [],
    enterprise: null,
    isLoading: false,
    error: null,
};

export default function enterpriseReducer(state = initialState, action: EnterpriseAction): EnterpriseState {
    switch (action.type) {
        case EnterpriseActionEnum.SET_ENTERPRISES:
            return {...state, enterprises: action.payload};
        case EnterpriseActionEnum.SET_ENTERPRISE:
            return {...state, enterprise: action.payload};
        case EnterpriseActionEnum.SET_LOADING_ENTERPRISES:
            return {...state, isLoading: action.payload};
        case EnterpriseActionEnum.SET_ERROR_ENTERPRISES:
            return {...state, error: action.payload};
        default:
            return state;
    }
}
