import { Partner } from '../../../../domain/partner/partner.ts';

export interface PartnerState {
    partners: Partner[];
    partner: Partner | null;
    isLoading: boolean;
    error: string | null;
}

export enum PartnerActionEnum {
    SET_PARTNERS = "SET_PARTNERS",
    SET_PARTNER = "SET_PARTNER",
    SET_LOADING_PARTNERS = "SET_LOADING_PARTNERS",
    SET_ERROR_PARTNERS = "SET_ERROR_PARTNERS",
}

export interface SetPartnersAction {
    type: PartnerActionEnum.SET_PARTNERS;
    payload: Partner[];
}

export interface SetPartnerAction {
    type: PartnerActionEnum.SET_PARTNER;
    payload: Partner | null;
}

export interface SetLoadingAction {
    type: PartnerActionEnum.SET_LOADING_PARTNERS;
    payload: boolean;
}

export interface SetErrorAction {
    type: PartnerActionEnum.SET_ERROR_PARTNERS;
    payload: string | null;
}

export type PartnerAction = SetPartnersAction | SetPartnerAction | SetLoadingAction | SetErrorAction;
