'use client';

import {useEffect, useState} from "react";
import classes from "../../Home/Home.module.scss";
import {type MlString} from "@/domain/base/mlString/mlString";
import {translate} from "@/pkg/translate/translate";
import {useLang} from "@/pkg/lang/useLang";

export default function MissionBlock() {
    const lang = useLang();
    const [missionText, setMissionText] = useState<MlString | null>(null);

    useEffect(() => {
        const fetchMission = async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/mission`);
            const data = await res.json();
            if (data.success && data.data) {
                setMissionText(data.data.text);
            }
        }
        fetchMission();
    }, []);

    return (
        <p
            className={classes.mission__group__text}
            dangerouslySetInnerHTML={{__html: translate(missionText as MlString, lang).replace(/(\r\n|\r|\n)/g, '<br>')}}
        />
    )
}
