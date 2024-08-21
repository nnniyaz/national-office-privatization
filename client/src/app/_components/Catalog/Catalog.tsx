'use client'

import {Langs} from "@domain/mlString/mlString";
import classes from "./Catalog.module.scss";
import SearchSVG from "@assets/search.svg";
import CrossSVG from "@assets/x.svg";
import React, {useEffect, useMemo, useState} from "react";
import {Button as AntdButton, Form, Input, Modal, Select} from "antd";
import Button from "@components/ui/Button/Button";
import json from "@components/ui/Enterprises/objects.json";
import {translate} from "@/pkg/translate/translate";
import {useForm} from "antd/es/form/Form";

interface Enterprise {
    "id": number,
    "title": string,
    "field": string,
    "desc": string,
    "region": string,
    "shares": string,
    "opf": string,
    "departments": string,
}

function getWindowDimensions() {
    const {innerWidth: width, innerHeight: height} = window;
    return width;
}

export default function Catalog({lang}: { lang: Langs }) {
    const [objects] = useState<Enterprise[]>(json || []);
    const [selectedItem, setSelectedItem] = useState<number>(0);
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

    useEffect(() => {
        function handleResize() {
            setWindowDimensions(getWindowDimensions());
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const regions = [
        {value: "", label: translate("select_region".toLowerCase(), lang)},
        {value: "Abai", label: translate("Abai".toLowerCase(), lang)},
        {value: "Aqmola", label: translate("Aqmola".toLowerCase(), lang)},
        {value: "Aqtobe", label: translate("Aqtobe".toLowerCase(), lang)},
        {value: "Almaty", label: translate("Almaty".toLowerCase(), lang)},
        {value: "Atyrau", label: translate("Atyrau".toLowerCase(), lang)},
        {value: "BQO", label: translate("BQO".toLowerCase(), lang)},
        {value: "Jambyl", label: translate("Jambyl".toLowerCase(), lang)},
        {value: "Jetisu", label: translate("Jetisu".toLowerCase(), lang)},
        {value: "Qaragandy", label: translate("Qaragandy".toLowerCase(), lang)},
        {value: "Qostanai", label: translate("Qostanai".toLowerCase(), lang)},
        {value: "Qyzylorda", label: translate("Qyzylorda".toLowerCase(), lang)},
        {value: "Mangystau", label: translate("Mangystau".toLowerCase(), lang)},
        {value: "Pavlodar", label: translate("Pavlodar".toLowerCase(), lang)},
        {value: "SQO", label: translate("SQO".toLowerCase(), lang)},
        {value: "Turkistan", label: translate("Turkistan".toLowerCase(), lang)},
        {value: "Ulytau", label: translate("Ulytau".toLowerCase(), lang)},
        {value: "ShQO", label: translate("ShQO".toLowerCase(), lang)},
    ]

    const [filters, setFilters] = useState({
        search: "",
        region: "",
        field: "",
        owner: "",
    })

    const list = useMemo(() => {
        let copy = [...objects];

        if (filters.search) {
            copy = copy.filter(item => (
                item.title.toLowerCase().includes(filters.search.toLowerCase())
            ))
        }

        if (filters.region) {
            copy = copy.filter(item => (
                item.region === filters.region
            ))
        }

        return copy
    }, [filters.search, filters.region])

    const [positionY, setPositionY] = useState(0);

    useEffect(() => {
        window.addEventListener('scroll', () => {
            setPositionY(window.scrollY);
        })
    }, []);

    return (
        <div className={classes.main}>
            <h2 className={classes.title}>
                Каталог объектов
            </h2>
            <div className={classes.tab__bar}>
                <Input
                    value={filters.search}
                    onChange={(e) => setFilters({...filters, search: e.currentTarget.value})}
                    prefix={<SearchSVG/>}
                    placeholder={translate("search", lang)}
                    className={classes.tab}
                />
                <Select
                    value={filters.region}
                    onChange={(value) => setFilters({...filters, region: value})}
                    options={regions}
                    placeholder={"Выберите регион"}
                    className={classes.tab}
                    clearIcon={<CrossSVG/>}
                />
            </div>

            <div className={classes.container}>
                <div className={classes.group}>
                    <ul className={classes.enterprises__group__list}>
                        {
                            list.length > 0 ? (
                                list.map(item => (
                                    <li key={item.id} onClick={() => setSelectedItem(item.id)}>
                                        <EnterpriseItem
                                            title={item.title}
                                            field={item.field}
                                            desc={item.desc}
                                            active={selectedItem === item.id}
                                        />
                                    </li>
                                ))
                            ) : (
                                <li>
                                    <EnterpriseItem
                                        title={"объекты не найдены"}
                                        field={""}
                                        desc={""}
                                        active={false}
                                    />
                                </li>
                            )
                        }
                    </ul>
                </div>
                <div className={classes.group}>
                    <EnterpriseDetail
                        item={objects.find(item => item.id === selectedItem)}
                        lang={lang}
                    />
                </div>
            </div>

            {
                windowDimensions < 1200 && (
                    <Modal
                        open={!!selectedItem}
                        onCancel={() => setSelectedItem(0)}
                        footer={[
                            <AntdButton key={"close"} onClick={() => setSelectedItem(0)}>
                                Закрыть
                            </AntdButton>,
                        ]}
                    >
                        <EnterpriseDetail
                            item={objects.find(item => item.id === selectedItem)}
                            lang={lang}
                        />
                    </Modal>
                )
            }
        </div>
    )
}

function EnterpriseItem({title, field, desc, active}: { title: string, field: string, desc: string, active: boolean }) {
    return (
        <div className={active ? classes.enterprise_item__active : classes.enterprise_item}>
            <h5 className={classes.enterprise_item__title}>{title}</h5>
            {!!field && <p className={classes.enterprise_item__desc}>{`Отрасль: ${field}`}</p>}
            {!!desc && (
                <p
                    className={classes.enterprise_item__desc}
                    dangerouslySetInnerHTML={{__html: desc.replace("\n", "<br/>")}}
                />
            )}
            {(!!field || !!desc) && <p className={classes.enterprise_item__link}>Подробднее</p>}
        </div>
    )
}

function EnterpriseDetail({item, lang}: { item: Enterprise | undefined, lang: Langs }) {
    const [isOpen, setIsOpen] = useState(false);
    const [form] = useForm();

    if (!item) return null
    return (
        <div className={classes.details}>
            <h3>Детали объекта</h3>

            <div className={classes.row}>
                <div className={classes.row__label}>
                    Наименование
                </div>
                <div className={classes.row__value}>
                    {item.title}
                </div>
            </div>

            <div className={classes.row}>
                <div className={classes.row__label}>
                    Место нахождение:
                </div>
                <div className={classes.row__value}>
                    {item.region}
                </div>
            </div>

            <div className={classes.row}>
                <div className={classes.row__label}>
                    Отрасль:
                </div>
                <div className={classes.row__value}>
                    {item.field}
                </div>
            </div>

            <div className={classes.row}>
                <div className={classes.row__label}>
                    ОПФ:
                </div>
                <div className={classes.row__value}>
                    {item.opf}
                </div>
            </div>

            <div className={classes.row}>
                <div className={classes.row__label}>
                    Собственник:
                </div>
                <div className={classes.row__value}>
                    {item.departments}
                </div>
            </div>

            <div className={classes.row}>
                <div className={classes.row__label}>
                    Гос. участие (%):
                </div>
                <div className={classes.row__value}>
                    {item.shares}
                </div>
            </div>

            <div className={classes.row}>
                <div className={classes.row__label}>
                    Доп. информация
                </div>
                <div className={classes.row__value}>
                    {item.desc}
                </div>
            </div>

            <Button
                label={translate("submit_application", lang)}
                onClick={() => setIsOpen(true)}
            />

            <Modal
                open={isOpen}
                title={translate("submit_application", lang)}
                okText={"Отправить"}
                cancelText={"Отмена"}
                onOk={() => form.submit()}
                onCancel={() => setIsOpen(false)}
            >
                <p>{`Наименование:`} <strong>{item.title}</strong></p>
                <p>{`Место нахождение:`} <strong>{item.region}</strong></p>
                <p>{`Отрасль:`} <strong>{item.field}</strong></p>
                <p>{`ОПФ:`} <strong>{item.opf}</strong></p>
                <p>{`Собственник:`} <strong>{item.departments}</strong></p>
                <p>{`Гос. участие (%):`} <strong>{item.shares}</strong></p>

                <h3 style={{margin: "30px 0 10px 0"}}>{"Укажите данные для обратной связи"}</h3>
                <Form
                    form={form}
                    onFinish={() => setIsOpen(false)}
                    layout={"vertical"}
                >
                    <Form.Item
                        name={"fio"}
                        label={"ФИО"}
                        required={true}
                        rules={[
                            {required: true, message: "Пожалуйста введите ФИО."}
                        ]}
                    >
                        <Input
                            placeholder={"Введите ФИО"}
                            className={classes.tab}
                        />
                    </Form.Item>
                    <Form.Item
                        name={"bin"}
                        label={"БИН"}
                        required={true}
                        rules={[
                            {required: true, message: "Пожалуйста введите БИН."}
                        ]}
                    >
                        <Input
                            placeholder={"Введите БИН"}
                            className={classes.tab}
                        />
                    </Form.Item>
                    <Form.Item
                        name={"contacts"}
                        label={"Номер телефона или email"}
                        required={true}
                        rules={[
                            {required: true, message: "Пожалуйста введите контакты."}
                        ]}
                    >
                        <Input
                            placeholder={"Введите номер телефона или email"}
                            className={classes.tab}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}
