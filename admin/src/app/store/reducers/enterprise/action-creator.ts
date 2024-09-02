import {
    EnterpriseActionEnum,
    SetEnterprisesAction,
    SetEnterpriseAction,
    SetLoadingAction,
    SetErrorAction,
} from './types';
import {Enterprise as EnterpriseService, EnterpriseCreateReq, EnterpriseUpdateReq} from "../../../api/enterprise/enterprise_http.ts";
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

    getEnterprises: (controller: AbortController) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {lang} = getState().system;
        try {
            dispatch(EnterpriseActionCreator.setLoading(true));
            const res = await EnterpriseService.getEnterprises(controller);
            if (res.data.success) {
                dispatch(EnterpriseActionCreator.setEnterprises(res.data.data?.enterprises))
            } else {
                dispatch(EnterpriseActionCreator.setError(res.data.messages[0]))
                FailedResponseHandler({
                    messages: res.data?.messages,
                    httpStatus: res.status,
                });
            }
        } catch (e: any) {
            httpHandler({
                error: e,
                httpStatus: e?.response?.status,
                dispatch: dispatch,
                currentLang: lang,
            });
        } finally {
            dispatch(EnterpriseActionCreator.setLoading(false));
        }
    },

    getOneEnterpriseById: (enterpriseId: string, navigationCallback: NavigateCallback) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {lang} = getState().system;
        try {
            dispatch(EnterpriseActionCreator.setLoading(true));
            const res = await EnterpriseService.getOneEnterpriseById(enterpriseId);
            if (res.data.success) {
                dispatch(EnterpriseActionCreator.setEnterprise(res.data.data))
            } else {
                dispatch(EnterpriseActionCreator.setError(res.data.messages[0]))
                FailedResponseHandler({
                    messages: res.data?.messages,
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
                    messages: res.data?.messages,
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
                    messages: res.data?.messages,
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
                    messages: res.data?.messages,
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
            });
        } finally {
            dispatch(EnterpriseActionCreator.setLoading(false));
        }
    },
}
