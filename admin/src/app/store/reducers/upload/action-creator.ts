import {
    SetDocumentUploadsAction,
    SetEventImageUploadsAction,
    SetNewsImageUploadsAction,
    SetNpaUploadsAction,
    UploadActionEnum,
    SetIsLoadingAction
} from "./types.ts";
import {AppDispatch, RootState} from "../../index.ts";
import {Upload} from "../../../api/upload/upload.ts";
import {Notify} from "../../../../shared/notification/notification.ts";
import {FailedResponseHandler, httpHandler} from "../../../../shared/http-handler/httpHandler.ts";
import {translate} from "../../../../shared/translate/translate.ts";

export const UploadActionCreator = {
    setIsLoadingAction: (payload: boolean): SetIsLoadingAction => ({
        type: UploadActionEnum.SET_IS_LOADING,
        payload
    }),
    setNpaUploadsAction: (): SetNpaUploadsAction => ({
        type: UploadActionEnum.SET_NPA_UPLOADS
    }),
    setDocumentUploadsAction: (): SetDocumentUploadsAction => ({
        type: UploadActionEnum.SET_DOCUMENT_UPLOADS
    }),
    setNewsImageUploadsAction: (): SetNewsImageUploadsAction => ({
        type: UploadActionEnum.SET_NEWS_IMAGE_UPLOADS
    }),
    setEventImageUploadsAction: (): SetEventImageUploadsAction => ({
        type: UploadActionEnum.SET_EVENT_IMAGE_UPLOADS
    }),

    uploadNpa: (formData: FormData) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {lang, notificationApi} = getState().system;
        try {
            dispatch(UploadActionCreator.setIsLoadingAction(true));
            Notify.Success({
                title: translate("npa_module", lang),
                message: translate("upload_is_started_please_wait", lang),
                notificationApi: notificationApi!
            });
            const res = await Upload.uploadNpa(formData);
            if (res.data.success) {
                Notify.Success({
                    title: translate("npa_module", lang),
                    message: translate("npa_successfully_uploaded_description", lang),
                    notificationApi: notificationApi!
                });
                return res.data.data.filename as string;
            } else {
                FailedResponseHandler({
                    title: translate("npa_module", lang),
                    message: translate("failed_to_upload_document", lang) + ". " + translate("take_into_account_that_file_can_not_exceed_1_mb", lang),
                    httpStatus: res.status,
                    notificationApi: notificationApi!
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
            dispatch(UploadActionCreator.setIsLoadingAction(false));
        }
    },

    uploadDocument: (formData: FormData) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {lang, notificationApi} = getState().system;
        try {
            dispatch(UploadActionCreator.setIsLoadingAction(true));
            Notify.Success({
                title: translate("document_module", lang),
                message: translate("upload_is_started_please_wait", lang),
                notificationApi: notificationApi!
            });
            const res = await Upload.uploadDocument(formData);
            if (res.data.success) {
                Notify.Success({
                    title: translate("document_module", lang),
                    message: translate("document_successfully_uploaded_description", lang),
                    notificationApi: notificationApi!
                });
                return res.data.data.filename as string;
            } else {
                FailedResponseHandler({
                    title: translate("document_module", lang),
                    message: translate("failed_to_upload_document", lang) + ". " + translate("take_into_account_that_file_can_not_exceed_1_mb", lang),
                    httpStatus: res.status,
                    notificationApi: notificationApi!
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
            dispatch(UploadActionCreator.setIsLoadingAction(false));
        }
    },

    uploadNewsImage: (formData: FormData) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {lang, notificationApi} = getState().system;
        try {
            dispatch(UploadActionCreator.setIsLoadingAction(true));
            Notify.Success({
                title: translate("news_module", lang),
                message: translate("upload_is_started_please_wait", lang),
                notificationApi: notificationApi!
            });
            const res = await Upload.uploadNewsImage(formData);
            if (res.data.success) {
                Notify.Success({
                    title: translate("news_module", lang),
                    message: translate("news_image_uploaded_successfully", lang),
                    notificationApi: notificationApi!
                });
                return res.data.data.filename as string;
            } else {
                FailedResponseHandler({
                    title: translate("news_module", lang),
                    message: translate("failed_to_upload_news_image", lang),
                    httpStatus: res.status,
                    notificationApi: notificationApi!
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
            dispatch(UploadActionCreator.setIsLoadingAction(false));
        }
    },

    uploadEventImage: (formData: FormData) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {lang, notificationApi} = getState().system;
        try {
            dispatch(UploadActionCreator.setIsLoadingAction(true));
            Notify.Success({
                title: translate("event_module", lang),
                message: translate("upload_is_started_please_wait", lang),
                notificationApi: notificationApi!
            });
            const res = await Upload.uploadEventImage(formData);
            if (res.data.success) {
                Notify.Success({
                    title: translate("event_module", lang),
                    message: translate("event_image_uploaded_successfully", lang),
                    notificationApi: notificationApi!
                });
                return res.data.data.filename as string;
            } else {
                FailedResponseHandler({
                    title: translate("event_module", lang),
                    message: translate("failed_to_upload_event_image", lang),
                    httpStatus: res.status,
                    notificationApi: notificationApi!
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
            dispatch(UploadActionCreator.setIsLoadingAction(false));
        }
    }
}
