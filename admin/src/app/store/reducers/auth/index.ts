import {AuthAction, AuthActionEnum, AuthState} from "./types.ts";

const initialState: AuthState = {
    isAuth: false,
    isLoading: false,
    error: null,
    user: null,
};

export default function authReducer(state = initialState, action: AuthAction): AuthState {
    switch (action.type) {
        case AuthActionEnum.SET_AUTH:
            return {...state, isAuth: action.payload};
        case AuthActionEnum.SET_ERROR:
            return {...state, error: action.payload};
        case AuthActionEnum.SET_LOADING_AUTH:
            return {...state, isLoading: action.payload};
        case AuthActionEnum.SET_USER_AUTH:
            return {...state, user: action.payload};
        default:
            return state;
    }
}
