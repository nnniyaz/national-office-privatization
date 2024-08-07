import type {Metadata} from "next";
import {headers} from "next/headers";
import {Montserrat} from "next/font/google";
import NextTopLoader from 'nextjs-toploader';
import Footer from "@/app/_components/Footer/Footer";
import Header from "@/app/_components/Header/Header";
import {Langs} from "@/domain/mlString/mlString";
import "./layout.scss";

const montserrat = Montserrat({subsets: ["latin"]});

export const metadata: Metadata = {
    title: "Жекешелендірудің ұлттық басқармасы",
    description: "Мемлекеттiң кәсiпкерлiкке қатысуының мақсаттары ел экономикасын дамыту, оның бәсекеге қабiлеттiлiгiн, өнiмдiлiгi мен жұмыспен қамтылуын арттыру, ұлттық қауiпсiздiктi және Республика азаматтарының әлеуметтiк кепiлдiктерiн қамтамасыз ету болып табылады. Жекешелендірудің мақсаттары жеке кәсіпкерлікті кеңейту, мемлекеттік меншікті оңтайландыру, жекешелендірілген активтерді пайдалану шығындарын азайту және тиімділігін арттыру, сондай-ақ мемлекеттің реттеу саясатын жетілдіру арқылы ел экономикасының тиімділігін арттыру болып табылады."
};

export default function RootLayout({children}: Readonly<{ children: React.ReactNode }>) {
    const headersList = headers();
    const lang = () => {
        let langFromThePath = headersList.get("x-pathname")?.split("/")?.[2] as Langs;
        if (!(langFromThePath in Langs)) {
            langFromThePath = Langs.EN;
        }
        return langFromThePath.toLowerCase();
    };
    return (
        <html lang={lang()}>
        <head>
            <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
            <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
            <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
        </head>
        <body className={montserrat.className} suppressHydrationWarning={true}>
        <main className={"main"}>
            <div className={"container"}>
                <NextTopLoader color={"#005FF9"}/>
                <Header/>
                <div className={"content"}>{children}</div>
                <Footer/>
            </div>
        </main>
        </body>
        </html>
    );
}
