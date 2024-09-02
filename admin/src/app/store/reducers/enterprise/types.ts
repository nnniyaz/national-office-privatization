import { Enterprise } from '../../../../domain/enterprise/enterprise.ts';

export interface EnterpriseState {
    enterprises: Enterprise[];
    enterprise: Enterprise | null;
    isLoading: boolean;
    error: string | null;
}

export enum EnterpriseActionEnum {
    SET_ENTERPRISES = "SET_ENTERPRISES",
    SET_ENTERPRISE = "SET_ENTERPRISE",
    SET_LOADING_ENTERPRISES = "SET_LOADING_ENTERPRISES",
    SET_ERROR_ENTERPRISES = "SET_ERROR_ENTERPRISES",
}

export interface SetEnterprisesAction {
    type: EnterpriseActionEnum.SET_ENTERPRISES;
    payload: Enterprise[];
}

export interface SetEnterpriseAction {
    type: EnterpriseActionEnum.SET_ENTERPRISE;
    payload: Enterprise | null;
}

export interface SetLoadingAction {
    type: EnterpriseActionEnum.SET_LOADING_ENTERPRISES;
    payload: boolean;
}

export interface SetErrorAction {
    type: EnterpriseActionEnum.SET_ERROR_ENTERPRISES;
    payload: string | null;
}

export type EnterpriseAction = SetEnterprisesAction | SetEnterpriseAction | SetLoadingAction | SetErrorAction;
