import {ReactNode} from "react";
import classes from "./FormSection.module.scss";

type Props = {
    index?: number;          // порядковый номер секции: 1 -> «01»
    title: string;
    hint?: string;           // пояснение справа от заголовка
    children: ReactNode;
};

export default function FormSection({index, title, hint, children}: Props) {
    return (
        <section className={classes.section}>
            <div className={classes.head}>
                {index !== undefined && (
                    <span className={classes.head__index}>{String(index).padStart(2, "0")}</span>
                )}
                <h2 className={classes.head__title}>{title}</h2>
                {hint && <span className={classes.head__hint}>{hint}</span>}
            </div>
            <div className={classes.content}>{children}</div>
        </section>
    );
}
