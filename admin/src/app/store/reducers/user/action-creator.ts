import {SetErrorAction, SetLoadingAction, SetUserAction, SetUsersAction, UserActionEnum,} from "./types.ts";
import {User} from "../../../../domain/user/user.ts";
import {
    CreateUserRequest,
    UpdateUserPasswordRequest,
    UpdateUserRequest,
    User as UserService
} from "../../../api/user/user_http.ts";
import {AppDispatch, RootState} from "../../index.ts";
import {FailedResponseHandler, httpHandler} from "../../../../shared/http-handler/httpHandler.ts";
import {NavigateCallback} from "../../../../domain/base/navigateCallback.ts";
import {RouteNames} from "../../../../pages";
import {translate} from "../../../../shared/translate/translate.ts";
import {Notify} from "../../../../shared/notification/notification.ts";

export const UserActionCreator = {
    setUsers: (payload: User[]): SetUsersAction => ({
        type: UserActionEnum.SET_USERS, payload
    }),
    setUser: (payload: User | null): SetUserAction => ({
        type: UserActionEnum.SET_USER, payload
    }),
    setLoading: (payload: boolean): SetLoadingAction => ({
        type: UserActionEnum.SET_LOADING_USERS, payload
    }),
    setError: (payload: string | null): SetErrorAction => ({
        type: UserActionEnum.SET_ERROR_USERS, payload
    }),

    getUsers: (controller: AbortController) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {lang, notificationApi} = getState().system;
        try {
            dispatch(UserActionCreator.setLoading(true));
            const res = await UserService.getUsers(controller);
            if (res.data.success) {
                dispatch(UserActionCreator.setUsers(res.data.data?.users || []));
            } else {
                dispatch(UserActionCreator.setError(res.data.messages[0]));
                FailedResponseHandler({
                    messages: res.data?.messages,
                    httpStatus: res.status,
                    notificationApi: notificationApi!
                });
            }
        } catch (e: any) {
            httpHandler({
                error: e,
                httpStatus: e?.response?.status,
                dispatch: dispatch,
                currentLang: lang,
                notificationApi: notificationApi!
            });
        } finally {
            dispatch(UserActionCreator.setLoading(false));
        }
    },

    getOneUserById: (userId: string, navigationCallback: NavigateCallback) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {lang, notificationApi} = getState().system;
        try {
            dispatch(UserActionCreator.setLoading(true));
            const res = await UserService.getOneUserById(userId);
            if (res.data.success) {
                dispatch(UserActionCreator.setUser(res.data.data));
            } else {
                dispatch(UserActionCreator.setError(res.data.messages[0]));
                FailedResponseHandler({
                    messages: res.data?.messages,
                    httpStatus: res.status,
                    notificationApi: notificationApi!
                });
            }
        } catch (e: any) {
            httpHandler({
                error: e,
                httpStatus: e?.response?.status,
                dispatch: dispatch,
                currentLang: lang,
                navigateCallback: navigationCallback,
                notificationApi: notificationApi!
            });
        } finally {
            dispatch(UserActionCreator.setLoading(false));
        }
    },

    getOneUserByLogin: (login: string, navigationCallback: NavigateCallback) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {lang, notificationApi} = getState().system;
        try {
            dispatch(UserActionCreator.setLoading(true));
            const res = await UserService.getOneUserByLogin({login: login});
            if (res.data.success) {
                dispatch(UserActionCreator.setUser(res.data.data));
            } else {
                dispatch(UserActionCreator.setError(res.data.messages[0]));
                FailedResponseHandler({
                    messages: res.data?.messages,
                    httpStatus: res.status,
                    notificationApi: notificationApi!
                });
            }
        } catch (e: any) {
            httpHandler({
                error: e,
                httpStatus: e?.response?.status,
                dispatch: dispatch,
                currentLang: lang,
                navigateCallback: navigationCallback,
                notificationApi: notificationApi!
            });
        } finally {
            dispatch(UserActionCreator.setLoading(false));
        }
    },

    createUser: (request: CreateUserRequest, navigationCallback: NavigateCallback) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {lang, notificationApi} = getState().system;
        try {
            dispatch(UserActionCreator.setLoading(true));
            const res = await UserService.createUser(request);
            if (res.data.success) {
                Notify.Success({
                    title: translate("user_module", lang),
                    message: translate("user_created_successfully", lang),
                    notificationApi: notificationApi!
                });
                navigationCallback.navigate(RouteNames.USERS);
            } else {
                dispatch(UserActionCreator.setError(res.data.messages[0]));
                FailedResponseHandler({
                    messages: res.data?.messages,
                    httpStatus: res.status,
                    notificationApi: notificationApi!
                });
            }
        } catch (e: any) {
            httpHandler({
                error: e,
                httpStatus: e?.response?.status,
                dispatch: dispatch,
                currentLang: lang,
                navigateCallback: navigationCallback,
                notificationApi: notificationApi!
            });
        } finally {
            dispatch(UserActionCreator.setLoading(false));
        }
    },

    updateUser: (request: UpdateUserRequest, userId: string, navigationCallback: NavigateCallback) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {lang, notificationApi} = getState().system;
        try {
            dispatch(UserActionCreator.setLoading(true));
            const res = await UserService.updateUser(request);
            if (res.data.success) {
                Notify.Success({
                    title: translate("user_module", lang),
                    message: translate("user_updated_successfully", lang),
                    notificationApi: notificationApi!
                });
                await UserActionCreator.getOneUserById(userId, navigationCallback)(dispatch, getState);
            } else {
                dispatch(UserActionCreator.setError(res.data.messages[0]));
                FailedResponseHandler({
                    messages: res.data?.messages,
                    httpStatus: res.status,
                    notificationApi: notificationApi!
                });
            }
        } catch (e: any) {
            httpHandler({
                error: e,
                httpStatus: e?.response?.status,
                dispatch: dispatch,
                currentLang: lang,
                navigateCallback: navigationCallback,
                notificationApi: notificationApi!
            });
        } finally {
            dispatch(UserActionCreator.setLoading(false));
        }
    },

    updateUserPassword: (request: UpdateUserPasswordRequest, userId: string, navigationCallback: NavigateCallback) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {lang, notificationApi} = getState().system;
        try {
            dispatch(UserActionCreator.setLoading(true));
            const res = await UserService.updateUserPassword(request);
            if (res.data.success) {
                Notify.Success({
                    title: translate("user_module", lang),
                    message: translate("user_password_updated_successfully", lang),
                    notificationApi: notificationApi!
                });
                await UserActionCreator.getOneUserById(userId, navigationCallback)(dispatch, getState);
            } else {
                dispatch(UserActionCreator.setError(res.data.messages[0]));
                FailedResponseHandler({
                    messages: res.data?.messages,
                    httpStatus: res.status,
                    notificationApi: notificationApi!
                });
            }
        } catch (e: any) {
            httpHandler({
                error: e,
                httpStatus: e?.response?.status,
                dispatch: dispatch,
                currentLang: lang,
                navigateCallback: navigationCallback,
                notificationApi: notificationApi!
            });
        } finally {
            dispatch(UserActionCreator.setLoading(false));
        }
    },

    deleteUser: (userId: string, navigationCallback: NavigateCallback) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {lang, notificationApi} = getState().system;
        try {
            dispatch(UserActionCreator.setLoading(true));
            const res = await UserService.deleteUser(userId);
            if (res.data.success) {
                await UserActionCreator.getOneUserById(userId, navigationCallback)(dispatch, getState);
                Notify.Success({
                    title: translate("user_module", lang),
                    message: translate("user_deleted_successfully", lang),
                    notificationApi: notificationApi!
                });
            } else {
                dispatch(UserActionCreator.setError(res.data.messages[0]));
                FailedResponseHandler({
                    messages: res.data?.messages,
                    httpStatus: res.status,
                    notificationApi: notificationApi!
                });
            }
        } catch (e: any) {
            httpHandler({
                error: e,
                httpStatus: e?.response?.status,
                dispatch: dispatch,
                currentLang: lang,
                navigateCallback: navigationCallback,
                notificationApi: notificationApi!
            });
        } finally {
            dispatch(UserActionCreator.setLoading(false));
        }
    },

    recoverUser: (userId: string, navigationCallback: NavigateCallback) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {lang, notificationApi} = getState().system;
        try {
            dispatch(UserActionCreator.setLoading(true));
            const res = await UserService.recoverUser(userId);
            if (res.data.success) {
                Notify.Success({
                    title: translate("user_module", lang),
                    message: translate("user_recovered_successfully", lang),
                    notificationApi: notificationApi!
                });
                await UserActionCreator.getOneUserById(userId, navigationCallback)(dispatch, getState);
            } else {
                dispatch(UserActionCreator.setError(res.data.messages[0]));
                FailedResponseHandler({
                    messages: res.data?.messages,
                    httpStatus: res.status,
                    notificationApi: notificationApi!
                });
            }
        } catch (e: any) {
            httpHandler({
                error: e,
                httpStatus: e?.response?.status,
                dispatch: dispatch,
                currentLang: lang,
                navigateCallback: navigationCallback,
                notificationApi: notificationApi!
            });
        } finally {
            dispatch(UserActionCreator.setLoading(false));
        }
    },
}
