import {
    ApplicationActionEnum,
    SetApplicationsAction,
    SetApplicationAction,
    SetLoadingAction,
    SetErrorAction,
} from './types';
import {Application as ApplicationService, ApplicationCreateReq, ApplicationUpdateReq} from "../../../api/application/application_http.ts";
import {AppDispatch, RootState} from "../../index.ts";
import {httpHandler, FailedResponseHandler} from "../../../../shared/http-handler/httpHandler.ts";
import {NavigateCallback} from "../../../../domain/base/navigateCallback.ts";
import {Application} from "../../../../domain/application/application.ts";
import {txts} from "../../../../shared/core/i18ngen.ts";
import {RouteNames} from "../../../../pages";

export const ApplicationActionCreator = {
    setApplications: (payload: Application[]): SetApplicationsAction => ({
        type: ApplicationActionEnum.SET_APPLICATIONS,
        payload
    }),
    setApplication: (payload: Application | null): SetApplicationAction => ({
        type: ApplicationActionEnum.SET_APPLICATION,
        payload
    }),
    setLoading: (payload: boolean): SetLoadingAction => ({
        type: ApplicationActionEnum.SET_LOADING_APPLICATIONS,
        payload
    }),
    setError: (payload: string | null): SetErrorAction => ({
        type: ApplicationActionEnum.SET_ERROR_APPLICATIONS,
        payload
    }),

    getApplications: (controller: AbortController) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {lang, notificationApi} = getState().system;
        try {
            dispatch(ApplicationActionCreator.setLoading(true));
            const res = await ApplicationService.getApplications(controller);
            if (res.data.success) {
                dispatch(ApplicationActionCreator.setApplications(res.data.data?.applications))
            } else {
                dispatch(ApplicationActionCreator.setError(res.data.messages[0]))
                FailedResponseHandler({
                    title: txts.applications[lang],
                    message: txts.could_not_get_application[lang],
                    notificationApi: notificationApi!,
                    httpStatus: res.status,
                });
            }
        } catch (e: any) {
            httpHandler({
                error: e,
                httpStatus: e?.response?.status,
                dispatch: dispatch,
                currentLang: lang,
                notificationApi: notificationApi!,
            });
        } finally {
            dispatch(ApplicationActionCreator.setLoading(false));
        }
    },

    exportApplications: (from?: string, to?: string) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {lang, notificationApi} = getState().system;
        try {
            const res = await ApplicationService.exportApplications(from, to);
            if (res.status !== 200 || !(res.data instanceof Blob) || res.data.type.includes("application/json")) {
                FailedResponseHandler({
                    title: txts.applications[lang],
                    message: txts.could_not_export_applications[lang],
                    notificationApi: notificationApi!,
                    httpStatus: res.status,
                });
                return;
            }
            const url = URL.createObjectURL(res.data);
            const link = document.createElement("a");
            link.href = url;
            link.download = `applications_${new Date().toISOString().slice(0, 10)}.xlsx`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (e: any) {
            httpHandler({
                error: e,
                httpStatus: e?.response?.status,
                dispatch: dispatch,
                currentLang: lang,
                notificationApi: notificationApi!,
            });
        }
    },

    getOneApplicationById: (applicationId: string, navigationCallback: NavigateCallback) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {lang, notificationApi} = getState().system;
        try {
            dispatch(ApplicationActionCreator.setLoading(true));
            const res = await ApplicationService.getOneApplicationById(applicationId);
            if (res.data.success) {
                dispatch(ApplicationActionCreator.setApplication(res.data.data))
            } else {
                dispatch(ApplicationActionCreator.setError(res.data.messages[0]))
                FailedResponseHandler({
                    title: txts.applications[lang],
                    message: txts.could_not_get_application[lang],
                    notificationApi: notificationApi!,
                    hideNotify: true,
                    httpStatus: res.status,
                });
            }
        } catch (e: any) {
            httpHandler({
                error: e,
                httpStatus: e?.response?.status,
                dispatch: dispatch,
                currentLang: lang,
                navigateCallback: navigationCallback,
                notificationApi: notificationApi!,
            });
        } finally {
            dispatch(ApplicationActionCreator.setLoading(false));
        }
    },

    createApplication: (request: ApplicationCreateReq, applicationId: string, navigationCallback: NavigateCallback) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {lang, notificationApi} = getState().system;
        try {
            dispatch(ApplicationActionCreator.setLoading(true));
            const res = await ApplicationService.createApplication(request);
            if (res.data.success) {
                await ApplicationActionCreator.getOneApplicationById(applicationId, navigationCallback)(dispatch, getState);
                notificationApi!.success({
                    message: txts.applications[lang],
                    description: txts.application_created_successfully[lang]
                });
            } else {
                dispatch(ApplicationActionCreator.setError(res.data.messages[0]))
                FailedResponseHandler({
                    title: txts.applications[lang],
                    message: txts.could_not_create_application[lang],
                    notificationApi: notificationApi!,
                    httpStatus: res.status,
                });
            }
        } catch (e: any) {
            httpHandler({
                error: e,
                httpStatus: e?.response?.status,
                dispatch: dispatch,
                currentLang: lang,
                navigateCallback: navigationCallback,
                notificationApi: notificationApi!,
            });
        } finally {
            dispatch(ApplicationActionCreator.setLoading(false));
        }
    },

    updateApplication: (request: ApplicationUpdateReq, applicationId: string, navigationCallback: NavigateCallback) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {lang, notificationApi} = getState().system;
        try {
            dispatch(ApplicationActionCreator.setLoading(true));
            const res = await ApplicationService.updateApplication(request);
            if (res.data.success) {
                await ApplicationActionCreator.getOneApplicationById(applicationId, navigationCallback)(dispatch, getState);
                notificationApi!.success({
                    message: txts.applications[lang],
                    description: txts.application_updated_successfully[lang]
                });
            } else {
                dispatch(ApplicationActionCreator.setError(res.data.messages[0]))
                FailedResponseHandler({
                    title: txts.applications[lang],
                    message: txts.could_not_update_application[lang],
                    notificationApi: notificationApi!,
                    httpStatus: res.status,
                });
            }
        } catch (e: any) {
            httpHandler({
                error: e,
                httpStatus: e?.response?.status,
                dispatch: dispatch,
                currentLang: lang,
                navigateCallback: navigationCallback,
                notificationApi: notificationApi!,
            });
        } finally {
            dispatch(ApplicationActionCreator.setLoading(false));
        }
    },

    deleteApplication: (applicationId: string, navigationCallback: NavigateCallback) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {lang, notificationApi} = getState().system;
        try {
            dispatch(ApplicationActionCreator.setLoading(true));
            const res = await ApplicationService.deleteApplication(applicationId);
            if (res.data.success) {
                await ApplicationActionCreator.getOneApplicationById(applicationId, navigationCallback)(dispatch, getState);
                notificationApi!.success({
                    message: txts.applications[lang],
                    description: txts.application_deleted_successfully[lang]
                });
                navigationCallback.navigate(RouteNames.APPLICATIONS);
            } else {
                dispatch(ApplicationActionCreator.setError(res.data.messages[0]))
                FailedResponseHandler({
                    title: txts.applications[lang],
                    message: txts.could_not_delete_application[lang],
                    notificationApi: notificationApi!,
                    httpStatus: res.status,
                });
            }
        } catch (e: any) {
            httpHandler({
                error: e,
                httpStatus: e?.response?.status,
                dispatch: dispatch,
                currentLang: lang,
                navigateCallback: navigationCallback,
                notificationApi: notificationApi!,
            });
        } finally {
            dispatch(ApplicationActionCreator.setLoading(false));
        }
    },
}
