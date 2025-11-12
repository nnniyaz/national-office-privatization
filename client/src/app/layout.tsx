import type {Metadata} from "next";
import {headers} from "next/headers";
import {Montserrat} from "next/font/google";
import NextTopLoader from 'nextjs-toploader';
import Footer from "@/app/_components/Footer/Footer";
import Header from "@/app/_components/Header/Header";
import "./layout.scss";
import {Contacts} from "@domain/contacts/contacts";
import {ErrorResponse, SuccessResponse} from "@domain/base/response/response";
import React from "react";

const montserrat = Montserrat({subsets: ["latin"]});

export const metadata: Metadata = {
    metadataBase: new URL("https://azrk.nop.kz/"),
    title: "Национальный офис приватизации",
    description: "Национальный офис по приватизации анонсировал передачу ряда государственных предприятий в частные руки. На первом заседании Национального офиса по приватизации, учреждённого по указу Президента, были представлены планы по снижению государственного участия в предпринимательстве.",
    publisher: "Национальный офис приватизации",
    creator: "Национальный офис приватизации",
    manifest: "/site.webmanifest",
    openGraph: {
        title: "Национальный офис приватизации",
        description: "Национальный офис по приватизации анонсировал передачу ряда государственных предприятий в частные руки. На первом заседании Национального офиса по приватизации, учреждённого по указу Президента, были представлены планы по снижению государственного участия в предпринимательстве.",
        type: "website",
        url: "https://azrk.nop.kz/",
        images: [
            {
                url: "https://ardodev.fra1.cdn.digitaloceanspaces.com/nop/gerb.png",
                width: 250,
                height: 260,
                alt: "Национальный офис приватизации",
            },
        ],
        siteName: "Национальный офис приватизации",
    },
};

const fetchData = async (): Promise<SuccessResponse<Contacts> | ErrorResponse> => {
    try {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/contacts");
        // const response = await fetch("http://localhost:8080/api/contacts");
        return await response.json();
    } catch (e: any) {
        console.log(e);
        return {success: false, messages: [e]};
    }
}

export default async function RootLayout({children}: Readonly<{ children: React.ReactNode }>) {
    const headersList = headers();
    const lang = (): string => {
        const pathLang = headersList.get("x-pathname")?.split("/")?.[1];
        const validLangs = ['kz', 'ru', 'en'];
        
        if (pathLang && validLangs.includes(pathLang)) {
            return pathLang.toUpperCase();
        }
        return 'EN';
    };
    const contacts = await fetchData();

    if (!contacts.success) {
        return (
            <html lang={lang()}>
            <head>
                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
            </head>
            <body className={montserrat.className} suppressHydrationWarning={true}>
            <main className={"main"}>
                <div style={{padding: "50px", textAlign: "center"}}>
                    <p style={{marginBottom: "10px"}}>Техникалық қолдау қызметіне хабарласыңыз.</p>
                    <p style={{marginBottom: "10px"}}>Пожалуйста, обратитесь в службу технической поддержки.</p>
                    <p>Please, contact technical support.</p>
                </div>
            </main>
            </body>
            </html>
        )
    }

    return (
        <html lang={lang()}>
        <head>
            <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
            <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
            <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
        </head>
        <body className={montserrat.className} suppressHydrationWarning={true}>
        <main className={"main"}>
            <NextTopLoader color={"#005FF9"}/>
            <Header contacts={contacts.data}/>
            <div className={"container"}>
                <div className={"content"}>{children}</div>
                <Footer contacts={contacts.data}/>
            </div>
        </main>
        </body>
        </html>
    );
}
