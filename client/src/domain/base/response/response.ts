export interface ErrorResponse {
    success: false;
    messages: string[];
}

export interface SuccessResponse<T> {
    success: true;
    messages: string[];
    data: T;
}
