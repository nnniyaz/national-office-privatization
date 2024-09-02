import {
    SetContactsAction,
    SetLoadingAction,
    SetErrorAction,
    ContactsActionEnum
} from "./types.ts";
import {Contacts} from "../../../../domain/contacts/contacts.ts";
import {
    Contacts as ContactsService,
    CreateContactsReq,
    UpdateContactsReq
} from "../../../../app/api/contacts/contacts_http.ts";
import {AppDispatch, RootState} from "../../index.ts";
import {FailedResponseHandler, httpHandler} from "../../../../shared/http-handler/httpHandler.ts";
import {NavigateCallback} from "../../../../domain/base/navigateCallback.ts";
import {Notify} from "../../../../shared/notification/notification.ts";
import {translate} from "../../../../shared/translate/translate.ts";
import {RouteNames} from "../../../../pages";

export const ContactsActionCreator = {
    setContacts: (payload: Contacts): SetContactsAction => ({
        type: ContactsActionEnum.SET_CONTACTS,
        payload
    }),
    setLoading: (payload: boolean): SetLoadingAction => ({
        type: ContactsActionEnum.SET_LOADING_CONTACTS,
        payload
    }),
    setError: (payload: string | null): SetErrorAction => ({
        type: ContactsActionEnum.SET_ERROR_CONTACTS,
        payload
    }),

    getContacts: () => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {lang} = getState().system;
        try {
            dispatch(ContactsActionCreator.setLoading(true));
            const res = await ContactsService.getContacts();
            if (res.data.success) {
                dispatch(ContactsActionCreator.setContacts(res.data.data))
            } else {
                dispatch(ContactsActionCreator.setError(res.data.messages[0]))
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
            dispatch(ContactsActionCreator.setLoading(false));
        }
    },

    createContacts: (request: CreateContactsReq, navigationCallback: NavigateCallback) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {lang, notificationApi} = getState().system;
        try {
            dispatch(ContactsActionCreator.setLoading(true));
            const res = await ContactsService.createContacts(request);
            if (res.data.success) {
                Notify.Success({
                    title: translate("contacts_module", lang),
                    message: translate("contacts_created_successfully", lang),
                    notificationApi: notificationApi!
                });
                navigationCallback.navigate(RouteNames.CONTACTS);
            } else {
                dispatch(ContactsActionCreator.setError(res.data.messages[0]))
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
            dispatch(ContactsActionCreator.setLoading(false));
        }
    },

    updateContacts: (request: UpdateContactsReq, navigationCallback: NavigateCallback) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {lang, notificationApi} = getState().system;
        try {
            dispatch(ContactsActionCreator.setLoading(true));
            const res = await ContactsService.updateContacts(request);
            if (res.data.success) {
                Notify.Success({
                    title: translate("contacts_module", lang),
                    message: translate("contacts_updated_successfully", lang),
                    notificationApi: notificationApi!
                });
            } else {
                dispatch(ContactsActionCreator.setError(res.data.messages[0]))
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
            dispatch(ContactsActionCreator.setLoading(false));
        }
    },
}
