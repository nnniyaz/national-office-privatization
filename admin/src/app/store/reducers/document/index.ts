import {DocumentAction, DocumentActionEnum, DocumentState} from "./types.ts";

const initialState: DocumentState = {
    documents: [],
    document: null,
    isLoading: false,
    error: null,
};

export default function documentReducer(state = initialState, action: DocumentAction): DocumentState {
    switch (action.type) {
        case DocumentActionEnum.SET_DOCUMENTS:
            return {...state, documents: action.payload};
        case DocumentActionEnum.SET_DOCUMENT:
            return {...state, document: action.payload};
        case DocumentActionEnum.SET_LOADING_DOCUMENTS:
            return {...state, isLoading: action.payload};
        case DocumentActionEnum.SET_ERROR_DOCUMENTS:
            return {...state, error: action.payload};
        default:
            return state;
    }
}
