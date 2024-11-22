import {
    EventActionEnum,
    SetEventsAction,
    SetEventAction,
    SetLoadingAction,
    SetErrorAction,
} from './types';
import {Event as EventService, EventCreateReq, EventUpdateReq} from "../../../api/event/event_http.ts";
import {AppDispatch, RootState} from "../../index.ts";
import {httpHandler, FailedResponseHandler} from "../../../../shared/http-handler/httpHandler.ts";
import {NavigateCallback} from "../../../../domain/base/navigateCallback.ts";
import {Event} from "../../../../domain/event/event.ts";
import {translate} from "../../../../shared/translate/translate.ts";
import {Notify} from "../../../../shared/notification/notification.ts";
import {RouteNames} from "../../../../pages";

export const EventActionCreator = {
    setEvents: (payload: Event[]): SetEventsAction => ({
        type: EventActionEnum.SET_EVENTS,
        payload
    }),
    setEvent: (payload: Event | null): SetEventAction => ({
        type: EventActionEnum.SET_EVENT,
        payload
    }),
    setLoading: (payload: boolean): SetLoadingAction => ({
        type: EventActionEnum.SET_LOADING_EVENTS,
        payload
    }),
    setError: (payload: string | null): SetErrorAction => ({
        type: EventActionEnum.SET_ERROR_EVENTS,
        payload
    }),

    getEvents: (controller: AbortController) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {lang, notificationApi} = getState().system;
        try {
            dispatch(EventActionCreator.setLoading(true));
            const res = await EventService.getEvents(controller);
            if (res.data.success) {
                dispatch(EventActionCreator.setEvents(res.data.data?.events))
            } else {
                dispatch(EventActionCreator.setError(res.data.messages[0]))
                FailedResponseHandler({
                    notificationApi: notificationApi!,
                    title: translate("event_module", lang),
                    message: translate("failed_to_fetch_events", lang),
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
            dispatch(EventActionCreator.setLoading(false));
        }
    },

    getOneEventById: (eventId: string, navigationCallback: NavigateCallback) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {lang, notificationApi} = getState().system;
        try {
            dispatch(EventActionCreator.setLoading(true));
            const res = await EventService.getOneEventById(eventId);
            if (res.data.success) {
                dispatch(EventActionCreator.setEvent(res.data.data))
            } else {
                dispatch(EventActionCreator.setError(res.data.messages[0]))
                FailedResponseHandler({
                    notificationApi: notificationApi!,
                    title: translate("event_module", lang),
                    message: translate("failed_to_fetch_event", lang),
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
            dispatch(EventActionCreator.setLoading(false));
        }
    },

    createEvent: (request: EventCreateReq, navigationCallback: NavigateCallback) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {lang, notificationApi} = getState().system;
        try {
            dispatch(EventActionCreator.setLoading(true));
            const res = await EventService.createEvent(request);
            if (res.data.success) {
                Notify.Success({
                    title: translate("event_module", lang),
                    message: translate("event_created_successfully", lang),
                    notificationApi: notificationApi!
                });
                navigationCallback.navigate(RouteNames.EVENTS);
            } else {
                dispatch(EventActionCreator.setError(res.data.messages[0]))
                FailedResponseHandler({
                    notificationApi: notificationApi!,
                    title: translate("event_module", lang),
                    message: translate("failed_to_create_event", lang),
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
            dispatch(EventActionCreator.setLoading(false));
        }
    },

    updateEvent: (request: EventUpdateReq, eventId: string, navigationCallback: NavigateCallback) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {lang, notificationApi} = getState().system;
        try {
            dispatch(EventActionCreator.setLoading(true));
            const res = await EventService.updateEvent(request);
            if (res.data.success) {
                Notify.Success({
                    title: translate("event_module", lang),
                    message: translate("event_updated_successfully", lang),
                    notificationApi: notificationApi!
                });
                await EventActionCreator.getOneEventById(eventId, navigationCallback)(dispatch, getState);
            } else {
                dispatch(EventActionCreator.setError(res.data.messages[0]))
                FailedResponseHandler({
                    notificationApi: notificationApi!,
                    title: translate("event_module", lang),
                    message: translate("failed_to_update_event", lang),
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
            dispatch(EventActionCreator.setLoading(false));
        }
    },

    deleteEvent: (eventId: string, navigationCallback: NavigateCallback) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {lang, notificationApi} = getState().system;
        try {
            dispatch(EventActionCreator.setLoading(true));
            const res = await EventService.deleteEvent(eventId);
            if (res.data.success) {
                Notify.Success({
                    title: translate("event_module", lang),
                    message: translate("event_deleted_successfully", lang),
                    notificationApi: notificationApi!
                });
                navigationCallback.navigate(RouteNames.EVENTS);
            } else {
                dispatch(EventActionCreator.setError(res.data.messages[0]))
                FailedResponseHandler({
                    notificationApi: notificationApi!,
                    title: translate("event_module", lang),
                    message: translate("failed_to_delete_event", lang),
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
            dispatch(EventActionCreator.setLoading(false));
        }
    },
}
