import {AxiosResponse} from "axios";
import {$api, ApiRoutes, ErrorResponse, SuccessResponse} from "../index.ts";
import {Partner as PartnerModel, PartnerData} from "../../../domain/partner/partner.ts";

export interface PartnerCreateReq {
    "name": string
    "link": string
}

export interface PartnerUpdateReq {
    "id": string
    "name": string
    "link": string
}

export class Partner {
    static async getPartners(controller: AbortController): Promise<AxiosResponse<SuccessResponse<PartnerData> | ErrorResponse>> {
        return $api.get(ApiRoutes.GET_ALL_PARTNERS, {signal: controller.signal});
    }

    static async getOnePartnerById(partnerId: string): Promise<AxiosResponse<SuccessResponse<PartnerModel> | ErrorResponse>> {
        return $api.get(ApiRoutes.GET_ONE_PARTNER_BY_ID.replace(":partner_id", partnerId))
    }

    static async createPartner(request: PartnerCreateReq): Promise<AxiosResponse<SuccessResponse<null> | ErrorResponse>> {
        return $api.post(ApiRoutes.POST_CREATE_PARTNER, request)
    }

    static async updatePartner(request: PartnerUpdateReq): Promise<AxiosResponse<SuccessResponse<null> | ErrorResponse>> {
        return $api.put(ApiRoutes.PUT_UPDATE_PARTNER, request)
    }

    static async deletePartner(partnerId: string): Promise<AxiosResponse<SuccessResponse<null> | ErrorResponse>> {
        return $api.delete(ApiRoutes.DELETE_PARTNER.replace(":partner_id", partnerId))
    }
}
