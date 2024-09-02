import {ContactsAction, ContactsActionEnum, ContactsState} from "./types.ts";

const initialState: ContactsState = {
    contacts: null,
    isLoading: false,
    error: null,
};

export default function contactsReducer(state = initialState, action: ContactsAction): ContactsState {
    switch (action.type) {
        case ContactsActionEnum.SET_CONTACTS:
            return {...state, contacts: action.payload};
        case ContactsActionEnum.SET_LOADING_CONTACTS:
            return {...state, isLoading: action.payload};
        case ContactsActionEnum.SET_ERROR_CONTACTS:
            return {...state, error: action.payload};
        default:
            return state;
    }
};
