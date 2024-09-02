import {NpaAction, NpaActionEnum, NpaState} from "./types.ts";

const initialState: NpaState = {
    npas: [],
    npa: null,
    isLoading: false,
    error: null,
};

export default function npaReducer(state = initialState, action: NpaAction): NpaState {
    switch (action.type) {
        case NpaActionEnum.SET_NPAS:
            return {...state, npas: action.payload};
        case NpaActionEnum.SET_NPA:
            return {...state, npa: action.payload};
        case NpaActionEnum.SET_LOADING_NPAS:
            return {...state, isLoading: action.payload};
        case NpaActionEnum.SET_ERROR_NPAS:
            return {...state, error: action.payload};
        default:
            return state;
    }
}
