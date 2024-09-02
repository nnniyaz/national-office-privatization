import {AxiosResponse} from "axios";
import {$api, ApiRoutes, ErrorResponse, SuccessResponse} from "../index.ts";
import {Event as EventModel, EventData} from "../../../domain/event/event.ts";

export interface EventCreateReq {
    "name": string
    "desc": string
    "imgUrl": string
    "plannedAt": string
}

export interface EventUpdateReq {
    "id": string
    "name": string
    "desc": string
    "imgUrl": string
    "plannedAt": string
}

export class Event {
    static async getEvents(controller: AbortController): Promise<AxiosResponse<SuccessResponse<EventData> | ErrorResponse>> {
        return $api.get(ApiRoutes.GET_ALL_EVENTS, {signal: controller.signal})
    }

    static async getOneEventById(eventId: string): Promise<AxiosResponse<SuccessResponse<EventModel> | ErrorResponse>> {
        return $api.get(ApiRoutes.GET_ONE_EVENT_BY_ID.replace(":event_id", eventId))
    }

    static async createEvent(request: EventCreateReq): Promise<AxiosResponse<SuccessResponse<null> | ErrorResponse>> {
        return $api.post(ApiRoutes.POST_CREATE_EVENT, request)
    }

    static async updateEvent(request: EventUpdateReq): Promise<AxiosResponse<SuccessResponse<null> | ErrorResponse>> {
        return $api.put(ApiRoutes.PUT_UPDATE_EVENT, request)
    }

    static async deleteEvent(eventId: string): Promise<AxiosResponse<SuccessResponse<null> | ErrorResponse>> {
        return $api.delete(ApiRoutes.DELETE_EVENT.replace(":event_id", eventId))
    }
}
