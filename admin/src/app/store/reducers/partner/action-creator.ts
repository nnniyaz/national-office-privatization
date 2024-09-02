import {
    PartnerActionEnum,
    SetPartnersAction,
    SetPartnerAction,
    SetLoadingAction,
    SetErrorAction,
} from './types';
import {Partner as PartnerService, PartnerCreateReq, PartnerUpdateReq} from "../../../api/partner/partner_http.ts";
import {AppDispatch, RootState} from "../../index.ts";
import {httpHandler, FailedResponseHandler} from "../../../../shared/http-handler/httpHandler.ts";
import {NavigateCallback} from "../../../../domain/base/navigateCallback.ts";
import {Partner} from "../../../../domain/partner/partner.ts";
import {RouteNames} from "../../../../pages";
import {Notify} from "../../../../shared/notification/notification.ts";
import {translate} from "../../../../shared/translate/translate.ts";

export const PartnerActionCreator = {
    setPartners: (payload: Partner[]): SetPartnersAction => ({
        type: PartnerActionEnum.SET_PARTNERS,
        payload
    }),
    setPartner: (payload: Partner | null): SetPartnerAction => ({
        type: PartnerActionEnum.SET_PARTNER,
        payload
    }),
    setLoading: (payload: boolean): SetLoadingAction => ({
        type: PartnerActionEnum.SET_LOADING_PARTNERS,
        payload
    }),
    setError: (payload: string | null): SetErrorAction => ({
        type: PartnerActionEnum.SET_ERROR_PARTNERS,
        payload
    }),

    getPartners: (controller: AbortController) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {lang} = getState().system;
        try {
            dispatch(PartnerActionCreator.setLoading(true));
            const res = await PartnerService.getPartners(controller);
            if (res.data.success) {
                dispatch(PartnerActionCreator.setPartners(res.data.data?.partners))
            } else {
                dispatch(PartnerActionCreator.setError(res.data.messages[0]))
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
            dispatch(PartnerActionCreator.setLoading(false));
        }
    },

    getOnePartnerById: (partnerId: string, navigationCallback: NavigateCallback) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {lang} = getState().system;
        try {
            dispatch(PartnerActionCreator.setLoading(true));
            const res = await PartnerService.getOnePartnerById(partnerId);
            if (res.data.success) {
                dispatch(PartnerActionCreator.setPartner(res.data.data))
            } else {
                dispatch(PartnerActionCreator.setError(res.data.messages[0]))
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
            dispatch(PartnerActionCreator.setLoading(false));
        }
    },

    createPartner: (request: PartnerCreateReq, navigationCallback: NavigateCallback) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {lang, notificationApi} = getState().system;
        try {
            dispatch(PartnerActionCreator.setLoading(true));
            const res = await PartnerService.createPartner(request);
            if (res.data.success) {
                Notify.Success({
                    title: translate("partner_module", lang),
                    message: translate("partner_created_successfully", lang),
                    notificationApi: notificationApi!
                });
                navigationCallback.navigate(RouteNames.PARTNERS);
            } else {
                dispatch(PartnerActionCreator.setError(res.data.messages[0]))
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
            dispatch(PartnerActionCreator.setLoading(false));
        }
    },

    updatePartner: (request: PartnerUpdateReq, partnerId: string, navigationCallback: NavigateCallback) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {lang, notificationApi} = getState().system;
        try {
            dispatch(PartnerActionCreator.setLoading(true));
            const res = await PartnerService.updatePartner(request);
            if (res.data.success) {
                Notify.Success({
                    title: translate("partner_module", lang),
                    message: translate("partner_updated_successfully", lang),
                    notificationApi: notificationApi!
                });
                await PartnerActionCreator.getOnePartnerById(partnerId, navigationCallback)(dispatch, getState);
            } else {
                dispatch(PartnerActionCreator.setError(res.data.messages[0]))
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
            dispatch(PartnerActionCreator.setLoading(false));
        }
    },

    deletePartner: (partnerId: string, navigationCallback: NavigateCallback) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {lang, notificationApi} = getState().system;
        try {
            dispatch(PartnerActionCreator.setLoading(true));
            const res = await PartnerService.deletePartner(partnerId);
            if (res.data.success) {
                Notify.Success({
                    title: translate("partner_module", lang),
                    message: translate("partner_deleted_successfully", lang),
                    notificationApi: notificationApi!
                });
                navigationCallback.navigate(RouteNames.PARTNERS);
            } else {
                dispatch(PartnerActionCreator.setError(res.data.messages[0]))
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
            dispatch(PartnerActionCreator.setLoading(false));
        }
    },
}
