import Router from "../pages";
import '@fontsource/golos-text/400.css';
import '@fontsource/golos-text/500.css';
import '@fontsource/golos-text/600.css';
import '@fontsource/pt-serif/400.css';
import '@fontsource/pt-serif/700.css';
import '@fontsource/pt-mono/400.css';
import './App.scss'
import {useActions} from "../shared/hooks/useActions.ts";
import React, {useEffect, useMemo} from "react";
import {LoadingOutlined} from "@ant-design/icons";
import {useTypedSelector} from "../shared/hooks/useTypedSelector.ts";
import {ConfigProvider, notification} from "antd";
import ruRU from "antd/locale/ru_RU";
import kkKZ from "antd/locale/kk_KZ";
import enUS from "antd/locale/en_US";
import {Langs} from "../domain/base/mlString.ts";

const Context = React.createContext({name: 'Default'});

const antdLocales = {
    [Langs.RU]: ruRU,
    [Langs.KZ]: kkKZ,
    [Langs.EN]: enUS,
};

const registryTheme = {
    token: {
        colorPrimary: "#0E5E78",
        colorInfo: "#0E5E78",
        colorLink: "#0E5E78",
        colorError: "#B4232A",
        colorTextBase: "#1E1E1A",
        colorBgLayout: "#F6F5F0",
        colorBorder: "rgba(30, 30, 26, 0.28)",
        colorBorderSecondary: "rgba(30, 30, 26, 0.14)",
        borderRadius: 4,
        fontFamily: "'Golos Text', 'Segoe UI', sans-serif",
        controlHeight: 38,
    },
    components: {
        Button: {
            fontWeight: 500,
            primaryShadow: "none",
        },
        Form: {
            labelColor: "rgba(30, 30, 26, 0.62)",
            verticalLabelPadding: "0 0 6px",
        },
        Input: {
            activeShadow: "0 0 0 3px rgba(14, 94, 120, 0.12)",
        },
    },
};

function App() {
    const {isLoadingCurrentUser} = useTypedSelector(state => state.auth);
    const {lang} = useTypedSelector(state => state.system);
    const {getCurrentUser, setNotificationApi} = useActions();
    const [api, contextHolder] = notification.useNotification();

    const contextValue = useMemo(() => ({name: 'Ant Design'}), []);

    useEffect(() => {
        getCurrentUser();
        setNotificationApi(api);
    }, []);

    if (isLoadingCurrentUser) {
        return (
            <div style={{
                width: "100%",
                height: "100dvh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}>
                <LoadingOutlined style={{fontSize: "40px"}}/>
            </div>
        )
    }

    return (
        <ConfigProvider theme={registryTheme} locale={antdLocales[lang]}>
            <Context.Provider value={contextValue}>
                {contextHolder}
                <Router/>
            </Context.Provider>
        </ConfigProvider>
    )
}

export default App
