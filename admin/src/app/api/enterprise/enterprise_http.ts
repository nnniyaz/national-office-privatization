import {AxiosResponse} from "axios";
import {$api, ApiRoutes, ErrorResponse, SuccessResponse} from "../index.ts";
import {Enterprise as EnterpriseModel, EnterpriseData} from "../../../domain/enterprise/enterprise.ts";

export interface EnterpriseCreateReq {
    "name": string
    "location": string
    "industry": string
    "governmentShare": number
}

export interface EnterpriseUpdateReq {
    "id": string
    "name": string
    "location": string
    "industry": string
    "governmentShare": number
}

export class Enterprise {
    static async getEnterprises(controller: AbortController): Promise<AxiosResponse<SuccessResponse<EnterpriseData> | ErrorResponse>> {
        return $api.get(ApiRoutes.GET_ALL_ENTERPRISES, {signal: controller.signal})
    }

    static async getOneEnterpriseById(enterpriseId: string): Promise<AxiosResponse<SuccessResponse<EnterpriseModel> | ErrorResponse>> {
        return $api.get(ApiRoutes.GET_ONE_ENTERPRISE_BY_ID.replace(":enterprise_id", enterpriseId))
    }

    static async createEnterprise(request: EnterpriseCreateReq): Promise<AxiosResponse<SuccessResponse<null> | ErrorResponse>> {
        return $api.post(ApiRoutes.POST_CREATE_ENTERPRISE, request)
    }

    static async updateEnterprise(request: EnterpriseUpdateReq): Promise<AxiosResponse<SuccessResponse<null> | ErrorResponse>> {
        return $api.put(ApiRoutes.PUT_UPDATE_ENTERPRISE, request)
    }

    static async deleteEnterprise(enterpriseId: string): Promise<AxiosResponse<SuccessResponse<null> | ErrorResponse>> {
        return $api.delete(ApiRoutes.DELETE_ENTERPRISE.replace(":enterprise_id", enterpriseId))
    }
}
