import {AxiosResponse} from "axios";
import {$api, ApiRoutes, ErrorResponse, SuccessResponse} from "../index.ts";
import {Contacts as ContactsModel} from "../../../domain/contacts/contacts.ts";

export interface CreateContactsReq {
    "primaryContact": string
    "primaryContactPerson": string
    "secondaryContact": string
    "secondaryContactPerson": string
    "email": string
}

export interface UpdateContactsReq {
    "id": string
    "primaryContact": string
    "primaryContactPerson": string
    "secondaryContact": string
    "secondaryContactPerson": string
    "email": string
}

export class Contacts {
    static async getContacts(): Promise<AxiosResponse<SuccessResponse<ContactsModel> | ErrorResponse>> {
        return $api.get(ApiRoutes.GET_CONTACTS)
    }

    static async createContacts(request: CreateContactsReq): Promise<AxiosResponse<SuccessResponse<null> | ErrorResponse>> {
        return $api.post(ApiRoutes.POST_CREATE_CONTACTS, request)
    }

    static async updateContacts(request: UpdateContactsReq): Promise<AxiosResponse<SuccessResponse<null> | ErrorResponse>> {
        return $api.put(ApiRoutes.PUT_UPDATE_CONTACTS, request)
    }
}
