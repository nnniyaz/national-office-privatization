import {
    NpaActionEnum,
    SetNpasAction,
    SetNpaAction,
    SetLoadingAction,
    SetErrorAction,
} from './types';
import {Npa as NpaService, NpaCreateReq, NpaUpdateReq} from "../../../api/npa/npa_http.ts";
import {AppDispatch, RootState} from "../../index.ts";
import {httpHandler, FailedResponseHandler} from "../../../../shared/http-handler/httpHandler.ts";
import {NavigateCallback} from "../../../../domain/base/navigateCallback.ts";
import {Npa} from "../../../../domain/npa/npa.ts";
import {Notify} from "../../../../shared/notification/notification.ts";
import {translate} from "../../../../shared/translate/translate.ts";
import {RouteNames} from "../../../../pages";

export const NpaActionCreator = {
    setNpas: (payload: Npa[]): SetNpasAction => ({
        type: NpaActionEnum.SET_NPAS,
        payload
    }),
    setNpa: (payload: Npa | null): SetNpaAction => ({
        type: NpaActionEnum.SET_NPA,
        payload
    }),
    setLoading: (payload: boolean): SetLoadingAction => ({
        type: NpaActionEnum.SET_LOADING_NPAS,
        payload
    }),
    setError: (payload: string | null): SetErrorAction => ({
        type: NpaActionEnum.SET_ERROR_NPAS,
        payload
    }),

    getNpas: (controller: AbortController) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {lang} = getState().system;
        try {
            dispatch(NpaActionCreator.setLoading(true));
            const res = await NpaService.getNpas(controller);
            if (res.data.success) {
                dispatch(NpaActionCreator.setNpas(res.data.data?.npas));
            } else {
                dispatch(NpaActionCreator.setError(res.data.messages[0]))
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
            dispatch(NpaActionCreator.setLoading(false));
        }
    },

    getOneNpaById: (npaId: string, navigationCallback: NavigateCallback) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {lang} = getState().system;
        try {
            dispatch(NpaActionCreator.setLoading(true));
            const res = await NpaService.getOneNpaById(npaId);
            if (res.data.success) {
                dispatch(NpaActionCreator.setNpa(res.data.data))
            } else {
                dispatch(NpaActionCreator.setError(res.data.messages[0]))
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
            dispatch(NpaActionCreator.setLoading(false));
        }
    },

    createNpa: (request: NpaCreateReq, navigationCallback: NavigateCallback) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {lang, notificationApi} = getState().system;
        try {
            dispatch(NpaActionCreator.setLoading(true));
            const res = await NpaService.createNpa(request);
            if (res.data.success) {
                Notify.Success({
                    title: translate("npa_module", lang),
                    message: translate("npa_created_successfully", lang),
                    notificationApi: notificationApi!
                });
                navigationCallback.navigate(RouteNames.NPA);
            } else {
                dispatch(NpaActionCreator.setError(res.data.messages[0]))
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
            dispatch(NpaActionCreator.setLoading(false));
        }
    },

    updateNpa: (request: NpaUpdateReq, npaId: string, navigationCallback: NavigateCallback) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {lang, notificationApi} = getState().system;
        try {
            dispatch(NpaActionCreator.setLoading(true));
            const res = await NpaService.updateNpa(request);
            if (res.data.success) {
                Notify.Success({
                    title: translate("npa_module", lang),
                    message: translate("npa_updated_successfully", lang),
                    notificationApi: notificationApi!
                });
                await NpaActionCreator.getOneNpaById(npaId, navigationCallback)(dispatch, getState);
            } else {
                dispatch(NpaActionCreator.setError(res.data.messages[0]))
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
            dispatch(NpaActionCreator.setLoading(false));
        }
    },

    deleteNpa: (npaId: string, navigationCallback: NavigateCallback) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {lang, notificationApi} = getState().system;
        try {
            dispatch(NpaActionCreator.setLoading(true));
            const res = await NpaService.deleteNpa(npaId);
            if (res.data.success) {
                Notify.Success({
                    title: translate("npa_module", lang),
                    message: translate("npa_deleted_successfully", lang),
                    notificationApi: notificationApi!
                });
                navigationCallback.navigate(RouteNames.NPA);
            } else {
                dispatch(NpaActionCreator.setError(res.data.messages[0]))
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
            dispatch(NpaActionCreator.setLoading(false));
        }
    },
}
