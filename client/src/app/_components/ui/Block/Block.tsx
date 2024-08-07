import React from "react";
import classes from "./Block.module.scss";

interface Block {
    title?: string;
    children: React.ReactNode
}

export default function Block({title, children}: Block) {
    return (
        <section className={classes.block}>
            {!!title && <h3 className={classes.block__title}>{title}</h3>}
            <div className={classes.block__content}>{children}</div>
        </section>
    )
}
