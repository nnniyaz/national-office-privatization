import {
    NewsActionEnum,
    SetNewsListAction,
    SetNewsAction,
    SetLoadingAction,
    SetErrorAction,
} from './types';
import {News as NewsService, NewsCreateReq, NewsUpdateReq} from "../../../api/news/news_http.ts";
import {AppDispatch, RootState} from "../../index.ts";
import {httpHandler, FailedResponseHandler} from "../../../../shared/http-handler/httpHandler.ts";
import {NavigateCallback} from "../../../../domain/base/navigateCallback.ts";
import {News} from "../../../../domain/news/news.ts";
import {Notify} from "../../../../shared/notification/notification.ts";
import {translate} from "../../../../shared/translate/translate.ts";
import {RouteNames} from "../../../../pages";

export const NewsActionCreator = {
    setNewsList: (payload: News[]): SetNewsListAction => ({
        type: NewsActionEnum.SET_NEWS_LIST,
        payload
    }),
    setNews: (payload: News | null): SetNewsAction => ({
        type: NewsActionEnum.SET_NEWS,
        payload
    }),
    setLoading: (payload: boolean): SetLoadingAction => ({
        type: NewsActionEnum.SET_LOADING_NEWS,
        payload
    }),
    setError: (payload: string | null): SetErrorAction => ({
        type: NewsActionEnum.SET_ERROR_NEWS,
        payload
    }),

    getNews: (controller: AbortController) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {lang} = getState().system;
        try {
            dispatch(NewsActionCreator.setLoading(true));
            const res = await NewsService.getNews(controller);
            if (res.data.success) {
                dispatch(NewsActionCreator.setNewsList(res.data.data?.news))
            } else {
                dispatch(NewsActionCreator.setError(res.data.messages[0]))
                FailedResponseHandler({
                    messages: res.data?.messages,
                    httpStatus: res.status,
                });
            }
        } catch (e: any) {
            httpHandler({
                error: e,
                httpStatus: e?.response?.status,
                dispatch: dispatch,
                currentLang: lang,
            });
        } finally {
            dispatch(NewsActionCreator.setLoading(false));
        }
    },

    getOneNewsById: (newsId: string, navigationCallback: NavigateCallback) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {lang} = getState().system;
        try {
            dispatch(NewsActionCreator.setLoading(true));
            const res = await NewsService.getOneNewsById(newsId);
            if (res.data.success) {
                dispatch(NewsActionCreator.setNews(res.data.data))
            } else {
                dispatch(NewsActionCreator.setError(res.data.messages[0]))
                FailedResponseHandler({
                    messages: res.data?.messages,
                    httpStatus: res.status,
                });
            }
        } catch (e: any) {
            httpHandler({
                error: e,
                httpStatus: e?.response?.status,
                dispatch: dispatch,
                currentLang: lang,
                navigateCallback: navigationCallback,
            });
        } finally {
            dispatch(NewsActionCreator.setLoading(false));
        }
    },

    createNews: (request: NewsCreateReq, navigationCallback: NavigateCallback) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {lang, notificationApi} = getState().system;
        try {
            dispatch(NewsActionCreator.setLoading(true));
            const res = await NewsService.createNews(request);
            if (res.data.success) {
                Notify.Success({
                    title: translate("news_module", lang),
                    message: translate("news_created_successfully", lang),
                    notificationApi: notificationApi!
                });
                navigationCallback.navigate(RouteNames.NEWS);
            } else {
                dispatch(NewsActionCreator.setError(res.data.messages[0]))
                FailedResponseHandler({
                    messages: res.data?.messages,
                    httpStatus: res.status,
                });
            }
        } catch (e: any) {
            httpHandler({
                error: e,
                httpStatus: e?.response?.status,
                dispatch: dispatch,
                currentLang: lang,
                navigateCallback: navigationCallback,
            });
        } finally {
            dispatch(NewsActionCreator.setLoading(false));
        }
    },

    updateNews: (request: NewsUpdateReq, newsId: string, navigationCallback: NavigateCallback) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {lang, notificationApi} = getState().system;
        try {
            dispatch(NewsActionCreator.setLoading(true));
            const res = await NewsService.updateNews(request);
            if (res.data.success) {
                Notify.Success({
                    title: translate("news_module", lang),
                    message: translate("news_updated_successfully", lang),
                    notificationApi: notificationApi!
                });
                await NewsActionCreator.getOneNewsById(newsId, navigationCallback)(dispatch, getState);
            } else {
                dispatch(NewsActionCreator.setError(res.data.messages[0]))
                FailedResponseHandler({
                    messages: res.data?.messages,
                    httpStatus: res.status,
                });
            }
        } catch (e: any) {
            httpHandler({
                error: e,
                httpStatus: e?.response?.status,
                dispatch: dispatch,
                currentLang: lang,
                navigateCallback: navigationCallback,
            });
        } finally {
            dispatch(NewsActionCreator.setLoading(false));
        }
    },

    deleteNews: (newsId: string, navigationCallback: NavigateCallback) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {lang, notificationApi} = getState().system;
        try {
            dispatch(NewsActionCreator.setLoading(true));
            const res = await NewsService.deleteNews(newsId);
            if (res.data.success) {
                Notify.Success({
                    title: translate("news_module", lang),
                    message: translate("news_deleted_successfully", lang),
                    notificationApi: notificationApi!
                });
                navigationCallback.navigate(RouteNames.NEWS);
            } else {
                dispatch(NewsActionCreator.setError(res.data.messages[0]))
                FailedResponseHandler({
                    messages: res.data?.messages,
                    httpStatus: res.status,
                });
            }
        } catch (e: any) {
            httpHandler({
                error: e,
                httpStatus: e?.response?.status,
                dispatch: dispatch,
                currentLang: lang,
                navigateCallback: navigationCallback,
            });
        } finally {
            dispatch(NewsActionCreator.setLoading(false));
        }
    },
}
