import { Document } from '../../../../domain/document/document.ts';

export interface DocumentState {
    documents: Document[];
    document: Document | null;
    isLoading: boolean;
    error: string | null;
}

export enum DocumentActionEnum {
    SET_DOCUMENTS = "SET_DOCUMENTS",
    SET_DOCUMENT = "SET_DOCUMENT",
    SET_LOADING_DOCUMENTS = "SET_LOADING_DOCUMENTS",
    SET_ERROR_DOCUMENTS = "SET_ERROR_DOCUMENTS",
}

export interface SetDocumentsAction {
    type: DocumentActionEnum.SET_DOCUMENTS;
    payload: Document[];
}

export interface SetDocumentAction {
    type: DocumentActionEnum.SET_DOCUMENT;
    payload: Document | null;
}

export interface SetLoadingAction {
    type: DocumentActionEnum.SET_LOADING_DOCUMENTS;
    payload: boolean;
}

export interface SetErrorAction {
    type: DocumentActionEnum.SET_ERROR_DOCUMENTS;
    payload: string | null;
}

export type DocumentAction = SetDocumentsAction | SetDocumentAction | SetLoadingAction | SetErrorAction;
