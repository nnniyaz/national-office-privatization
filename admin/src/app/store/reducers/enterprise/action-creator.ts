import {
    EnterpriseActionEnum,
    SetEnterprisesAction,
    SetEnterpriseAction,
    SetLoadingAction,
    SetErrorAction,
    SetCountAction,
} from './types';
import {
    Enterprise as EnterpriseService,
    EnterpriseCreateReq,
    EnterpriseUpdateReq, Pagination
} from "../../../api/enterprise/enterprise_http.ts";
import {AppDispatch, RootState} from "../../index.ts";
import {httpHandler, FailedResponseHandler} from "../../../../shared/http-handler/httpHandler.ts";
import {NavigateCallback} from "../../../../domain/base/navigateCallback.ts";
import {Enterprise} from "../../../../domain/enterprise/enterprise.ts";
import {RouteNames} from "../../../../pages";
import {Notify} from "../../../../shared/notification/notification.ts";
import {translate} from "../../../../shared/translate/translate.ts";

export const EnterpriseActionCreator = {
    setEnterprises: (payload: Enterprise[]): SetEnterprisesAction => ({
        type: EnterpriseActionEnum.SET_ENTERPRISES,
        payload
    }),
    setCount: (payload: number): SetCountAction => ({
        type: EnterpriseActionEnum.SET_COUNT,
        payload
    }),
    setEnterprise: (payload: Enterprise | null): SetEnterpriseAction => ({
        type: EnterpriseActionEnum.SET_ENTERPRISE,
        payload
    }),
    setLoading: (payload: boolean): SetLoadingAction => ({
        type: EnterpriseActionEnum.SET_LOADING_ENTERPRISES,
        payload
    }),
    setError: (payload: string | null): SetErrorAction => ({
        type: EnterpriseActionEnum.SET_ERROR_ENTERPRISES,
        payload
    }),

    getEnterprises: (controller: AbortController, pagination: Pagination) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {lang, notificationApi} = getState().system;
        try {
            dispatch(EnterpriseActionCreator.setLoading(true));
            const res = await EnterpriseService.getEnterprises(controller, pagination);
            if (res.data.success) {
                dispatch(EnterpriseActionCreator.setEnterprises(res.data.data?.enterprises))
                dispatch(EnterpriseActionCreator.setCount(res.data.data?.count))
            } else {
                dispatch(EnterpriseActionCreator.setError(res.data.messages[0]))
                FailedResponseHandler({
                    notificationApi: notificationApi!,
                    title: translate("enterprise_module", lang),
                    message: translate("failed_to_fetch_enterprises", lang),
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
            dispatch(EnterpriseActionCreator.setLoading(false));
        }
    },

    getOneEnterpriseById: (enterpriseId: string, navigationCallback: NavigateCallback) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {lang, notificationApi} = getState().system;
        try {
            dispatch(EnterpriseActionCreator.setLoading(true));
            const res = await EnterpriseService.getOneEnterpriseById(enterpriseId);
            if (res.data.success) {
                dispatch(EnterpriseActionCreator.setEnterprise(res.data.data))
            } else {
                dispatch(EnterpriseActionCreator.setError(res.data.messages[0]))
                FailedResponseHandler({
                    notificationApi: notificationApi!,
                    title: translate("enterprise_module", lang),
                    message: translate("failed_to_fetch_enterprise", lang),
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
            dispatch(EnterpriseActionCreator.setLoading(false));
        }
    },

    createEnterprise: (request: EnterpriseCreateReq, navigationCallback: NavigateCallback) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {lang, notificationApi} = getState().system;
        try {
            dispatch(EnterpriseActionCreator.setLoading(true));
            const res = await EnterpriseService.createEnterprise(request);
            if (res.data.success) {
                Notify.Success({
                    title: translate("enterprise_module", lang),
                    message: translate("enterprise_created_successfully", lang),
                    notificationApi: notificationApi!
                });
                navigationCallback.navigate(RouteNames.ENTERPRISE);
            } else {
                dispatch(EnterpriseActionCreator.setError(res.data.messages[0]))
                FailedResponseHandler({
                    notificationApi: notificationApi!,
                    title: translate("enterprise_module", lang),
                    message: translate("enterprise_created_failed", lang),
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
            dispatch(EnterpriseActionCreator.setLoading(false));
        }
    },

    updateEnterprise: (request: EnterpriseUpdateReq, enterpriseId: string, navigationCallback: NavigateCallback) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {lang, notificationApi} = getState().system;
        try {
            dispatch(EnterpriseActionCreator.setLoading(true));
            const res = await EnterpriseService.updateEnterprise(request);
            if (res.data.success) {
                Notify.Success({
                    title: translate("enterprise_module", lang),
                    message: translate("enterprise_updated_successfully", lang),
                    notificationApi: notificationApi!
                });
                await EnterpriseActionCreator.getOneEnterpriseById(enterpriseId, navigationCallback)(dispatch, getState);
            } else {
                dispatch(EnterpriseActionCreator.setError(res.data.messages[0]))
                FailedResponseHandler({
                    notificationApi: notificationApi!,
                    title: translate("enterprise_module", lang),
                    message: translate("enterprise_updated_failed", lang),
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
            dispatch(EnterpriseActionCreator.setLoading(false));
        }
    },

    deleteEnterprise: (enterpriseId: string, navigationCallback: NavigateCallback) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {lang, notificationApi} = getState().system;
        try {
            dispatch(EnterpriseActionCreator.setLoading(true));
            const res = await EnterpriseService.deleteEnterprise(enterpriseId);
            if (res.data.success) {
                Notify.Success({
                    title: translate("enterprise_module", lang),
                    message: translate("enterprise_deleted_successfully", lang),
                    notificationApi: notificationApi!
                });
                navigationCallback.navigate(RouteNames.ENTERPRISE);
            } else {
                dispatch(EnterpriseActionCreator.setError(res.data.messages[0]))
                FailedResponseHandler({
                    notificationApi: notificationApi!,
                    title: translate("enterprise_module", lang),
                    message: translate("enterprise_deleted_failed", lang),
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
            dispatch(EnterpriseActionCreator.setLoading(false));
        }
    },
}
