import {AxiosResponse} from "axios";
import {$apiFormData, ApiRoutes, ErrorResponse, SuccessResponse} from "../index.ts";

export interface ImageUploadResponse {
    filename: string;
}

export class Upload {
    static async uploadDocument(formData: FormData): Promise<AxiosResponse<SuccessResponse<ImageUploadResponse> | ErrorResponse>> {
        return $apiFormData.post(ApiRoutes.UPLOAD_DOCUMENT, formData);
    }

    static async uploadNpa(formData: FormData): Promise<AxiosResponse<SuccessResponse<ImageUploadResponse> | ErrorResponse>> {
        return $apiFormData.post(ApiRoutes.UPLOAD_NPA, formData);
    }

    static async uploadNewsImage(formData: FormData): Promise<AxiosResponse<SuccessResponse<ImageUploadResponse> | ErrorResponse>> {
        return $apiFormData.post(ApiRoutes.UPLOAD_NEWS_IMAGE, formData);
    }

    static async uploadEventImage(formData: FormData): Promise<AxiosResponse<SuccessResponse<ImageUploadResponse> | ErrorResponse>> {
        return $apiFormData.post(ApiRoutes.UPLOAD_EVENT_IMAGE, formData);
    }
}
