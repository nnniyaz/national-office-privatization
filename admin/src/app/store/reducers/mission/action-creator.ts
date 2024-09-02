import {
    MissionActionEnum,
    SetMissionAction,
    SetLoadingAction,
    SetErrorAction,
} from './types';
import {Mission as MissionService, MissionCreateReq, MissionUpdateReq} from "../../../api/mission/mission_http.ts";
import {AppDispatch, RootState} from "../../index.ts";
import {httpHandler, FailedResponseHandler} from "../../../../shared/http-handler/httpHandler.ts";
import {NavigateCallback} from "../../../../domain/base/navigateCallback.ts";
import {Mission} from "../../../../domain/mission/mission.ts";
import {Notify} from "../../../../shared/notification/notification.ts";
import {translate} from "../../../../shared/translate/translate.ts";
import {RouteNames} from "../../../../pages";

export const MissionActionCreator = {
    setMission: (payload: Mission | null): SetMissionAction => ({
        type: MissionActionEnum.SET_MISSION,
        payload
    }),
    setLoading: (payload: boolean): SetLoadingAction => ({
        type: MissionActionEnum.SET_LOADING_MISSION,
        payload
    }),
    setError: (payload: string | null): SetErrorAction => ({
        type: MissionActionEnum.SET_ERROR_MISSION,
        payload
    }),

    getMission: () => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {lang} = getState().system;
        try {
            dispatch(MissionActionCreator.setLoading(true));
            const res = await MissionService.getMission();
            if (res.data.success) {
                dispatch(MissionActionCreator.setMission(res.data.data))
            } else {
                dispatch(MissionActionCreator.setError(res.data.messages[0]))
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
            dispatch(MissionActionCreator.setLoading(false));
        }
    },

    createMission: (request: MissionCreateReq, navigationCallback: NavigateCallback) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {lang, notificationApi} = getState().system;
        try {
            dispatch(MissionActionCreator.setLoading(true));
            const res = await MissionService.createMission(request);
            if (res.data.success) {
                Notify.Success({
                    title: translate("mission_module", lang),
                    message: translate("mission_created_successfully", lang),
                    notificationApi: notificationApi!
                });
                navigationCallback.navigate(RouteNames.MISSION);
            } else {
                dispatch(MissionActionCreator.setError(res.data.messages[0]))
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
            dispatch(MissionActionCreator.setLoading(false));
        }
    },

    updateMission: (request: MissionUpdateReq, navigationCallback: NavigateCallback) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {lang, notificationApi} = getState().system;
        try {
            dispatch(MissionActionCreator.setLoading(true));
            const res = await MissionService.updateMission(request);
            if (res.data.success) {
                Notify.Success({
                    title: translate("mission_module", lang),
                    message: translate("mission_updated_successfully", lang),
                    notificationApi: notificationApi!
                });
                await MissionActionCreator.getMission()(dispatch, getState);
            } else {
                dispatch(MissionActionCreator.setError(res.data.messages[0]))
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
            dispatch(MissionActionCreator.setLoading(false));
        }
    },
}
