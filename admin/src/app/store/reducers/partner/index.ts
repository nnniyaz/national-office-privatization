import {PartnerAction, PartnerActionEnum, PartnerState} from "./types.ts";

const initialState: PartnerState = {
    partners: [],
    partner: null,
    isLoading: false,
    error: null,
};

export default function partnerReducer(state = initialState, action: PartnerAction): PartnerState {
    switch (action.type) {
        case PartnerActionEnum.SET_PARTNERS:
            return {...state, partners: action.payload};
        case PartnerActionEnum.SET_PARTNER:
            return {...state, partner: action.payload};
        case PartnerActionEnum.SET_LOADING_PARTNERS:
            return {...state, isLoading: action.payload};
        case PartnerActionEnum.SET_ERROR_PARTNERS:
            return {...state, error: action.payload};
        default:
            return state;
    }
}
