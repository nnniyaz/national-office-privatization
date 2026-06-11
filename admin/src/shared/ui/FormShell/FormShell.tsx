import {ReactNode} from "react";
import {useNavigate} from "react-router-dom";
import {Button, Popconfirm} from "antd";
import {useTypedSelector} from "../../hooks/useTypedSelector.ts";
import {txts} from "../../core/i18ngen.ts";
import classes from "./FormShell.module.scss";

export type FormShellMeta = {
    label: string;
    value: ReactNode;
};

type Props = {
    entityLabel: string;        // надзаголовок раздела: «Новости»
    title: ReactNode;           // заголовок записи
    id?: string;                // UUID записи (страницы Edit)
    meta?: FormShellMeta[];     // создано / обновлено и т.п.
    formId: string;             // id antd-формы — кнопка «Сохранить» сабмитит её из футера
    saving?: boolean;
    onDelete?: () => void;      // если передан — в футере появится «Удалить» с подтверждением
    children: ReactNode;
};

export default function FormShell({entityLabel, title, id, meta, formId, saving = false, onDelete, children}: Props) {
    const navigate = useNavigate();
    const {lang} = useTypedSelector(state => state.system);

    return (
        <div className={classes.shell}>
            <header className={classes.header}>
                <div className={classes.overline}>
                    <span className={classes.overline__label}>{entityLabel}</span>
                    <span className={classes.overline__rule}/>
                </div>
                <h1 className={classes.title}>{title}</h1>
                {(id || (meta && meta.length > 0)) && (
                    <div className={classes.metaRow}>
                        {id && <span className={classes.idChip}>{id}</span>}
                        {meta?.map((m, i) => (
                            <span key={i} className={classes.metaItem}>
                                <span className={classes.metaItem__label}>{m.label}</span>
                                {m.value}
                            </span>
                        ))}
                    </div>
                )}
            </header>

            <div className={classes.body}>{children}</div>

            <footer className={classes.actions}>
                <div className={classes.actions__left}>
                    {onDelete && (
                        <Popconfirm
                            title={txts.confirm_delete_title[lang]}
                            description={txts.confirm_delete_desc[lang]}
                            okText={txts.yes_delete[lang]}
                            cancelText={txts.cancel[lang]}
                            okButtonProps={{danger: true}}
                            onConfirm={onDelete}
                        >
                            <Button danger disabled={saving}>
                                {txts.delete[lang]}
                            </Button>
                        </Popconfirm>
                    )}
                </div>
                <div className={classes.actions__right}>
                    <Button onClick={() => navigate(-1)} disabled={saving}>
                        {txts.cancel[lang]}
                    </Button>
                    <Button
                        type={"primary"}
                        htmlType={"submit"}
                        form={formId}
                        loading={saving}
                        disabled={saving}
                    >
                        {txts.save[lang]}
                    </Button>
                </div>
            </footer>
        </div>
    );
}
