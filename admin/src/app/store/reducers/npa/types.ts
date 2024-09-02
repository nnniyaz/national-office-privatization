import { Npa } from '../../../../domain/npa/npa.ts';

export interface NpaState {
    npas: Npa[];
    npa: Npa | null;
    isLoading: boolean;
    error: string | null;
}

export enum NpaActionEnum {
    SET_NPAS = "SET_NPAS",
    SET_NPA = "SET_NPA",
    SET_LOADING_NPAS = "SET_LOADING_NPAS",
    SET_ERROR_NPAS = "SET_ERROR_NPAS",
}

export interface SetNpasAction {
    type: NpaActionEnum.SET_NPAS;
    payload: Npa[];
}

export interface SetNpaAction {
    type: NpaActionEnum.SET_NPA;
    payload: Npa | null;
}

export interface SetLoadingAction {
    type: NpaActionEnum.SET_LOADING_NPAS;
    payload: boolean;
}

export interface SetErrorAction {
    type: NpaActionEnum.SET_ERROR_NPAS;
    payload: string | null;
}

export type NpaAction = SetNpasAction | SetNpaAction | SetLoadingAction | SetErrorAction;
