import {
    UploadAction,
    UploadActionEnum,
    UploadState
} from "./types.ts";

const initialState: UploadState = {
    isLoading: false,
};

export default function uploadReducer(state = initialState, action: UploadAction) {
    switch (action.type) {
        case UploadActionEnum.SET_IS_LOADING:
            return {...state, isLoading: action.payload};
        case UploadActionEnum.SET_NPA_UPLOADS:
            return {...state};
        case UploadActionEnum.SET_DOCUMENT_UPLOADS:
            return {...state};
        case UploadActionEnum.SET_NEWS_IMAGE_UPLOADS:
            return {...state};
        case UploadActionEnum.SET_EVENT_IMAGE_UPLOADS:
            return {...state};
        default:
            return state;
    }
}
