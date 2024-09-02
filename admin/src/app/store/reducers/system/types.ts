import {Langs} from "../../../../domain/base/mlString.ts";
import {NotificationInstance} from "antd/es/notification/interface";
import {IRoute} from "../../../../pages";

export interface SystemState {
    lang: Langs;
    notificationApi: NotificationInstance | null;
    breadcrumbs: IRoute[];
}

export enum SystemActionEnum {
    SET_LANG = "SET_LANG",
    SET_NOTIFICATION_API = "SET_NOTIFICATION_API",
    SET_BREADCRUMBS = "SET_BREADCRUMBS",
}

export interface SetLangAction {
    type: SystemActionEnum.SET_LANG;
    payload: Langs;
}

export interface SetNotificationApiAction {
    type: SystemActionEnum.SET_NOTIFICATION_API;
    payload: NotificationInstance | null;
}

export interface SetBreadcrumbsAction {
    type: SystemActionEnum.SET_BREADCRUMBS;
    payload: IRoute[];
}

export type SystemAction = SetLangAction | SetNotificationApiAction | SetBreadcrumbsAction;
