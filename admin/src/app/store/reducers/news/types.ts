import { News } from '../../../../domain/news/news.ts';

export interface NewsState {
    newsList: News[];
    news: News | null;
    isLoading: boolean;
    error: string | null;
}

export enum NewsActionEnum {
    SET_NEWS_LIST = "SET_NEWS_LIST",
    SET_NEWS = "SET_NEWS",
    SET_LOADING_NEWS = "SET_LOADING_NEWS",
    SET_ERROR_NEWS = "SET_ERROR_NEWS",
}

export interface SetNewsListAction {
    type: NewsActionEnum.SET_NEWS_LIST;
    payload: News[];
}

export interface SetNewsAction {
    type: NewsActionEnum.SET_NEWS;
    payload: News | null;
}

export interface SetLoadingAction {
    type: NewsActionEnum.SET_LOADING_NEWS;
    payload: boolean;
}

export interface SetErrorAction {
    type: NewsActionEnum.SET_ERROR_NEWS;
    payload: string | null;
}

export type NewsAction = SetNewsListAction | SetNewsAction | SetLoadingAction | SetErrorAction;
