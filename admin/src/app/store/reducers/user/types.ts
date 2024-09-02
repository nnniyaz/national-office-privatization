import {User} from "../../../../domain/user/user.ts";

export interface UserState {
    users: User[];
    user: User | null;
    isLoading: boolean;
    error: string | null;
}

export enum UserActionEnum {
    SET_USERS = "SET_USERS",
    SET_USER = "SET_USER",
    SET_LOADING_USERS = "SET_LOADING_USERS",
    SET_ERROR_USERS = "SET_ERROR_USERS",
}

export interface SetUsersAction {
    type: UserActionEnum.SET_USERS;
    payload: User[];
}

export interface SetUserAction {
    type: UserActionEnum.SET_USER;
    payload: User | null;
}

export interface SetLoadingAction {
    type: UserActionEnum.SET_LOADING_USERS;
    payload: boolean;
}

export interface SetErrorAction {
    type: UserActionEnum.SET_ERROR_USERS;
    payload: string | null;
}

export type UserAction = SetUsersAction | SetUserAction | SetLoadingAction | SetErrorAction;
