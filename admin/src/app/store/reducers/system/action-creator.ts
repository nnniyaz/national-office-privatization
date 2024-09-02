import {SetLangAction, SetNotificationApiAction, SetBreadcrumbsAction, SystemActionEnum} from "./types.ts";
import {Langs} from "../../../../domain/base/mlString.ts";
import {NotificationInstance} from "antd/es/notification/interface";
import {IRoute} from "../../../../pages";

export const SystemActionCreator = {
    setLang: (payload: Langs): SetLangAction => ({
        type: SystemActionEnum.SET_LANG,
        payload
    }),
    setNotificationApi: (payload: NotificationInstance | null): SetNotificationApiAction => ({
        type: SystemActionEnum.SET_NOTIFICATION_API,
        payload
    }),
    setBreadcrumbs: (payload: IRoute[]): SetBreadcrumbsAction => ({
        type: SystemActionEnum.SET_BREADCRUMBS,
        payload
    }),
}
