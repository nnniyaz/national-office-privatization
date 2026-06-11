import {useRef} from "react";
import {LoadingOutlined, PlusOutlined, FileTextOutlined} from "@ant-design/icons";
import {useTypedSelector} from "../../hooks/useTypedSelector.ts";
import {txts} from "../../core/i18ngen.ts";
import {Notify} from "../../notification/notification.ts";
import classes from "./Upload.module.scss";

const MAX_SIZE_MB = 5;

interface UploadProps {
    onUpload?: (file: File) => void;
    loading?: boolean;
    imgSrc?: string;
    isDocument?: boolean;
}

export const Upload = ({onUpload, loading, imgSrc, isDocument}: UploadProps) => {
    const {lang, notificationApi} = useTypedSelector(state => state.system);
    const ref = useRef<HTMLInputElement>(null);

    const handleClick = () => {
        ref.current?.click();
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > MAX_SIZE_MB * 1024 * 1024) {
                if (notificationApi) {
                    Notify.Warning({
                        title: txts.file_upload[lang],
                        message: txts.file_too_large_5mb[lang],
                        notificationApi,
                    });
                }
            } else if (onUpload) {
                onUpload(file);
            }
        }
        e.target.value = "";
    }

    if (isDocument && !!imgSrc) {
        return (
            <p className={classes.upload__filename}>
                <FileTextOutlined/>
                {imgSrc.length > 50 ? imgSrc.slice(0, 50) + "..." : imgSrc}
            </p>
        )
    }

    return (
        <div className={classes.upload} onClick={handleClick}>
            {loading ? (
                <LoadingOutlined className={classes.upload__icon}/>
            ) : (
                !imgSrc && (
                    <>
                        <PlusOutlined className={classes.upload__icon}/>
                        <p>
                            {isDocument ? txts.upload_document[lang] : txts.upload_image[lang]}
                        </p>
                        <span className={classes.upload__limit}>{`≤ ${MAX_SIZE_MB} MB`}</span>
                    </>
                )
            )}

            {
                !!imgSrc && (
                    <img
                        src={imgSrc}
                        alt={"Uploaded File"}
                        className={classes.upload__img}
                    />
                )
            }

            <input
                type={"file"}
                accept={isDocument ? "application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint,\n" +
                    "text/plain, application/pdf, image/*" : "image/*"}
                style={{display: "none"}}
                multiple={false}
                ref={ref}
                onChange={handleFileChange}
            />
        </div>
    )
}
