'use client'

import React, {useEffect, useState} from "react";
import Map from "@components/ui/Map/Map";
import DocSVG from "@assets/document-text.svg";
import {Langs} from "@domain/base/mlString/mlString";
import classes from "./About.module.scss";
import {translate} from "@/pkg/translate/translate";
import {Partner, PartnerData} from "@domain/partner/partner";
import {ErrorResponse, SuccessResponse} from "@domain/base/response/response";
import {Contacts} from "@domain/contacts/contacts";
import {Npa, NpaData} from "@domain/npa/npa";
import {Employee, EmployeeData} from "@domain/employee/employee";

export default function About({lang}: { lang: Langs }) {
    const [isMounted, setMounted] = useState(false);
    const [currentTab, setCurrentTab] = useState("office");
    const [currentSubTab, setCurrentSubTab] = useState("1");
    const sideTabs: { [key: string]: string } = {
        "office": translate("about_office", lang),
        "team": translate("team", lang),
        "npa": translate("npa", lang),
        "contacts": translate("contacts", lang),
    }

    const [missionText, setMissionText] = useState<string>('');
    const [contacts, setContacts] = useState<Contacts>({} as Contacts);
    const [employee, setEmployee] = useState<Employee[]>([]);
    const [npa, setNpa] = useState<Npa[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (currentTab !== "office") {
            return;
        }
        const fetchMission = async () => {
            setLoading(true);
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/mission`);
            const data = await res.json();
            if (data.success) {
                setMissionText(data.data.text);
            }
            setLoading(false);
        }
        fetchMission();
    }, [currentTab]);

    useEffect(() => {
        if (currentTab !== "contacts") {
            return;
        }
        const fetchContacts = async () => {
            setLoading(true);
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contacts`);
            const data = await res.json();
            if (data.success) {
                setContacts(data.data)
            }
            setLoading(false);
        }
        fetchContacts();
    }, [currentTab]);

    useEffect(() => {
        if (currentTab !== "team") {
            return;
        }
        const fetchEmployee = async () => {
            setLoading(true);
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/employee`);
            const data = await res.json();
            if (data.success) {
                setEmployee(data.data.employees || [])
            }
            setLoading(false);
        }
        fetchEmployee();
    }, [currentTab]);

    useEffect(() => {
        if (currentTab !== "npa") {
            return;
        }
        const fetchNpa = async () => {
            setLoading(true);
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/npa`);
            const data = await res.json();
            if (data.success) {
                setNpa(data.data.npas || [])
            }
            setLoading(false);
        }
        fetchNpa();
    }, [currentTab]);

    useEffect(() => {
        if (isMounted) {
            setCurrentTab(window?.location?.hash?.replace("#", "") || "office");
        } else {
            setMounted(true);
        }
    }, [isMounted])

    return (
        <div className={classes.main}>
            <h2 className={classes.title}>
                {translate("about_us", lang)}
            </h2>
            <div className={classes.container}>
                <div className={classes.sidebar}>
                    {
                        Object.keys(sideTabs).map(key => (
                            <a
                                key={key}
                                className={currentTab === key ? classes.sidebar__item__active : classes.sidebar__item}
                                href={`#${key}`}
                                onClick={() => {
                                    setCurrentTab(key);
                                }}
                            >
                                {sideTabs[key]}
                            </a>
                        ))
                    }
                </div>

                {
                    isMounted ? (
                        <div className={classes.content}>
                            {currentTab === "office" && (
                                loading ? (
                                    <div className={"loader_wrapper"}>
                                        <div className={"loader"}></div>
                                    </div>
                                ) : (
                                    <>
                                        <h2 className={classes.content__title}>
                                            {translate("office_of_nop", lang)}
                                        </h2>
                                        <p
                                            className={classes.mission__text}
                                            dangerouslySetInnerHTML={{__html: missionText.replace(/(\r\n|\r|\n)/g, '<br>')}}
                                        />
                                    </>
                                )
                            )}

                            {currentTab === "team" && (
                                loading ? (
                                    <div className={"loader_wrapper"}>
                                        <div className={"loader"}></div>
                                    </div>
                                ) : (
                                    <>
                                        <h2 className={classes.content__title}>
                                            {translate("team", lang)}
                                        </h2>
                                        <div className={classes.tab__bar}>
                                            <div
                                                className={currentSubTab === "1" ? classes.tab__active : classes.tab}
                                                onClick={() => setCurrentSubTab("1")}
                                            >
                                                {translate("main_group", lang)}
                                            </div>
                                            <div
                                                className={currentSubTab === "2" ? classes.tab__active : classes.tab}
                                                onClick={() => setCurrentSubTab("2")}
                                            >
                                                {translate("first_sub_group", lang)}
                                            </div>
                                            <div
                                                className={currentSubTab === "3" ? classes.tab__active : classes.tab}
                                                onClick={() => setCurrentSubTab("3")}
                                            >
                                                {translate("second_sub_group", lang)}
                                            </div>
                                        </div>

                                        <ol className={classes.staff}>
                                            {
                                                employee.filter(item => item.group === currentSubTab).map((item, index) => (
                                                    <li key={index}>{item.name}</li>
                                                ))
                                            }
                                        </ol>
                                    </>
                                )
                            )}

                            {currentTab === "npa" && (
                                loading ? (
                                    <div className={"loader_wrapper"}>
                                        <div className={"loader"}></div>
                                    </div>
                                ) : (
                                    <>
                                        <h2 className={classes.content__title}>
                                            {translate("npa", lang)}
                                        </h2>
                                        {
                                            npa.map((item, index) => (
                                                <div className={classes.doc} key={index}>
                                                    <div className={classes.doc__group}>
                                                        <div className={classes.doc__title}>
                                                            {item.title}
                                                        </div>
                                                        <DocSVG className={classes.doc__symbol}/>
                                                    </div>
                                                    <a
                                                        className={classes.doc__download}
                                                        href={`${process.env.NEXT_PUBLIC_SPACE_HOST}/npa/${item?.filename}`}
                                                        target={"_blank"}
                                                    >
                                                        {translate("download", lang)}
                                                    </a>
                                                </div>
                                            ))
                                        }
                                    </>
                                )
                            )}

                            {currentTab === "contacts" && (
                                loading ? (
                                    <div className={"loader_wrapper"}>
                                        <div className={"loader"}></div>
                                    </div>
                                ) : (
                                    <>
                                        <h2 className={classes.content__title}>
                                            {translate("contacts", lang)}
                                        </h2>
                                        <div className={classes.map__info}>
                                            <div>
                                                <strong>{`${translate("main_phone", lang)}:`}</strong>
                                                <p>{`${contacts.primaryContact}`}</p>
                                            </div>

                                            <div>
                                                <strong>{`${translate("additional_phone", lang)}:`}</strong>
                                                <p>{`${contacts.secondaryContactPerson} - ${contacts.secondaryContact}`}</p>
                                            </div>

                                            <div>
                                                <strong>{`${translate("address", lang)}:`}</strong>
                                                <p>Проспект Мангилик Ел, 8, Есиль район, г.Астана</p>
                                            </div>
                                        </div>
                                        <Map/>
                                    </>
                                )
                            )}
                        </div>
                    ) : (
                        <div className={classes.content}></div>
                    )
                }
            </div>
        </div>
    )
}
