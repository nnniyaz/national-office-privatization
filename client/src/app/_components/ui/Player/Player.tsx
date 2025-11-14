'use client'

import {Button, Modal} from "antd";
import classes from "@components/Home/Home.module.scss";
import PlaySVG from "@assets/play.svg";
import {LegacyRef, useRef, useState} from "react";

export default function Player() {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<LegacyRef<HTMLVideoElement> | null>(null);

    const handleOpen = () => {
        setIsOpen(true);
    }

    const handleClose = () => {
        setIsOpen(false);
        if (ref) {
            // @ts-ignore
            ref.current?.pause();
        }
    }

    return (
        <>
            <div
                className={classes.welcome_block__statement__group__player}
                // onClick={handleOpen}
            >
                {/*<img*/}
                {/*    className={classes.welcome_block__statement__group__player__cover}*/}
                {/*    src={"https://www.gov.kz/uploads/2024/6/28/5c5b866ca9b640b71ab5521a702b11ad_1280x720.jpg"}*/}
                {/*    alt={"Video player cover"}*/}
                {/*/>*/}
                <video
                    ref={ref as LegacyRef<HTMLVideoElement> | undefined}
                    controls
                    autoPlay={true}
                    muted={true}
                    style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "10px",
                        objectFit: "cover"
                    }}
                    src={`${process.env.NEXT_PUBLIC_SPACE_HOST}/video/promo.mp4`}
                />
                {/*<div className={classes.welcome_block__statement__group__player__btn__container}>*/}
                {/*    <PlaySVG className={classes.welcome_block__statement__group__player__btn}/>*/}
                {/*</div>*/}
            </div>
            <Modal
                open={isOpen}
                onCancel={handleClose}
                footer={[
                    <Button key={"close"} onClick={handleClose}>
                        Закрыть
                    </Button>,
                ]}
            >
                <video
                    ref={ref as LegacyRef<HTMLVideoElement> | undefined}
                    controls
                    style={{
                        width: "100%",
                        margin: "30px 0",
                        borderRadius: "10px"
                    }}
                    src={`${process.env.NEXT_PUBLIC_SPACE_HOST}/video/promo.mp4`}
                />
            </Modal>
        </>
    )
}
