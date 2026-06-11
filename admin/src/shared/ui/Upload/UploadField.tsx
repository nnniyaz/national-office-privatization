import {Button} from "antd";
import {Upload} from "./Upload.tsx";
import {useTypedSelector} from "../../hooks/useTypedSelector.ts";
import {txts} from "../../core/i18ngen.ts";

// Однодетный контрол для Form.Item (value/onChange инжектятся antd):
// хранит имя загруженного файла, рендерит кнопку удаления + дропзону.
type Props = {
    value?: string;                       // имя файла (из Form.Item)
    onChange?: (v: string) => void;       // инжектится Form.Item
    onUpload: (file: File) => void;       // загрузка на сервер — у страницы
    preview?: (filename: string) => string; // как построить URL превью; по умолчанию само значение
    isDocument?: boolean;
    uploading?: boolean;
};

export default function UploadField({value, onChange, onUpload, preview, isDocument, uploading}: Props) {
    const {lang} = useTypedSelector(state => state.system);

    return (
        <div>
            {!!value && (
                <Button style={{marginBottom: "20px"}} onClick={() => onChange?.("")}>
                    {txts.remove[lang]}
                </Button>
            )}
            <Upload
                imgSrc={value ? (preview ? preview(value) : value) : ""}
                onUpload={onUpload}
                loading={uploading}
                isDocument={isDocument}
            />
        </div>
    );
}
