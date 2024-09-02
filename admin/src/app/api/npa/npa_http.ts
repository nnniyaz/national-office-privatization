import {AxiosResponse} from "axios";
import {$api, ApiRoutes, ErrorResponse, SuccessResponse} from "../index.ts";
import {Npa as NpaModel, NpaData} from "../../../domain/npa/npa.ts";

export interface NpaCreateReq {
    "title": string
    "filename": string
}

export interface NpaUpdateReq {
    "id": string
    "title": string
    "filename": string
}

export class Npa {
    static async getNpas(controller: AbortController): Promise<AxiosResponse<SuccessResponse<NpaData> | ErrorResponse>> {
        return $api.get(ApiRoutes.GET_ALL_NPAS, {signal: controller.signal})
    }

    static async getOneNpaById(npaId: string): Promise<AxiosResponse<SuccessResponse<NpaModel> | ErrorResponse>> {
        return $api.get(ApiRoutes.GET_ONE_NPA_BY_ID.replace(":npa_id", npaId))
    }

    static async createNpa(request: NpaCreateReq): Promise<AxiosResponse<SuccessResponse<null> | ErrorResponse>> {
        return $api.post(ApiRoutes.POST_CREATE_NPA, request)
    }

    static async updateNpa(request: NpaUpdateReq): Promise<AxiosResponse<SuccessResponse<null> | ErrorResponse>> {
        return $api.put(ApiRoutes.PUT_UPDATE_NPA, request)
    }

    static async deleteNpa(npaId: string): Promise<AxiosResponse<SuccessResponse<null> | ErrorResponse>> {
        return $api.delete(ApiRoutes.DELETE_NPA.replace(":npa_id", npaId))
    }
}
