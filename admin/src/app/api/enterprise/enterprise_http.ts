import {AxiosResponse} from "axios";
import {$api, ApiRoutes, ErrorResponse, SuccessResponse} from "../index.ts";
import {Enterprise as EnterpriseModel, EnterpriseData} from "../../../domain/enterprise/enterprise.ts";

export interface EnterpriseCreateReq {
    "name": string
    "location"?: string
    "industry"?: string
    "governmentShare"?: number
    "juridicalForm"?: string
    "year"?: number
    "owner"?: string
    "mainActivity"?: string
    "authorizedCapital"?: number
    "authorizedCapitalComment"?: string
    "assets"?: number
    "assetsComment"?: string
    "equity"?: number
    "equityComment"?: string
    "income"?: number
    "incomeComment"?: string
    "netProfit"?: number
    "netProfitComment"?: string
    "numberOfEmployees"?: number
    "numberOfEmployeesComment"?: string
    "totalLiabilities"?: number
    "totalLiabilitiesComment"?: string
    "propertyComplex"?: string
    "additionalInfo"?: string
    "salesRecommendations"?: string
    "implementationForm"?: string
    "salePurpose"?: string
    "keyTerms"?: string
    "additionalTerms"?: string
    "documentUrl"?: string
}

export interface EnterpriseUpdateReq {
    "id": string
    "name": string
    "location"?: string
    "industry"?: string
    "governmentShare"?: number
    "juridicalForm"?: string
    "year"?: number
    "owner"?: string
    "mainActivity"?: string
    "authorizedCapital"?: number
    "authorizedCapitalComment"?: string
    "assets"?: number
    "assetsComment"?: string
    "equity"?: number
    "equityComment"?: string
    "income"?: number
    "incomeComment"?: string
    "netProfit"?: number
    "netProfitComment"?: string
    "numberOfEmployees"?: number
    "numberOfEmployeesComment"?: string
    "totalLiabilities"?: number
    "totalLiabilitiesComment"?: string
    "propertyComplex"?: string
    "additionalInfo"?: string
    "salesRecommendations"?: string
    "implementationForm"?: string
    "salePurpose"?: string
    "keyTerms"?: string
    "additionalTerms"?: string
    "documentUrl"?: string
}

export interface Pagination {
    offset: number
    limit: number
    search?: string
}

export class Enterprise {
    static async getEnterprises(controller: AbortController, pagination: Pagination ): Promise<AxiosResponse<SuccessResponse<EnterpriseData> | ErrorResponse>> {
        return $api.get(ApiRoutes.GET_ALL_ENTERPRISES, {signal: controller.signal, params: pagination})
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
