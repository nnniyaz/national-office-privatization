import axios from "axios";

const validateStatus = (status: number) => {
    return (status >= 200 && status < 401) || (status > 401 && status !== 403 && status !== 404 && status < 500);
}

export const $api = axios.create({
    baseURL: import.meta.env.VITE_API_URL + '/api' || '',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Time-Zone': Intl.DateTimeFormat().resolvedOptions().timeZone
    },
    timeout: 120000,
    timeoutErrorMessage: 'Timeout error',
    validateStatus: validateStatus
});

export const $apiFormData = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '',
    withCredentials: true,
    headers: {
        'Content-Type': 'multipart/form-data',
        'Time-Zone': Intl.DateTimeFormat().resolvedOptions().timeZone
    },
    timeout: 120000,
    timeoutErrorMessage: 'Timeout error',
    validateStatus: validateStatus
});

export interface ErrorResponse {
    success: false;
    messages: string[];
}

export interface SuccessResponse<T> {
    success: true;
    messages: string[];
    data: T;
}

export enum ApiRoutes {
    // Auth
    GET_CURRENT_USER = '/auth/me',
    POST_LOGIN = '/auth/login',
    POST_LOGOUT = '/auth/logout',

    // User
    GET_ALL_USERS = "/users",
    GET_ONE_USER_BY_ID = "/users/:user_id",
    GET_ONE_USER_BY_LOGIN = "/users/login",
    POST_CREATE_USER = "/users",
    PUT_UPDATE_USER = "/users",
    PUT_UPDATE_USER_PASSWORD = "/users/password",
    DELETE_USER = "/users/:user_id",
    RECOVER_USER = "/users/:user_id",

    // Contacts
    GET_CONTACTS = "/contacts",
    POST_CREATE_CONTACTS = "/contacts",
    PUT_UPDATE_CONTACTS = "/contacts",

    // Mission
    GET_MISSION = "/mission",
    POST_CREATE_MISSION = "/mission",
    PUT_UPDATE_MISSION = "/mission",

    // Employee
    GET_ALL_EMPLOYEES = "/employee",
    GET_ONE_EMPLOYEE_BY_ID = "/employee/:employee_id",
    POST_CREATE_EMPLOYEE = "/employee",
    PUT_UPDATE_EMPLOYEE = "/employee",
    DELETE_EMPLOYEE = "/employee/:employee_id",

    // Partner
    GET_ALL_PARTNERS = "/partner",
    GET_ONE_PARTNER_BY_ID = "/partner/:partner_id",
    POST_CREATE_PARTNER = "/partner",
    PUT_UPDATE_PARTNER = "/partner",
    DELETE_PARTNER = "/partner/:partner_id",

    // Document
    GET_ALL_DOCUMENTS = "/document",
    GET_ONE_DOCUMENT_BY_ID = "/document/:document_id",
    POST_CREATE_DOCUMENT = "/document",
    PUT_UPDATE_DOCUMENT = "/document",
    DELETE_DOCUMENT = "/document/:document_id",

    // News
    GET_ALL_NEWS = "/news",
    GET_ONE_NEWS_BY_ID = "/news/:news_id",
    POST_CREATE_NEWS = "/news",
    PUT_UPDATE_NEWS = "/news",
    DELETE_NEWS = "/news/:news_id",

    // Enterprise
    GET_ALL_ENTERPRISES = "/enterprise",
    GET_ONE_ENTERPRISE_BY_ID = "/enterprise/:enterprise_id",
    POST_CREATE_ENTERPRISE = "/enterprise",
    PUT_UPDATE_ENTERPRISE = "/enterprise",
    DELETE_ENTERPRISE = "/enterprise/:enterprise_id",

    // NPA
    GET_ALL_NPAS = "/npa",
    GET_ONE_NPA_BY_ID = "/npa/:npa_id",
    POST_CREATE_NPA = "/npa",
    PUT_UPDATE_NPA = "/npa",
    DELETE_NPA = "/npa/:npa_id",

    // Event
    GET_ALL_EVENTS = "/event",
    GET_ONE_EVENT_BY_ID = "/event/:event_id",
    POST_CREATE_EVENT = "/event",
    PUT_UPDATE_EVENT = "/event",
    DELETE_EVENT = "/event/:event_id",

    // Application
    GET_ALL_APPLICATIONS = "/application",
    GET_ONE_APPLICATION_BY_ID = "/application/:application_id",
    POST_CREATE_APPLICATION = "/application",
    PUT_UPDATE_APPLICATION = "/application",
    DELETE_APPLICATION = "/application/:application_id",

    // Upload
    UPLOAD_DOCUMENT = "/upload/document",
    UPLOAD_NPA = "/upload/npa",
    UPLOAD_NEWS_IMAGE = "/upload/news-image",
    UPLOAD_EVENT_IMAGE = "/upload/event-image",
    UPLOAD_ENTERPRISE_PASSPORT = "/upload/enterprise-passport",
}
