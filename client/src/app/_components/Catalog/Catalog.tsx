'use client'

import type {Lang} from "@/domain/base/mlString/mlString";
import classes from "./Catalog.module.scss";
import SearchSVG from "@assets/search.svg";
import CrossSVG from "@assets/x.svg";
import React, {useEffect, useMemo, useState} from "react";
import {Button as AntdButton, Form, Input, Modal, notification, Pagination, Select} from "antd";
import Button from "@components/ui/Button/Button";
import {translate} from "@/pkg/translate/translate";
import {useForm} from "antd/es/form/Form";
import {Enterprise} from "@domain/enterprise/enterprise";
import {LoadingOutlined} from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import {useParams} from "next/navigation";

function getWindowDimensions() {
    const {innerWidth: width, innerHeight: height} = window;
    return width;
}

export default function Catalog({lang}: { lang: Lang }) {
    const params = useParams();
    const [objects, setObjects] = useState<Enterprise[]>([]);
    const [selectedItem, setSelectedItem] = useState<string>("");
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
    const [mounted, setMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    console.log(params);

    const [enterprisesCount, setEnterprisesCount] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [pagination, setPagination] = useState({
        currentPage: 1,
        limit: 10,
        search: "",
        region: "",
        field: "",
    });

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
        {
            value: "Финансовые услуги, за исключением услуг страховых и пенсионных фондов",
            label: "Финансовые услуги, за исключением услуг страховых и пенсионных фондов"
        },
        {
            value: "Складское хозяйство и вспомогательная транспортная деятельность",
            label: "Складское хозяйство и вспомогательная транспортная деятельность"
        },
        {value: "Рыболовство и аквакультура", label: "Рыболовство и аквакультура"},
        {
            value: "Растениеводство и животноводство, охота и предоставление услуг в этих областях",
            label: "Растениеводство и животноводство, охота и предоставление услуг в этих областях"
        },
        {
            value: "Вспомогательная деятельность по предоставлению финансовых услуг и страхования",
            label: "Вспомогательная деятельность по предоставлению финансовых услуг и страхования"
        },
        {
            value: "Компьютерное программирование, консультации и другие сопутствующие услуги",
            label: "Компьютерное программирование, консультации и другие сопутствующие услуги"
        },
        {
            value: "Электроснабжение, подача газа, пара и воздушное кондиционирование",
            label: "Электроснабжение, подача газа, пара и воздушное кондиционирование"
        },
        {
            value: "Сбор, обработка и удаление отходов; утилизация отходов",
            label: "Сбор, обработка и удаление отходов; утилизация отходов"
        },
        {
            value: "Производство готовых металлических изделий, кроме машин и оборудования",
            label: "Производство готовых металлических изделий, кроме машин и оборудования"
        },
        {value: "Научные исследования и разработки", label: "Научные исследования и разработки"},
        {
            value: "Прочая профессиональная, научная и техническая деятельность",
            label: "Прочая профессиональная, научная и техническая деятельность"
        },
        {value: "Связь", label: "Связь"},
        {
            value: "Сухопутный транспорт и транспортирование по трубопроводам",
            label: "Сухопутный транспорт и транспортирование по трубопроводам"
        },
        {value: "Производство прочих транспортных средств", label: "Производство прочих транспортных средств"},
        {value: "Добыча металлических руд", label: "Добыча металлических руд"},
        {
            value: "Деятельность по обеспечению безопасности и расследованию",
            label: "Деятельность по обеспечению безопасности и расследованию"
        },
        {
            value: "Производство продуктов химической промышленности",
            label: "Производство продуктов химической промышленности"
        },
        {
            value: "Деятельность в области архитектуры, инженерных изысканий, технических испытаний и анализа",
            label: "Деятельность в области архитектуры, инженерных изысканий, технических испытаний и анализа"
        },
        {
            value: "Прочие отрасли горнодобывающей промышленности",
            label: "Прочие отрасли горнодобывающей промышленности"
        },
        {value: "Гражданское строительство", label: "Гражданское строительство"},
        {value: "Деятельность членских организаций", label: "Деятельность членских организаций"},
        {value: "Образование", label: "Образование"},
        {
            value: "Оптовая торговля, за исключением автомобилей и мотоциклов",
            label: "Оптовая торговля, за исключением автомобилей и мотоциклов"
        },
        {value: "Добыча сырой нефти и природного газа", label: "Добыча сырой нефти и природного газа"},
        {
            value: "Технические услуги в области горнодобывающей промышленности",
            label: "Технические услуги в области горнодобывающей промышленности"
        },
        {
            value: "Услуги по предоставлению продуктов питания и напитков",
            label: "Услуги по предоставлению продуктов питания и напитков"
        },
        {value: "Специализированные строительные работы", label: "Специализированные строительные работы"},
        {
            value: "Производство кокса и продуктов нефтепереработки",
            label: "Производство кокса и продуктов нефтепереработки"
        },
        {
            value: "Деятельность библиотек, архивов, музеев и других учреждений культурного обслуживания",
            label: "Деятельность библиотек, архивов, музеев и других учреждений культурного обслуживания"
        },
        {
            value: "Деятельность головных компаний; консультации по вопросам управления",
            label: "Деятельность головных компаний; консультации по вопросам управления"
        },
        {
            value: "Государственное управление и оборона; обязательное социальное обеспечение",
            label: "Государственное управление и оборона; обязательное социальное обеспечение"
        },
        {
            value: "Деятельность по созданию программ и телерадиовещание",
            label: "Деятельность по созданию программ и телерадиовещание"
        },
        {value: "Операции с недвижимым имуществом", label: "Операции с недвижимым имуществом"},
        {value: "Предоставление прочих индивидуальных услуг", label: "Предоставление прочих индивидуальных услуг"},
        {
            value: "Деятельность в области административно-управленческого, хозяйственного и прочего вспомогательного обслуживания",
            label: "Деятельность в области административно-управленческого, хозяйственного и прочего вспомогательного обслуживания"
        },
        {value: "Строительство зданий и сооружений", label: "Строительство зданий и сооружений"},
        {value: "Сбор, обработка и распределение воды", label: "Сбор, обработка и распределение воды"},
        {
            value: "Розничная торговля, кроме торговли автомобилями и мотоциклами",
            label: "Розничная торговля, кроме торговли автомобилями и мотоциклами"
        },
        {
            value: "Рекламная деятельность и изучение рыночной конъюнктуры",
            label: "Рекламная деятельность и изучение рыночной конъюнктуры"
        },
        {
            value: "Предоставление социальных услуг без обеспечения проживания",
            label: "Предоставление социальных услуг без обеспечения проживания"
        },
        {
            value: "Деятельность туроператоров, турагентов и прочих организаций, предоставляющих услуги в сфере туризма",
            label: "Деятельность туроператоров, турагентов и прочих организаций, предоставляющих услуги в сфере туризма"
        },
        {
            value: "Деятельность в области обслуживания зданий и территорий",
            label: "Деятельность в области обслуживания зданий и территорий"
        },
        {value: "Воздушный транспорт", label: "Воздушный транспорт"},
        {
            value: "Деятельность в области спорта, организации отдыха и развлечений",
            label: "Деятельность в области спорта, организации отдыха и развлечений"
        },
        {
            value: "Деятельность в области творчества, искусства и развлечений",
            label: "Деятельность в области творчества, искусства и развлечений"
        },
        {
            value: "Предоставление социальных услуг с обеспечением проживания",
            label: "Предоставление социальных услуг с обеспечением проживания"
        },
        {value: "Лесоводство и лесозаготовки", label: "Лесоводство и лесозаготовки"},
    ];

    const [positionY, setPositionY] = useState(0);

    useEffect(() => {
        const fetchObjects = async () => {
            setIsLoading(true);
            if (pagination.search) {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/enterprise?offset=${(pagination.currentPage - 1) * pagination.limit}&limit=${pagination.limit}&search=${pagination.search}`);
                const data = await res.json();
                if (data.success) {
                    setObjects(data.data.enterprises || []);
                    setEnterprisesCount(data.data.count || 0);
                }
            } else {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/enterprise?offset=${(pagination.currentPage - 1) * pagination.limit}&limit=${pagination.limit}&region=${pagination.region}&field=${pagination.field}`);
                const data = await res.json();
                if (data.success) {
                    setObjects(data.data.enterprises || []);
                    setEnterprisesCount(data.data.count || 0);
                }
            }
            setIsLoading(false);
        }
        fetchObjects();
    }, [pagination]);

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
            <div
                className={classes.tab__bar}
                style={{
                    borderBottom: "none",
                    paddingBottom: 0,
                    height: "40px",
                }}
            >
                <div style={{width: "100%", display: "flex", gap: "10px"}}>
                    <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        prefix={<SearchSVG/>}
                        placeholder={translate("search", lang)}
                        onKeyPress={(e) => setPagination({...pagination, currentPage: 1, search: searchQuery})}
                        className={classes.tab}
                    />
                    <Button
                        label={translate("search", lang)}
                        onClick={() => setPagination({...pagination, currentPage: 1, search: searchQuery})}
                    />
                </div>
            </div>
            <div className={classes.tab__bar}>
                <Select
                    value={pagination.region}
                    onChange={(value) => setPagination({...pagination, currentPage: 1, region: value})}
                    options={regions}
                    placeholder={translate("select_region", lang)}
                    className={classes.tab}
                    clearIcon={<CrossSVG/>}
                />
                <Select
                    value={pagination.field}
                    onChange={(value) => setPagination({...pagination, currentPage: 1, field: value})}
                    options={fields}
                    placeholder={translate("select_field", lang)}
                    className={classes.tab}
                    clearIcon={<CrossSVG/>}
                />
            </div>

            <div style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
            }}>
                {
                    isLoading ? (
                        <div style={{
                            width: "100%",
                            height: "300px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}>
                            <LoadingOutlined style={{fontSize: "50px", color: "#005FF9"}}/>
                        </div>
                    ) : (
                        objects.length > 0 ? (
                            <div className={classes.container}>
                                <div className={classes.group}>
                                    <ul className={classes.enterprises__group__list}>
                                        {
                                            objects.map(item => (
                                                <li key={item.id} onClick={() => setSelectedItem(item.id)}>
                                                    <EnterpriseItem
                                                        id={item.id}
                                                        title={item.name}
                                                        implementationForm={item.implementationForm}
                                                        salesRecommendations={item.salesRecommendations}
                                                        active={selectedItem === item.id}
                                                        lang={lang}
                                                    />
                                                </li>
                                            ))
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
                        ) : (
                            <div style={{
                                width: "100%",
                                height: "300px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}>
                                <h3 style={{margin: "100px 0"}}>
                                    {translate("no_enterprises_found", lang)}
                                </h3>
                            </div>
                        )
                    )
                }

                <Pagination
                    total={enterprisesCount}
                    current={pagination.currentPage}
                    onChange={(page) => setPagination({...pagination, currentPage: page})}
                    pageSize={pagination.limit}
                    style={{marginTop: "20px"}}
                    pageSizeOptions={[]}
                    align={"center"}
                />
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

// Helper component for displaying enterprise details
function DetailRow({label, value}: {label: string, value: string | undefined}) {
    if (!value || value === '-') return null;
    return (
        <div style={{display: "flex", marginBottom: "8px", fontSize: "14px"}}>
            <div style={{fontWeight: "500", minWidth: "200px", color: "#666"}}>{label}:</div>
            <div style={{flex: 1}}>{value}</div>
        </div>
    );
}

function EnterpriseItem({id, title, implementationForm, salesRecommendations, active, lang}: {
    id: string,
    title: string,
    implementationForm: string,
    salesRecommendations: string,
    active: boolean,
    lang: Lang
}) {
    return (
        <div className={active ? classes.enterprise_item__active : classes.enterprise_item} id={id}>
            <h5 className={classes.enterprise_item__title}>{title}</h5>
            {!!implementationForm && <p className={classes.enterprise_item__desc}>{`${translate("implementation_form", lang)}: ${implementationForm}`}</p>}
            {!!salesRecommendations && (
                <p className={classes.enterprise_item__desc}>
                    {`${translate("sales_recommendations", lang)}: ${salesRecommendations}`}
                </p>
            )}
            {(!!implementationForm || !!salesRecommendations) && <p className={classes.enterprise_item__link}>
                {translate("details", lang)}
            </p>}
        </div>
    )
}

function EnterpriseDetail({item, lang}: { item: Enterprise | undefined, lang: Lang }) {
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
                phone: values.phone,
                email: values.email,
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

    const [showAllDetails, setShowAllDetails] = useState(false);

    if (!item) return null
    
    const formatNumber = (num: number) => num ? num.toLocaleString('ru-RU') : '-';
    const formatCurrency = (num: number, comment?: string) => {
        if (!num && !comment) return '-';
        return `${formatNumber(num)} тг${comment ? ` (${comment})` : ''}`;
    };

    return (
        <div className={classes.details}>
            {contextHolder}
            <h3 style={{fontSize: "20px", lineHeight: "normal", marginBottom: "20px"}}>{item.name}</h3>

            {/* Основная информация */}
            <div className={classes.row}>
                <div className={classes.row__label}>{translate("name", lang)}:</div>
                <div className={classes.row__value}>{item.name}</div>
            </div>

            <div className={classes.row}>
                <div className={classes.row__label}>{translate("implementation_form", lang)}:</div>
                <div className={classes.row__value}>{item.implementationForm || '-'}</div>
            </div>

            <div className={classes.row}>
                <div className={classes.row__label}>{translate("sales_recommendations", lang)}:</div>
                <div className={classes.row__value}>{item.salesRecommendations || '-'}</div>
            </div>

            {item.documentUrl && (
                <AntdButton
                    type="link"
                    href={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${item.documentUrl}`}
                    target="_blank"
                    style={{padding: 0, marginBottom: "10px", fontSize: "14px"}}
                >
                    {translate("download_document", lang)} ↓
                </AntdButton>
            )}

            <Button
                label={translate("submit_application", lang)}
                onClick={() => setIsOpen(true)}
            />

            {/* Модалка с полной информацией */}
            <Modal
                open={showAllDetails}
                onCancel={() => setShowAllDetails(false)}
                footer={[
                    <AntdButton key="close" onClick={() => setShowAllDetails(false)}>
                        {translate("close", lang)}
                    </AntdButton>
                ]}
                width={800}
                title={item.name}
            >
                <div style={{maxHeight: "70vh", overflowY: "auto", padding: "10px 0"}}>
                    <h4 style={{marginTop: "20px", marginBottom: "10px", borderBottom: "1px solid #eee", paddingBottom: "5px"}}>
                        {translate("general_info", lang)}
                    </h4>
                    
                    <DetailRow label={translate("name", lang)} value={item.name} />
                    <DetailRow label={translate("location", lang)} value={translate(item.location.toLowerCase(), lang)} />
                    <DetailRow label={translate("industry", lang)} value={item.industry} />
                    <DetailRow label={translate("juridical_form", lang)} value={item.juridicalForm} />
                    <DetailRow label={translate("year", lang)} value={item.year?.toString()} />
                    <DetailRow label={translate("owner", lang)} value={item.owner} />
                    <DetailRow label={translate("main_activity", lang)} value={item.mainActivity} />
                    <DetailRow label={`${translate("gov_participation", lang)} (%)`} value={`${item.governmentShare}%`} />

                    <h4 style={{marginTop: "20px", marginBottom: "10px", borderBottom: "1px solid #eee", paddingBottom: "5px"}}>
                        {translate("financial_info", lang)}
                    </h4>
                    
                    <DetailRow label={translate("authorized_capital", lang)} value={formatCurrency(item.authorizedCapital, item.authorizedCapitalComment)} />
                    <DetailRow label={translate("assets", lang)} value={formatCurrency(item.assets, item.assetsComment)} />
                    <DetailRow label={translate("equity", lang)} value={formatCurrency(item.equity, item.equityComment)} />
                    <DetailRow label={translate("income", lang)} value={formatCurrency(item.income, item.incomeComment)} />
                    <DetailRow label={translate("net_profit", lang)} value={formatCurrency(item.netProfit, item.netProfitComment)} />
                    <DetailRow label={translate("total_liabilities", lang)} value={formatCurrency(item.totalLiabilities, item.totalLiabilitiesComment)} />

                    <h4 style={{marginTop: "20px", marginBottom: "10px", borderBottom: "1px solid #eee", paddingBottom: "5px"}}>
                        {translate("hr_info", lang)}
                    </h4>
                    
                    <DetailRow 
                        label={translate("number_of_employees", lang)} 
                        value={item.numberOfEmployees ? `${item.numberOfEmployees}${item.numberOfEmployeesComment ? ` (${item.numberOfEmployeesComment})` : ''}` : '-'} 
                    />

                    <h4 style={{marginTop: "20px", marginBottom: "10px", borderBottom: "1px solid #eee", paddingBottom: "5px"}}>
                        {translate("additional_info", lang)}
                    </h4>
                    
                    <DetailRow label={translate("property_complex", lang)} value={item.propertyComplex} />
                    <DetailRow label={translate("additional_info", lang)} value={item.additionalInfo} />

                    <h4 style={{marginTop: "20px", marginBottom: "10px", borderBottom: "1px solid #eee", paddingBottom: "5px"}}>
                        {translate("sale_info", lang)}
                    </h4>
                    
                    <DetailRow label={translate("sales_recommendations", lang)} value={item.salesRecommendations} />
                    <DetailRow label={translate("implementation_form", lang)} value={item.implementationForm} />
                    <DetailRow label={translate("sale_purpose", lang)} value={item.salePurpose} />
                    <DetailRow label={translate("key_terms", lang)} value={item.keyTerms} />
                    <DetailRow label={translate("additional_terms", lang)} value={item.additionalTerms} />
                </div>
            </Modal>

            <Modal
                open={isOpen}
                okText={translate("send", lang)}
                cancelText={translate("cancel", lang)}
                onOk={() => form.submit()}
                onCancel={() => setIsOpen(false)}
                confirmLoading={isLoading}
            >
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
                            {required: true, message: translate("enter_bin", lang)},
                            {pattern: /^[0-9]{12}$/, message: translate("bin_must_be_12_digits", lang)}
                        ]}
                    >
                        <Input
                            placeholder={translate("please_enter_bin", lang)}
                            className={classes.tab}
                        />
                    </Form.Item>
                    <Form.Item
                        name={"phone"}
                        label={translate("phone", lang)}
                        required={true}
                        rules={[
                            {required: true, message: translate("enter_phone", lang)},
                            {pattern: /^[0-9]{10}$/, message: translate("phone_must_be_10_digits", lang)}
                        ]}
                    >
                        <Input
                            prefix={"+7"}
                            placeholder={"7071234567"}
                            className={classes.tab}
                        />
                    </Form.Item>
                    <Form.Item
                        name={"email"}
                        label={translate("email", lang)}
                        required={true}
                        rules={[
                            {required: true, message: translate("enter_email", lang)},
                            {type: "email", message: translate("email_must_be_valid", lang)}
                        ]}
                    >
                        <Input
                            placeholder={"example@mail.com"}
                            className={classes.tab}
                        />
                    </Form.Item>
                    <Form.Item
                        name={"message"}
                        label={translate("request_reason", lang)}
                        required={true}
                        rules={[
                            {required: true, message: translate("enter_message", lang)}
                        ]}
                    >
                        <TextArea
                            placeholder={translate("please_enter_message", lang)}
                            className={classes.tab}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}
