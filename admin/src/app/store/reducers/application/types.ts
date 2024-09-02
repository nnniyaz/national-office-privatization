import {Application} from "../../../../domain/application/application.ts";

export interface ApplicationState {
    applications: Application[];
    application: Application | null;
    isLoading: boolean;
    error: string | null;
}

export enum ApplicationActionEnum {
    SET_APPLICATIONS = "SET_APPLICATIONS",
    SET_APPLICATION = "SET_APPLICATION",
    SET_LOADING_APPLICATIONS = "SET_LOADING_APPLICATIONS",
    SET_ERROR_APPLICATIONS = "SET_ERROR_APPLICATIONS",
}

export interface SetApplicationsAction {
    type: ApplicationActionEnum.SET_APPLICATIONS;
    payload: Application[];
}

export interface SetApplicationAction {
    type: ApplicationActionEnum.SET_APPLICATION;
    payload: Application | null;
}

export interface SetLoadingAction {
    type: ApplicationActionEnum.SET_LOADING_APPLICATIONS;
    payload: boolean;
}

export interface SetErrorAction {
    type: ApplicationActionEnum.SET_ERROR_APPLICATIONS;
    payload: string | null;
}

export type ApplicationAction =
    SetApplicationsAction
    | SetApplicationAction
    | SetLoadingAction
    | SetErrorAction;
