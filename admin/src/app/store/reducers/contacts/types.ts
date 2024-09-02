import {Contacts} from "../../../../domain/contacts/contacts.ts";

export interface ContactsState {
    contacts: Contacts | null;
    isLoading: boolean;
    error: string | null;
}

export enum ContactsActionEnum {
    SET_CONTACTS = "SET_CONTACTS",
    SET_LOADING_CONTACTS = "SET_LOADING_CONTACTS",
    SET_ERROR_CONTACTS = "SET_ERROR_CONTACTS",
}

export interface SetContactsAction {
    type: ContactsActionEnum.SET_CONTACTS;
    payload: Contacts;
}

export interface SetLoadingAction {
    type: ContactsActionEnum.SET_LOADING_CONTACTS;
    payload: boolean;
}

export interface SetErrorAction {
    type: ContactsActionEnum.SET_ERROR_CONTACTS;
    payload: string | null;
}

export type ContactsAction =
    SetContactsAction
    | SetLoadingAction
    | SetErrorAction;
