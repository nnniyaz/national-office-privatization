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

    const [contacts, setContacts] = useState<Contacts>({} as Contacts);
    const [employee, setEmployee] = useState<Employee[]>([]);
    const [npa, setNpa] = useState<Npa[]>([]);

    const fetchContacts = async (): Promise<SuccessResponse<Contacts> | ErrorResponse> => {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/contacts");
        return await response.json();
    }

    const fetchEmployees = async (): Promise<SuccessResponse<EmployeeData> | ErrorResponse> => {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/employee");
        return await response.json();
    }

    const fetchNpas = async (): Promise<SuccessResponse<NpaData> | ErrorResponse> => {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/npa");
        return await response.json();
    }

    useEffect(() => {
        const getContacts = async () => {
            const partners = await fetchContacts();
            if (partners.success) {
                setContacts(partners.data)
            }
        }
        const getEmployees = async () => {
            const employees = await fetchEmployees();
            if (employees.success) {
                setEmployee(employees.data.employees)
            }
        }
        const getNpas = async () => {
            const npas = await fetchNpas();
            if (npas.success) {
                setNpa(npas.data.npas)
            }
        }
        getContacts();
        getEmployees();
        getNpas();
    }, []);

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
                                <>
                                    <h2 className={classes.content__title}>
                                        {translate("office_of_nop", lang)}
                                    </h2>
                                    <p className={classes.mission__text}>
                                        В соответствии с Указом Национальный офис до 31 декабря 2024 года должен
                                        обеспечить:
                                    </p>
                                    <p className={classes.mission__text}>
                                        - Выработку критериев к государственным объектам, подлежащим обязательной
                                        приватизации;
                                    </p>
                                    <p className={classes.mission__text}>
                                        - Проведение анализа деятельности действующих государственных предприятий и
                                        юридических
                                        лиц,
                                        более пятидесяти процентов акций (долей участия в уставном капитале) которых
                                        принадлежат
                                        государству и аффилированным с ними лицам, на предмет возможности и
                                        целесообразности
                                        передачи в
                                        конкурентную среду непрофильных активов с учетом региональной специфики;
                                    </p>
                                    <p className={classes.mission__text}>
                                        - Формирование перечня государственных активов, подлежащих приватизации (с
                                        определением
                                        по
                                        каждому из них условий и методов реализации, включая проведение IPO, SPO,
                                        аукционов и
                                        других),
                                        утверждение и корректировка которого будут возможны только по решению Высшего
                                        совета при
                                        Президенте Республики Казахстан по реформам;
                                    </p>
                                    <p className={classes.mission__text}>
                                        - Предоставление возможности приватизации объектов по инициативе субъектов
                                        частного
                                        предпринимательства путем формирования и внедрения заявочного перечня
                                        государственных
                                        активов,
                                        подлежащих приватизации;
                                    </p>
                                    <p className={classes.mission__text}>
                                        - Мониторинг хода приватизации государственных активов.
                                    </p>
                                    <p className={classes.mission__text}>
                                        Национальным офисом также будет осуществляться формирование условий и методов
                                        приватизации,
                                        что
                                        исключит факты необоснованного затягивания процедур, завышения требований к
                                        потенциальным
                                        покупателям и
                                    </p>
                                </>
                            )}

                            {currentTab === "team" && (
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
                            )}

                            {currentTab === "npa" && (
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
                                                    href={item.filename}
                                                    target={"_blank"}
                                                >
                                                    {translate("download", lang)}
                                                </a>
                                            </div>
                                        ))
                                    }
                                </>
                            )}

                            {currentTab === "contacts" && (
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
