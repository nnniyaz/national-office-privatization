'use client';

import {useEffect, useState} from "react";
import classes from "../../Home/Home.module.scss";

export default function MissionBlock() {
    const [missionText, setMissionText] = useState<string>('');

    useEffect(() => {
        const fetchMission = async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/mission`);
            const data = await res.json();
            if (data.success) {
                setMissionText(data.data.text);
            }
        }
        fetchMission();
    }, []);

    return (
        <p
            className={classes.mission__group__text}
            dangerouslySetInnerHTML={{__html: missionText.replace(/(\r\n|\r|\n)/g, '<br>')}}
        />
    )
}
