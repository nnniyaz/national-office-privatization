'use client'

import {useEffect, useState} from "react";
import {Swiper} from "swiper";
import {Swiper as SwiperComponent, SwiperSlide} from 'swiper/react';
import GerbSVG from "@assets/gerb.svg";
import 'swiper/css';
import classes from "./CarouselPartners.module.scss";
import {Autoplay} from 'swiper/modules';
import {ErrorResponse, SuccessResponse} from "@domain/base/response/response";
import {PartnerData, Partner} from "@domain/partner/partner";

function getWindowDimensions() {
    const {innerWidth: width} = window;
    return width;
}

export default function CarouselPartners() {
    const [swiper, setSwiper] = useState<Swiper | null>(null);
    const [partners, setPartners] = useState<Partner[]>([])

    const fetchPartners = async (): Promise<SuccessResponse<PartnerData> | ErrorResponse> => {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/partner");
        return await response.json();
    }

    useEffect(() => {
        const getPartners = async () => {
            const partners = await fetchPartners();
            if (partners.success) {
                setPartners(partners.data.partners)
            }
        }
        getPartners();
    }, []);

    return (
        <>
            <SwiperComponent
                spaceBetween={10}
                slidesPerView={4}
                loop={true}
                autoplay={{
                    delay: 2000,
                    disableOnInteraction: false,
                }}
                centeredSlides={true}
                onSwiper={(swiper) => setSwiper(swiper)}
                className={classes.swiper}
                modules={[Autoplay]}
            >
                {
                    partners.map((partner, index) => (
                        <SwiperSlide key={index}>
                            <PartnerItem title={partner.name} link={partner.link}/>
                        </SwiperSlide>
                    ))
                }
            </SwiperComponent>

            <div className={classes.partner_list}>
                {
                    partners.map((partner, index) => (
                        <PartnerItem title={partner.name} link={partner.link} key={index}/>
                    ))
                }
            </div>
        </>
    )
}

interface PartnerProps {
    title: string
    link: string
}

function PartnerItem({title, link}: PartnerProps) {
    return (
        <a className={classes.partner} href={link} target={"_blank"}>
            <GerbSVG className={classes.partner__logo}/>
            <div className={classes.partner__title}>
                <p>{title}</p>
            </div>
        </a>
    )
}
