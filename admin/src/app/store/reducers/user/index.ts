import {UserAction, UserActionEnum, UserState} from "./types.ts";

const initialState: UserState = {
    users: [],
    user: null,
    isLoading: false,
    error: null,
};

export default function userReducer(state = initialState, action: UserAction): UserState {
    switch (action.type) {
        case UserActionEnum.SET_USERS:
            return {...state, users: action.payload, isLoading: false};
        case UserActionEnum.SET_USER:
            return {...state, user: action.payload, isLoading: false};
        case UserActionEnum.SET_LOADING_USERS:
            return {...state, isLoading: action.payload};
        case UserActionEnum.SET_ERROR_USERS:
            return {...state, error: action.payload, isLoading: false};
        default:
            return state;
    }
};
