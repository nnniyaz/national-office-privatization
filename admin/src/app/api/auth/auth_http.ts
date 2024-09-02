import {AxiosResponse} from "axios";
import {$api, ApiRoutes, ErrorResponse, SuccessResponse} from "../index.ts";
import {User} from "../../../domain/user/user.ts";

export interface LoginRequest {
    "login": string
    "password": string
}

export class Auth {
    static async getCurrentUser(): Promise<AxiosResponse<SuccessResponse<User> | ErrorResponse>> {
        return $api.get(ApiRoutes.GET_CURRENT_USER)
    }

    static async login(request: LoginRequest): Promise<AxiosResponse<SuccessResponse<null> | ErrorResponse>> {
        return $api.post(ApiRoutes.POST_LOGIN, request)
    }

    static async logout(): Promise<AxiosResponse<SuccessResponse<null> | ErrorResponse>> {
        return $api.post(ApiRoutes.POST_LOGOUT)
    }
}
