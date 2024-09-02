import {isEmpty} from "lodash";
import {AppDispatch} from "../../app/store";
import {Langs} from "../../domain/base/mlString.ts";
import {NavigateCallback} from "../../domain/base/navigateCallback.ts";
import {RouteNames} from "../../pages";
import {AuthActionCreator} from "../../app/store/reducers/auth/action-creator.ts";
import {Notify} from "../notification/notification.ts";
import {NotificationInstance} from "antd/es/notification/interface";
import {txts} from "../core/i18ngen.ts";

interface HttpHandlerProps {
    error: any;
    httpStatus: number;
    dispatch: AppDispatch;
    currentLang: Langs;
    navigateCallback?: NavigateCallback;
    hideNotify?: boolean;
    notificationApi?: NotificationInstance;
}

export const httpHandler = (
    {
        error,
        httpStatus,
        dispatch,
        currentLang,
        navigateCallback,
        hideNotify,
        notificationApi
    }: HttpHandlerProps
) => {
    if (httpStatus === 401) {
        dispatch(AuthActionCreator.setAuth(false));
        if (!hideNotify) {
            Notify.Warning({
                title: txts.authorization[currentLang],
                message: txts.session_expired[currentLang],
                notificationApi: notificationApi!
            });
        }
        navigateCallback?.navigate(RouteNames.LOGIN);
    } else if (httpStatus === 403) {
        if (!hideNotify) {
            Notify.Warning({
                title: txts.internal_system[currentLang],
                message: txts.you_dont_have_access[currentLang],
                notificationApi: notificationApi!
            });
        }
    } else if (httpStatus === 404) {
        if (!hideNotify) {
            Notify.Warning({
                title: txts.page_not_found[currentLang],
                message: "",
                notificationApi: notificationApi!
            });
        }
    } else if (httpStatus >= 400 && httpStatus < 500) {
        return;
    } else if (error?.code === "ERR_CANCELED") {
        return;
    } else {
        if (!hideNotify) {
            Notify.Error({
                title: txts.critical_error[currentLang],
                message: txts.please_try_again_or_contact_support[currentLang],
                notificationApi: notificationApi!
            });
        }
        console.log(error)
    }
}

interface FailedResponseHandlerProps {
    messages: string[];
    httpStatus: number;
    hideNotify?: boolean;
    notificationApi?: NotificationInstance;
}

export const FailedResponseHandler = (
    {messages, httpStatus, hideNotify, notificationApi}: FailedResponseHandlerProps
) => {
    if (hideNotify) {
        return;
    }
    if (httpStatus >= 400 && httpStatus < 500 && !isEmpty(messages)) {
        messages.forEach((msg) => {
            Notify.Warning({
                title: msg,
                message: "",
                notificationApi: notificationApi!
            });
        });
    }
}
