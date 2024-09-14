'use client'

import {Langs} from "@domain/base/mlString/mlString";
import classes from "./Catalog.module.scss";
import SearchSVG from "@assets/search.svg";
import CrossSVG from "@assets/x.svg";
import React, {useEffect, useMemo, useState} from "react";
import {Button as AntdButton, Form, Input, Modal, notification, Select} from "antd";
import Button from "@components/ui/Button/Button";
import {translate} from "@/pkg/translate/translate";
import {useForm} from "antd/es/form/Form";
import {Enterprise} from "@domain/enterprise/enterprise";

function getWindowDimensions() {
    const {innerWidth: width, innerHeight: height} = window;
    return width;
}

export default function Catalog({lang}: { lang: Langs }) {
    const [objects, setObjects] = useState<Enterprise[]>([]);
    const [selectedItem, setSelectedItem] = useState<string>("");
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        function handleResize() {
            setWindowDimensions(getWindowDimensions());
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const regions = [
        {value: "", label: translate("select_region".toLowerCase(), lang)},
        {value: "Almaty_city", label: translate("Almaty_city".toLowerCase(), lang)},
        {value: "Astana_city", label: translate("Astana_city".toLowerCase(), lang)},
        {value: "Shymkent_city", label: translate("Shymkent_city".toLowerCase(), lang)},
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

    const fields = [
        {value: "", label: translate("select_field".toLowerCase(), lang)},
        {value: "Добыча угля и лигнита", label: "Добыча угля и лигнита"},
        {value: "Деятельность в области здравоохранения", label: "Деятельность в области здравоохранения"},
        {value: "Финансовые услуги, за исключением услуг страховых и пенсионных фондов", label: "Финансовые услуги, за исключением услуг страховых и пенсионных фондов"},
        {value: "Складское хозяйство и вспомогательная транспортная деятельность", label: "Складское хозяйство и вспомогательная транспортная деятельность"},
        {value: "Рыболовство и аквакультура", label: "Рыболовство и аквакультура"},
        {value: "Растениеводство и животноводство, охота и предоставление услуг в этих областях", label: "Растениеводство и животноводство, охота и предоставление услуг в этих областях"},
        {value: "Вспомогательная деятельность по предоставлению финансовых услуг и страхования", label: "Вспомогательная деятельность по предоставлению финансовых услуг и страхования"},
        {value: "Компьютерное программирование, консультации и другие сопутствующие услуги", label: "Компьютерное программирование, консультации и другие сопутствующие услуги"},
        {value: "Электроснабжение, подача газа, пара и воздушное кондиционирование", label: "Электроснабжение, подача газа, пара и воздушное кондиционирование"},
        {value: "Сбор, обработка и удаление отходов; утилизация отходов", label: "Сбор, обработка и удаление отходов; утилизация отходов"},
        {value: "Производство готовых металлических изделий, кроме машин и оборудования", label: "Производство готовых металлических изделий, кроме машин и оборудования"},
        {value: "Научные исследования и разработки", label: "Научные исследования и разработки"},
        {value: "Прочая профессиональная, научная и техническая деятельность", label: "Прочая профессиональная, научная и техническая деятельность"},
        {value: "Связь", label: "Связь"},
        {value: "Сухопутный транспорт и транспортирование по трубопроводам", label: "Сухопутный транспорт и транспортирование по трубопроводам"},
        {value: "Производство прочих транспортных средств", label: "Производство прочих транспортных средств"},
        {value: "Добыча металлических руд", label: "Добыча металлических руд"},
        {value: "Деятельность по обеспечению безопасности и расследованию", label: "Деятельность по обеспечению безопасности и расследованию"},
        {value: "Производство продуктов химической промышленности", label: "Производство продуктов химической промышленности"},
        {value: "Деятельность в области архитектуры, инженерных изысканий, технических испытаний и анализа", label: "Деятельность в области архитектуры, инженерных изысканий, технических испытаний и анализа"},
        {value: "Прочие отрасли горнодобывающей промышленности", label: "Прочие отрасли горнодобывающей промышленности"},
        {value: "Гражданское строительство", label: "Гражданское строительство"},
        {value: "Деятельность членских организаций", label: "Деятельность членских организаций"},
        {value: "Образование", label: "Образование"},
        {value: "Оптовая торговля, за исключением автомобилей и мотоциклов", label: "Оптовая торговля, за исключением автомобилей и мотоциклов"},
        {value: "Добыча сырой нефти и природного газа", label: "Добыча сырой нефти и природного газа"},
        {value: "Технические услуги в области горнодобывающей промышленности", label: "Технические услуги в области горнодобывающей промышленности"},
        {value: "Услуги по предоставлению продуктов питания и напитков", label: "Услуги по предоставлению продуктов питания и напитков"},
        {value: "Специализированные строительные работы", label: "Специализированные строительные работы"},
        {value: "Производство кокса и продуктов нефтепереработки", label: "Производство кокса и продуктов нефтепереработки"},
        {value: "Деятельность библиотек, архивов, музеев и других учреждений культурного обслуживания", label: "Деятельность библиотек, архивов, музеев и других учреждений культурного обслуживания"},
        {value: "Деятельность головных компаний; консультации по вопросам управления", label: "Деятельность головных компаний; консультации по вопросам управления"},
        {value: "Государственное управление и оборона; обязательное социальное обеспечение", label: "Государственное управление и оборона; обязательное социальное обеспечение"},
        {value: "Деятельность по созданию программ и телерадиовещание", label: "Деятельность по созданию программ и телерадиовещание"},
        {value: "Операции с недвижимым имуществом", label: "Операции с недвижимым имуществом"},
        {value: "Предоставление прочих индивидуальных услуг", label: "Предоставление прочих индивидуальных услуг"},
        {value: "Деятельность в области административно-управленческого, хозяйственного и прочего вспомогательного обслуживания", label: "Деятельность в области административно-управленческого, хозяйственного и прочего вспомогательного обслуживания"},
        {value: "Строительство зданий и сооружений", label: "Строительство зданий и сооружений"},
        {value: "Сбор, обработка и распределение воды", label: "Сбор, обработка и распределение воды"},
        {value: "Розничная торговля, кроме торговли автомобилями и мотоциклами", label: "Розничная торговля, кроме торговли автомобилями и мотоциклами"},
        {value: "Рекламная деятельность и изучение рыночной конъюнктуры", label: "Рекламная деятельность и изучение рыночной конъюнктуры"},
        {value: "Предоставление социальных услуг без обеспечения проживания", label: "Предоставление социальных услуг без обеспечения проживания"},
        {value: "Деятельность туроператоров, турагентов и прочих организаций, предоставляющих услуги в сфере туризма", label: "Деятельность туроператоров, турагентов и прочих организаций, предоставляющих услуги в сфере туризма"},
        {value: "Деятельность в области обслуживания зданий и территорий", label: "Деятельность в области обслуживания зданий и территорий"},
        {value: "Воздушный транспорт", label: "Воздушный транспорт"},
        {value: "Деятельность в области спорта, организации отдыха и развлечений", label: "Деятельность в области спорта, организации отдыха и развлечений"},
        {value: "Деятельность в области творчества, искусства и развлечений", label: "Деятельность в области творчества, искусства и развлечений"},
        {value: "Предоставление социальных услуг с обеспечением проживания", label: "Предоставление социальных услуг с обеспечением проживания"},
        {value: "Лесоводство и лесозаготовки", label: "Лесоводство и лесозаготовки"},
    ];

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
                item.name.toLowerCase().includes(filters.search.toLowerCase())
            ))
        }

        if (filters.region) {
            copy = copy.filter(item => (
                item.location === filters.region
            ))
        }

        if (filters.field) {
            copy = copy.filter(item => (
                item.industry === filters.field
            ))
        }

        return copy
    }, [filters.search, filters.region, filters.field, objects])

    const [positionY, setPositionY] = useState(0);

    useEffect(() => {
        const fetchObjects = async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/enterprise`);
            const data = await res.json();
            if (data.success) {
                setObjects(data.data.enterprises);
            }
        }
        fetchObjects();
    }, [])

    useEffect(() => {
        window.addEventListener('scroll', () => {
            setPositionY(window.scrollY);
        })
    }, []);

    useEffect(() => {
        if (mounted) {
            const hash = window.location.hash.replace("#", "");
            if (!!hash) {
                document.getElementById(hash)?.scrollTo()
                setSelectedItem(hash)
            }
        } else {
            setMounted(true);
        }
    }, [mounted]);

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
                    placeholder={translate("select_region", lang)}
                    className={classes.tab}
                    clearIcon={<CrossSVG/>}
                />
                <Select
                    value={filters.field}
                    onChange={(value) => setFilters({...filters, field: value})}
                    options={fields}
                    placeholder={translate("select_field", lang)}
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
                                            id={item.id}
                                            title={item.name}
                                            field={item.industry}
                                            desc={item.location}
                                            active={selectedItem === item.id}
                                            lang={lang}
                                        />
                                    </li>
                                ))
                            ) : (
                                <li>
                                    <EnterpriseItem
                                        id={""}
                                        title={"объекты не найдены"}
                                        field={""}
                                        desc={""}
                                        active={false}
                                        lang={lang}
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
                        onCancel={() => setSelectedItem("")}
                        footer={[
                            <AntdButton key={"close"} onClick={() => setSelectedItem("")}>
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

function EnterpriseItem({id, title, field, desc, active, lang}: { id: string, title: string, field: string, desc: string, active: boolean, lang: Langs }) {
    return (
        <div className={active ? classes.enterprise_item__active : classes.enterprise_item} id={id}>
            <h5 className={classes.enterprise_item__title}>{title}</h5>
            {!!field && <p className={classes.enterprise_item__desc}>{`${translate("industry", lang)}: ${field}`}</p>}
            {!!desc && (
                <p className={classes.enterprise_item__desc}>
                    {`${translate("location", lang)}: ${translate(desc.toLowerCase(), lang)}`}
                </p>
            )}
            {(!!field || !!desc) && <p className={classes.enterprise_item__link}>
                {translate("details", lang)}
            </p>}
        </div>
    )
}

function EnterpriseDetail({item, lang}: { item: Enterprise | undefined, lang: Langs }) {
    const [isOpen, setIsOpen] = useState(false);
    const [form] = useForm();
    const [api, contextHolder] = notification.useNotification();
    const [isLoading, setIsLoading] = useState(false);

    const handleFinish = async () => {
        const values = form.getFieldsValue();
        setIsLoading(true);
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/application`, {
            method: "POST",
            body: JSON.stringify({
                enterpriseId: item?.id,
                fio: values.fio,
                bin: values.bin,
                contact: values.contacts,
                message: values.message,
            })
        })
        setIsLoading(false);
        api.success({
            message: translate("application_sent", lang),
            description: translate("we_will_review_your_request_and_contact_with_you", lang)
        })
        setIsOpen(false);
        form.resetFields();
    }

    if (!item) return null
    return (
        <div className={classes.details}>
            {contextHolder}
            <h3>{translate("object_details", lang)}</h3>

            <div className={classes.row}>
                <div className={classes.row__label}>
                    {translate("name", lang)}:
                </div>
                <div className={classes.row__value}>
                    {item.name}
                </div>
            </div>

            <div className={classes.row}>
                <div className={classes.row__label}>
                    {translate("location", lang)}:
                </div>
                <div className={classes.row__value}>
                    {translate(item.location.toLowerCase(), lang)}
                </div>
            </div>

            <div className={classes.row}>
                <div className={classes.row__label}>
                    {translate("industry", lang)}:
                </div>
                <div className={classes.row__value}>
                    {item.industry}
                </div>
            </div>

            <div className={classes.row}>
                <div className={classes.row__label}>
                    {`${translate("gov_participation", lang)} (%)`}:
                </div>
                <div className={classes.row__value}>
                    {item.governmentShare}
                </div>
            </div>

            <Button
                label={translate("submit_application", lang)}
                onClick={() => setIsOpen(true)}
            />

            <Modal
                open={isOpen}
                title={translate("submit_application", lang)}
                okText={translate("send", lang)}
                cancelText={translate("cancel", lang)}
                onOk={() => form.submit()}
                onCancel={() => setIsOpen(false)}
                confirmLoading={isLoading}
            >
                <p>{`${translate("name", lang)}`} <strong>{item.name}</strong></p>
                <p>{`${translate("location", lang)}:`} <strong>{translate(item.location.toLowerCase(), lang)}</strong></p>
                <p>{`${translate("industry", lang)}`} <strong>{item.industry}</strong></p>
                <p>{`${translate("gov_participation", lang)} (%):`} <strong>{item.governmentShare}</strong></p>

                <h3 style={{margin: "30px 0 10px 0"}}>
                    {translate("share_contact_info_for_callback", lang)}
                </h3>
                <Form
                    form={form}
                    onFinish={handleFinish}
                    layout={"vertical"}
                >
                    <Form.Item
                        name={"fio"}
                        label={translate("fio", lang)}
                        required={true}
                        rules={[
                            {required: true, message: translate("enter_fio", lang)}
                        ]}
                    >
                        <Input
                            placeholder={translate("please_enter_fio", lang)}
                            className={classes.tab}
                        />
                    </Form.Item>
                    <Form.Item
                        name={"bin"}
                        label={translate("bin", lang)}
                        required={true}
                        rules={[
                            {required: true, message: translate("enter_bin", lang)}
                        ]}
                    >
                        <Input
                            placeholder={translate("please_enter_bin", lang)}
                            className={classes.tab}
                        />
                    </Form.Item>
                    <Form.Item
                        name={"contacts"}
                        label={translate("phone_or_email", lang)}
                        required={true}
                        rules={[
                            {required: true, message: translate("enter_phone_or_email", lang)}
                        ]}
                    >
                        <Input
                            placeholder={translate("please_enter_phone_or_email", lang)}
                            className={classes.tab}
                        />
                    </Form.Item>
                    <Form.Item
                        name={"message"}
                        label={translate("message", lang)}
                        required={true}
                        rules={[
                            {required: true, message: translate("enter_message", lang)}
                        ]}
                    >
                        <Input
                            placeholder={translate("please_enter_message", lang)}
                            className={classes.tab}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}
