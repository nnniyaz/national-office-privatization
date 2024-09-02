import {AxiosResponse} from "axios";
import {$api, ApiRoutes, ErrorResponse, SuccessResponse} from "../index.ts";
import {Application as ApplicationModel, ApplicationData} from "../../../domain/application/application.ts";

export interface ApplicationCreateReq {
    "enterpriseId": string
    "fio": string
    "bin": string
    "contact": string
    "message": string
}

export interface ApplicationUpdateReq {
    "id": string
    "enterpriseId": string
    "fio": string
    "bin": string
    "contact": string
    "message": string
}

export class Application {
    static async getApplications(controller: AbortController): Promise<AxiosResponse<SuccessResponse<ApplicationData> | ErrorResponse>> {
        return $api.get(ApiRoutes.GET_ALL_APPLICATIONS, {signal: controller.signal})
    }

    static async getOneApplicationById(applicationId: string): Promise<AxiosResponse<SuccessResponse<ApplicationModel> | ErrorResponse>> {
        return $api.get(ApiRoutes.GET_ONE_APPLICATION_BY_ID.replace(":application_id", applicationId))
    }

    static async createApplication(request: ApplicationCreateReq): Promise<AxiosResponse<SuccessResponse<null> | ErrorResponse>> {
        return $api.post(ApiRoutes.POST_CREATE_APPLICATION, request)
    }

    static async updateApplication(request: ApplicationUpdateReq): Promise<AxiosResponse<SuccessResponse<null> | ErrorResponse>> {
        return $api.put(ApiRoutes.PUT_UPDATE_APPLICATION, request)
    }

    static async deleteApplication(applicationId: string): Promise<AxiosResponse<SuccessResponse<null> | ErrorResponse>> {
        return $api.delete(ApiRoutes.DELETE_APPLICATION.replace(":application_id", applicationId))
    }
}
