import type {Metadata} from "next";
import {headers} from "next/headers";
import {Montserrat} from "next/font/google";
import NextTopLoader from 'nextjs-toploader';
import Footer from "@/app/_components/Footer/Footer";
import Header from "@/app/_components/Header/Header";
import {Langs} from "@domain/base/mlString/mlString";
import "./layout.scss";
import {Contacts} from "@domain/contacts/contacts";
import {ErrorResponse, SuccessResponse} from "@domain/base/response/response";

const montserrat = Montserrat({subsets: ["latin"]});

export const metadata: Metadata = {
    title: "Ұлттық жекешелендіру кеңсесі",
    description: "Мемлекеттiң кәсiпкерлiкке қатысуының мақсаттары ел экономикасын дамыту, оның бәсекеге қабiлеттiлiгiн, өнiмдiлiгi мен жұмыспен қамтылуын арттыру, ұлттық қауiпсiздiктi және Республика азаматтарының әлеуметтiк кепiлдiктерiн қамтамасыз ету болып табылады. Жекешелендірудің мақсаттары жеке кәсіпкерлікті кеңейту, мемлекеттік меншікті оңтайландыру, жекешелендірілген активтерді пайдалану шығындарын азайту және тиімділігін арттыру, сондай-ақ мемлекеттің реттеу саясатын жетілдіру арқылы ел экономикасының тиімділігін арттыру болып табылады."
};

const fetchData = async (): Promise<SuccessResponse<Contacts> | ErrorResponse> => {
    const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/contacts");
    return await response.json();
}

export default async function RootLayout({children}: Readonly<{ children: React.ReactNode }>) {
    const headersList = headers();
    const lang = () => {
        let langFromThePath = headersList.get("x-pathname")?.split("/")?.[2] as Langs;
        if (!(langFromThePath in Langs)) {
            langFromThePath = Langs.EN;
        }
        return langFromThePath.toLowerCase();
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
                <div>Error</div>
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
