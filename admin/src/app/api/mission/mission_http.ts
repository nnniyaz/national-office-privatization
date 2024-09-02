import {AxiosResponse} from "axios";
import {$api, ApiRoutes, ErrorResponse, SuccessResponse} from "../index.ts";
import {Mission as MissionModel} from "../../../domain/mission/mission.ts";

export interface MissionCreateReq {
    "mission": string
}

export interface MissionUpdateReq {
    "id": string
    "mission": string
}

export class Mission {
    static async getMission(): Promise<AxiosResponse<SuccessResponse<MissionModel> | ErrorResponse>> {
        return $api.get(ApiRoutes.GET_MISSION)
    }

    static async createMission(request: MissionCreateReq): Promise<AxiosResponse<SuccessResponse<null> | ErrorResponse>> {
        return $api.post(ApiRoutes.POST_CREATE_MISSION, request)
    }

    static async updateMission(request: MissionUpdateReq): Promise<AxiosResponse<SuccessResponse<null> | ErrorResponse>> {
        return $api.put(ApiRoutes.PUT_UPDATE_MISSION, request)
    }
}
