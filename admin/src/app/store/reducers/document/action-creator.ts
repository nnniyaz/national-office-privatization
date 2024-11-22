import {
    DocumentActionEnum,
    SetDocumentsAction,
    SetDocumentAction,
    SetLoadingAction,
    SetErrorAction,
} from './types';
import {Document as DocumentService, DocumentCreateReq, DocumentUpdateReq} from "../../../api/document/document_http.ts";
import {AppDispatch, RootState} from "../../index.ts";
import {httpHandler, FailedResponseHandler} from "../../../../shared/http-handler/httpHandler.ts";
import {NavigateCallback} from "../../../../domain/base/navigateCallback.ts";
import {Document} from "../../../../domain/document/document.ts";
import {Notify} from "../../../../shared/notification/notification.ts";
import {translate} from "../../../../shared/translate/translate.ts";
import {RouteNames} from "../../../../pages";

export const DocumentActionCreator = {
    setDocuments: (payload: Document[]): SetDocumentsAction => ({
        type: DocumentActionEnum.SET_DOCUMENTS,
        payload
    }),
    setDocument: (payload: Document | null): SetDocumentAction => ({
        type: DocumentActionEnum.SET_DOCUMENT,
        payload
    }),
    setLoading: (payload: boolean): SetLoadingAction => ({
        type: DocumentActionEnum.SET_LOADING_DOCUMENTS,
        payload
    }),
    setError: (payload: string | null): SetErrorAction => ({
        type: DocumentActionEnum.SET_ERROR_DOCUMENTS,
        payload
    }),

    getDocuments: (controller: AbortController) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {lang, notificationApi} = getState().system;
        try {
            dispatch(DocumentActionCreator.setLoading(true));
            const res = await DocumentService.getDocuments(controller);
            if (res.data.success) {
                dispatch(DocumentActionCreator.setDocuments(res.data.data?.documents))
            } else {
                dispatch(DocumentActionCreator.setError(res.data.messages[0]))
                FailedResponseHandler({
                    notificationApi: notificationApi!,
                    title: translate("document_module", lang),
                    message: translate("document_fetch_failed", lang),
                    httpStatus: res.status,
                });
            }
        } catch (e: any) {
            httpHandler({
                notificationApi: notificationApi!,
                error: e,
                httpStatus: e?.response?.status,
                dispatch: dispatch,
                currentLang: lang,
            });
        } finally {
            dispatch(DocumentActionCreator.setLoading(false));
        }
    },

    getOneDocumentById: (documentId: string, navigationCallback: NavigateCallback) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {lang, notificationApi} = getState().system;
        try {
            dispatch(DocumentActionCreator.setLoading(true));
            const res = await DocumentService.getOneDocumentById(documentId);
            if (res.data.success) {
                dispatch(DocumentActionCreator.setDocument(res.data.data))
            } else {
                dispatch(DocumentActionCreator.setError(res.data.messages[0]))
                FailedResponseHandler({
                    notificationApi: notificationApi!,
                    title: translate("document_module", lang),
                    message: translate("document_fetch_failed", lang),
                    httpStatus: res.status,
                });
            }
        } catch (e: any) {
            httpHandler({
                notificationApi: notificationApi!,
                error: e,
                httpStatus: e?.response?.status,
                dispatch: dispatch,
                currentLang: lang,
                navigateCallback: navigationCallback,
            });
        } finally {
            dispatch(DocumentActionCreator.setLoading(false));
        }
    },

    createDocument: (request: DocumentCreateReq, navigationCallback: NavigateCallback) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {lang, notificationApi} = getState().system;
        try {
            dispatch(DocumentActionCreator.setLoading(true));
            const res = await DocumentService.createDocument(request);
            if (res.data.success) {
                Notify.Success({
                    title: translate("document_module", lang),
                    message: translate("document_created_successfully", lang),
                    notificationApi: notificationApi!
                });
                navigationCallback.navigate(RouteNames.DOCUMENTS);
            } else {
                dispatch(DocumentActionCreator.setError(res.data.messages[0]))
                FailedResponseHandler({
                    notificationApi: notificationApi!,
                    title: translate("document_module", lang),
                    message: translate("document_create_failed", lang),
                    httpStatus: res.status,
                });
            }
        } catch (e: any) {
            httpHandler({
                notificationApi: notificationApi!,
                error: e,
                httpStatus: e?.response?.status,
                dispatch: dispatch,
                currentLang: lang,
                navigateCallback: navigationCallback,
            });
        } finally {
            dispatch(DocumentActionCreator.setLoading(false));
        }
    },

    updateDocument: (request: DocumentUpdateReq, documentId: string, navigationCallback: NavigateCallback) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {lang, notificationApi} = getState().system;
        try {
            dispatch(DocumentActionCreator.setLoading(true));
            const res = await DocumentService.updateDocument(request);
            if (res.data.success) {
                Notify.Success({
                    title: translate("document_module", lang),
                    message: translate("document_updated_successfully", lang),
                    notificationApi: notificationApi!
                });
                await DocumentActionCreator.getOneDocumentById(documentId, navigationCallback)(dispatch, getState);
            } else {
                dispatch(DocumentActionCreator.setError(res.data.messages[0]))
                FailedResponseHandler({
                    notificationApi: notificationApi!,
                    title: translate("document_module", lang),
                    message: translate("document_update_failed", lang),
                    httpStatus: res.status,
                });
            }
        } catch (e: any) {
            httpHandler({
                notificationApi: notificationApi!,
                error: e,
                httpStatus: e?.response?.status,
                dispatch: dispatch,
                currentLang: lang,
                navigateCallback: navigationCallback,
            });
        } finally {
            dispatch(DocumentActionCreator.setLoading(false));
        }
    },

    deleteDocument: (documentId: string, navigationCallback: NavigateCallback) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {lang, notificationApi} = getState().system;
        try {
            dispatch(DocumentActionCreator.setLoading(true));
            const res = await DocumentService.deleteDocument(documentId);
            if (res.data.success) {
                Notify.Success({
                    title: translate("document_module", lang),
                    message: translate("document_deleted_successfully", lang),
                    notificationApi: notificationApi!
                });
                navigationCallback.navigate(RouteNames.DOCUMENTS);
            } else {
                dispatch(DocumentActionCreator.setError(res.data.messages[0]))
                FailedResponseHandler({
                    notificationApi: notificationApi!,
                    title: translate("document_module", lang),
                    message: translate("document_delete_failed", lang),
                    httpStatus: res.status,
                });
            }
        } catch (e: any) {
            httpHandler({
                notificationApi: notificationApi!,
                error: e,
                httpStatus: e?.response?.status,
                dispatch: dispatch,
                currentLang: lang,
                navigateCallback: navigationCallback,
            });
        } finally {
            dispatch(DocumentActionCreator.setLoading(false));
        }
    },
}
