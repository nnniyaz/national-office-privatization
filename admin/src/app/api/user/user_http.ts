import {AxiosResponse} from "axios";
import {$api, ApiRoutes, ErrorResponse, SuccessResponse} from "../index.ts";
import {UsersData, User as UserModel} from "../../../domain/user/user.ts";

export interface GetOneUserByLoginRequest {
    "login": string
}

export interface CreateUserRequest {
    "firstName": string
    "lastName": string
    "login": string
    "password": string
    "role": string
}

export interface UpdateUserRequest {
    "id": string
    "firstName": string
    "lastName": string
    "role": string
}

export interface UpdateUserPasswordRequest {
    "id": string
    "password": string
}

export class User {
    static async getUsers(controller: AbortController): Promise<AxiosResponse<SuccessResponse<UsersData> | ErrorResponse>> {
        return $api.get(ApiRoutes.GET_ALL_USERS, {signal: controller.signal})
    }

    static async getOneUserById(userId: string): Promise<AxiosResponse<SuccessResponse<UserModel> | ErrorResponse>> {
        return $api.get(ApiRoutes.GET_ONE_USER_BY_ID.replace(':user_id', userId))
    }

    static async getOneUserByLogin(request: GetOneUserByLoginRequest): Promise<AxiosResponse<SuccessResponse<UserModel> | ErrorResponse>> {
        return $api.post(ApiRoutes.GET_ONE_USER_BY_LOGIN, request)
    }

    static async createUser(request: CreateUserRequest): Promise<AxiosResponse<SuccessResponse<null> | ErrorResponse>> {
        return $api.post(ApiRoutes.POST_CREATE_USER, request)
    }

    static async updateUser(request: UpdateUserRequest): Promise<AxiosResponse<SuccessResponse<null> | ErrorResponse>> {
        return $api.put(ApiRoutes.PUT_UPDATE_USER, request)
    }

    static async updateUserPassword(request: UpdateUserPasswordRequest): Promise<AxiosResponse<SuccessResponse<null> | ErrorResponse>> {
        return $api.put(ApiRoutes.PUT_UPDATE_USER_PASSWORD, request)
    }

    static async deleteUser(userId: string): Promise<AxiosResponse<SuccessResponse<null> | ErrorResponse>> {
        return $api.delete(ApiRoutes.DELETE_USER.replace(":user_id", userId))
    }

    static async recoverUser(userId: string): Promise<AxiosResponse<SuccessResponse<null> | ErrorResponse>> {
        return $api.put(ApiRoutes.RECOVER_USER.replace(":user_id", userId))
    }
}
