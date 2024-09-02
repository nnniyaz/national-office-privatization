import {NewsAction, NewsActionEnum, NewsState} from "./types.ts";

const initialState: NewsState = {
    newsList: [],
    news: null,
    isLoading: false,
    error: null,
};

export default function newsReducer(state = initialState, action: NewsAction): NewsState {
    switch (action.type) {
        case NewsActionEnum.SET_NEWS_LIST:
            return {...state, newsList: action.payload};
        case NewsActionEnum.SET_NEWS:
            return {...state, news: action.payload};
        case NewsActionEnum.SET_LOADING_NEWS:
            return {...state, isLoading: action.payload};
        case NewsActionEnum.SET_ERROR_NEWS:
            return {...state, error: action.payload};
        default:
            return state;
    }
}
