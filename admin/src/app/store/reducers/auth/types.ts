import {User} from "../../../../domain/user/user.ts";

export interface AuthState {
    isAuth: boolean;
    isLoading: boolean;
    error: string | null;
    user: User | null;
}

export enum AuthActionEnum {
    SET_AUTH = "SET_AUTH",
    SET_ERROR = "SET_ERROR",
    SET_LOADING_AUTH = "SET_LOADING_AUTH",
    SET_USER_AUTH = "SET_USER_AUTH",
}

export interface SetAuthAction {
    type: AuthActionEnum.SET_AUTH;
    payload: boolean;
}

export interface SetErrorAction {
    type: AuthActionEnum.SET_ERROR;
    payload: string | null;
}

export interface SetLoadingAction {
    type: AuthActionEnum.SET_LOADING_AUTH;
    payload: boolean;
}

export interface SetUserAction {
    type: AuthActionEnum.SET_USER_AUTH;
    payload: User | null;
}

export type AuthAction = SetAuthAction | SetErrorAction | SetLoadingAction | SetUserAction;
