import classes from "./Button.module.scss";

interface ButtonProps {
    label: string,
}

export default function Button({label}: ButtonProps) {
    return (
        <button className={classes.btn}>{label}</button>
    )
}
