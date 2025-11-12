'use client';

import {useEffect, useState} from "react";
import {useParams} from "next/navigation";
import classes from "../../Home/Home.module.scss";
import {tPick, type Lang, type MlString} from "@/domain/base/mlString/mlString";
import {translate} from "@/pkg/translate/translate";

export default function MissionBlock() {
    const params = useParams();
    const lang = (params.lang || 'en') as Lang;
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

    console.log(missionText);

    return (
        <p
            className={classes.mission__group__text}
            dangerouslySetInnerHTML={{__html: translate(missionText as MlString, lang).replace(/(\r\n|\r|\n)/g, '<br>')}}
        />
    )
}
