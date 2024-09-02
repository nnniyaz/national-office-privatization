import {
    SetAuthAction,
    SetLoadingAction,
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
    setUser: (payload: User | null): SetUserAction => ({
        type: AuthActionEnum.SET_USER_AUTH,
        payload
    }),

    getCurrentUser: () => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {lang} = getState().system;
        try {
            dispatch(AuthActionCreator.setLoading(true));
            const res = await AuthService.getCurrentUser();
            if (res.data.success) {
                dispatch(AuthActionCreator.setUser(res.data.data));
                dispatch(AuthActionCreator.setAuth(true));
            } else {
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
            dispatch(AuthActionCreator.setLoading(false));
        }
    },

    login: (request: LoginRequest, navigationCallback: NavigateCallback) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {lang} = getState().system;
        try {
            dispatch(AuthActionCreator.setLoading(true));
            const res = await AuthService.login(request);
            if (res.data.success) {
                await AuthActionCreator.getCurrentUser()(dispatch, getState);
                navigationCallback.navigate(RouteNames.APPLICATIONS);
            } else {
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
            dispatch(AuthActionCreator.setLoading(false));
        }
    },

    logout: (navigationCallback: NavigateCallback) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {lang} = getState().system;
        try {
            dispatch(AuthActionCreator.setLoading(true));
            const res = await AuthService.logout();
            if (res.data.success) {
                dispatch(AuthActionCreator.setAuth(false));
                dispatch(AuthActionCreator.setUser(null));
                navigationCallback.navigate(RouteNames.LOGIN);
            } else {
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
            dispatch(AuthActionCreator.setLoading(false));
        }
    }
}
