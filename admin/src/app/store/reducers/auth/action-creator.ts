import {
    SetAuthAction,
    SetLoadingAction,
    SetLoadingCurrentUserAction,
    SetErrorAction,
    SetUserAction,
    AuthActionEnum,
} from "./types.ts";
import {Auth as AuthService, LoginRequest} from "../../../api/auth/auth_http.ts";
import {AppDispatch, RootState} from "../../index.ts";
import {FailedResponseHandler, httpHandler} from "../../../../shared/http-handler/httpHandler.ts";
import {User} from "../../../../domain/user/user.ts";
import {NavigateCallback} from "../../../../domain/base/navigateCallback.ts";
import {RouteNames} from "../../../../pages";
import {txts} from "../../../../shared/core/i18ngen.ts";

export const AuthActionCreator = {
    setAuth: (payload: boolean): SetAuthAction => ({
        type: AuthActionEnum.SET_AUTH,
        payload
    }),
    setError: (payload: string | null): SetErrorAction => ({
        type: AuthActionEnum.SET_ERROR,
        payload
    }),
    setLoading: (payload: boolean): SetLoadingAction => ({
        type: AuthActionEnum.SET_LOADING_AUTH,
        payload
    }),
    setLoadingCurrentUser: (payload: boolean): SetLoadingCurrentUserAction => ({
        type: AuthActionEnum.SET_LOADING_CURRENT_USER,
        payload
    }),
    setUser: (payload: User | null): SetUserAction => ({
        type: AuthActionEnum.SET_USER_AUTH,
        payload
    }),

    getCurrentUser: () => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {lang, notificationApi} = getState().system;
        try {
            dispatch(AuthActionCreator.setLoadingCurrentUser(true));
            const res = await AuthService.getCurrentUser();
            if (res.data.success) {
                dispatch(AuthActionCreator.setUser(res.data.data));
                dispatch(AuthActionCreator.setAuth(true));
            } else {
                FailedResponseHandler({
                    httpStatus: res.status,
                    notificationApi: notificationApi!,
                });
            }
        } catch (e: any) {
            httpHandler({
                error: e,
                httpStatus: e?.response?.status,
                dispatch: dispatch,
                currentLang: lang,
                hideNotify: true,
                notificationApi: notificationApi!,
            });
        } finally {
            dispatch(AuthActionCreator.setLoadingCurrentUser(false));
        }
    },

    login: (request: LoginRequest, navigationCallback: NavigateCallback) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {lang, notificationApi} = getState().system;
        try {
            dispatch(AuthActionCreator.setLoading(true));
            const res = await AuthService.login(request);
            if (res.data.success) {
                await AuthActionCreator.getCurrentUser()(dispatch, getState);
                navigationCallback.navigate(RouteNames.APPLICATIONS);
                dispatch(AuthActionCreator.setError(null));
                notificationApi?.success({
                    message: txts.authorization[lang],
                    description: txts.successfully_logged_in[lang]
                });
            } else {
                dispatch(AuthActionCreator.setError(res.data?.messages[0]));
                FailedResponseHandler({
                    title: txts.authorization[lang],
                    message: txts.invalid_login_or_password[lang],
                    httpStatus: res.status,
                    notificationApi: notificationApi!,
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
            dispatch(AuthActionCreator.setLoading(false));
        }
    },

    logout: (navigationCallback: NavigateCallback) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {lang, notificationApi} = getState().system;
        try {
            dispatch(AuthActionCreator.setLoading(true));
            const res = await AuthService.logout();
            if (res.data.success) {
                dispatch(AuthActionCreator.setAuth(false));
                dispatch(AuthActionCreator.setUser(null));
                navigationCallback.navigate(RouteNames.LOGIN);
                notificationApi?.success({
                    message: txts.logout[lang],
                    description: txts.successfully_logged_out[lang]
                });
            } else {
                FailedResponseHandler({
                    title: txts.logout[lang],
                    message: txts.error_occurred[lang],
                    httpStatus: res.status,
                    notificationApi: notificationApi!,
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
            dispatch(AuthActionCreator.setLoading(false));
        }
    }
}
