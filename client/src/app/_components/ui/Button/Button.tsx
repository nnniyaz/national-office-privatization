import classes from "./Button.module.scss";

interface ButtonProps {
    label: string,
    onClick?: (arg: any) => void
}

export default function Button({label, onClick}: ButtonProps) {
    return (
        <button className={classes.btn} onClick={onClick}>{label}</button>
    )
}
