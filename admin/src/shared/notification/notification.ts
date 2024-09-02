import {NotificationInstance} from "antd/es/notification/interface";

export interface Notification {
    title: string;
    message?: string;
    notificationApi: NotificationInstance;
}

export class Notify {
    public static Info = ({title, message, notificationApi} : Notification) => {
        notificationApi.info({message: title, description: message});
    };

    public static Success = ({title, message, notificationApi} : Notification) => {
        notificationApi.success({message: title, description: message});
    };

    public static Warning = ({title, message, notificationApi} : Notification) => {
        notificationApi.warning({message: title, description: message});
    };

    public static Error = ({title, message, notificationApi} : Notification) => {
        notificationApi.error({message: title, description: message});
    };
}
