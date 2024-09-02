import {AxiosResponse} from "axios";
import {$api, ApiRoutes, ErrorResponse, SuccessResponse} from "../index.ts";
import {Document as DocumentModel, DocumentData} from "../../../domain/document/document.ts";

export interface DocumentCreateReq {
    "title": string
    "filename": string
}

export interface DocumentUpdateReq {
    "id": string
    "title": string
    "filename": string
}

export class Document {
    static async getDocuments(controller: AbortController): Promise<AxiosResponse<SuccessResponse<DocumentData> | ErrorResponse>> {
        return $api.get(ApiRoutes.GET_ALL_DOCUMENTS, {signal: controller.signal})
    }

    static async getOneDocumentById(documentId: string): Promise<AxiosResponse<SuccessResponse<DocumentModel> | ErrorResponse>> {
        return $api.get(ApiRoutes.GET_ONE_DOCUMENT_BY_ID.replace(":document_id", documentId))
    }

    static async createDocument(request: DocumentCreateReq): Promise<AxiosResponse<SuccessResponse<null> | ErrorResponse>> {
        return $api.post(ApiRoutes.POST_CREATE_DOCUMENT, request)
    }

    static async updateDocument(request: DocumentUpdateReq): Promise<AxiosResponse<SuccessResponse<null> | ErrorResponse>> {
        return $api.put(ApiRoutes.PUT_UPDATE_DOCUMENT, request)
    }

    static async deleteDocument(documentId: string): Promise<AxiosResponse<SuccessResponse<null> | ErrorResponse>> {
        return $api.delete(ApiRoutes.DELETE_DOCUMENT.replace(":document_id", documentId))
    }
}
