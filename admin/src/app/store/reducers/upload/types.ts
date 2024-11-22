export type UploadState = {
    isLoading: boolean;
};

export enum UploadActionEnum {
    SET_IS_LOADING = "SET_IS_LOADING",
    SET_NPA_UPLOADS = "SET_NPA_UPLOADS",
    SET_DOCUMENT_UPLOADS = "SET_DOCUMENT_UPLOADS",
    SET_NEWS_IMAGE_UPLOADS = "SET_NEWS_UPLOADS",
    SET_EVENT_IMAGE_UPLOADS = "SET_EVENT_IMAGE_UPLOADS",
}

export interface SetIsLoadingAction {
    type: UploadActionEnum.SET_IS_LOADING;
    payload: boolean;
}

export interface SetNpaUploadsAction {
    type: UploadActionEnum.SET_NPA_UPLOADS;
}

export interface SetDocumentUploadsAction {
    type: UploadActionEnum.SET_DOCUMENT_UPLOADS;
}

export interface SetNewsImageUploadsAction {
    type: UploadActionEnum.SET_NEWS_IMAGE_UPLOADS;
}

export interface SetEventImageUploadsAction {
    type: UploadActionEnum.SET_EVENT_IMAGE_UPLOADS;
}

export type UploadAction =
    SetIsLoadingAction
    | SetNpaUploadsAction
    | SetDocumentUploadsAction
    | SetNewsImageUploadsAction
    | SetEventImageUploadsAction;
