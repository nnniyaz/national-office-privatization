import {AxiosResponse} from "axios";
import {$api, ApiRoutes, ErrorResponse, SuccessResponse} from "../index.ts";
import {News as NewsModel, NewsData} from "../../../domain/news/news.ts";

export interface NewsCreateReq {
    "title": string
    "content": string
    "imgUrl": string
}

export interface NewsUpdateReq {
    "id": string
    "title": string
    "content": string
    "imgUrl": string
}

export class News {
    static async getNews(controller: AbortController): Promise<AxiosResponse<SuccessResponse<NewsData> | ErrorResponse>> {
        return $api.get(ApiRoutes.GET_ALL_NEWS, {signal: controller.signal})
    }

    static async getOneNewsById(newsId: string): Promise<AxiosResponse<SuccessResponse<NewsModel> | ErrorResponse>> {
        return $api.get(ApiRoutes.GET_ONE_NEWS_BY_ID.replace(":news_id", newsId))
    }

    static async createNews(request: NewsCreateReq): Promise<AxiosResponse<SuccessResponse<null> | ErrorResponse>> {
        return $api.post(ApiRoutes.POST_CREATE_NEWS, request)
    }

    static async updateNews(request: NewsUpdateReq): Promise<AxiosResponse<SuccessResponse<null> | ErrorResponse>> {
        return $api.put(ApiRoutes.PUT_UPDATE_NEWS, request)
    }

    static async deleteNews(newsId: string): Promise<AxiosResponse<SuccessResponse<null> | ErrorResponse>> {
        return $api.delete(ApiRoutes.DELETE_NEWS.replace(":news_id", newsId))
    }
}
